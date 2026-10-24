import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('memuat nilai yang sudah tersimpan di localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify(['buku-a', 'buku-b']));

    const { result } = renderHook(() => useLocalStorage('test-key', []));

    expect(result.current[0]).toEqual(['buku-a', 'buku-b']);
  });

  it('menyimpan perubahan nilai ke localStorage secara otomatis', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1](42);
    });

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem('test-key'))).toBe(42);
    });
  });

  it('menggunakan nilai awal dan tidak crash saat data localStorage rusak', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem('test-key', '{ini-bukan-json');

    const { result } = renderHook(() => useLocalStorage('test-key', []));

    expect(result.current[0]).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
