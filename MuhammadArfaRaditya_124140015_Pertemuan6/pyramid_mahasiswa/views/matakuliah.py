from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from pyramid.view import view_config

from ..models import Matakuliah


def _parse_id(raw_id):
    """Mengubah ID dari URL menjadi integer positif atau None."""
    try:
        nilai = int(raw_id)
    except (TypeError, ValueError):
        return None
    return nilai if nilai > 0 else None


def _json_object(request):
    """Mengambil body JSON dan memastikan berbentuk objek."""
    try:
        data = request.json_body
    except ValueError:
        return None
    return data if isinstance(data, dict) else None


def _positive_integer(value):
    """Mengembalikan True jika value adalah integer positif (bukan bool)."""
    return (
        isinstance(value, int)
        and not isinstance(value, bool)
        and value > 0
    )


def _matakuliah_tidak_ditemukan(matakuliah_id):
    return HTTPNotFound(
        json_body={
            'error': (
                f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'
            )
        }
    )


@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """READ ALL: Menampilkan seluruh data mata kuliah."""
    daftar = (
        request.dbsession.query(Matakuliah)
        .order_by(Matakuliah.id.asc())
        .all()
    )
    return {'matakuliahs': [item.to_dict() for item in daftar]}


@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """READ ONE: Menampilkan detail mata kuliah berdasarkan ID."""
    matakuliah_id = _parse_id(request.matchdict['id'])
    if matakuliah_id is None:
        return _matakuliah_tidak_ditemukan(request.matchdict['id'])

    matakuliah = (
        request.dbsession.query(Matakuliah)
        .filter_by(id=matakuliah_id)
        .first()
    )
    if matakuliah is None:
        return _matakuliah_tidak_ditemukan(matakuliah_id)

    return {'matakuliah': matakuliah.to_dict()}


@view_config(
    route_name='matakuliah_add',
    request_method='POST',
    renderer='json',
)
def matakuliah_add(request):
    """CREATE: Menambahkan data mata kuliah baru."""
    json_data = _json_object(request)
    if json_data is None:
        return HTTPBadRequest(
            json_body={'error': 'Body request harus berupa JSON object'}
        )

    field_wajib = ['kode_mk', 'nama_mk', 'sks', 'semester']
    field_kosong = []

    for field in field_wajib:
        nilai = json_data.get(field)
        if nilai is None or (isinstance(nilai, str) and not nilai.strip()):
            field_kosong.append(field)

    if field_kosong:
        return HTTPBadRequest(
            json_body={
                'error': (
                    'Field wajib diisi: ' + ', '.join(field_kosong)
                )
            }
        )

    kode_mk = str(json_data['kode_mk']).strip()
    nama_mk = str(json_data['nama_mk']).strip()
    sks = json_data['sks']
    semester = json_data['semester']

    if not _positive_integer(sks):
        return HTTPBadRequest(
            json_body={'error': 'Field sks harus berupa integer positif'}
        )
    if not _positive_integer(semester):
        return HTTPBadRequest(
            json_body={
                'error': 'Field semester harus berupa integer positif'
            }
        )

    dbsession = request.dbsession
    kode_dipakai = (
        dbsession.query(Matakuliah)
        .filter_by(kode_mk=kode_mk)
        .first()
    )
    if kode_dipakai is not None:
        return HTTPBadRequest(
            json_body={
                'error': f'Kode mata kuliah {kode_mk} sudah digunakan'
            }
        )

    matakuliah = Matakuliah(
        kode_mk=kode_mk,
        nama_mk=nama_mk,
        sks=sks,
        semester=semester,
    )
    dbsession.add(matakuliah)
    dbsession.flush()

    return {'success': True, 'matakuliah': matakuliah.to_dict()}


@view_config(
    route_name='matakuliah_update',
    request_method='PUT',
    renderer='json',
)
def matakuliah_update(request):
    """UPDATE: Mengubah data mata kuliah berdasarkan ID."""
    matakuliah_id = _parse_id(request.matchdict['id'])
    if matakuliah_id is None:
        return _matakuliah_tidak_ditemukan(request.matchdict['id'])

    dbsession = request.dbsession
    matakuliah = (
        dbsession.query(Matakuliah)
        .filter_by(id=matakuliah_id)
        .first()
    )
    if matakuliah is None:
        return _matakuliah_tidak_ditemukan(matakuliah_id)

    json_data = _json_object(request)
    if json_data is None:
        return HTTPBadRequest(
            json_body={'error': 'Body request harus berupa JSON object'}
        )
    if not json_data:
        return HTTPBadRequest(
            json_body={'error': 'Tidak ada data untuk diperbarui'}
        )

    if 'kode_mk' in json_data:
        kode_mk = json_data['kode_mk']
        if not isinstance(kode_mk, str) or not kode_mk.strip():
            return HTTPBadRequest(
                json_body={'error': 'Field kode_mk tidak boleh kosong'}
            )
        kode_mk = kode_mk.strip()
        kode_dipakai = (
            dbsession.query(Matakuliah)
            .filter(
                Matakuliah.kode_mk == kode_mk,
                Matakuliah.id != matakuliah_id,
            )
            .first()
        )
        if kode_dipakai is not None:
            return HTTPBadRequest(
                json_body={
                    'error': (
                        f'Kode mata kuliah {kode_mk} sudah digunakan'
                    )
                }
            )
        matakuliah.kode_mk = kode_mk

    if 'nama_mk' in json_data:
        nama_mk = json_data['nama_mk']
        if not isinstance(nama_mk, str) or not nama_mk.strip():
            return HTTPBadRequest(
                json_body={'error': 'Field nama_mk tidak boleh kosong'}
            )
        matakuliah.nama_mk = nama_mk.strip()

    if 'sks' in json_data:
        if not _positive_integer(json_data['sks']):
            return HTTPBadRequest(
                json_body={
                    'error': 'Field sks harus berupa integer positif'
                }
            )
        matakuliah.sks = json_data['sks']

    if 'semester' in json_data:
        if not _positive_integer(json_data['semester']):
            return HTTPBadRequest(
                json_body={
                    'error': (
                        'Field semester harus berupa integer positif'
                    )
                }
            )
        matakuliah.semester = json_data['semester']

    dbsession.flush()
    return {'success': True, 'matakuliah': matakuliah.to_dict()}


@view_config(
    route_name='matakuliah_delete',
    request_method='DELETE',
    renderer='json',
)
def matakuliah_delete(request):
    """DELETE: Menghapus mata kuliah berdasarkan ID."""
    matakuliah_id = _parse_id(request.matchdict['id'])
    if matakuliah_id is None:
        return _matakuliah_tidak_ditemukan(request.matchdict['id'])

    dbsession = request.dbsession
    matakuliah = (
        dbsession.query(Matakuliah)
        .filter_by(id=matakuliah_id)
        .first()
    )
    if matakuliah is None:
        return _matakuliah_tidak_ditemukan(matakuliah_id)

    dbsession.delete(matakuliah)
    return {
        'success': True,
        'message': (
            f'Matakuliah dengan ID {matakuliah_id} berhasil dihapus'
        ),
    }
