import PropTypes from 'prop-types';
import { STATUS_LABELS, STATUS_VALUES } from '../utils/constants';

function BookCard({ book, onEdit, onDelete }) {
  return (
    <article className="book-card">
      <div className="book-card__header">
        <h3 className="book-card__title">{book.title}</h3>
        <span className="book-card__status">{STATUS_LABELS[book.status]}</span>
      </div>
      <p className="book-card__author">oleh {book.author}</p>
      <div className="book-card__actions">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => onEdit(book)}
          aria-label={`Edit buku ${book.title}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--danger-ghost btn--sm"
          onClick={() => onDelete(book)}
          aria-label={`Hapus buku ${book.title}`}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(STATUS_VALUES).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookCard;
