from library_item import LibraryItem


# Class anggota perpustakaan yang mencatat item yang sedang dipinjam
class Member:
    def __init__(self, member_id: str, nama: str):
        self._member_id = member_id
        self._nama = nama
        # Daftar pinjaman private; hanya bisa dibaca sebagai tuple
        self.__daftar_pinjaman = []

    @property
    def member_id(self):
        return self._member_id

    @property
    def nama(self):
        return self._nama

    @property
    def daftar_pinjaman(self):
        return tuple(self.__daftar_pinjaman)

    # Meminjam item; gagal jika item sedang dipinjam anggota lain
    def pinjam_item(self, item: LibraryItem):
        if not isinstance(item, LibraryItem):
            print("Item tidak valid!")
            return False

        if item.pinjam():
            self.__daftar_pinjaman.append(item)
            print(f"{self.nama} berhasil meminjam: {item.judul}")
            return True

        print(f"Item {item.judul} sedang dipinjam!")
        return False

    # Mengembalikan item yang sebelumnya dipinjam oleh anggota ini
    def kembalikan_item(self, item: LibraryItem):
        if item not in self.__daftar_pinjaman:
            print("Item tidak ditemukan dalam daftar pinjaman!")
            return False

        if item.kembalikan():
            self.__daftar_pinjaman.remove(item)
            print(f"{self.nama} berhasil mengembalikan: {item.judul}")
            return True

        return False