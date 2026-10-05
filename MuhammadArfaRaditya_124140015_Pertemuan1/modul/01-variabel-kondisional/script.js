const biodataOut = document.getElementById('biodataOut');

const lulusForm = document.getElementById('lulusForm');
const nilaiLulus = document.getElementById('nilaiLulus');
const nilaiLulusError = document.getElementById('nilaiLulusError');
const lulusOut = document.getElementById('lulusOut');

const umurForm = document.getElementById('umurForm');
const umurInput = document.getElementById('umurInput');
const umurInputError = document.getElementById('umurInputError');
const umurOut = document.getElementById('umurOut');

const hariForm = document.getElementById('hariForm');
const hariInput = document.getElementById('hariInput');
const hariInputError = document.getElementById('hariInputError');
const hariOut = document.getElementById('hariOut');

const gradeForm = document.getElementById('gradeForm');
const gradeInput = document.getElementById('gradeInput');
const gradeInputError = document.getElementById('gradeInputError');
const gradeOut = document.getElementById('gradeOut');

// 1. Data Diri — const untuk yang tetap, let untuk yang bisa berubah
const nama = 'Muhammad Arfa Raditya';
let umur = 20;
let kotaAsal = 'Bandar Lampung';
biodataOut.textContent = 'Nama: ' + nama + ' | Umur: ' + umur + ' tahun | Kota: ' + kotaAsal;

// 2. Pengecekan Kelulusan
function cekKelulusan(nilai) {
  if (nilai >= 70) {
    return 'Lulus';
  }
  return 'Tidak Lulus';
}

lulusForm.addEventListener('submit', (event) => {
  event.preventDefault();
  nilaiLulusError.textContent = '';
  const nilai = Number(nilaiLulus.value);
  if (!Number.isFinite(nilai) || nilai < 0 || nilai > 100) {
    nilaiLulusError.textContent = 'Masukkan nilai 0–100.';
    lulusOut.textContent = '';
    return;
  }
  lulusOut.textContent = 'Nilai: ' + nilai + ' → ' + cekKelulusan(nilai);
});

// 3. Kategori Umur
function kategoriUmur(umurValue) {
  if (umurValue < 12) {
    return 'anak';
  } else if (umurValue <= 17) {
    return 'remaja';
  } else if (umurValue <= 59) {
    return 'dewasa';
  }
  return 'lansia';
}

umurForm.addEventListener('submit', (event) => {
  event.preventDefault();
  umurInputError.textContent = '';
  const umurValue = Number(umurInput.value);
  if (!Number.isInteger(umurValue) || umurValue < 0 || umurValue > 150) {
    umurInputError.textContent = 'Masukkan umur yang valid (0–150).';
    umurOut.textContent = '';
    return;
  }
  umurOut.textContent = 'Umur: ' + umurValue + ' tahun → kategori ' + kategoriUmur(umurValue) + '.';
});

// 4. Konversi Hari dengan switch-case
function namaHari(angka) {
  switch (angka) {
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    case 7:
      return 'Sunday';
    default:
      return '';
  }
}

hariForm.addEventListener('submit', (event) => {
  event.preventDefault();
  hariInputError.textContent = '';
  const angka = Number(hariInput.value);
  if (!Number.isInteger(angka) || angka < 1 || angka > 7) {
    hariInputError.textContent = 'Masukkan angka 1–7.';
    hariOut.textContent = '';
    return;
  }
  hariOut.textContent = angka + ' → ' + namaHari(angka);
});

// 5. Kalkulator Grade dengan ternary operator
function hitungGrade(nilai) {
  return nilai >= 85 ? 'A'
    : nilai >= 70 ? 'B'
    : nilai >= 55 ? 'C'
    : nilai >= 40 ? 'D'
    : 'E';
}

gradeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  gradeInputError.textContent = '';
  const nilai = Number(gradeInput.value);
  if (!Number.isFinite(nilai) || nilai < 0 || nilai > 100) {
    gradeInputError.textContent = 'Masukkan nilai 0–100.';
    gradeOut.textContent = '';
    return;
  }
  gradeOut.textContent = 'Nilai: ' + nilai + ' → Grade ' + hitungGrade(nilai) + '.';
});
