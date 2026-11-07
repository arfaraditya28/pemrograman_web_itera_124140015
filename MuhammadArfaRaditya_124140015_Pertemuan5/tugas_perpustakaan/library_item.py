from abc import ABC, abstractmethod


# Abstract class: kontrak dasar yang wajib diikuti semua item perpustakaan
class LibraryItem(ABC):
    def __init__(self, item_id: str, judul: str, tahun_terbit: int):
        self._id = item_id
        self._judul = judul
        self._tahun_terbit = tahun_terbit
        self.__is_dipinjam = False

    # Property getter: atribut hanya bisa dibaca dari luar class (read-only)
    @property
    def id(self):
        return self._id

    @property
    def judul(self):
        return self._judul

    @property
    def tahun_terbit(self):
        return self._tahun_terbit

    @property
    def is_dipinjam(self):
        return self.__is_dipinjam

    # Menandai item sedang dipinjam; gagal jika item sudah dipinjam
    def pinjam(self):
        if self.__is_dipinjam:
            return False

        self.__is_dipinjam = True
        return True

    # Mengembalikan item agar tersedia lagi; gagal jika tidak sedang dipinjam
    def kembalikan(self):
        if not self.__is_dipinjam:
            return False

        self.__is_dipinjam = False
        return True

    # Abstract method: wajib dioverride oleh setiap subclass
    @abstractmethod
    def get_detail(self) -> str:
        pass


# Subclass Book: item perpustakaan dengan atribut tambahan penulis
class Book(LibraryItem):
    def __init__(self, item_id: str, judul: str, tahun_terbit: int, penulis: str):
        super().__init__(item_id, judul, tahun_terbit)
        self._penulis = penulis

    @property
    def penulis(self):
        return self._penulis

    # Implementasi abstract method untuk menampilkan detail buku
    def get_detail(self) -> str:
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[Buku] ID: {self.id} | Judul: {self.judul} | "
            f"Penulis: {self.penulis} | Tahun: {self.tahun_terbit} | "
            f"Status: {status}"
        )


# Subclass Magazine: item perpustakaan dengan atribut tambahan edisi
class Magazine(LibraryItem):
    def __init__(self, item_id: str, judul: str, tahun_terbit: int, edisi: str):
        super().__init__(item_id, judul, tahun_terbit)
        self._edisi = edisi

    @property
    def edisi(self):
        return self._edisi

    # Implementasi abstract method untuk menampilkan detail majalah
    def get_detail(self) -> str:
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[Majalah] ID: {self.id} | Judul: {self.judul} | "
            f"Edisi: {self.edisi} | Tahun: {self.tahun_terbit} | "
            f"Status: {status}"
        )