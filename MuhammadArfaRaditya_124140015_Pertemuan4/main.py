import math_operations

from math_operations import (
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
    keliling_lingkaran,
    luas_persegi,
)

print("=" * 60)
print("OPERASI MATEMATIKA".center(60))
print("=" * 60)
print(f"Konstanta PI yang digunakan: {math_operations.PI}")
print()

print("--- BANGUN DATAR: PERSEGI ---")
sisi = 5
print(f"Sisi persegi               : {sisi}")
print(f"Luas persegi               : {luas_persegi(sisi):.2f}")
print(
    "Keliling persegi           : "
    f"{math_operations.keliling_persegi(sisi):.2f}"
)
print()

print("--- BANGUN DATAR: PERSEGI PANJANG ---")
panjang = 8
lebar = 6
print(f"Panjang x lebar            : {panjang} x {lebar}")
print(
    "Luas persegi panjang       : "
    f"{math_operations.luas_persegi_panjang(panjang, lebar):.2f}"
)
print(
    "Keliling persegi panjang   : "
    f"{math_operations.keliling_persegi_panjang(panjang, lebar):.2f}"
)
print()

print("--- BANGUN DATAR: LINGKARAN ---")
jari_jari = 7
print(f"Jari-jari lingkaran        : {jari_jari}")
print(
    f"Luas lingkaran             : "
    f"{math_operations.luas_lingkaran(jari_jari):.5f}"
)
print(f"Keliling lingkaran         : {keliling_lingkaran(jari_jari):.5f}")
print()

print("--- KONVERSI SUHU ---")
daftar_suhu = [0, 25, 37, 100]
print(f"{'Celsius':>10} | {'Fahrenheit':>12} | {'Kelvin':>10}")
print("-" * 40)
for celsius in daftar_suhu:
    fahrenheit = celsius_ke_fahrenheit(celsius)
    kelvin = celsius_ke_kelvin(celsius)
    print(f"{celsius:>10.2f} | {fahrenheit:>12.2f} | {kelvin:>10.2f}")

print()
print("=" * 60)
