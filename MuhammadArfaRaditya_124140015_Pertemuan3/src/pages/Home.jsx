import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BookFilter from '../components/BookFilter';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { useBooks } from '../context/BookContext';
import useBookStats from '../hooks/useBookStats';

const ALL_STATUSES = 'all';

function Home() {
  const { books, addBook, updateBook, deleteBook, notify } = useBooks();
  const stats = useBookStats(books);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES);
  const [formState, setFormState] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesQuery =
        normalizedQuery === '' ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === ALL_STATUSES || book.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [books, normalizedQuery, statusFilter]);

  const isFiltering = normalizedQuery !== '' || statusFilter !== ALL_STATUSES;
  const isCollectionEmpty = books.length === 0;

  const openCreateForm = () => setFormState({ book: null });
  const openEditForm = (book) => setFormState({ book });
  const closeForm = () => setFormState(null);

  const handleSubmit = (data) => {
    if (formState?.book) {
      updateBook(formState.book.id, data);
      notify(`Buku "${data.title}" berhasil diperbarui.`);
    } else {
      addBook(data);
      notify(`Buku "${data.title}" berhasil ditambahkan.`);
    }
    setFormState(null);
  };

  const handleConfirmDelete = () => {
    if (!bookToDelete) {
      return;
    }
    deleteBook(bookToDelete.id);
    notify(`Buku "${bookToDelete.title}" telah dihapus.`, 'info');
    setBookToDelete(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter(ALL_STATUSES);
  };

  return (
    <div className="page home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="hero__eyebrow">Aplikasi Manajemen Buku Pribadi</p>
          <h1 className="hero__title" id="hero-title">
            Book Manager
          </h1>
          <p className="hero__subtitle">
            Kelola koleksi bukumu dalam satu tempat: catat buku yang sudah dimiliki, sedang
            dibaca, dan ingin dibeli.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--outline-light" onClick={openCreateForm}>
              Tambah Buku
            </button>
            <Link to="/stats" className="btn btn--outline-light">
              Lihat Statistik
            </Link>
            <a href="#daftar-buku" className="btn btn--outline-light">
              Lihat Daftar Buku
            </a>
          </div>
        </div>
        <div className="hero__panel" aria-label="Ringkasan koleksi">
          <div className="hero__stat">
            <span className="hero__stat-value">{stats.total}</span>
            <span className="hero__stat-label">Total buku</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{stats.owned}</span>
            <span className="hero__stat-label">Dimiliki</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{stats.reading}</span>
            <span className="hero__stat-label">Sedang dibaca</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{stats.wishlist}</span>
            <span className="hero__stat-label">Ingin dibeli</span>
          </div>
        </div>
      </section>

      <section className="toolbar" aria-label="Pencarian dan filter buku">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <BookFilter value={statusFilter} onChange={setStatusFilter} />
      </section>

      <section className="section" id="daftar-buku" aria-labelledby="daftar-buku-title">
        <div className="section__header">
          <h2 className="section__title" id="daftar-buku-title">
            Daftar Buku
          </h2>
          <p className="section__meta">
            {isFiltering
              ? `Menampilkan ${filteredBooks.length} dari ${books.length} buku`
              : `${books.length} buku dalam koleksi`}
          </p>
        </div>

        <BookList
          books={filteredBooks}
          onEdit={openEditForm}
          onDelete={setBookToDelete}
          emptyTitle={isCollectionEmpty ? 'Koleksi masih kosong' : 'Buku tidak ditemukan'}
          emptyMessage={
            isCollectionEmpty
              ? 'Mulai kelola koleksimu dengan menambahkan buku pertama. Data akan tersimpan otomatis di browser.'
              : 'Coba kata kunci lain atau ubah filter status untuk menemukan buku yang kamu cari.'
          }
          emptyActionLabel={
            isCollectionEmpty ? 'Tambah Buku Pertama' : 'Reset Pencarian & Filter'
          }
          onEmptyAction={isCollectionEmpty ? openCreateForm : resetFilters}
        />
      </section>

      {formState ? (
        <Modal
          title={formState.book ? 'Edit Buku' : 'Tambah Buku Baru'}
          onClose={closeForm}
        >
          <BookForm
            key={formState.book ? formState.book.id : 'new-book'}
            initialBook={formState.book}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </Modal>
      ) : null}

      {bookToDelete ? (
        <ConfirmDialog
          title="Hapus Buku"
          message={`Apakah kamu yakin ingin menghapus "${bookToDelete.title}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmLabel="Ya, Hapus"
          cancelLabel="Batal"
          onConfirm={handleConfirmDelete}
          onCancel={() => setBookToDelete(null)}
        />
      ) : null}
    </div>
  );
}

export default Home;
