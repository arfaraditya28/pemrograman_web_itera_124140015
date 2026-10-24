import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { STORAGE_KEY } from '../utils/constants';
import { createBook, renderApp, seedBooks } from './testUtils';

describe('Dashboard dan manajemen buku', () => {
  it('menambahkan buku baru melalui formulir dan menyimpannya ke localStorage', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByRole('heading', { name: 'Koleksi masih kosong' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tambah Buku' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Judul buku'), 'Laskar Pelangi');
    await user.type(screen.getByLabelText('Nama penulis'), 'Andrea Hirata');
    await user.selectOptions(screen.getByLabelText('Status'), 'ingin-dibeli');
    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const card = screen.getByRole('heading', { name: 'Laskar Pelangi' }).closest('article');
    expect(card).not.toBeNull();
    expect(within(card).getByText('oleh Andrea Hirata')).toBeInTheDocument();
    expect(within(card).getByText('Ingin Dibeli')).toBeInTheDocument();

    const storedBooks = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(storedBooks).toHaveLength(1);
    expect(storedBooks[0]).toMatchObject({
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'ingin-dibeli',
    });
    expect(storedBooks[0].id).toBeTruthy();
    expect(storedBooks[0].createdAt).toBeTruthy();
  });

  it('mengedit informasi buku yang sudah ada', async () => {
    seedBooks([createBook({ id: 'book-lama', title: 'Buku Lama', author: 'Penulis Lama' })]);
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Edit buku Buku Lama' }));
    const titleInput = screen.getByLabelText('Judul buku');
    expect(titleInput).toHaveValue('Buku Lama');

    await user.clear(titleInput);
    await user.type(titleInput, 'Buku Baru');
    await user.click(screen.getByRole('button', { name: 'Simpan Perubahan' }));

    expect(screen.getByRole('heading', { name: 'Buku Baru' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Buku Lama' })).not.toBeInTheDocument();

    const storedBooks = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(storedBooks[0].title).toBe('Buku Baru');
  });

  it('menghapus buku hanya setelah pengguna mengonfirmasi', async () => {
    seedBooks([createBook({ id: 'book-hapus', title: 'Buku Hapus', author: 'Penulis' })]);
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Hapus buku Buku Hapus' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.getByRole('heading', { name: 'Buku Hapus' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hapus buku Buku Hapus' }));
    await user.click(screen.getByRole('button', { name: 'Ya, Hapus' }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Buku Hapus' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: 'Koleksi masih kosong' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual([]);
  });

  it('menggabungkan pencarian judul/penulis dengan filter status', async () => {
    seedBooks([
      createBook({
        id: '1',
        title: 'Laskar Pelangi',
        author: 'Andrea Hirata',
        status: 'dimiliki',
      }),
      createBook({
        id: '2',
        title: 'Bumi Manusia',
        author: 'Pramoedya Ananta Toer',
        status: 'dibaca',
      }),
      createBook({
        id: '3',
        title: 'Filosofi Teras',
        author: 'Henry Manampiring',
        status: 'ingin-dibeli',
      }),
    ]);
    const user = userEvent.setup();
    renderApp();

    const searchInput = screen.getByLabelText('Cari buku');
    const filterSelect = screen.getByLabelText('Filter status');

    await user.type(searchInput, 'bumi');
    expect(screen.getByRole('heading', { name: 'Bumi Manusia' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Laskar Pelangi' })).not.toBeInTheDocument();
    expect(screen.getByText('Menampilkan 1 dari 3 buku')).toBeInTheDocument();

    await user.selectOptions(filterSelect, 'dimiliki');
    expect(screen.getByRole('heading', { name: 'Buku tidak ditemukan' })).toBeInTheDocument();

    await user.selectOptions(filterSelect, 'dibaca');
    expect(screen.getByRole('heading', { name: 'Bumi Manusia' })).toBeInTheDocument();

    await user.clear(searchInput);
    await user.selectOptions(filterSelect, 'all');
    await user.type(searchInput, 'andrea');
    expect(screen.getByRole('heading', { name: 'Laskar Pelangi' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bumi Manusia' })).not.toBeInTheDocument();
  });

  it('mempertahankan data setelah aplikasi dirender ulang', async () => {
    const user = userEvent.setup();
    const firstRender = renderApp();

    await user.click(screen.getByRole('button', { name: 'Tambah Buku' }));
    await user.type(screen.getByLabelText('Judul buku'), 'Buku Persisten');
    await user.type(screen.getByLabelText('Nama penulis'), 'Penulis Persisten');
    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(screen.getByRole('heading', { name: 'Buku Persisten' })).toBeInTheDocument();
    firstRender.unmount();

    renderApp();
    expect(screen.getByRole('heading', { name: 'Buku Persisten' })).toBeInTheDocument();
  });
});
