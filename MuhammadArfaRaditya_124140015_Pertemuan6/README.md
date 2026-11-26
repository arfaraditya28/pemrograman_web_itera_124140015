# RESTful API Manajemen Mahasiswa dan Matakuliah - Tugas Praktikum 6

## Identitas

- **Nama:** Muhammad Arfa Raditya
- **NIM:** 124140015
- **Kelas:** RB

## 1. Deskripsi Proyek

Proyek ini merupakan aplikasi RESTful API berbasis **Pyramid Framework** dengan
**SQLAlchemy ORM**, **PostgreSQL**, dan **Alembic**. Aplikasi menyediakan dua
modul data:

1. **Manajemen Mahasiswa** - implementasi berdasarkan materi praktikum.
2. **Manajemen Matakuliah** - pengembangan tugas Pertemuan 6.

Seluruh komunikasi data dilakukan melalui endpoint JSON. Tidak ada frontend
React pada proyek ini karena fokus praktikum adalah REST API dan integrasi
database. Seluruh bukti pengujian pada laporan ini diambil langsung dari
terminal PowerShell menggunakan `curl.exe`, sehingga status HTTP dan body
respons yang terlihat pada screenshot adalah keluaran asli dari server.

## 2. Tujuan Aplikasi

- Menyediakan operasi CRUD data mahasiswa melalui REST API.
- Menyediakan operasi CRUD data mata kuliah melalui REST API.
- Menerapkan validasi input dan penanganan status HTTP `200`, `400`, dan `404`.
- Mengelola skema database PostgreSQL menggunakan migrasi Alembic.
- Menyediakan data awal (seeding) yang aman dijalankan berulang kali.

## 3. Teknologi yang Digunakan

| Teknologi | Versi yang diuji | Fungsi |
| --- | --- | --- |
| Python | 3.14.2 | Runtime aplikasi |
| Pyramid | 2.1 | Web framework dan URL dispatch |
| SQLAlchemy | 2.0.58 | ORM dan session database |
| PostgreSQL | 18.3 | Database utama |
| Alembic | 1.20.1 | Migrasi skema database |
| psycopg2-binary | 2.9.13 | Driver PostgreSQL untuk Python |
| Waitress | 3.0.2 | WSGI server (`pserve`) |
| pytest + WebTest | 9.2.0 / 3.0.7 | Automated test |
| flake8 | 7.5.0 | Pemeriksaan gaya kode PEP 8 |

> Catatan kompatibilitas: `setup.py` membatasi `SQLAlchemy < 2.1` karena
> SQLAlchemy 2.1 mengubah driver default `postgresql://` menjadi psycopg 3,
> sedangkan modul praktikum mewajibkan `psycopg2-binary`.

## 4. Struktur Direktori

```text
MuhammadArfaRaditya_124140015_Pertemuan6/
├── development.ini
├── production.ini
├── setup.py
├── README.md
├── README.txt
├── .gitignore
├── pytest.ini
├── MANIFEST.in
├── CHANGES.txt
├── .coveragerc
├── screenshots/
└── pyramid_mahasiswa/
    ├── __init__.py
    ├── routes.py
    ├── pshell.py
    ├── alembic/
    │   ├── env.py
    │   ├── script.py.mako
    │   └── versions/
    │       ├── 20261126_7a4263f7ee44.py
    │       └── 20261126_73eb630a3836.py
    ├── models/
    │   ├── __init__.py
    │   ├── meta.py
    │   ├── mahasiswa.py
    │   ├── matakuliah.py
    │   └── mymodel.py
    ├── scripts/
    │   ├── __init__.py
    │   ├── initialize_db.py
    │   └── api_test.py
    ├── views/
    │   ├── __init__.py
    │   ├── default.py
    │   ├── notfound.py
    │   ├── mahasiswa.py
    │   └── matakuliah.py
    ├── static/
    │   └── ... aset bawaan template
    ├── templates/
    │   └── ... template bawaan Pyramid
    └── tests/
        ├── __init__.py
        ├── test_api.py
        └── test_default.py
```

### Fungsi Berkas Utama

