from library_item import Book, Magazine
from member import Member
from library import Library


# Inisialisasi perpustakaan dan anggota
perpustakaan = Library()
anggota = Member("M001", "Anggota Umum")


# Input data buku baru lalu menambahkannya ke perpustakaan
def tambah_buku():
    print("\n===== TAMBAH BUKU =====")

    item_id = input("ID Buku       : ")
    judul = input("Judul Buku    : ")
    penulis = input("Nama Penulis  : ")

    try:
        tahun = int(input("Tahun Terbit  : "))
    except ValueError:
        print("Tahun harus berupa angka!")
        return

    buku = Book(item_id, judul, tahun, penulis)
    perpustakaan.tambah_item(buku)


# Input data majalah baru lalu menambahkannya ke perpustakaan
def tambah_majalah():
    print("\n===== TAMBAH MAJALAH =====")

    item_id = input("ID Majalah    : ")
    judul = input("Judul Majalah : ")
    edisi = input("Edisi         : ")

    try:
        tahun = int(input("Tahun Terbit  : "))
    except ValueError:
        print("Tahun harus berupa angka!")
        return

    majalah = Magazine(item_id, judul, tahun, edisi)
    perpustakaan.tambah_item(majalah)


# Menampilkan katalog item yang masih tersedia
def tampilkan_katalog():
    perpustakaan.tampilkan_katalog()


# Mencari item berdasarkan judul atau ID, lalu mencetak hasilnya
def cari_item():
    print("\n===== CARI ITEM =====")
    keyword = input("Masukkan judul atau ID: ").strip()

    if not keyword:
        print("Kata kunci tidak boleh kosong!")
        return

    hasil = perpustakaan.cari_item(keyword)

    if hasil:
        print("\nHasil pencarian:")
        for item in hasil:
            print(item.get_detail())
    else:
        print("Item tidak ditemukan!")


# Mencari item berdasarkan ID lalu memproses peminjamannya
def pinjam_item():
    print("\n===== PEMINJAMAN ITEM =====")
    item_id = input("Masukkan ID item: ").strip()

    hasil = perpustakaan.cari_item(item_id)
    item = next(
        (item for item in hasil if item.id.lower() == item_id.lower()),
        None
    )

    if item:
        anggota.pinjam_item(item)
    else:
        print("Item tidak ditemukan!")


# Mencari item berdasarkan ID lalu memproses pengembaliannya
def kembalikan_item():
    print("\n===== PENGEMBALIAN ITEM =====")
    item_id = input("Masukkan ID item: ").strip()

    hasil = perpustakaan.cari_item(item_id)
    item = next(
        (item for item in hasil if item.id.lower() == item_id.lower()),
        None
    )

    if item:
        anggota.kembalikan_item(item)
    else:
        print("Item tidak ditemukan!")


# Loop menu utama; berjalan terus sampai pengguna memilih keluar
def main():
    while True:
        print("\n====================================")
        print("   SISTEM MANAJEMEN PERPUSTAKAAN")
        print("====================================")
        print("1. Tambah Buku")
        print("2. Tambah Majalah")
        print("3. Tampilkan Katalog")
        print("4. Cari Item")
        print("5. Pinjam Item")
        print("6. Kembalikan Item")
        print("7. Keluar")
        print("====================================")

        pilihan = input("Pilih menu (1-7): ")

        if pilihan == "1":
            tambah_buku()
        elif pilihan == "2":
            tambah_majalah()
        elif pilihan == "3":
            tampilkan_katalog()
        elif pilihan == "4":
            cari_item()
        elif pilihan == "5":
            pinjam_item()
        elif pilihan == "6":
            kembalikan_item()
        elif pilihan == "7":
            print("\nTerima kasih telah menggunakan perpustakaan!")
            break
        else:
            print("Pilihan tidak valid! Silakan coba lagi.")


if __name__ == "__main__":
    main()