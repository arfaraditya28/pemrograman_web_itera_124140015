import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import BookForm from '../components/BookForm';

describe('BookForm', () => {
  it('menampilkan pesan validasi jika judul dan penulis kosong', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(screen.getByText('Judul buku wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi.')).toBeInTheDocument();
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('menolak input yang hanya berisi spasi', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await user.type(screen.getByLabelText('Judul buku'), '    ');
    await user.type(screen.getByLabelText('Nama penulis'), '    ');
    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(screen.getByText('Judul buku wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('mengirim data yang sudah dirapikan saat formulir valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await user.type(screen.getByLabelText('Judul buku'), '  Laskar Pelangi  ');
    await user.type(screen.getByLabelText('Nama penulis'), '  Andrea Hirata  ');
    await user.selectOptions(screen.getByLabelText('Status'), 'dibaca');
    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'dibaca',
    });
  });
});