| Berkas | Fungsi |
| --- | --- |
| `development.ini` | Konfigurasi server lokal, koneksi PostgreSQL, debug toolbar, dan Alembic |
| `production.ini` | Konfigurasi server produksi; sesuaikan URL database sebelum deploy |
| `setup.py` | Metadata paket, dependensi, dan entry point aplikasi |
| `pyramid_mahasiswa/routes.py` | Pendaftaran seluruh route REST API dengan `request_method` |
| `models/mahasiswa.py` | Model ORM dan `to_dict()` data mahasiswa |
| `models/matakuliah.py` | Model ORM dan `to_dict()` data mata kuliah |
| `models/__init__.py` | Registrasi model, engine, session factory, dan `request.dbsession` |
| `views/mahasiswa.py` | CRUD dan validasi data mahasiswa |
| `views/matakuliah.py` | CRUD dan validasi data mata kuliah |
| `scripts/initialize_db.py` | Seeding data awal yang idempotent |
| `scripts/api_test.py` | Pengujian HTTP nyata terhadap server yang aktif |
| `alembic/versions/` | Dua revisi migrasi: tabel mahasiswa dan matakuliah |
| `pyramid_mahasiswa/tests/test_api.py` | Automated test seluruh endpoint menggunakan pytest + WebTest |

## 5. Persiapan Environment

### 5.1 Prasyarat

- Python 3.10 atau lebih baru (proyek ini diuji pada Python 3.14.2).
- PostgreSQL aktif pada port `5432`.
- PowerShell, Command Prompt, atau terminal lain.
- cURL, Postman, atau browser untuk pengujian.

### 5.2 Membuat dan Mengaktifkan Virtual Environment

```powershell
cd MuhammadArfaRaditya_124140015_Pertemuan6
python -m venv venv
venv\Scripts\Activate.ps1
```

Jika PowerShell menolak aktivasi script, jalankan sekali:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 5.3 Instalasi Dependencies

```powershell
python -m pip install --upgrade pip setuptools wheel
pip install -e ".[testing]" "setuptools<81"
```

Perintah di atas memasang Pyramid, SQLAlchemy, Alembic, Waitress, psycopg2-binary,
pytest, WebTest, dan dependensi lain yang tercantum pada `setup.py`.
Pemasangan `setuptools<81` hanya untuk menghindari peringatan `pkg_resources`
yang tidak memengaruhi fungsi aplikasi.

Jika ingin memasang driver PostgreSQL secara terpisah:

```powershell
pip install psycopg2-binary
```

## 6. Konfigurasi PostgreSQL

### 6.1 Membuat Database dan User

Masuk sebagai superuser PostgreSQL:

```powershell
psql -U postgres
```

Jalankan SQL berikut:

```sql
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
CREATE DATABASE pyramid_mahasiswa OWNER pyramid_user;
GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;

\c pyramid_mahasiswa
GRANT ALL ON SCHEMA public TO pyramid_user;
\q
```

> Kredensial di atas adalah contoh lokal untuk praktikum. Untuk lingkungan
> produksi, gunakan password yang kuat dan jangan menyimpan kredensial rahasia
> di repository publik.

### 6.2 Connection String

`development.ini` menggunakan konfigurasi berikut:

```ini
sqlalchemy.url = postgresql://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
```

`production.ini` juga menggunakan PostgreSQL. Sesuaikan host, user, password,
dan nama database dengan konfigurasi server Anda sebelum deployment.

### 6.3 Verifikasi Koneksi

```powershell
psql -h localhost -U pyramid_user -d pyramid_mahasiswa
```

Masukkan password `pyramid_pass`. Jika prompt berubah menjadi
`pyramid_mahasiswa=>`, koneksi berhasil.

## 7. Migrasi Database dengan Alembic

Dua berkas revisi sudah tersedia:

- `20261126_7a4263f7ee44.py` - membuat tabel `mahasiswa` (dan tabel bawaan
  template `models`).
- `20261126_73eb630a3836.py` - membuat tabel `matakuliah` dengan constraint
  `UNIQUE` pada `kode_mk`.

Terapkan seluruh migrasi:

```powershell
alembic -c development.ini upgrade head
```

Perintah pemeriksaan yang digunakan selama pengujian:

```powershell
alembic -c development.ini current
alembic -c development.ini check
alembic -c development.ini downgrade base
alembic -c development.ini upgrade head
```

Hasil pengujian:

