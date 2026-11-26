from sqlalchemy.orm import sessionmaker
from webtest import TestApp

import pytest

from pyramid_mahasiswa import main
from pyramid_mahasiswa.models import (
    get_engine,
    Mahasiswa,
    Matakuliah,
)
from pyramid_mahasiswa.models.meta import Base


@pytest.fixture()
def testapp(tmp_path):
    db_url = 'sqlite:///' + str(tmp_path / 'test.sqlite')
    settings = {
        'sqlalchemy.url': db_url,
        'pyramid.reload_templates': 'false',
    }

    engine = get_engine(settings)
    Base.metadata.create_all(engine)

    session = sessionmaker(bind=engine)()
    session.add_all(
        [
            Mahasiswa(
                nim='12345',
                nama='Budi Santoso',
                jurusan='Teknik Informatika',
            ),
            Mahasiswa(
                nim='54321',
                nama='Siti Aminah',
                jurusan='Sistem Informasi',
            ),
            Matakuliah(
                kode_mk='IF2110',
                nama_mk='Pemrograman Web',
                sks=3,
                semester=5,
            ),
            Matakuliah(
                kode_mk='IF2120',
                nama_mk='Basis Data',
                sks=3,
                semester=3,
            ),
            Matakuliah(
                kode_mk='IF2130',
                nama_mk='Struktur Data',
                sks=3,
                semester=3,
            ),
        ]
    )
    session.commit()
    session.close()

    application = main({}, **settings)
    app = TestApp(application)
    yield app

    engine.dispose()


# ---------------------------------------------------------------------------
# Pengujian endpoint Mahasiswa
# ---------------------------------------------------------------------------
def test_mahasiswa_get_all(testapp):
    response = testapp.get('/api/mahasiswa')
    assert response.status_int == 200
    assert len(response.json['mahasiswas']) == 2


def test_mahasiswa_get_detail(testapp):
    response = testapp.get('/api/mahasiswa/1')
    assert response.status_int == 200
    assert response.json['mahasiswa']['nim'] == '12345'


def test_mahasiswa_get_not_found(testapp):
    response = testapp.get('/api/mahasiswa/999', expect_errors=True)
    assert response.status_int == 404
    assert 'tidak ditemukan' in response.json['error']


def test_mahasiswa_create(testapp):
    response = testapp.post_json(
        '/api/mahasiswa',
        {
            'nim': '124140015',
            'nama': 'Muhammad Arfa Raditya',
            'jurusan': 'Teknik Informatika',
            'tanggal_lahir': '2006-04-28',
            'alamat': 'Bandar Lampung',
        },
    )
    assert response.status_int == 200
    assert response.json['success'] is True
    assert response.json['mahasiswa']['nim'] == '124140015'
    assert response.json['mahasiswa']['tanggal_lahir'] == '2006-04-28'


