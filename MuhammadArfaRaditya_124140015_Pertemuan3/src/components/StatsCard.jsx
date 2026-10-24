import PropTypes from 'prop-types';

function StatsCard({ title, count, percentage, tone = 'primary', caption = 'buku' }) {
  const hasPercentage = typeof percentage === 'number';

  return (
    <article className={`stats-card stats-card--${tone}`} aria-label={`Statistik ${title}`}>
      <p className="stats-card__title">{title}</p>
      <p className="stats-card__value">{count}</p>
      <p className="stats-card__caption">{caption}</p>
      {hasPercentage ? (
        <div className="stats-card__progress">
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Persentase ${title}`}
          >
            <span className="progress__fill" style={{ width: `${percentage}%` }} />
          </div>
          <span className="stats-card__percentage">{percentage}%</span>
        </div>
      ) : null}
    </article>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percentage: PropTypes.number,
  tone: PropTypes.oneOf(['primary', 'owned', 'reading', 'wishlist']),
  caption: PropTypes.string,
};

export default StatsCard;
