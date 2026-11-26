import datetime

from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from pyramid.view import view_config
from sqlalchemy.exc import IntegrityError

from ..models import Mahasiswa

FORMAT_TANGGAL = '%Y-%m-%d'


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


def _parse_tanggal(value):
    """Mengubah string YYYY-MM-DD menjadi date atau None jika tidak valid."""
    try:
        return datetime.datetime.strptime(value, FORMAT_TANGGAL).date()
    except (TypeError, ValueError):
        return None


def _mahasiswa_tidak_ditemukan(mahasiswa_id):
    return HTTPNotFound(
        json_body={
            'error': (
                f'Mahasiswa dengan ID {mahasiswa_id} tidak ditemukan'
            )
        }
    )


@view_config(route_name='mahasiswa_list', renderer='json')
def mahasiswa_list(request):
    """READ ALL: Menampilkan seluruh data mahasiswa."""
    mahasiswas = (
        request.dbsession.query(Mahasiswa)
        .order_by(Mahasiswa.id.asc())
        .all()
    )
    return {'mahasiswas': [item.to_dict() for item in mahasiswas]}


@view_config(route_name='mahasiswa_detail', renderer='json')
def mahasiswa_detail(request):
    """READ ONE: Menampilkan detail mahasiswa berdasarkan ID."""
    mahasiswa_id = _parse_id(request.matchdict['id'])
    if mahasiswa_id is None:
        return _mahasiswa_tidak_ditemukan(request.matchdict['id'])

    mahasiswa = (
        request.dbsession.query(Mahasiswa)
        .filter_by(id=mahasiswa_id)
        .first()
    )
    if mahasiswa is None:
        return _mahasiswa_tidak_ditemukan(mahasiswa_id)

    return {'mahasiswa': mahasiswa.to_dict()}


@view_config(
    route_name='mahasiswa_add',
    request_method='POST',
    renderer='json',
)
def mahasiswa_add(request):
    """CREATE: Menambahkan data mahasiswa baru."""
    json_data = _json_object(request)
    if json_data is None:
        return HTTPBadRequest(
            json_body={'error': 'Body request harus berupa JSON object'}
        )

    field_wajib = ['nim', 'nama', 'jurusan']
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

    nim = str(json_data['nim']).strip()
    nama = str(json_data['nama']).strip()
    jurusan = str(json_data['jurusan']).strip()

    tanggal_lahir = None
    if json_data.get('tanggal_lahir'):
        tanggal_lahir = _parse_tanggal(json_data['tanggal_lahir'])
        if tanggal_lahir is None:
            return HTTPBadRequest(
                json_body={
                    'error': (
                        'Format tanggal lahir tidak valid. '
                        'Gunakan format YYYY-MM-DD'
                    )
                }
            )

    dbsession = request.dbsession
    nim_dipakai = (
        dbsession.query(Mahasiswa)
        .filter_by(nim=nim)
        .first()
    )
    if nim_dipakai is not None:
        return HTTPBadRequest(
            json_body={'error': f'NIM {nim} sudah terdaftar'}
        )

    mahasiswa = Mahasiswa(
        nim=nim,
        nama=nama,
        jurusan=jurusan,
        tanggal_lahir=tanggal_lahir,
        alamat=json_data.get('alamat'),
    )
    dbsession.add(mahasiswa)

    try:
        dbsession.flush()
    except IntegrityError:
        dbsession.rollback()
        return HTTPBadRequest(
            json_body={'error': f'NIM {nim} sudah terdaftar'}
        )

    return {'success': True, 'mahasiswa': mahasiswa.to_dict()}


@view_config(
    route_name='mahasiswa_update',
    request_method='PUT',
    renderer='json',
)
def mahasiswa_update(request):
    """UPDATE: Mengubah data mahasiswa berdasarkan ID."""
    mahasiswa_id = _parse_id(request.matchdict['id'])
    if mahasiswa_id is None:
        return _mahasiswa_tidak_ditemukan(request.matchdict['id'])

    dbsession = request.dbsession
    mahasiswa = (
        dbsession.query(Mahasiswa)
        .filter_by(id=mahasiswa_id)
        .first()
    )
    if mahasiswa is None:
        return _mahasiswa_tidak_ditemukan(mahasiswa_id)

    json_data = _json_object(request)
    if json_data is None:
        return HTTPBadRequest(
            json_body={'error': 'Body request harus berupa JSON object'}
        )
    if not json_data:
        return HTTPBadRequest(
            json_body={'error': 'Tidak ada data untuk diperbarui'}
        )

    if 'nim' in json_data:
        nim = json_data['nim']
        if not isinstance(nim, str) or not nim.strip():
            return HTTPBadRequest(
                json_body={'error': 'Field nim tidak boleh kosong'}
            )
        nim = nim.strip()
        nim_dipakai = (
            dbsession.query(Mahasiswa)
            .filter(
                Mahasiswa.nim == nim,
                Mahasiswa.id != mahasiswa_id,
            )
            .first()
        )
        if nim_dipakai is not None:
            return HTTPBadRequest(
                json_body={'error': f'NIM {nim} sudah terdaftar'}
            )
        mahasiswa.nim = nim

    if 'nama' in json_data:
        nama = json_data['nama']
        if not isinstance(nama, str) or not nama.strip():
            return HTTPBadRequest(
                json_body={'error': 'Field nama tidak boleh kosong'}
            )
        mahasiswa.nama = nama.strip()

    if 'jurusan' in json_data:
        jurusan = json_data['jurusan']
        if not isinstance(jurusan, str) or not jurusan.strip():
            return HTTPBadRequest(
                json_body={'error': 'Field jurusan tidak boleh kosong'}
            )
        mahasiswa.jurusan = jurusan.strip()

    if 'alamat' in json_data:
        mahasiswa.alamat = json_data['alamat']

    if 'tanggal_lahir' in json_data:
        if json_data['tanggal_lahir']:
            tanggal_lahir = _parse_tanggal(
                json_data['tanggal_lahir']
            )
            if tanggal_lahir is None:
                return HTTPBadRequest(
                    json_body={
                        'error': (
                            'Format tanggal lahir tidak valid. '
                            'Gunakan format YYYY-MM-DD'
                        )
                    }
                )
            mahasiswa.tanggal_lahir = tanggal_lahir
        else:
            mahasiswa.tanggal_lahir = None

    try:
        dbsession.flush()
    except IntegrityError:
        dbsession.rollback()
        return HTTPBadRequest(
            json_body={'error': 'Data mahasiswa melanggar constraint'}
        )

    return {'success': True, 'mahasiswa': mahasiswa.to_dict()}


@view_config(
    route_name='mahasiswa_delete',
    request_method='DELETE',
    renderer='json',
)
def mahasiswa_delete(request):
    """DELETE: Menghapus data mahasiswa berdasarkan ID."""
    mahasiswa_id = _parse_id(request.matchdict['id'])
    if mahasiswa_id is None:
        return _mahasiswa_tidak_ditemukan(request.matchdict['id'])

    dbsession = request.dbsession
    mahasiswa = (
        dbsession.query(Mahasiswa)
        .filter_by(id=mahasiswa_id)
        .first()
    )
    if mahasiswa is None:
        return _mahasiswa_tidak_ditemukan(mahasiswa_id)

    dbsession.delete(mahasiswa)
    return {
        'success': True,
        'message': (
            f'Mahasiswa dengan ID {mahasiswa_id} berhasil dihapus'
        ),
    }
