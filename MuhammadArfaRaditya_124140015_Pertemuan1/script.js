const STORAGE_KEY = 'miniPosCart';
const DISCOUNT_THRESHOLD = 50000;
const DISCOUNT_RATE = 0.1;
const MIN_PRICE = 500;

const itemForm = document.getElementById('itemForm');
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemQtyInput = document.getElementById('itemQty');
const cashPaidInput = document.getElementById('cashPaid');

const nameError = document.getElementById('nameError');
const priceError = document.getElementById('priceError');
const qtyError = document.getElementById('qtyError');
const cashError = document.getElementById('cashError');

const cartBody = document.getElementById('cartBody');
const emptyNote = document.getElementById('emptyNote');
const cartCount = document.getElementById('cartCount');

const totalBelanjaEl = document.getElementById('totalBelanja');
const discountEl = document.getElementById('discount');
const discountBadge = document.getElementById('discountBadge');
const grandTotalEl = document.getElementById('grandTotal');
const changeValueEl = document.getElementById('changeValue');
const changeMessageEl = document.getElementById('changeMessage');
const changeBox = document.getElementById('changeBox');
const resetBtn = document.getElementById('resetBtn');

let cartItems = [];

function formatRupiah(amount) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return 'Rp' + Math.round(safeAmount).toLocaleString('id-ID');
}

function calculateSubtotal(price, qty) {
  return price * qty;
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + calculateSubtotal(item.price, item.qty), 0);
}

function calculateDiscount(total) {
  if (total >= DISCOUNT_THRESHOLD) {
    return total * DISCOUNT_RATE;
  }
  return 0;
}

function calculateChange(cashPaid, grandTotal) {
  return cashPaid - grandTotal;
}

function saveToLocalStorage() {
  try {
    const serialized = JSON.stringify(cartItems);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Gagal menyimpan ke localStorage:', err);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null || raw === '') {
      cartItems = [];
      return;
    }
    const parsed = JSON.parse(raw);
    cartItems = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Gagal membaca localStorage, keranjang dikosongkan:', err);
    cartItems = [];
  }
}

function clearFieldError(inputEl, errorEl) {
  errorEl.textContent = '';
  inputEl.classList.remove('invalid');
}

function setFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  inputEl.classList.add('invalid');
}

function validateForm() {
  let isValid = true;

  const rawName = itemNameInput.value.trim();
  const rawPrice = itemPriceInput.value.trim();
  const rawQty = itemQtyInput.value.trim();

  clearFieldError(itemNameInput, nameError);
  clearFieldError(itemPriceInput, priceError);
  clearFieldError(itemQtyInput, qtyError);

  // Nama barang
  if (rawName === '') {
    setFieldError(itemNameInput, nameError, 'Nama barang wajib diisi.');
    isValid = false;
  } else if (rawName.length < 3) {
    setFieldError(itemNameInput, nameError, 'Nama barang minimal 3 karakter.');
    isValid = false;
  }

  // Harga satuan
  if (rawPrice === '') {
    setFieldError(itemPriceInput, priceError, 'Harga satuan wajib diisi.');
    isValid = false;
  } else {
    const price = Number(rawPrice);
    if (!Number.isFinite(price) || rawPrice.includes(' ') || Number.isNaN(price)) {
      setFieldError(itemPriceInput, priceError, 'Harga satuan wajib berupa angka.');
      isValid = false;
    } else if (price <= 0) {
      setFieldError(itemPriceInput, priceError, 'Harga harus positif.');
      isValid = false;
    } else if (price < MIN_PRICE) {
      setFieldError(itemPriceInput, priceError, 'Harga minimal Rp500.');
      isValid = false;
    }
  }

  // Qty
  if (rawQty === '') {
    setFieldError(itemQtyInput, qtyError, 'Qty wajib diisi.');
    isValid = false;
  } else {
    const qty = Number(rawQty);
    if (!Number.isFinite(qty) || !Number.isInteger(qty)) {
      setFieldError(itemQtyInput, qtyError, 'Qty wajib berupa angka bulat.');
      isValid = false;
    } else if (qty < 1) {
      setFieldError(itemQtyInput, qtyError, 'Qty minimal 1.');
      isValid = false;
    }
  }

  return isValid;
}

