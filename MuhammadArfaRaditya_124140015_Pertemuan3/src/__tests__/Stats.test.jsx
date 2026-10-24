import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createBook, renderApp, seedBooks } from './testUtils';

describe('Halaman Statistik', () => {
  it('menampilkan jumlah dan persentase setiap kategori buku', () => {
    seedBooks([
      createBook({ id: '1', title: 'Buku A', author: 'Penulis A' }),
      createBook({ id: '2', title: 'Buku B', author: 'Penulis B' }),
      createBook({ id: '3', title: 'Buku C', author: 'Penulis C', status: 'dibaca' }),
    ]);

    renderApp('/stats');

    expect(screen.getByRole('heading', { name: 'Statistik Buku' })).toBeInTheDocument();

    const totalCard = screen.getByRole('article', { name: 'Statistik Total Buku' });
    expect(within(totalCard).getByText('3')).toBeInTheDocument();

    const ownedCard = screen.getByRole('article', { name: 'Statistik Dimiliki' });
    expect(within(ownedCard).getByText('2')).toBeInTheDocument();
    expect(within(ownedCard).getByText('67%')).toBeInTheDocument();

    const readingCard = screen.getByRole('article', { name: 'Statistik Sedang Dibaca' });
    expect(within(readingCard).getByText('1')).toBeInTheDocument();
    expect(within(readingCard).getByText('33%')).toBeInTheDocument();

    const wishlistCard = screen.getByRole('article', { name: 'Statistik Ingin Dibeli' });
    expect(within(wishlistCard).getByText('0')).toBeInTheDocument();
    expect(within(wishlistCard).getByText('0%')).toBeInTheDocument();

    expect(screen.getByText('Distribusi Koleksi')).toBeInTheDocument();
  });

  it('menampilkan empty state dan dapat kembali ke dashboard saat belum ada buku', async () => {
    const user = userEvent.setup();
    renderApp('/stats');

    expect(screen.getByRole('heading', { name: 'Belum ada data statistik' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Buka Dashboard' }));
    expect(screen.getByRole('heading', { name: 'Book Manager' })).toBeInTheDocument();
  });
});
