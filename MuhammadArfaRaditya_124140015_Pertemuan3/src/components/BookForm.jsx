import { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';
import { STATUS, STATUS_OPTIONS, STATUS_VALUES } from '../utils/constants';

function BookForm({ initialBook = null, onSubmit, onCancel }) {
  const titleId = useId();
  const authorId = useId();
  const statusId = useId();

  const [title, setTitle] = useState(initialBook ? initialBook.title : '');
  const [author, setAuthor] = useState(initialBook ? initialBook.author : '');
  const [status, setStatus] = useState(initialBook ? initialBook.status : STATUS.OWNED);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle(initialBook ? initialBook.title : '');
    setAuthor(initialBook ? initialBook.author : '');
    setStatus(initialBook ? initialBook.status : STATUS.OWNED);
    setErrors({});
  }, [initialBook]);

  const clearError = (field) => {
    setErrors((previous) => {
      if (!previous[field]) {
        return previous;
      }
      const nextErrors = { ...previous };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validate = () => {
    const nextErrors = {};
    if (title.trim() === '') {
      nextErrors.title = 'Judul buku wajib diisi.';
    }
    if (author.trim() === '') {
      nextErrors.author = 'Nama penulis wajib diisi.';
    }
    if (!STATUS_VALUES.includes(status)) {
      nextErrors.status = 'Pilih status buku.';
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    onSubmit({ title: title.trim(), author: author.trim(), status });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className={`form-field${errors.title ? ' form-field--error' : ''}`}>
        <label className="form-field__label" htmlFor={titleId}>
          Judul buku
        </label>
        <input
          id={titleId}
          type="text"
          className="input"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            clearError('title');
          }}
          placeholder="Contoh: Laskar Pelangi"
          autoFocus
          autoComplete="off"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
        />
        {errors.title ? (
          <p className="form-error" id={`${titleId}-error`} role="alert">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className={`form-field${errors.author ? ' form-field--error' : ''}`}>
        <label className="form-field__label" htmlFor={authorId}>
          Nama penulis
        </label>
        <input
          id={authorId}
          type="text"
          className="input"
          value={author}
          onChange={(event) => {
            setAuthor(event.target.value);
            clearError('author');
          }}
          placeholder="Contoh: Andrea Hirata"
          autoComplete="off"
          aria-invalid={Boolean(errors.author)}
          aria-describedby={errors.author ? `${authorId}-error` : undefined}
        />
        {errors.author ? (
          <p className="form-error" id={`${authorId}-error`} role="alert">
            {errors.author}
          </p>
        ) : null}
      </div>

      <div className={`form-field${errors.status ? ' form-field--error' : ''}`}>
        <label className="form-field__label" htmlFor={statusId}>
          Status
        </label>
        <select
          id={statusId}
          className="input select"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            clearError('status');
          }}
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? `${statusId}-error` : undefined}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.status ? (
          <p className="form-error" id={`${statusId}-error`} role="alert">
            {errors.status}
          </p>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn--primary">
          {initialBook ? 'Simpan Perubahan' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}

BookForm.propTypes = {
  initialBook: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(STATUS_VALUES).isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BookForm;
