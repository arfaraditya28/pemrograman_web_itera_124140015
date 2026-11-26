"""Uji HTTP nyata terhadap server Pyramid yang sedang berjalan.

Jalankan setelah ``pserve development.ini`` aktif:

    python -m pyramid_mahasiswa.scripts.api_test

Skrip ini tidak menghapus data seeding. Data uji dibuat, diubah, lalu
dihapus kembali pada akhir pengujian.
"""

import argparse
import json
import sys
import urllib.error
import urllib.request

NIM_UJI = '124140015'
KODE_MK_UJI = 'IF9999'


def panggil(base_url, method, path, payload=None):
    """Mengirim request HTTP dan mengembalikan (status, body)."""
    data = None
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')

    request = urllib.request.Request(
        base_url + path,
        data=data,
        method=method,
    )
    if data is not None:
        request.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(request) as response:
            body = response.read().decode('utf-8')
            return response.status, _parse(body)
    except urllib.error.HTTPError as error:
        body = error.read().decode('utf-8')
        return error.code, _parse(body)


def _parse(body):
    if not body:
        return None
    try:
        return json.loads(body)
    except ValueError:
        return body


def catat(hasil, method, path, status, diharapkan, body):
    """Mencatat satu hasil pengujian."""
    lulus = status == diharapkan
    hasil.append(
        {
            'method': method,
            'path': path,
            'status': status,
            'expected': diharapkan,
            'lulus': lulus,
            'body': body,
        }
    )
    tanda = 'PASS' if lulus else 'FAIL'
    print(f'[{tanda}] {method:6s} {path:32s} status={status}')
    if not lulus:
        print(f'       diharapkan {diharapkan}, body: {body}')
    return lulus


def bersihkan_data_uji(base_url):
    """Menghapus sisa data uji dari eksekusi sebelumnya."""
    status, body = panggil(base_url, 'GET', '/api/mahasiswa')
    if status == 200:
        for item in body['mahasiswas']:
            if item['nim'] == NIM_UJI:
                panggil(
                    base_url, 'DELETE', f"/api/mahasiswa/{item['id']}"
                )

    status, body = panggil(base_url, 'GET', '/api/matakuliah')
    if status == 200:
        for item in body['matakuliahs']:
            if item['kode_mk'] == KODE_MK_UJI:
                panggil(
                    base_url, 'DELETE', f"/api/matakuliah/{item['id']}"
                )


def uji_mahasiswa(base_url, hasil):
    print('\n--- Pengujian Mahasiswa ---')
    semua_lulus = True

    status, body = panggil(base_url, 'GET', '/api/mahasiswa')
    semua_lulus &= catat(
        hasil, 'GET', '/api/mahasiswa', status, 200, body
    )

    status, body = panggil(base_url, 'GET', '/api/mahasiswa/1')
    semua_lulus &= catat(
        hasil, 'GET', '/api/mahasiswa/1', status, 200, body
    )

    status, body = panggil(
        base_url,
        'POST',
        '/api/mahasiswa',
        {'nama': 'Tanpa NIM', 'jurusan': 'Informatika'},
    )
    semua_lulus &= catat(
        hasil, 'POST', '/api/mahasiswa (tanpa NIM)', status, 400, body
    )

    status, body = panggil(
        base_url,
        'POST',
        '/api/mahasiswa',
        {
            'nim': '124140016',
            'nama': 'Tanggal Salah',
            'jurusan': 'Informatika',
            'tanggal_lahir': '15-01-2003',
        },
    )
    semua_lulus &= catat(
        hasil, 'POST', '/api/mahasiswa (tanggal salah)', status, 400, body
    )

    status, body = panggil(
        base_url,
        'POST',
        '/api/mahasiswa',
        {
            'nim': '12345',
            'nama': 'NIM Ganda',
            'jurusan': 'Informatika',
        },
    )
    semua_lulus &= catat(
        hasil, 'POST', '/api/mahasiswa (NIM ganda)', status, 400, body
    )

    status, body = panggil(
        base_url,
        'POST',
        '/api/mahasiswa',
        {
            'nim': NIM_UJI,
            'nama': 'Muhammad Arfa Raditya',
            'jurusan': 'Teknik Informatika',
            'tanggal_lahir': '2006-04-28',
            'alamat': 'Bandar Lampung',
        },
    )
    semua_lulus &= catat(
        hasil, 'POST', '/api/mahasiswa', status, 200, body
    )
    id_mahasiswa = body['mahasiswa']['id'] if status == 200 else None

    if id_mahasiswa is not None:
        status, body = panggil(
            base_url, 'GET', f'/api/mahasiswa/{id_mahasiswa}'
        )
        semua_lulus &= catat(
            hasil,
            'GET',
            f'/api/mahasiswa/{id_mahasiswa}',
            status,
            200,
            body,
        )

        status, body = panggil(
            base_url,
            'PUT',
            f'/api/mahasiswa/{id_mahasiswa}',
            {
                'jurusan': 'Informatika Medis',
                'alamat': 'Jl. Dipati Ukur No. 88, Bandung',
            },
        )
        semua_lulus &= catat(
            hasil,
            'PUT',
            f'/api/mahasiswa/{id_mahasiswa}',
            status,
            200,
            body,
        )

        status, body = panggil(
            base_url, 'DELETE', f'/api/mahasiswa/{id_mahasiswa}'
        )
        semua_lulus &= catat(
            hasil,
            'DELETE',
            f'/api/mahasiswa/{id_mahasiswa}',
            status,
            200,
            body,
        )

        status, body = panggil(
            base_url, 'GET', f'/api/mahasiswa/{id_mahasiswa}'
        )
        semua_lulus &= catat(
            hasil,
            'GET',
            f'/api/mahasiswa/{id_mahasiswa} (setelah hapus)',
            status,
            404,
            body,
        )

    status, body = panggil(base_url, 'GET', '/api/mahasiswa/999')
    semua_lulus &= catat(
        hasil, 'GET', '/api/mahasiswa/999', status, 404, body
    )

    return semua_lulus


