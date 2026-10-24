import PropTypes from 'prop-types';
import BookCard from './BookCard';
import EmptyState from './EmptyState';
import { STATUS_VALUES } from '../utils/constants';

function BookList({
  books,
  onEdit,
  onDelete,
  emptyTitle = 'Belum ada buku',
  emptyMessage = 'Tambahkan buku pertamamu agar koleksi mulai tersusun rapi.',
  emptyActionLabel,
  onEmptyAction,
}) {
  if (books.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <ul className="book-grid" aria-label="Daftar buku">
      {books.map((book) => (
        <li key={book.id} className="book-grid__item">
          <BookCard book={book} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

const bookShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  status: PropTypes.oneOf(STATUS_VALUES).isRequired,
  createdAt: PropTypes.string.isRequired,
});

BookList.propTypes = {
  books: PropTypes.arrayOf(bookShape).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  emptyTitle: PropTypes.string,
  emptyMessage: PropTypes.string,
  emptyActionLabel: PropTypes.string,
  onEmptyAction: PropTypes.func,
};

export default BookList;
