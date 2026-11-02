import math

BATAS_KURANG = 18.5
BATAS_NORMAL = 25.0
BATAS_BERLEBIH = 30.0


def baca_angka(prompt, nama_nilai):
    while True:
        teks = input(prompt).strip().replace(",", ".")

        try:
            nilai = float(teks)
        except ValueError:
            print(f"Input tidak valid: {nama_nilai} harus berupa angka.")
            continue

        if not math.isfinite(nilai) or nilai <= 0:
            print(f"Input tidak valid: {nama_nilai} harus lebih dari 0.")
            continue

        return nilai


def hitung_bmi(berat_kg, tinggi_m):
    if (
        not math.isfinite(berat_kg)
        or not math.isfinite(tinggi_m)
        or berat_kg <= 0
        or tinggi_m <= 0
    ):
        raise ValueError("Berat dan tinggi harus berupa angka positif.")

    return berat_kg / (tinggi_m * tinggi_m)


def tentukan_kategori(bmi):
    if bmi < BATAS_KURANG:
        return "Berat badan kurang"
    elif bmi < BATAS_NORMAL:
        return "Berat badan normal"
    elif bmi < BATAS_BERLEBIH:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    print("=" * 48)
    print("PROGRAM PENGHITUNG BMI".center(48))
    print("=" * 48)
    print("Rumus: BMI = berat (kg) / tinggi (m)^2")
    print("-" * 48)

    berat_kg = baca_angka(
        "Masukkan berat badan (kg) : ", "berat badan"
    )
    tinggi_m = baca_angka(
        "Masukkan tinggi badan (m) : ", "tinggi badan"
    )

    bmi = hitung_bmi(berat_kg, tinggi_m)
    kategori = tentukan_kategori(bmi)

    print("-" * 48)
    print(f"Berat badan  : {berat_kg:.2f} kg")
    print(f"Tinggi badan : {tinggi_m:.2f} m")
    print(f"Nilai BMI    : {bmi:.2f}")
    print(f"Kategori     : {kategori}")
    print("=" * 48)


if __name__ == "__main__":
    main()