function addItem(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const newItem = {
    id: Date.now(),
    name: itemNameInput.value.trim(),
    price: Number(itemPriceInput.value.trim()),
    qty: Number(itemQtyInput.value.trim())
  };

  cartItems.push(newItem);
  saveToLocalStorage();
  renderCart();

  itemForm.reset();
  itemNameInput.focus();
}

function deleteItem(id) {
  cartItems = cartItems.filter((item) => item.id !== id);
  saveToLocalStorage();
  renderCart();
}

function renderCart() {
  cartBody.innerHTML = '';

  cartItems.forEach((item, index) => {
    const row = document.createElement('tr');

    const noCell = document.createElement('td');
    noCell.textContent = String(index + 1);

    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;

    const priceCell = document.createElement('td');
    priceCell.textContent = formatRupiah(item.price);

    const qtyCell = document.createElement('td');
    qtyCell.textContent = String(item.qty);

    const subtotalCell = document.createElement('td');
    subtotalCell.textContent = formatRupiah(calculateSubtotal(item.price, item.qty));

    const actionCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'btn-small';
    deleteBtn.addEventListener('click', () => deleteItem(item.id));
    actionCell.appendChild(deleteBtn);

    row.append(noCell, nameCell, priceCell, qtyCell, subtotalCell, actionCell);
    cartBody.appendChild(row);
  });

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = cartItems.length + ' item (' + totalQty + ' pcs)';
  emptyNote.style.display = cartItems.length === 0 ? 'block' : 'none';

  updateSummary();
}

function updateSummary() {
  const total = calculateTotal(cartItems);
  const discount = calculateDiscount(total);
  const grandTotal = total - discount;

  totalBelanjaEl.textContent = formatRupiah(total);
  discountEl.textContent = formatRupiah(discount);
  grandTotalEl.textContent = formatRupiah(grandTotal);
  discountBadge.textContent = discount > 0 ? '10%' : '0%';

  updateChange(grandTotal);
}

function updateChange(grandTotal) {
  const rawCash = cashPaidInput.value.trim();

  cashError.textContent = '';
  cashPaidInput.classList.remove('invalid');
  changeBox.classList.remove('warning');

  if (rawCash === '') {
    changeValueEl.textContent = formatRupiah(0);
    changeMessageEl.textContent = grandTotal > 0 ? 'Masukkan uang bayar untuk menghitung kembalian.' : '';
    return;
  }

  const cashPaid = Number(rawCash);
  if (!Number.isFinite(cashPaid) || cashPaid < 0) {
    setFieldError(cashPaidInput, cashError, 'Uang bayar harus berupa angka positif.');
    changeValueEl.textContent = formatRupiah(0);
    changeMessageEl.textContent = '';
    return;
  }

  if (cartItems.length === 0 || grandTotal === 0) {
    changeValueEl.textContent = formatRupiah(0);
    changeMessageEl.textContent = 'Keranjang masih kosong.';
    return;
  }

  const change = calculateChange(cashPaid, grandTotal);
  if (change < 0) {
    changeValueEl.textContent = formatRupiah(0);
    changeMessageEl.textContent = 'Uang pembayaran belum mencukupi. Kurang ' + formatRupiah(Math.abs(change)) + '.';
    changeBox.classList.add('warning');
  } else {
    changeValueEl.textContent = formatRupiah(change);
    changeMessageEl.textContent = 'Pembayaran cukup. Terima kasih!';
  }
}

function resetTransaction() {
  cartItems = [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Gagal menghapus localStorage:', err);
  }

  itemForm.reset();
  cashPaidInput.value = '';
  clearFieldError(itemNameInput, nameError);
  clearFieldError(itemPriceInput, priceError);
  clearFieldError(itemQtyInput, qtyError);
  clearFieldError(cashPaidInput, cashError);
  renderCart();
  itemNameInput.focus();
}

itemForm.addEventListener('submit', addItem);
resetBtn.addEventListener('click', resetTransaction);
cashPaidInput.addEventListener('input', () => {
  const total = calculateTotal(cartItems);
  const discount = calculateDiscount(total);
  updateChange(total - discount);
});

// Validasi live: hapus error saat user mengetik ulang
itemNameInput.addEventListener('input', () => clearFieldError(itemNameInput, nameError));
itemPriceInput.addEventListener('input', () => clearFieldError(itemPriceInput, priceError));
itemQtyInput.addEventListener('input', () => clearFieldError(itemQtyInput, qtyError));

loadFromLocalStorage();
renderCart();
