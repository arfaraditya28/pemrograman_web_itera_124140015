# 1. Membuktikan bahwa tipe data merupakan object
angka = 42
pesan = "Praktikum Pemrograman Web ITERA"
daftar_nilai = [85, 90, 78]

print("Tipe objek 'angka'        :", type(angka), "| Class:", angka.__class__)
print("Tipe objek 'pesan'        :", type(pesan), "| Class:", pesan.__class__)
print("Tipe objek 'daftar_nilai' :", type(daftar_nilai), "| Class:", daftar_nilai.__class__)


# 2. Menggunakan method bawaan dari class str
print("\nManipulasi string via method class str:")
print("Versi Huruf Besar :", pesan.upper())
print("Pecah Kata        :", pesan.split(" "))


# 3. Membuktikan bahwa fungsi juga merupakan object
def salam():
    return "Halo dari fungsi!"

print("\nTipe objek fungsi 'salam' :", type(salam))
print("Identitas memori (id)     :", hex(id(salam)))