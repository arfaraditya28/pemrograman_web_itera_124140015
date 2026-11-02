BOBOT_UTS = 0.30
BOBOT_UAS = 0.40
BOBOT_TUGAS = 0.30


data_mahasiswa = [
    {
        "nama": "Muhammad Arfa Raditya",
        "nim": "124140015",
        "nilai_uts": 85.0,
        "nilai_uas": 90.0,
        "nilai_tugas": 88.0,
    },
    {
        "nama": "Muhammad Irfan Ramadhan",
        "nim": "124140159",
        "nilai_uts": 78.0,
        "nilai_uas": 82.0,
        "nilai_tugas": 80.0,
    },
    {
        "nama": "Jeremi Pison Efrat",
        "nim": "12414195",
        "nilai_uts": 70.0,
        "nilai_uas": 75.0,
        "nilai_tugas": 72.0,
    },
    {
        "nama": "Hanung Akbar Pramusintho",
        "nim": "124140207",
        "nilai_uts": 62.0,
        "nilai_uas": 68.0,
        "nilai_tugas": 65.0,
    },
    {
        "nama": "Rifky Samudin",
        "nim": "124140224",
        "nilai_uts": 55.0,
        "nilai_uas": 58.0,
        "nilai_tugas": 60.0,
    },
    {
        "nama": "Adit Sopo",
        "nim": "124140076",
        "nilai_uts": 45.0,
        "nilai_uas": 48.0,
        "nilai_tugas": 50.0,
    },
    {
        "nama": "Budi Santoso",
        "nim": "124140049",
        "nilai_uts": 45.0,
        "nilai_uas": 48.0,
        "nilai_tugas": 50.0,
    },
]


def hitung_nilai_akhir(nilai_uts, nilai_uas, nilai_tugas):
    """Menghitung nilai akhir berdasarkan bobot setiap komponen."""
    return (
        (BOBOT_UTS * nilai_uts)
        + (BOBOT_UAS * nilai_uas)
        + (BOBOT_TUGAS * nilai_tugas)
    )


def tentukan_grade(nilai_akhir):
    """Menentukan grade mahasiswa berdasarkan nilai akhir."""
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def buat_baris_tabel(mahasiswa, nomor):
    """Membuat satu baris data mahasiswa untuk tabel."""
    nilai_akhir = hitung_nilai_akhir(
        mahasiswa["nilai_uts"],
        mahasiswa["nilai_uas"],
        mahasiswa["nilai_tugas"],
    )

    return [
        str(nomor),
        mahasiswa["nama"],
        mahasiswa["nim"],
        f'{mahasiswa["nilai_uts"]:.2f}',
        f'{mahasiswa["nilai_uas"]:.2f}',
        f'{mahasiswa["nilai_tugas"]:.2f}',
        f"{nilai_akhir:.2f}",
        tentukan_grade(nilai_akhir),
    ]


def tampilkan_tabel(data):
    """Menampilkan seluruh nilai mahasiswa dalam tabel."""
    header = [
        "No",
        "Nama",
        "NIM",
        "UTS",
        "UAS",
        "Tugas",
        "Nilai Akhir",
        "Grade",
    ]

    isi_tabel = [
        buat_baris_tabel(mahasiswa, nomor)
        for nomor, mahasiswa in enumerate(data, start=1)
    ]

    lebar_kolom = [
        max(
            [len(header[kolom])]
            + [len(baris[kolom]) for baris in isi_tabel]
        )
        for kolom in range(len(header))
    ]

    garis = "+" + "+".join(
        "-" * (lebar + 2) for lebar in lebar_kolom
    ) + "+"

    def cetak_baris(baris):
        """Mencetak satu baris dengan lebar kolom yang sesuai."""
        sel = [
            f" {nilai:<{lebar_kolom[kolom]}} "
            for kolom, nilai in enumerate(baris)
        ]
        print("|" + "|".join(sel) + "|")

    print(garis)
    cetak_baris(header)
    print(garis)

    for baris in isi_tabel:
        cetak_baris(baris)

    print(garis)


def cari_nilai_ekstrem(data, ambil_tertinggi=True):
    """Mencari nilai akhir tertinggi atau terendah beserta mahasiswanya."""
    if not data:
        raise ValueError("Data mahasiswa tidak boleh kosong.")

    pasangan = [
        (
            hitung_nilai_akhir(
                mahasiswa["nilai_uts"],
                mahasiswa["nilai_uas"],
                mahasiswa["nilai_tugas"],
            ),
            mahasiswa,
        )
        for mahasiswa in data
    ]

    if ambil_tertinggi:
        nilai_ekstrem = max(nilai for nilai, mahasiswa in pasangan)
    else:
        nilai_ekstrem = min(nilai for nilai, mahasiswa in pasangan)

    mahasiswa_terpilih = [
        mahasiswa
        for nilai, mahasiswa in pasangan
        if nilai == nilai_ekstrem
    ]

    return nilai_ekstrem, mahasiswa_terpilih


def tampilkan_ekstrem(judul, nilai, daftar_mahasiswa):
    """Menampilkan nilai ekstrem dan mahasiswa yang memilikinya."""
    print(f"{judul:<22}: {nilai:.2f}")

    for mahasiswa in daftar_mahasiswa:
        print(f"  - {mahasiswa['nama']} ({mahasiswa['nim']})")


def main():
    """Menjalankan program pengelolaan nilai mahasiswa."""
    print("=" * 70)
    print("PENGELOLAAN NILAI MAHASISWA".center(70))
    print("=" * 70)
    print("Bobot nilai: UTS 30% | UAS 40% | Tugas 30%")
    print()

    tampilkan_tabel(data_mahasiswa)

    nilai_tertinggi, mahasiswa_tertinggi = cari_nilai_ekstrem(
        data_mahasiswa,
        ambil_tertinggi=True,
    )

    nilai_terendah, mahasiswa_terendah = cari_nilai_ekstrem(
        data_mahasiswa,
        ambil_tertinggi=False,
    )

    print()
    print("RINGKASAN NILAI AKHIR")
    print("-" * 70)

    tampilkan_ekstrem(
        "Nilai akhir tertinggi",
        nilai_tertinggi,
        mahasiswa_tertinggi,
    )

    tampilkan_ekstrem(
        "Nilai akhir terendah",
        nilai_terendah,
        mahasiswa_terendah,
    )

    print("=" * 70)


if __name__ == "__main__":
    main()