- `current` berada pada revisi `73eb630a3836 (head)`.
- `check` menghasilkan `No new upgrade operations detected.`
- `downgrade base` berhasil menghapus tabel.
- `upgrade head` berhasil membuat kembali tabel tanpa error.

## 8. Seeding Data Awal

```powershell
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

Data awal yang dimasukkan:

- Mahasiswa: Budi Santoso (NIM 12345) dan Siti Aminah (NIM 54321).
- Matakuliah: IF2110 Pemrograman Web, IF2120 Basis Data, dan IF2130
  Struktur Data.

Script memeriksa `nim` dan `kode_mk` sebelum menyisipkan data. Jika dijalankan
ulang, data yang sudah ada akan dilewati sehingga tidak terjadi duplikasi.

## 9. Menjalankan Server

```powershell
pserve development.ini --reload
```

Server berjalan pada:

- `http://localhost:6543`
- `http://127.0.0.1:6543`

## 10. Daftar Endpoint

### 10.1 Mahasiswa

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/mahasiswa` | Mengambil seluruh data mahasiswa |
| GET | `/api/mahasiswa/{id}` | Mengambil detail mahasiswa berdasarkan ID |
| POST | `/api/mahasiswa` | Menambahkan mahasiswa baru |
| PUT | `/api/mahasiswa/{id}` | Memperbarui data mahasiswa |
| DELETE | `/api/mahasiswa/{id}` | Menghapus data mahasiswa |

### 10.2 Matakuliah

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/matakuliah` | Mengambil seluruh data mata kuliah |
| GET | `/api/matakuliah/{id}` | Mengambil detail mata kuliah berdasarkan ID |
| POST | `/api/matakuliah` | Menambahkan mata kuliah baru |
| PUT | `/api/matakuliah/{id}` | Memperbarui data mata kuliah |
| DELETE | `/api/matakuliah/{id}` | Menghapus data mata kuliah |

Validasi utama:

- Field wajib mahasiswa: `nim`, `nama`, `jurusan`.
- Field wajib matakuliah: `kode_mk`, `nama_mk`, `sks`, `semester`.
- `sks` dan `semester` wajib berupa integer positif (bukan nol atau negatif).
- `kode_mk` dan `nim` tidak boleh duplikat.
- `tanggal_lahir` menggunakan format `YYYY-MM-DD` jika diisi.
- ID yang tidak ditemukan menghasilkan HTTP `404`.

## 11. Contoh Request dan Response

### 11.1 GET Semua Mahasiswa

```bash
curl -X GET http://localhost:6543/api/mahasiswa
```

Response `200 OK`:

```json
{
  "mahasiswas": [
    {
      "id": 1,
      "nim": "12345",
      "nama": "Budi Santoso",
      "jurusan": "Teknik Informatika",
      "tanggal_lahir": "2000-05-15",
      "alamat": "Jl. Merdeka No. 123, Bandung"
    },
    {
      "id": 2,
      "nim": "54321",
      "nama": "Siti Aminah",
      "jurusan": "Sistem Informasi",
      "tanggal_lahir": "2001-08-22",
      "alamat": "Jl. Mawar No. 45, Jakarta"
    }
  ]
}
```

### 11.2 POST Mahasiswa

```bash
curl -X POST http://localhost:6543/api/mahasiswa \
  -H "Content-Type: application/json" \
  -d "{\"nim\":\"124140015\",\"nama\":\"Muhammad Arfa Raditya\",\"jurusan\":\"Teknik Informatika\",\"tanggal_lahir\":\"2006-04-28\",\"alamat\":\"Bandar Lampung\"}"
```

Response `200 OK`:

```json
{
  "success": true,
  "mahasiswa": {
    "id": 15,
    "nim": "124140015",
    "nama": "Muhammad Arfa Raditya",
    "jurusan": "Teknik Informatika",
    "tanggal_lahir": "2006-04-28",
    "alamat": "Bandar Lampung"
  }
}
```

Jika `nim` tidak dikirim, response `400 Bad Request`:

```json
{ "error": "Field wajib diisi: nim" }
```

### 11.3 PUT Mahasiswa

