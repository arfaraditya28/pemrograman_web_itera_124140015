import math

PI = 3.14159


def _validasi_positif(nama_parameter, nilai):
    if isinstance(nilai, bool) or not isinstance(nilai, (int, float)):
        raise TypeError(f"{nama_parameter} harus berupa angka.")

    if isinstance(nilai, float) and not math.isfinite(nilai):
        raise ValueError(f"{nama_parameter} harus berupa angka finite.")

    if nilai <= 0:
        raise ValueError(f"{nama_parameter} harus lebih besar dari 0.")


def _validasi_celsius(celsius):
    if isinstance(celsius, bool) or not isinstance(celsius, (int, float)):
        raise TypeError("Celsius harus berupa angka.")

    if isinstance(celsius, float) and not math.isfinite(celsius):
        raise ValueError("Celsius harus berupa angka finite.")

    if celsius < -273.15:
        raise ValueError("Suhu tidak boleh di bawah nol mutlak (-273.15 C).")


def luas_persegi(sisi):
    _validasi_positif("sisi", sisi)
    return sisi * sisi


def keliling_persegi(sisi):
    _validasi_positif("sisi", sisi)
    return 4 * sisi


def luas_persegi_panjang(panjang, lebar):
    _validasi_positif("panjang", panjang)
    _validasi_positif("lebar", lebar)
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    _validasi_positif("panjang", panjang)
    _validasi_positif("lebar", lebar)
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari):
    _validasi_positif("jari-jari", jari_jari)
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari):
    _validasi_positif("jari-jari", jari_jari)
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius):
    _validasi_celsius(celsius)
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius):
    _validasi_celsius(celsius)
    return celsius + 273.15


if __name__ == "__main__":
    print("UJI MODUL math_operations")
    print("-" * 48)

    print(f"Luas persegi (sisi 5)            : {luas_persegi(5)}")
    print(f"Keliling persegi (sisi 5)        : {keliling_persegi(5)}")

    print(
        f"Luas persegi panjang (8 x 6)     : "
        f"{luas_persegi_panjang(8, 6)}"
    )
    print(
        f"Keliling persegi panjang (8 x 6): "
        f"{keliling_persegi_panjang(8, 6)}"
    )

    print(f"Luas lingkaran (r = 7)           : {luas_lingkaran(7):.5f}")
    print(
        f"Keliling lingkaran (r = 7)       : "
        f"{keliling_lingkaran(7):.5f}"
    )

    print(
        f"25 Celsius ke Fahrenheit        : "
        f"{celsius_ke_fahrenheit(25):.2f}"
    )
    print(
        f"25 Celsius ke Kelvin            : "
        f"{celsius_ke_kelvin(25):.2f}"
    )

    print("-" * 48)