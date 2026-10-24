import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useBookStats from '../hooks/useBookStats';

describe('useBookStats', () => {
  it('menghitung total, jumlah per status, dan persentasenya', () => {
    const books = [
      { status: 'dimiliki' },
      { status: 'dimiliki' },
      { status: 'dibaca' },
      { status: 'ingin-dibeli' },
    ];

    const { result } = renderHook(() => useBookStats(books));

    expect(result.current.total).toBe(4);
    expect(result.current.owned).toBe(2);
    expect(result.current.reading).toBe(1);
    expect(result.current.wishlist).toBe(1);
    expect(result.current.percentages).toEqual({
      dimiliki: 50,
      dibaca: 25,
      'ingin-dibeli': 25,
    });
  });

  it('mengembalikan nol untuk semua nilai saat koleksi kosong', () => {
    const { result } = renderHook(() => useBookStats([]));

    expect(result.current).toEqual({
      total: 0,
      owned: 0,
      reading: 0,
      wishlist: 0,
      percentages: {
        dimiliki: 0,
        dibaca: 0,
        'ingin-dibeli': 0,
      },
    });
  });
});
