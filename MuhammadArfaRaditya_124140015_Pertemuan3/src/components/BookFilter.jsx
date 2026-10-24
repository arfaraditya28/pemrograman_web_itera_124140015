import PropTypes from 'prop-types';
import { STATUS_OPTIONS } from '../utils/constants';

function BookFilter({ value, onChange }) {
  return (
    <div className="field-inline">
      <label className="field-inline__label" htmlFor="status-filter">
        Filter status
      </label>
      <select
        id="status-filter"
        className="input select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">Semua status</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

BookFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BookFilter;