def test_mahasiswa_create_missing_field(testapp):
    response = testapp.post_json(
        '/api/mahasiswa',
        {'nama': 'Tanpa NIM', 'jurusan': 'Informatika'},
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'nim' in response.json['error']


def test_mahasiswa_create_duplicate_nim(testapp):
    response = testapp.post_json(
        '/api/mahasiswa',
        {
            'nim': '12345',
            'nama': 'NIM Ganda',
            'jurusan': 'Informatika',
        },
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'sudah terdaftar' in response.json['error']


def test_mahasiswa_create_invalid_date(testapp):
    response = testapp.post_json(
        '/api/mahasiswa',
        {
            'nim': '124140016',
            'nama': 'Tanggal Salah',
            'jurusan': 'Informatika',
            'tanggal_lahir': '15-01-2003',
        },
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'YYYY-MM-DD' in response.json['error']


def test_mahasiswa_update(testapp):
    response = testapp.put_json(
        '/api/mahasiswa/1',
        {
            'jurusan': 'Informatika Medis',
            'alamat': 'Jl. Dipati Ukur No. 88',
        },
    )
    assert response.status_int == 200
    assert response.json['mahasiswa']['jurusan'] == 'Informatika Medis'

    detail = testapp.get('/api/mahasiswa/1')
    assert detail.json['mahasiswa']['alamat'] == 'Jl. Dipati Ukur No. 88'


def test_mahasiswa_update_not_found(testapp):
    response = testapp.put_json(
        '/api/mahasiswa/999',
        {'nama': 'Tidak Ada'},
        expect_errors=True,
    )
    assert response.status_int == 404


def test_mahasiswa_delete(testapp):
    response = testapp.delete('/api/mahasiswa/1')
    assert response.status_int == 200
    assert response.json['success'] is True

    detail = testapp.get('/api/mahasiswa/1', expect_errors=True)
    assert detail.status_int == 404


# ---------------------------------------------------------------------------
# Pengujian endpoint Matakuliah
# ---------------------------------------------------------------------------
def test_matakuliah_get_all(testapp):
    response = testapp.get('/api/matakuliah')
    assert response.status_int == 200
    assert len(response.json['matakuliahs']) == 3


def test_matakuliah_get_detail(testapp):
    response = testapp.get('/api/matakuliah/1')
    assert response.status_int == 200
    assert response.json['matakuliah']['kode_mk'] == 'IF2110'


def test_matakuliah_get_not_found(testapp):
    response = testapp.get('/api/matakuliah/999', expect_errors=True)
    assert response.status_int == 404
    assert 'tidak ditemukan' in response.json['error']


def test_matakuliah_create(testapp):
    response = testapp.post_json(
        '/api/matakuliah',
        {
            'kode_mk': 'IF2140',
            'nama_mk': 'Pemrograman Berorientasi Objek',
            'sks': 3,
            'semester': 4,
        },
    )
    assert response.status_int == 200
    assert response.json['success'] is True
    assert response.json['matakuliah']['kode_mk'] == 'IF2140'


def test_matakuliah_create_missing_field(testapp):
    response = testapp.post_json(
        '/api/matakuliah',
        {'kode_mk': 'IF2150', 'nama_mk': 'Tanpa SKS'},
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'sks' in response.json['error']
    assert 'semester' in response.json['error']


def test_matakuliah_create_duplicate_kode(testapp):
    response = testapp.post_json(
        '/api/matakuliah',
        {
            'kode_mk': 'IF2110',
            'nama_mk': 'Duplikat',
            'sks': 3,
            'semester': 5,
        },
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'sudah digunakan' in response.json['error']


@pytest.mark.parametrize('sks', [0, -1])
def test_matakuliah_create_invalid_sks(testapp, sks):
    response = testapp.post_json(
        '/api/matakuliah',
        {
            'kode_mk': 'IF2160',
            'nama_mk': 'SKS Tidak Valid',
            'sks': sks,
            'semester': 3,
        },
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'sks' in response.json['error']


@pytest.mark.parametrize('semester', [0, -1])
def test_matakuliah_create_invalid_semester(testapp, semester):
    response = testapp.post_json(
        '/api/matakuliah',
        {
            'kode_mk': 'IF2170',
            'nama_mk': 'Semester Tidak Valid',
            'sks': 3,
            'semester': semester,
        },
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'semester' in response.json['error']


def test_matakuliah_create_non_integer_sks(testapp):
    response = testapp.post_json(
        '/api/matakuliah',
        {
            'kode_mk': 'IF2180',
            'nama_mk': 'SKS String',
            'sks': 'tiga',
            'semester': 3,
        },
        expect_errors=True,
    )
    assert response.status_int == 400


def test_matakuliah_update(testapp):
    response = testapp.put_json(
        '/api/matakuliah/1',
        {'nama_mk': 'Pemrograman Web Lanjut', 'sks': 4},
    )
    assert response.status_int == 200
    assert response.json['matakuliah']['nama_mk'] == (
        'Pemrograman Web Lanjut'
    )
    assert response.json['matakuliah']['sks'] == 4


def test_matakuliah_update_duplicate_kode(testapp):
    response = testapp.put_json(
        '/api/matakuliah/1',
        {'kode_mk': 'IF2120'},
        expect_errors=True,
    )
    assert response.status_int == 400
    assert 'sudah digunakan' in response.json['error']


def test_matakuliah_update_invalid_sks(testapp):
    response = testapp.put_json(
        '/api/matakuliah/1',
        {'sks': 0},
        expect_errors=True,
    )
    assert response.status_int == 400


def test_matakuliah_update_not_found(testapp):
    response = testapp.put_json(
        '/api/matakuliah/999',
        {'nama_mk': 'Tidak Ada'},
        expect_errors=True,
    )
    assert response.status_int == 404


def test_matakuliah_delete(testapp):
    response = testapp.delete('/api/matakuliah/1')
    assert response.status_int == 200
    assert response.json['success'] is True

    detail = testapp.get('/api/matakuliah/1', expect_errors=True)
    assert detail.status_int == 404
