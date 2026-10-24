import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import { useBooks } from '../context/BookContext';
import useBookStats from '../hooks/useBookStats';
import { STATUS } from '../utils/constants';

function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);
  const navigate = useNavigate();

  const categories = [
    {
      key: 'owned',
      title: 'Dimiliki',
      tone: 'owned',
      count: stats.owned,
      percentage: stats.percentages[STATUS.OWNED],
      caption: 'buku di rakmu',
    },
    {
      key: 'reading',
      title: 'Sedang Dibaca',
      tone: 'reading',
      count: stats.reading,
      percentage: stats.percentages[STATUS.READING],
      caption: 'buku sedang dibaca',
    },
    {
      key: 'wishlist',
      title: 'Ingin Dibeli',
      tone: 'wishlist',
      count: stats.wishlist,
      percentage: stats.percentages[STATUS.WISHLIST],
      caption: 'buku di daftar beli',
    },
  ];

  return (
    <div className="page stats-page">
      <header className="page__header">
        <div>
          <p className="page__eyebrow">Ringkasan Koleksi</p>
          <h1 className="page__title">Statistik Buku</h1>
          <p className="page__subtitle">
            Lihat gambaran singkat tentang sebaran koleksi buku pribadimu.
          </p>
        </div>
        <Link to="/" className="btn btn--secondary">
          Kembali ke Dashboard
        </Link>
      </header>

      {stats.total === 0 ? (
        <EmptyState
          title="Belum ada data statistik"
          message="Statistik akan muncul setelah kamu menambahkan buku pertama ke koleksi."
          actionLabel="Buka Dashboard"
          onAction={() => navigate('/')}
        />
      ) : (
        <>
          <section className="stats-grid" aria-label="Ringkasan statistik buku">
            <StatsCard
              title="Total Buku"
              count={stats.total}
              tone="primary"
              caption="buku dalam koleksi"
            />
            {categories.map((category) => (
              <StatsCard
                key={category.key}
                title={category.title}
                count={category.count}
                percentage={category.percentage}
                tone={category.tone}
                caption={category.caption}
              />
            ))}
          </section>

          <section className="panel" aria-labelledby="distribusi-title">
            <div className="panel__header">
              <h2 className="panel__title" id="distribusi-title">
                Distribusi Koleksi
              </h2>
              <p className="panel__subtitle">
                Persentase dihitung dari total {stats.total} buku.
              </p>
            </div>

            <div className="distribution" aria-hidden="true">
              {categories.map((category) =>
                category.count > 0 ? (
                  <span
                    key={category.key}
                    className={`distribution__segment distribution__segment--${category.tone}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                ) : null,
              )}
            </div>

            <ul className="stats-legend">
              {categories.map((category) => (
                <li key={category.key} className="stats-legend__item">
                  <span
                    className={`stats-legend__dot stats-legend__dot--${category.tone}`}
                    aria-hidden="true"
                  />
                  <span className="stats-legend__label">{category.title}</span>
                  <span className="stats-legend__value">
                    {category.count} buku ({category.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

export default Stats;