```bash
curl -X PUT http://localhost:6543/api/mahasiswa/15 \
  -H "Content-Type: application/json" \
  -d "{\"jurusan\":\"Informatika Medis\",\"alamat\":\"Jl. Dipati Ukur No. 88, Bandung\"}"
```

### 11.4 DELETE Mahasiswa

```bash
curl -X DELETE http://localhost:6543/api/mahasiswa/15
```

Response `200 OK`:

```json
{
  "success": true,
  "message": "Mahasiswa dengan ID 15 berhasil dihapus"
}
```

### 11.5 GET Semua Matakuliah

```bash
curl -X GET http://localhost:6543/api/matakuliah
```

Response `200 OK`:

```json
{
  "matakuliahs": [
    {
      "id": 1,
      "kode_mk": "IF2110",
      "nama_mk": "Pemrograman Web",
      "sks": 3,
      "semester": 5
    },
    {
      "id": 2,
      "kode_mk": "IF2120",
      "nama_mk": "Basis Data",
      "sks": 3,
      "semester": 3
    },
    {
      "id": 3,
      "kode_mk": "IF2130",
      "nama_mk": "Struktur Data",
      "sks": 3,
      "semester": 3
    }
  ]
}
```

### 11.6 POST Matakuliah

```bash
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d "{\"kode_mk\":\"IF9999\",\"nama_mk\":\"Pemrograman Berorientasi Objek\",\"sks\":3,\"semester\":4}"
```

Response `200 OK`:

```json
{
  "success": true,
  "matakuliah": {
    "id": 16,
    "kode_mk": "IF9999",
    "nama_mk": "Pemrograman Berorientasi Objek",
    "sks": 3,
    "semester": 4
  }
}
```

Jika `sks` bernilai `0`:

```json
{ "error": "Field sks harus berupa integer positif" }
```

### 11.7 PUT Matakuliah

```bash
curl -X PUT http://localhost:6543/api/matakuliah/16 \
  -H "Content-Type: application/json" \
  -d "{\"nama_mk\":\"Pemrograman Web Lanjut\",\"sks\":4}"
```

### 11.8 DELETE Matakuliah

```bash
curl -X DELETE http://localhost:6543/api/matakuliah/16
```

Response `200 OK`:

```json
{
  "success": true,
  "message": "Matakuliah dengan ID 16 berhasil dihapus"
}
```

### 11.9 ID Tidak Ditemukan

```bash
curl -X GET http://localhost:6543/api/matakuliah/999
```

Response `404 Not Found`:

```json
{ "error": "Matakuliah dengan ID 999 tidak ditemukan" }
```

## 12. Hasil Pengujian

Pengujian dilakukan pada **26 November 2026** menggunakan server
`pserve development.ini` dan PostgreSQL 18.3.

### 12.1 Automated Test

```text
python -m pytest -q
28 passed in 1.59s
```

![Hasil pytest 28 passed](screenshots/terminal_pytest.png)

`pyramid_mahasiswa/tests/test_api.py` mencakup CRUD, validasi field wajib, NIM duplikat,
kode mata kuliah duplikat, SKS/semester nol dan negatif, serta kondisi 404.

### 12.2 Uji HTTP Nyata

```text
python -m pyramid_mahasiswa.scripts.api_test
Total pengujian : 27
Lulus           : 27
Gagal           : 0
```

![Uji HTTP nyata 27/27 lulus](screenshots/terminal_api_test.png)

### 12.3 Tabel Hasil Endpoint

