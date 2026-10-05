const MHS_KEY = 'modul04Mahasiswa';
const TODO_KEY = 'modul04Todos';
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const PER_PAGE = 5;

// ---------- Dark Mode (latihan 4) ----------
const darkBtn = document.getElementById('darkBtn');
const darkBtn2 = document.getElementById('darkBtn2');

function toggleDark() {
  document.body.classList.toggle('dark');
  const aktif = document.body.classList.contains('dark');
  darkBtn.textContent = aktif ? '☀️ Light Mode' : '🌙 Dark Mode';
}

darkBtn.addEventListener('click', toggleDark);
darkBtn2.addEventListener('click', toggleDark);

// ---------- Latihan 1 & 2: Form Mahasiswa + LocalStorage ----------
const mhsForm = document.getElementById('mhsForm');
const mhsNama = document.getElementById('mhsNama');
const mhsNim = document.getElementById('mhsNim');
const mhsJurusan = document.getElementById('mhsJurusan');
const mhsNilai = document.getElementById('mhsNilai');
const mhsError = document.getElementById('mhsError');
const mhsBody = document.getElementById('mhsBody');

let daftarMahasiswa = loadMahasiswa();

function loadMahasiswa() {
  try {
    const raw = localStorage.getItem(MHS_KEY);
    if (raw === null || raw === '') {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Gagal membaca localStorage mahasiswa:', err);
    return [];
  }
}

function saveMahasiswa() {
  try {
    localStorage.setItem(MHS_KEY, JSON.stringify(daftarMahasiswa));
  } catch (err) {
    console.error('Gagal menyimpan mahasiswa:', err);
  }
}

function renderMahasiswa() {
  mhsBody.innerHTML = '';
  daftarMahasiswa.forEach((mhs, index) => {
    const row = document.createElement('tr');
    [index + 1, mhs.nama, mhs.nim, mhs.jurusan, mhs.nilai].forEach((val) => {
      const cell = document.createElement('td');
      cell.textContent = String(val);
      row.appendChild(cell);
    });
    const aksi = document.createElement('td');
    const hapus = document.createElement('button');
    hapus.type = 'button';
    hapus.textContent = 'Hapus';
    hapus.className = 'btn-small btn btn-secondary';
    hapus.addEventListener('click', () => {
      daftarMahasiswa.splice(index, 1);
      saveMahasiswa();
      renderMahasiswa();
    });
    aksi.appendChild(hapus);
    row.appendChild(aksi);
    mhsBody.appendChild(row);
  });
}

mhsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (mhsNama.value.trim().length < 3) {
    mhsError.textContent = 'Nama minimal 3 karakter.';
    return;
  }
  if (mhsNim.value.trim() === '') {
    mhsError.textContent = 'NIM wajib diisi.';
    return;
  }
  if (mhsJurusan.value.trim() === '') {
    mhsError.textContent = 'Jurusan wajib diisi.';
    return;
  }
  const nilai = Number(mhsNilai.value);
  if (!Number.isFinite(nilai) || nilai < 0 || nilai > 100) {
    mhsError.textContent = 'Nilai harus 0–100.';
    return;
  }
  mhsError.textContent = '';
  daftarMahasiswa.push({
    nama: mhsNama.value.trim(),
    nim: mhsNim.value.trim(),
    jurusan: mhsJurusan.value.trim(),
    nilai: nilai
  });
  saveMahasiswa();
  renderMahasiswa();
  mhsForm.reset();
  mhsNama.focus();
});

renderMahasiswa();

// ---------- Latihan 3 & 5: Fetch API + Search + Pagination ----------
const searchInput = document.getElementById('searchInput');
const apiStatus = document.getElementById('apiStatus');
const apiBody = document.getElementById('apiBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let semuaPosts = [];
let halaman = 1;

function hasilFilter() {
  const kata = searchInput.value.trim().toLowerCase();
  if (kata === '') {
    return semuaPosts;
  }
  return semuaPosts.filter((post) => post.title.toLowerCase().includes(kata));
}

function totalHalaman() {
  return Math.max(1, Math.ceil(hasilFilter().length / PER_PAGE));
}

function renderApi() {
  const data = hasilFilter();
  const max = totalHalaman();
  if (halaman > max) {
    halaman = max;
  }
  if (halaman < 1) {
    halaman = 1;
  }
  const mulai = (halaman - 1) * PER_PAGE;
  const potong = data.slice(mulai, mulai + PER_PAGE);

  apiBody.innerHTML = '';
  potong.forEach((post) => {
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    idCell.textContent = String(post.id);
    const titleCell = document.createElement('td');
    titleCell.textContent = post.title;
    const bodyCell = document.createElement('td');
    bodyCell.textContent = post.body;
    row.append(idCell, titleCell, bodyCell);
    apiBody.appendChild(row);
  });

  pageInfo.textContent = 'Halaman ' + halaman + ' dari ' + max + ' (' + data.length + ' data)';
  prevBtn.disabled = halaman <= 1;
  nextBtn.disabled = halaman >= max;
}

async function muatPosts() {
  apiStatus.textContent = 'Memuat data dari API...';
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }
    semuaPosts = await res.json();
    halaman = 1;
    apiStatus.textContent = 'Berhasil memuat ' + semuaPosts.length + ' posts.';
  } catch (err) {
    console.error('Fetch gagal:', err);
    semuaPosts = [
      { id: 1, title: 'contoh offline 1', body: 'API tidak terjangkau, ini data cadangan.' },
      { id: 2, title: 'contoh offline 2', body: 'Periksa koneksi internet lalu refresh.' }
    ];
    apiStatus.textContent = 'API tidak terjangkau, memakai data cadangan offline.';
  }
  renderApi();
}

searchInput.addEventListener('input', () => {
  halaman = 1;
  renderApi();
});
prevBtn.addEventListener('click', () => {
  if (halaman > 1) {
    halaman = halaman - 1;
    renderApi();
  }
});
nextBtn.addEventListener('click', () => {
  if (halaman < totalHalaman()) {
    halaman = halaman + 1;
    renderApi();
  }
});

muatPosts();

// ---------- Latihan 6: Todo List + LocalStorage ----------
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoError = document.getElementById('todoError');
const todoList = document.getElementById('todoList');

let todos = loadTodos();

function loadTodos() {
  try {
    const raw = localStorage.getItem(TODO_KEY);
    if (raw === null || raw === '') {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Gagal membaca todos:', err);
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error('Gagal menyimpan todos:', err);
  }
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const item = document.createElement('div');
    item.className = 'todo-item' + (todo.selesai ? ' done' : '');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = todo.selesai;
    check.setAttribute('aria-label', 'Tandai selesai: ' + todo.teks);
    check.addEventListener('change', () => {
      todos[index].selesai = check.checked;
      saveTodos();
      renderTodos();
    });

    const teks = document.createElement('span');
    teks.textContent = todo.teks;

    const hapus = document.createElement('button');
    hapus.type = 'button';
    hapus.textContent = 'Hapus';
    hapus.className = 'btn-small btn btn-secondary';
    hapus.addEventListener('click', () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    item.append(check, teks, hapus);
    todoList.appendChild(item);
  });
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (todoInput.value.trim().length < 3) {
    todoError.textContent = 'Todo minimal 3 karakter.';
    return;
  }
  todoError.textContent = '';
  todos.push({ teks: todoInput.value.trim(), selesai: false });
  saveTodos();
  renderTodos();
  todoForm.reset();
  todoInput.focus();
});

renderTodos();
