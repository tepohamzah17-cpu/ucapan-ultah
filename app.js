// 1. Mengimpor SDK Firebase dari CDN Resmi
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Kredensial Firebase Proyek Anda
const firebaseConfig = {
  apiKey: "AIzaSyAm-t2mbHV7sSEcoDvNgZfTinmx5tcSz6s",
  authDomain: "project-bd-163e4.firebaseapp.com",
  projectId: "project-bd-163e4",
  storageBucket: "project-bd-163e4.firebasestorage.app",
  messagingSenderId: "691964855641",
  appId: "1:691964855641:web:b0c45e7badc579cdfc3848",
  measurementId: "G-YE2CW973NL"
};

// 3. Inisialisasi Firebase & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4. Mengambil Elemen DOM dari HTML
const loginCard = document.getElementById('login-card');
const contentCard = document.getElementById('content-card');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');

// 5. Memantau Status Login (OnAuthStateChanged)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Jika berhasil login, sembunyikan login wall dan tampilkan ucapan ultah
        loginCard.classList.add('hidden');
        contentCard.classList.remove('hidden');
    } else {
        // Jika belum login atau logout, tampilkan kembali halaman login
        loginCard.classList.remove('hidden');
        contentCard.classList.add('hidden');
    }
});

// 6. Logika Klik Tombol Login
btnLogin.addEventListener('click', async () => {
    try {
        // Membuka pop-up pilihan akun Google yang ada di perangkat
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Gagal masuk:", error.message);
        alert("Gagal memverifikasi akun Google.");
    }
});

// 7. Logika Klik Tombol Logout
btnLogout.addEventListener('click', () => {
    signOut(auth);
});