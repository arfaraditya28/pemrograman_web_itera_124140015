const tabelMahasiswa = document.getElementById('tabelMahasiswa');
const topBtn = document.getElementById('topBtn');
const topOut = document.getElementById('topOut');
const avgBtn = document.getElementById('avgBtn');
const avgOut = document.getElementById('avgOut');
const sortAscBtn = document.getElementById('sortAscBtn');
const sortDescBtn = document.getElementById('sortDescBtn');
const sortOut = document.getElementById('sortOut');

const crudForm = document.getElementById('crudForm');
const crudNama = document.getElementById('crudNama');
const crudNim = document.getElementById('crudNim');
const crudJurusan = document.getElementById('crudJurusan');
const crudNilai = document.getElementById('crudNilai');
const crudError = document.getElementById('crudError');
const crudSubmit = document.getElementById('crudSubmit');
const crudCancel = document.getElementById('crudCancel');
const crudBody = document.getElementById('crudBody');

// 1. Data awal: array minimal 5 objek mahasiswa
let daftarMahasiswa = [
  { nama: 'Muhammad Arfa Raditya', nim: '124140015', jurusan: 'Teknik Informatika', nilai: 88 },
  { nama: 'Budi', nim: '124140002', jurusan: 'Sistem Informasi', nilai: 72 },
  { nama: 'Citra', nim: '124140033', jurusan: 'Teknik Informatika', nilai: 95 },
  { nama: 'Dewi', nim: '124140041', jurusan: 'Teknik Elektro', nilai: 65 },
  { nama: 'Eko', nim: '124140057', jurusan: 'Sistem Informasi', nilai: 80 }
];

let editIndex = -1;

function renderTabelUtama() {
  tabelMahasiswa.innerHTML = '';
  daftarMahasiswa.forEach((mhs, index) => {
    const row = document.createElement('tr');
    [index + 1, mhs.nama, mhs.nim, mhs.jurusan, mhs.nilai].forEach((val) => {
      const cell = document.createElement('td');
      cell.textContent = String(val);
      row.appendChild(cell);
    });
    tabelMahasiswa.appendChild(row);
  });
}

// 2. Nilai tertinggi memakai reduce
function cariNilaiTertinggi(data) {
  return data.reduce((tertinggi, mhs) => (mhs.nilai > tertinggi.nilai ? mhs : tertinggi), data[0]);
}

topBtn.addEventListener('click', () => {
  const top = cariNilaiTertinggi(daftarMahasiswa);
  topOut.textContent = 'Tertinggi: ' + top.nama + ' (' + top.nim + ') — ' + top.jurusan + ', nilai ' + top.nilai + '.';
});

// 3. Rata-rata memakai reduce, lalu filter di atas rata-rata
function hitungRataRata(data) {
  const total = data.reduce((sum, mhs) => sum + mhs.nilai, 0);
  return total / data.length;
}

avgBtn.addEventListener('click', () => {
  const rata = hitungRataRata(daftarMahasiswa);
  const diAtas = daftarMahasiswa.filter((mhs) => mhs.nilai > rata);
  const daftar = diAtas.map((mhs) => mhs.nama + ' (' + mhs.nilai + ')').join(', ');
  avgOut.textContent = 'Rata-rata: ' + rata.toFixed(1) + '. Di atas rata-rata: ' + (daftar || 'tidak ada') + '.';
});

// 4. Sorting nama ascending / descending (tidak mengubah data asli)
function urutkanNama(data, arah) {
  const salinan = [...data];
  salinan.sort((a, b) => {
    if (arah === 'desc') {
      return b.nama.localeCompare(a.nama);
    }
    return a.nama.localeCompare(b.nama);
  });
  return salinan;
}

function tampilkanUrutan(arah) {
  const hasil = urutkanNama(daftarMahasiswa, arah).map((mhs) => mhs.nama).join(' → ');
  sortOut.textContent = (arah === 'desc' ? 'Descending: ' : 'Ascending: ') + hasil;
}

sortAscBtn.addEventListener('click', () => tampilkanUrutan('asc'));
sortDescBtn.addEventListener('click', () => tampilkanUrutan('desc'));

// 5. CRUD sederhana dengan event handler
function renderCrud() {
  crudBody.innerHTML = '';
  daftarMahasiswa.forEach((mhs, index) => {
    const row = document.createElement('tr');

    const noCell = document.createElement('td');
    noCell.textContent = String(index + 1);
    row.appendChild(noCell);

    [mhs.nama, mhs.nim, mhs.jurusan, mhs.nilai].forEach((val) => {
      const cell = document.createElement('td');
      cell.textContent = String(val);
      row.appendChild(cell);
    });

    const aksiCell = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn-small btn btn-secondary';
    editBtn.addEventListener('click', () => mulaiEdit(index));

    const hapusBtn = document.createElement('button');
    hapusBtn.type = 'button';
    hapusBtn.textContent = 'Hapus';
    hapusBtn.className = 'btn-small btn';
    hapusBtn.addEventListener('click', () => hapusMahasiswa(index));

    const wrap = document.createElement('div');
    wrap.className = 'row';
    wrap.append(editBtn, hapusBtn);
    aksiCell.appendChild(wrap);
    row.appendChild(aksiCell);

    crudBody.appendChild(row);
  });
  renderTabelUtama();
}

function validasiCrud() {
  if (crudNama.value.trim().length < 3) {
    return 'Nama minimal 3 karakter.';
  }
  if (crudNim.value.trim() === '') {
    return 'NIM wajib diisi.';
  }
  if (crudJurusan.value.trim() === '') {
    return 'Jurusan wajib diisi.';
  }
  const nilai = Number(crudNilai.value);
  if (!Number.isFinite(nilai) || nilai < 0 || nilai > 100) {
    return 'Nilai harus 0–100.';
  }
  return '';
}

function resetFormCrud() {
  crudForm.reset();
  crudError.textContent = '';
  editIndex = -1;
  crudSubmit.textContent = 'Tambah Mahasiswa';
  crudCancel.hidden = true;
}

function mulaiEdit(index) {
  const mhs = daftarMahasiswa[index];
  crudNama.value = mhs.nama;
  crudNim.value = mhs.nim;
  crudJurusan.value = mhs.jurusan;
  crudNilai.value = String(mhs.nilai);
  editIndex = index;
  crudSubmit.textContent = 'Simpan Perubahan';
  crudCancel.hidden = false;
  crudNama.focus();
}

function hapusMahasiswa(index) {
  daftarMahasiswa.splice(index, 1);
  if (editIndex === index) {
    resetFormCrud();
  }
  renderCrud();
}

crudForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const pesan = validasiCrud();
  if (pesan !== '') {
    crudError.textContent = pesan;
    return;
  }
  const data = {
    nama: crudNama.value.trim(),
    nim: crudNim.value.trim(),
    jurusan: crudJurusan.value.trim(),
    nilai: Number(crudNilai.value)
  };
  if (editIndex === -1) {
    daftarMahasiswa.push(data);
  } else {
    daftarMahasiswa[editIndex] = data;
  }
  resetFormCrud();
  renderCrud();
});

crudCancel.addEventListener('click', resetFormCrud);

renderTabelUtama();
renderCrud();
