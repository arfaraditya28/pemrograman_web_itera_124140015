const kaliForm = document.getElementById('kaliForm');
const kaliAngka = document.getElementById('kaliAngka');
const kaliAngkaError = document.getElementById('kaliAngkaError');
const kaliOut = document.getElementById('kaliOut');

const faktorialForm = document.getElementById('faktorialForm');
const faktorialAngka = document.getElementById('faktorialAngka');
const faktorialAngkaError = document.getElementById('faktorialAngkaError');
const faktorialOut = document.getElementById('faktorialOut');

const primaForm = document.getElementById('primaForm');
const primaAngka = document.getElementById('primaAngka');
const primaAngkaError = document.getElementById('primaAngkaError');
const primaOut = document.getElementById('primaOut');

const bmiForm = document.getElementById('bmiForm');
const beratInput = document.getElementById('beratInput');
const tinggiInput = document.getElementById('tinggiInput');
const bmiError = document.getElementById('bmiError');
const bmiOut = document.getElementById('bmiOut');

const fizzBtn = document.getElementById('fizzBtn');
const fizzOut = document.getElementById('fizzOut');

// 1. Tabel Perkalian 1–10 dengan loop
kaliForm.addEventListener('submit', (event) => {
  event.preventDefault();
  kaliAngkaError.textContent = '';
  const angka = Number(kaliAngka.value);
  if (!Number.isInteger(angka)) {
    kaliAngkaError.textContent = 'Masukkan angka bulat.';
    kaliOut.textContent = '';
    return;
  }
  const baris = [];
  for (let i = 1; i <= 10; i++) {
    baris.push(angka + ' × ' + i + ' = ' + (angka * i));
  }
  kaliOut.textContent = baris.join(' | ');
});

// 2. Faktorial dengan fungsi
function hitungFaktorial(n) {
  let hasil = 1;
  for (let i = 2; i <= n; i++) {
    hasil = hasil * i;
  }
  return hasil;
}

faktorialForm.addEventListener('submit', (event) => {
  event.preventDefault();
  faktorialAngkaError.textContent = '';
  const angka = Number(faktorialAngka.value);
  if (!Number.isInteger(angka) || angka < 0 || angka > 15) {
    faktorialAngkaError.textContent = 'Masukkan angka bulat 0–15.';
    faktorialOut.textContent = '';
    return;
  }
  faktorialOut.textContent = angka + '! = ' + hitungFaktorial(angka);
});

// 3. Bilangan Prima dengan fungsi
function isPrima(n) {
  if (n < 2) {
    return false;
  }
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

primaForm.addEventListener('submit', (event) => {
  event.preventDefault();
  primaAngkaError.textContent = '';
  const angka = Number(primaAngka.value);
  if (!Number.isInteger(angka)) {
    primaAngkaError.textContent = 'Masukkan angka bulat.';
    primaOut.textContent = '';
    return;
  }
  primaOut.textContent = angka + (isPrima(angka) ? ' adalah Bilangan Prima.' : ' Bukan Bilangan Prima.');
});

// 4. Kalkulator BMI dengan fungsi + event handler
function hitungBmi(beratKg, tinggiCm) {
  const tinggiM = tinggiCm / 100;
  return beratKg / (tinggiM * tinggiM);
}

function kategoriBmi(bmi) {
  if (bmi < 18.5) {
    return 'Kurus';
  } else if (bmi < 25) {
    return 'Normal';
  } else if (bmi < 30) {
    return 'Gemuk';
  }
  return 'Obesitas';
}

bmiForm.addEventListener('submit', (event) => {
  event.preventDefault();
  bmiError.textContent = '';
  const berat = Number(beratInput.value);
  const tinggi = Number(tinggiInput.value);
  if (!Number.isFinite(berat) || berat <= 0 || !Number.isFinite(tinggi) || tinggi <= 0) {
    bmiError.textContent = 'Berat dan tinggi harus angka positif.';
    bmiOut.textContent = '';
    return;
  }
  const bmi = hitungBmi(berat, tinggi);
  bmiOut.textContent = 'BMI: ' + bmi.toFixed(1) + ' (' + kategoriBmi(bmi) + ').';
});

// 5. FizzBuzz 1–100
function buatFizzBuzz() {
  const hasil = [];
  for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      hasil.push('FizzBuzz');
    } else if (i % 3 === 0) {
      hasil.push('Fizz');
    } else if (i % 5 === 0) {
      hasil.push('Buzz');
    } else {
      hasil.push(String(i));
    }
  }
  return hasil;
}

fizzBtn.addEventListener('click', () => {
  fizzOut.innerHTML = '';
  const hasil = buatFizzBuzz();
  hasil.forEach((teks) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = teks;
    fizzOut.appendChild(chip);
  });
});
