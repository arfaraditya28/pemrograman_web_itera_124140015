import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Halaman tidak ditemukan</h1>
      <p className="not-found__message">
        Alamat yang kamu buka tidak tersedia. Kembali ke dashboard untuk melanjutkan mengelola
        koleksi buku.
      </p>
      <Link to="/" className="btn btn--primary">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