| Endpoint | Method | Skenario | Hasil | HTTP Status |
| --- | --- | --- | --- | --- |
| `/api/mahasiswa` | GET | Ambil semua data | Berhasil | 200 |
| `/api/mahasiswa/{id}` | GET | Ambil detail ID 1 | Berhasil | 200 |
| `/api/mahasiswa` | POST | Tambah data valid | Berhasil | 200 |
| `/api/mahasiswa` | POST | Field `nim` tidak dikirim | Berhasil ditolak | 400 |
| `/api/mahasiswa` | POST | NIM duplikat | Berhasil ditolak | 400 |
| `/api/mahasiswa` | POST | Format tanggal salah | Berhasil ditolak | 400 |
| `/api/mahasiswa/{id}` | PUT | Perbarui data | Berhasil | 200 |
| `/api/mahasiswa/{id}` | DELETE | Hapus data | Berhasil | 200 |
| `/api/mahasiswa/{id}` | GET | ID sudah dihapus | Berhasil ditolak | 404 |
| `/api/mahasiswa/999` | GET | ID tidak tersedia | Berhasil ditolak | 404 |
| `/api/matakuliah` | GET | Ambil semua data | Berhasil | 200 |
| `/api/matakuliah/{id}` | GET | Ambil detail ID 1 | Berhasil | 200 |
| `/api/matakuliah` | POST | Tambah data valid | Berhasil | 200 |
| `/api/matakuliah` | POST | Field wajib tidak lengkap | Berhasil ditolak | 400 |
| `/api/matakuliah` | POST | Kode mata kuliah duplikat | Berhasil ditolak | 400 |
| `/api/matakuliah` | POST | `sks` = 0 | Berhasil ditolak | 400 |
| `/api/matakuliah` | POST | `sks` = -1 | Berhasil ditolak | 400 |
| `/api/matakuliah` | POST | `semester` = 0 | Berhasil ditolak | 400 |
| `/api/matakuliah` | POST | `semester` = -1 | Berhasil ditolak | 400 |
| `/api/matakuliah/{id}` | PUT | Perbarui data | Berhasil | 200 |
| `/api/matakuliah/{id}` | PUT | Kode duplikat dengan data lain | Berhasil ditolak | 400 |
| `/api/matakuliah/999` | PUT | ID tidak tersedia | Berhasil ditolak | 404 |
| `/api/matakuliah/{id}` | DELETE | Hapus data | Berhasil | 200 |
| `/api/matakuliah/999` | DELETE | ID tidak tersedia | Berhasil ditolak | 404 |
| `/api/matakuliah/{id}` | GET | ID sudah dihapus | Berhasil ditolak | 404 |

### 12.4 Pemeriksaan Database

```sql
SELECT COUNT(*) FROM mahasiswa;   -- 2 data seeding
SELECT COUNT(*) FROM matakuliah;  -- 3 data seeding
SELECT version_num FROM alembic_version; -- 73eb630a3836
```

![Pemeriksaan database dengan psql](screenshots/terminal_psql.png)

Data uji yang dibuat selama pengujian selalu dihapus kembali sehingga data
seeding tidak rusak.

### 12.5 Migrasi dan Seeding

```powershell
alembic -c development.ini upgrade head
alembic -c development.ini current
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

![Migrasi Alembic](screenshots/terminal_alembic.png)

![Seeding data awal](screenshots/terminal_seeding.png)

Seeding bersifat idempotent: saat dijalankan ulang, data yang sudah ada
dilewati sehingga tidak terjadi duplikasi (`0 data baru dimasukkan`).

## 13. Dokumentasi Screenshot Pengujian

Seluruh screenshot diambil dari **terminal PowerShell** pada mesin pengujian,
dengan server `pserve development.ini` aktif di `http://localhost:6543`.
Permintaan HTTP dikirim memakai `curl.exe`, sehingga status line
(`HTTP/1.1 200 OK`, `400 Bad Request`, `404 Not Found`), header, dan body
respons yang tampak adalah keluaran asli dari server Pyramid. Tidak ada data
contoh dan tidak ada respons yang direkayasa.

Pola perintah yang dipakai pada seluruh pengujian:

```powershell
$b='{"nim":"124140015","nama":"Muhammad Arfa Raditya","jurusan":"Teknik Informatika","tanggal_lahir":"2006-04-28","alamat":"Bandar Lampung"}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/mahasiswa -H "Content-Type: application/json" -d "@-"
```

Opsi `-i` menampilkan status line dan header, `-s` menyembunyikan progress bar,
dan body JSON dikirim melalui pipe (`-d "@-"`) agar tanda kutip tidak rusak di
PowerShell 5.1.

### 13.1 Mahasiswa

#### GET semua mahasiswa (200)

```powershell
curl.exe -i -s http://localhost:6543/api/mahasiswa
```

![GET semua mahasiswa](screenshots/curl_mahasiswa_get_all.png)

#### GET detail mahasiswa (200)

```powershell
curl.exe -i -s http://localhost:6543/api/mahasiswa/1
```

![GET detail mahasiswa](screenshots/curl_mahasiswa_get_detail.png)

