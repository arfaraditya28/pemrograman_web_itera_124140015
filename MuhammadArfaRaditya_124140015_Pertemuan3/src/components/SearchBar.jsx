import PropTypes from 'prop-types';

function SearchBar({ value, onChange, placeholder = 'Cari judul atau penulis...' }) {
  return (
    <div className="searchbar">
      <span className="searchbar__icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <label className="sr-only" htmlFor="book-search">
        Cari buku
      </label>
      <input
        id="book-search"
        type="search"
        className="input searchbar__input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
