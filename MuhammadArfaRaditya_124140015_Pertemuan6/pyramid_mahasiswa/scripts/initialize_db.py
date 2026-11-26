import argparse
import sys
from datetime import date

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError, SQLAlchemyError

from .. import models


MAHASISWA_SEED = [
    {
        'nim': '12345',
        'nama': 'Budi Santoso',
        'jurusan': 'Teknik Informatika',
        'tanggal_lahir': date(2000, 5, 15),
        'alamat': 'Jl. Merdeka No. 123, Bandung',
    },
    {
        'nim': '54321',
        'nama': 'Siti Aminah',
        'jurusan': 'Sistem Informasi',
        'tanggal_lahir': date(2001, 8, 22),
        'alamat': 'Jl. Mawar No. 45, Jakarta',
    },
]

MATAKULIAH_SEED = [
    {
        'kode_mk': 'IF2110',
        'nama_mk': 'Pemrograman Web',
        'sks': 3,
        'semester': 5,
    },
    {
        'kode_mk': 'IF2120',
        'nama_mk': 'Basis Data',
        'sks': 3,
        'semester': 3,
    },
    {
        'kode_mk': 'IF2130',
        'nama_mk': 'Struktur Data',
        'sks': 3,
        'semester': 3,
    },
]


def setup_models(dbsession):
    """Menambahkan data awal tanpa membuat duplikat saat dijalankan ulang."""
    jumlah_baru = 0

    for data in MAHASISWA_SEED:
        sudah_ada = (
            dbsession.query(models.Mahasiswa)
            .filter_by(nim=data['nim'])
            .first()
        )
        if sudah_ada:
            print(f"Mahasiswa NIM {data['nim']} sudah ada, dilewati.")
            continue
        dbsession.add(models.Mahasiswa(**data))
        jumlah_baru += 1
        print(f"Menambahkan mahasiswa NIM {data['nim']}.")

    for data in MATAKULIAH_SEED:
        sudah_ada = (
            dbsession.query(models.Matakuliah)
            .filter_by(kode_mk=data['kode_mk'])
            .first()
        )
        if sudah_ada:
            print(f"Matakuliah {data['kode_mk']} sudah ada, dilewati.")
            continue
        dbsession.add(models.Matakuliah(**data))
        jumlah_baru += 1
        print(f"Menambahkan matakuliah {data['kode_mk']}.")

    # Data contoh bawaan template agar halaman home tetap berfungsi.
    mymodel = (
        dbsession.query(models.MyModel)
        .filter_by(name='one')
        .first()
    )
    if mymodel is None:
        dbsession.add(models.MyModel(name='one', value=1))
        jumlah_baru += 1

    return jumlah_baru


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            jumlah_baru = setup_models(dbsession)
        print(
            'Seeding berhasil. '
            f'{jumlah_baru} data baru dimasukkan ke database.'
        )
        return 0
    except OperationalError:
        print('Pyramid gagal terhubung ke database.')
        print(
            'Pastikan service PostgreSQL berjalan dan connection string '
            'pada development.ini sudah benar.'
        )
        return 1
    except SQLAlchemyError as exc:
        print('Terjadi kesalahan SQLAlchemy saat seeding:')
        print(exc)
        return 1
    finally:
        env['closer']()


if __name__ == '__main__':
    sys.exit(main())
