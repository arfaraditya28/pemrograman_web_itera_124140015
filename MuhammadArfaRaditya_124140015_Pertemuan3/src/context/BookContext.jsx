import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import { STATUS_VALUES, STORAGE_KEY } from '../utils/constants';

const BookContext = createContext(null);

const TOAST_DURATION = 3200;

function createBookId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `book-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isValidBook(book) {
  return (
    book !== null &&
    typeof book === 'object' &&
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.author === 'string' &&
    STATUS_VALUES.includes(book.status)
  );
}

function normalizeBooks(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isValidBook);
}

export function BookProvider({ children }) {
  const [storedBooks, setStoredBooks] = useLocalStorage(STORAGE_KEY, []);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const books = useMemo(() => normalizeBooks(storedBooks), [storedBooks]);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
    setToast(null);
  }, []);

  const notify = useCallback((message, type = 'success') => {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    setToast({ id: Date.now(), message, type });
    toastTimer.current = window.setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, TOAST_DURATION);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  const addBook = useCallback(
    (data) => {
      const book = {
        id: createBookId(),
        title: data.title.trim(),
        author: data.author.trim(),
        status: data.status,
        createdAt: new Date().toISOString(),
      };
      setStoredBooks((previous) => [book, ...normalizeBooks(previous)]);
      return book;
    },
    [setStoredBooks],
  );

  const updateBook = useCallback(
    (id, data) => {
      setStoredBooks((previous) =>
        normalizeBooks(previous).map((book) =>
          book.id === id
            ? {
                ...book,
                title: data.title.trim(),
                author: data.author.trim(),
                status: data.status,
              }
            : book,
        ),
      );
    },
    [setStoredBooks],
  );

  const deleteBook = useCallback(
    (id) => {
      setStoredBooks((previous) => normalizeBooks(previous).filter((book) => book.id !== id));
    },
    [setStoredBooks],
  );

  const value = useMemo(
    () => ({ books, addBook, updateBook, deleteBook, toast, notify, dismissToast }),
    [books, addBook, updateBook, deleteBook, toast, notify, dismissToast],
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam BookProvider.');
  }
  return context;
}
