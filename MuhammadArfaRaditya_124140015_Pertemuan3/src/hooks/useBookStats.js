import { useMemo } from 'react';
import { STATUS } from '../utils/constants';

export default function useBookStats(books = []) {
  return useMemo(() => {
    const total = books.length;
    const counts = {
      [STATUS.OWNED]: 0,
      [STATUS.READING]: 0,
      [STATUS.WISHLIST]: 0,
    };

    books.forEach((book) => {
      if (Object.prototype.hasOwnProperty.call(counts, book.status)) {
        counts[book.status] += 1;
      }
    });

    const toPercentage = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

    return {
      total,
      owned: counts[STATUS.OWNED],
      reading: counts[STATUS.READING],
      wishlist: counts[STATUS.WISHLIST],
      percentages: {
        [STATUS.OWNED]: toPercentage(counts[STATUS.OWNED]),
        [STATUS.READING]: toPercentage(counts[STATUS.READING]),
        [STATUS.WISHLIST]: toPercentage(counts[STATUS.WISHLIST]),
      },
    };
  }, [books]);
}
