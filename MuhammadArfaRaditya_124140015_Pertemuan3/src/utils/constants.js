export const STATUS = {
  OWNED: 'dimiliki',
  READING: 'dibaca',
  WISHLIST: 'ingin-dibeli',
};

export const STATUS_VALUES = Object.values(STATUS);

export const STATUS_OPTIONS = [
  { value: STATUS.OWNED, label: 'Dimiliki' },
  { value: STATUS.READING, label: 'Sedang Dibaca' },
  { value: STATUS.WISHLIST, label: 'Ingin Dibeli' },
];

export const STATUS_LABELS = STATUS_OPTIONS.reduce((labels, option) => {
  labels[option.value] = option.label;
  return labels;
}, {});

export const STORAGE_KEY = 'book-manager:books';
