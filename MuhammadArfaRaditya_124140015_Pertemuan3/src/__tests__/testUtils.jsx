import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { STORAGE_KEY } from '../utils/constants';

export function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
}

export function seedBooks(books) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function createBook(overrides = {}) {
  return {
    id: 'book-1',
    title: 'Judul Buku',
    author: 'Nama Penulis',
    status: 'dimiliki',
    createdAt: '2026-10-01T08:00:00.000Z',
    ...overrides,
  };
}