def uji_matakuliah(base_url, hasil):
    print('\n--- Pengujian Matakuliah ---')
    semua_lulus = True

    status, body = panggil(base_url, 'GET', '/api/matakuliah')
    semua_lulus &= catat(
        hasil, 'GET', '/api/matakuliah', status, 200, body
    )

    status, body = panggil(base_url, 'GET', '/api/matakuliah/1')
    semua_lulus &= catat(
        hasil, 'GET', '/api/matakuliah/1', status, 200, body
    )

    status, body = panggil(
        base_url,
        'POST',
        '/api/matakuliah',
        {'kode_mk': 'IF9998', 'nama_mk': 'Tanpa SKS'},
    )
    semua_lulus &= catat(
        hasil, 'POST', '/api/matakuliah (tanpa SKS)', status, 400, body
    )

    status, body = panggil(
        base_url,
        'POST',
        '/api/matakuliah',
        {
            'kode_mk': 'IF2110',
            'nama_mk': 'Duplikat',
            'sks': 3,
            'semester': 5,
        },
    )
    semua_lulus &= catat(
        hasil, 'POST', '/api/matakuliah (kode ganda)', status, 400, body
    )

    for field, nilai in (
        ('sks', 0),
        ('sks', -1),
        ('semester', 0),
        ('semester', -1),
    ):
        payload = {
            'kode_mk': 'IF9997',
            'nama_mk': 'Nilai Tidak Valid',
            'sks': 3,
            'semester': 3,
        }
        payload[field] = nilai
        status, body = panggil(
            base_url, 'POST', '/api/matakuliah', payload
        )
        semua_lulus &= catat(
            hasil,
            'POST',
            f'/api/matakuliah ({field}={nilai})',
            status,
            400,
            body,
        )

    status, body = panggil(
        base_url,
        'POST',
        '/api/matakuliah',
        {
            'kode_mk': KODE_MK_UJI,
            'nama_mk': 'Pemrograman Berorientasi Objek',
            'sks': 3,
            'semester': 4,
        },
    )
    semua_lulus &= catat(
        hasil, 'POST', '/api/matakuliah', status, 200, body
    )
    id_matakuliah = body['matakuliah']['id'] if status == 200 else None

    if id_matakuliah is not None:
        status, body = panggil(
            base_url, 'GET', f'/api/matakuliah/{id_matakuliah}'
        )
        semua_lulus &= catat(
            hasil,
            'GET',
            f'/api/matakuliah/{id_matakuliah}',
            status,
            200,
            body,
        )

        status, body = panggil(
            base_url,
            'PUT',
            f'/api/matakuliah/{id_matakuliah}',
            {'nama_mk': 'Pemrograman Web Lanjut', 'sks': 4},
        )
        semua_lulus &= catat(
            hasil,
            'PUT',
            f'/api/matakuliah/{id_matakuliah}',
            status,
            200,
            body,
        )

        status, body = panggil(
            base_url,
            'PUT',
            f'/api/matakuliah/{id_matakuliah}',
            {'kode_mk': 'IF2110'},
        )
        semua_lulus &= catat(
            hasil,
            'PUT',
            f'/api/matakuliah/{id_matakuliah} (kode ganda)',
            status,
            400,
            body,
        )

        status, body = panggil(
            base_url, 'DELETE', f'/api/matakuliah/{id_matakuliah}'
        )
        semua_lulus &= catat(
            hasil,
            'DELETE',
            f'/api/matakuliah/{id_matakuliah}',
            status,
            200,
            body,
        )

        status, body = panggil(
            base_url, 'GET', f'/api/matakuliah/{id_matakuliah}'
        )
        semua_lulus &= catat(
            hasil,
            'GET',
            f'/api/matakuliah/{id_matakuliah} (setelah hapus)',
            status,
            404,
            body,
        )

    status, body = panggil(base_url, 'PUT', '/api/matakuliah/999', {})
    semua_lulus &= catat(
        hasil, 'PUT', '/api/matakuliah/999', status, 404, body
    )

    status, body = panggil(base_url, 'DELETE', '/api/matakuliah/999')
    semua_lulus &= catat(
        hasil, 'DELETE', '/api/matakuliah/999', status, 404, body
    )

    return semua_lulus


def main(argv=sys.argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--base-url',
        default='http://localhost:6543',
        help='Alamat server Pyramid (default: http://localhost:6543)',
    )
    args = parser.parse_args(argv[1:])

    hasil = []
    bersihkan_data_uji(args.base_url)

    try:
        lulus_mahasiswa = uji_mahasiswa(args.base_url, hasil)
        lulus_matakuliah = uji_matakuliah(args.base_url, hasil)
    finally:
        bersihkan_data_uji(args.base_url)

    total = len(hasil)
    jumlah_lulus = sum(1 for item in hasil if item['lulus'])

    print('\n=== RINGKASAN ===')
    print(f'Total pengujian : {total}')
    print(f'Lulus           : {jumlah_lulus}')
    print(f'Gagal           : {total - jumlah_lulus}')

    return 0 if (
        lulus_mahasiswa and lulus_matakuliah and jumlah_lulus == total
    ) else 1


if __name__ == '__main__':
    sys.exit(main())
