from abc import ABC, abstractmethod
import math


# 1. Abstract class Shape
class Shape(ABC):
    def __init__(self, nama: str):
        self.nama = nama

    @abstractmethod
    def luas(self) -> float:
        """Menghitung luas area bangun datar"""
        pass

    @abstractmethod
    def keliling(self) -> float:
        """Menghitung keliling bangun datar"""
        pass

    def cetak_laporan(self):
        print(f"[{self.nama}] Luas: {self.luas():.2f} unit persegi | Keliling: {self.keliling():.2f} unit")


class PersegiPanjang(Shape):
    def __init__(self, panjang: float, lebar: float):
        super().__init__("Persegi Panjang")
        self.panjang = panjang
        self.lebar = lebar

    def luas(self) -> float:
        return self.panjang * self.lebar

    def keliling(self) -> float:
        return 2 * (self.panjang + self.lebar)


class Lingkaran(Shape):
    def __init__(self, radius: float):
        super().__init__("Lingkaran")
        self.radius = radius

    def luas(self) -> float:
        return math.pi * (self.radius ** 2)

    def keliling(self) -> float:
        return 2 * math.pi * self.radius


# 2. Interface Database Connector
class DatabaseConnector(ABC):
    @property
    @abstractmethod
    def driver_name(self) -> str:
        """Abstract property: nama mesin database"""
        pass

    @abstractmethod
    def connect(self, host: str, port: int, database: str) -> bool:
        pass

    @abstractmethod
    def execute_query(self, sql: str) -> list:
        pass

    @abstractmethod
    def disconnect(self):
        pass


class PostgreSQLConnector(DatabaseConnector):
    @property
    def driver_name(self) -> str:
        return "PostgreSQL (psycopg2)"

    def connect(self, host: str, port: int, database: str) -> bool:
        print(f"[{self.driver_name}] Terhubung ke postgresql://{host}:{port}/{database} [OK]")
        return True

    def execute_query(self, sql: str) -> list:
        print(f"[{self.driver_name}] Menjalankan SQL: '{sql}'")
        return [{"id": 1, "nama": "Ahmad"}, {"id": 2, "nama": "Nabila"}]

    def disconnect(self):
        print(f"[{self.driver_name}] Koneksi database ditutup dengan aman.")


# Program utama
if __name__ == "__main__":
    print("--- 1. Uji Coba Kepatuhan Implementasi Shape ---")
    pp = PersegiPanjang(10, 5)
    ling = Lingkaran(7)

    pp.cetak_laporan()
    ling.cetak_laporan()

    print("\n--- 2. Pembuktian Enforcement Abstract Class ---")
    try:
        bentuk_gaib = Shape("Bentuk Abstrak")
    except TypeError as err:
        print(f"Penolakan Python Terbukti: {err}")

    class SegitigaCacat(Shape):
        def __init__(self, alas, tinggi):
            super().__init__("Segitiga Cacat")
            self.alas = alas
            self.tinggi = tinggi

        def luas(self):
            return 0.5 * self.alas * self.tinggi

    try:
        s = SegitigaCacat(6, 8)
    except TypeError as err:
        print(f"Penolakan Subclass Cacat: {err}")

    print("\n--- 3. Uji Coba Interface Database Backend ---")
    db = PostgreSQLConnector()
    db.connect("localhost", 5432, "paw_praktikum_db")
    hasil = db.execute_query("SELECT id, nama FROM mahasiswa;")
    print("Hasil Query Data:", hasil)
    db.disconnect()