#### POST mahasiswa berhasil (200)

```powershell
$b='{"nim":"124140015","nama":"Muhammad Arfa Raditya","jurusan":"Teknik Informatika","tanggal_lahir":"2006-04-28","alamat":"Bandar Lampung"}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/mahasiswa -H "Content-Type: application/json" -d "@-"
```

![POST mahasiswa](screenshots/curl_mahasiswa_post.png)

#### POST mahasiswa tanpa NIM (400)

```powershell
$b='{"nama":"Mahasiswa Tanpa NIM","jurusan":"Informatika"}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/mahasiswa -H "Content-Type: application/json" -d "@-"
```

![POST mahasiswa validasi](screenshots/curl_mahasiswa_post_validation.png)

#### POST mahasiswa dengan NIM duplikat (400)

```powershell
$b='{"nim":"12345","nama":"NIM Ganda","jurusan":"Informatika"}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/mahasiswa -H "Content-Type: application/json" -d "@-"
```

![POST mahasiswa NIM duplikat](screenshots/curl_mahasiswa_post_duplicate.png)

#### PUT mahasiswa (200)

```powershell
$b='{"jurusan":"Informatika Medis","alamat":"Jl. Dipati Ukur No. 88, Bandung"}'
$b | curl.exe -i -s -X PUT http://localhost:6543/api/mahasiswa/15 -H "Content-Type: application/json" -d "@-"
```

![PUT mahasiswa](screenshots/curl_mahasiswa_put.png)

#### DELETE mahasiswa lalu GET ulang (200 lalu 404)

```powershell
curl.exe -i -s -X DELETE http://localhost:6543/api/mahasiswa/15
curl.exe -i -s http://localhost:6543/api/mahasiswa/15
```

![DELETE mahasiswa lalu GET](screenshots/curl_mahasiswa_delete_and_get.png)

#### GET mahasiswa yang tidak ditemukan (404)

```powershell
curl.exe -i -s http://localhost:6543/api/mahasiswa/999
```

![GET mahasiswa tidak ditemukan](screenshots/curl_mahasiswa_not_found.png)

### 13.2 Matakuliah

#### GET semua matakuliah (200)

```powershell
curl.exe -i -s http://localhost:6543/api/matakuliah
```

![GET semua matakuliah](screenshots/curl_matakuliah_get_all.png)

#### GET detail matakuliah (200)

```powershell
curl.exe -i -s http://localhost:6543/api/matakuliah/1
```

![GET detail matakuliah](screenshots/curl_matakuliah_get_detail.png)

#### POST matakuliah berhasil (200)

```powershell
$b='{"kode_mk":"IF9999","nama_mk":"Pemrograman Berorientasi Objek","sks":3,"semester":4}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@-"
```

![POST matakuliah](screenshots/curl_matakuliah_post.png)

#### POST matakuliah dengan field wajib tidak lengkap (400)

```powershell
$b='{"kode_mk":"IF9998","nama_mk":"Tanpa SKS"}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@-"
```

![POST matakuliah validasi](screenshots/curl_matakuliah_post_validation.png)

#### POST matakuliah dengan kode duplikat (400)

```powershell
$b='{"kode_mk":"IF2110","nama_mk":"Duplikat","sks":3,"semester":5}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@-"
```

![POST matakuliah kode duplikat](screenshots/curl_matakuliah_post_duplicate.png)

#### POST matakuliah dengan SKS nol dan negatif (400)

```powershell
$b='{"kode_mk":"IF9997","nama_mk":"SKS Nol","sks":0,"semester":3}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@-"
$b='{"kode_mk":"IF9997","nama_mk":"SKS Negatif","sks":-1,"semester":3}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@-"
```

![POST matakuliah SKS tidak valid](screenshots/curl_matakuliah_post_sks_invalid.png)

#### POST matakuliah dengan semester nol dan negatif (400)

```powershell
$b='{"kode_mk":"IF9997","nama_mk":"Semester Nol","sks":3,"semester":0}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@-"
$b='{"kode_mk":"IF9997","nama_mk":"Semester Negatif","sks":3,"semester":-1}'
$b | curl.exe -i -s -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" -d "@-"
```

![POST matakuliah semester tidak valid](screenshots/curl_matakuliah_post_semester_invalid.png)

