import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import BookList from '../components/BookList';
import { createBook } from './testUtils';

describe('BookList', () => {
  it('menampilkan daftar buku beserta statusnya', () => {
    const books = [
      createBook({ id: 'book-1', title: 'Laskar Pelangi', author: 'Andrea Hirata' }),
      createBook({
        id: 'book-2',
        title: 'Bumi Manusia',
        author: 'Pramoedya Ananta Toer',
        status: 'dibaca',
      }),
    ];

    render(<BookList books={books} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('list', { name: 'Daftar buku' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Laskar Pelangi' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bumi Manusia' })).toBeInTheDocument();
    expect(screen.getByText('oleh Andrea Hirata')).toBeInTheDocument();
    expect(screen.getByText('Dimiliki')).toBeInTheDocument();
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument();
  });

  it('memanggil callback edit dan hapus dengan buku yang tepat', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const book = createBook({ title: 'Laskar Pelangi', author: 'Andrea Hirata' });

    render(<BookList books={[book]} onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'Edit buku Laskar Pelangi' }));
    expect(onEdit).toHaveBeenCalledWith(book);

    await user.click(screen.getByRole('button', { name: 'Hapus buku Laskar Pelangi' }));
    expect(onDelete).toHaveBeenCalledWith(book);
  });

  it('menampilkan empty state saat daftar kosong', () => {
    render(
      <BookList
        books={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        emptyTitle="Belum ada buku"
        emptyMessage="Tambahkan buku pertamamu."
      />,
    );

    expect(screen.getByRole('heading', { name: 'Belum ada buku' })).toBeInTheDocument();
    expect(screen.getByText('Tambahkan buku pertamamu.')).toBeInTheDocument();
  });
});
