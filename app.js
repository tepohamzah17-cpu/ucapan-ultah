import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase Configuration
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

// DOM Elements
const loginCard = document.getElementById('login-card');
const contentCard = document.getElementById('content-card');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnSurprise = document.getElementById('btn-surprise');
const btnLogout = document.getElementById('btn-logout');
const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');

// --- EFEK KEJUTAN INTERAKTIF ---

function lemparkanKonfeti() {
    confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.1, y: 0.6 }
    });
    confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.9, y: 0.6 }
    });
}

function buatBalonTerbang() {
    const container = document.getElementById('balloon-container');
    if (!container) return;
    
    container.innerHTML = ''; 
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 90 + '%';
        balloon.style.animationDelay = Math.random() * 2.5 + 's';
        container.appendChild(balloon);
    }
}

function picuKejutanUlangTahun() {
    lemparkanKonfeti();
    buatBalonTerbang();
}

// --- LOGIKA AUTENTIKASI ---

// Monitor Status Login
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginCard.classList.add('hidden');
        contentCard.classList.remove('hidden');
        // Jalankan efek saat halaman ucapan terbuka
        setTimeout(picuKejutanUlangTahun, 300);
    } else {
        loginCard.classList.remove('hidden');
        contentCard.classList.add('hidden');
    }
});

// Helper Ambil Input & Validasi
function getInputs() {
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    if (!email || !password) {
        alert("Harap isi email dan kata sandi!");
        return null;
    }
    if (password.length < 6) {
        alert("Kata sandi minimal harus 6 karakter!");
        return null;
    }
    return { email, password };
}

// Aksi Masuk Akun
btnLogin.addEventListener('click', async () => {
    const credentials = getInputs();
    if (!credentials) return;

    try {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error) {
        console.error("Gagal masuk:", error.message);
        alert("Email atau kata sandi salah!");
    }
});

// Aksi Daftar Akun Baru
btnRegister.addEventListener('click', async () => {
    const credentials = getInputs();
    if (!credentials) return;

    try {
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        alert("Akun berhasil dibuat dan Anda otomatis masuk!");
    } catch (error) {
        console.error("Gagal mendaftar:", error.message);
        if (error.code === 'auth/email-already-in-use') {
            alert("Email ini sudah terdaftar. Silakan langsung masuk.");
        } else {
            alert("Gagal mendaftar: " + error.message);
        }
    }
});

// Aksi Kejutan Manual
if (btnSurprise) {
    btnSurprise.addEventListener('click', picuKejutanUlangTahun);
}

// Aksi Keluar Halaman
btnLogout.addEventListener('click', () => {
    signOut(auth);
});