#### PUT matakuliah (200)

```powershell
$b='{"nama_mk":"Pemrograman Web Lanjut","sks":4}'
$b | curl.exe -i -s -X PUT http://localhost:6543/api/matakuliah/16 -H "Content-Type: application/json" -d "@-"
```

![PUT matakuliah](screenshots/curl_matakuliah_put.png)

#### PUT matakuliah dengan ID tidak tersedia (404)

```powershell
$b='{"nama_mk":"Tidak Ada"}'
$b | curl.exe -i -s -X PUT http://localhost:6543/api/matakuliah/999 -H "Content-Type: application/json" -d "@-"
```

![PUT matakuliah tidak ditemukan](screenshots/curl_matakuliah_put_not_found.png)

#### DELETE matakuliah lalu GET ulang (200 lalu 404)

```powershell
curl.exe -i -s -X DELETE http://localhost:6543/api/matakuliah/16
curl.exe -i -s http://localhost:6543/api/matakuliah/16
```

![DELETE matakuliah lalu GET](screenshots/curl_matakuliah_delete_and_get.png)

#### GET matakuliah yang tidak ditemukan (404)

```powershell
curl.exe -i -s http://localhost:6543/api/matakuliah/999
```

![GET matakuliah tidak ditemukan](screenshots/curl_matakuliah_not_found.png)

## 14. Catatan Keamanan dan Kerapian

- `venv/`, `__pycache__/`, file `*.pyc`, database SQLite lokal,
  `.pytest_cache/`, `.coverage`, `htmlcov/`, dan `.env` sudah masuk
  `.gitignore`.
- Kredensial pada `development.ini` dan `production.ini` adalah contoh lokal.
  Ganti dengan kredensial aman sebelum deploy.
- Jangan commit password produksi, token, atau file `.env`.
- File migrasi Alembic, `development.ini`, `production.ini`, `setup.py`, dan
  `README.md` tetap disertakan karena dibutuhkan untuk penilaian.

## 15. Perintah Ringkas

```powershell
# Aktivasi environment
venv\Scripts\Activate.ps1

# Migrasi database
alembic -c development.ini upgrade head

# Seeding data awal
python -m pyramid_mahasiswa.scripts.initialize_db development.ini

# Menjalankan server
pserve development.ini --reload

# Automated test
python -m pytest -q

# Uji HTTP nyata (server harus aktif)
python -m pyramid_mahasiswa.scripts.api_test

# Pemeriksaan gaya kode
python -m flake8 pyramid_mahasiswa setup.py --max-line-length=79

# Pemeriksaan migrasi
alembic -c development.ini check
```

## 16. Checklist Akhir

- [x] Model `Mahasiswa` sesuai spesifikasi dan memiliki `to_dict()`.
- [x] Model `Matakuliah` sesuai spesifikasi dan memiliki `to_dict()`.
- [x] Kedua model terdaftar pada `models/__init__.py`.
- [x] Migrasi Alembic tabel `mahasiswa` tersedia dan diterapkan.
- [x] Migrasi Alembic tabel `matakuliah` tersedia dan diterapkan.
- [x] `downgrade()` dan `upgrade()` diuji tanpa error.
- [x] Seeding minimal tiga mata kuliah tersedia dan idempotent.
- [x] Lima endpoint CRUD Mahasiswa berfungsi.
- [x] Lima endpoint CRUD Matakuliah berfungsi.
- [x] Predikat `request_method` diterapkan pada seluruh route.
- [x] Validasi input menghasilkan HTTP `400`.
- [x] ID tidak ditemukan menghasilkan HTTP `404`.
- [x] Kode mata kuliah duplikat ditangani tanpa error 500.
- [x] Automated test pytest lulus 28/28.
- [x] Uji HTTP nyata lulus 27/27.
- [x] `flake8` lulus tanpa temuan.
- [x] `alembic check` tidak menemukan perubahan skema tertunda.
- [x] README lengkap dengan identitas, cara instalasi, migrasi, seeding, dan
      pengujian.
- [x] Screenshot bukti pengujian tersedia di folder `screenshots/`.
- [x] `.gitignore` mengecualikan environment, cache, dan kredensial lokal.
- [ ] Commit dan push repository menunggu persetujuan pemilik proyek.
