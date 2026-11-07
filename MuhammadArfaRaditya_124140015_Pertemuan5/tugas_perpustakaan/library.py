from library_item import LibraryItem


# Class yang menyimpan dan mengelola seluruh koleksi item perpustakaan
class Library:
    def __init__(self):
        # Koleksi private agar tidak bisa diubah langsung dari luar class
        self.__koleksi = []

    # Menambah item baru; menolak item tidak valid atau ID yang sudah terdaftar
    def tambah_item(self, item: LibraryItem):
        if not isinstance(item, LibraryItem):
            print("Item tidak valid!")
            return False

        for koleksi in self.__koleksi:
            if koleksi.id == item.id:
                print("ID item sudah terdaftar!")
                return False

        self.__koleksi.append(item)
        print(f"Item '{item.judul}' berhasil ditambahkan!")
        return True

    # Menampilkan katalog berisi item yang statusnya masih tersedia
    def tampilkan_katalog(self):
        print("\n===== KATALOG PERPUSTAKAAN =====")

        item_tersedia = [
            item for item in self.__koleksi
            if not item.is_dipinjam
        ]

        if not item_tersedia:
            print("Tidak ada item yang tersedia.")
            return

        for item in item_tersedia:
            print(item.get_detail())

    # Mencari item berdasarkan ID (harus sama persis) atau judul (sebagian)
    def cari_item(self, keyword: str):
        keyword = keyword.strip().lower()

        hasil = [
            item for item in self.__koleksi
            if item.id.lower() == keyword
            or keyword in item.judul.lower()
        ]

        return hasil