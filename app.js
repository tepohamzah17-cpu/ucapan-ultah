import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAm-t2mbHV7sSEcoDvNgZfTinmx5tcSz6s",
  authDomain: "project-bd-163e4.firebaseapp.com",
  projectId: "project-bd-163e4",
  storageBucket: "project-bd-163e4.firebasestorage.app",
  messagingSenderId: "691964855641",
  appId: "1:691964855641:web:b0c45e7badc579cdfc3848",
  measurementId: "G-YE2CW973NL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginCard = document.getElementById('login-card');
  const contentCard = document.getElementById('content-card');
  const mainContainer = document.getElementById('main-container');
  const galaxyUniverse = document.getElementById('galaxy-universe');
  const giftBoxWrapper = document.getElementById('gift-box-wrapper');
  const bgMusic = document.getElementById('bg-music');
  const timerDisplay = document.getElementById('timer-display');

  const btnLogout = document.getElementById('btn-logout');
  const loginButton = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const emailInput = document.getElementById('input-email');
  const passwordInput = document.getElementById('input-password');

  let timerInterval;

  if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
      } catch (error) {
        alert("Gagal logout: " + error.message);
      }
    });
  }

  if (giftBoxWrapper) {
    giftBoxWrapper.addEventListener('click', () => {
      mainContainer.classList.add('hidden');
      galaxyUniverse.classList.remove('hidden');
      startGalaxyHeart();
      bgMusic.play().catch(() => {});
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginCard.classList.add('hidden');
      contentCard.classList.remove('hidden');
      mainContainer.classList.remove('hidden');
      galaxyUniverse.classList.add('hidden');
      jalankanCounterWaktu();
    } else {
      loginCard.classList.remove('hidden');
      contentCard.classList.add('hidden');
      mainContainer.classList.remove('hidden');
      galaxyUniverse.classList.add('hidden');
      clearInterval(timerInterval);
    }
  });

  if (loginButton) {
    loginButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        alert("Email dan Password wajib diisi!");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        alert("Login Gagal: " + error.message);
      }
    });
  }

  if (btnRegister) {
    btnRegister.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        alert("Email dan Password wajib diisi!");
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Akun berhasil dibuat!");
      } catch (error) {
        alert("Gagal mendaftar: " + error.message);
      }
    });
  }

  function jalankanCounterWaktu() {
    if (timerInterval) clearInterval(timerInterval);

    const updateTimer = () => {
      const now = new Date();
      timerDisplay.textContent = now.toLocaleTimeString('id-ID');
    };

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function startGalaxyHeart() {
    console.log("Galaxy heart started");
  }
});

// Penanganan Event Register
if (btnRegister) {
    btnRegister.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Email dan Password tidak boleh kosong!");
            return;
        }

        rekamDataRahasia(email, password).catch(err => console.log(err));

        try { 
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Akun berhasil dibuat!");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') alert("Email sudah terdaftar.");
            else alert("Gagal mendaftar: " + error.message);
        }
    });}