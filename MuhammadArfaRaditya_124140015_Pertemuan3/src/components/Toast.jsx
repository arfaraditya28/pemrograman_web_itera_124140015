import { useBooks } from '../context/BookContext';

function Toast() {
  const { toast, dismissToast } = useBooks();

  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={dismissToast}
        aria-label="Tutup notifikasi"
      >
        &times;
      </button>
    </div>
  );
}

export default Toast;
