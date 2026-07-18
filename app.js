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

// DOM Elements
const loginCard = document.getElementById('login-card');
const contentCard = document.getElementById('content-card');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnSurprise = document.getElementById('btn-surprise');
const btnLogout = document.getElementById('btn-logout');
const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');

const giftBoxWrapper = document.getElementById('gift-box-wrapper');
const secretMessage = document.getElementById('secret-message');
const timerDisplay = document.getElementById('timer-display');
const bgMusic = document.getElementById('bg-music');

let timerInterval;

// --- EFEK VISUAL PESTA ---
function lemparkanKonfeti() {
    confetti({ particleCount: 80, spread: 60, origin: { x: 0.1, y: 0.6 } });
    confetti({ particleCount: 80, spread: 60, origin: { x: 0.9, y: 0.6 } });
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

// --- LOGIKA LIVE TIMER USIA BARU ---
function jalankanCounterWaktu() {
    const startTime = new Date().getTime();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = now - startTime;

        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        timerDisplay.innerHTML = `${hours} Jam ${minutes} Menit ${seconds} Detik`;
    }, 1000);
}

// --- INTERAKSI BUKA KADO & AUDIO ---
giftBoxWrapper.addEventListener('click', () => {
    // Sembunyikan ikon kado
    giftBoxWrapper.classList.add('hidden');
    // Munculkan isi surat ucapan dengan efek transisi
    secretMessage.classList.add('show');
    
    // Picu audio & efek visual pesta
    bgMusic.play().catch(error => console.log("Autoplay musik diblokir browser, dimainkan setelah interaksi."));
    lemparkanKonfeti();
    buatBalonTerbang();
    jalankanCounterWaktu();
});

// --- AUTENTIKASI ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginCard.classList.add('hidden');
        contentCard.classList.remove('hidden');
    } else {
        loginCard.classList.remove('hidden');
        contentCard.classList.add('hidden');
        secretMessage.classList.remove('show');
        giftBoxWrapper.classList.remove('hidden');
        clearInterval(timerInterval);
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
});

function getInputs() {
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    if (!email || !password) { alert("Harap isi email dan kata sandi!"); return null; }
    if (password.length < 6) { alert("Kata sandi minimal harus 6 karakter!"); return null; }
    return { email, password };
}

btnLogin.addEventListener('click', async () => {
    const credentials = getInputs(); if (!credentials) return;
    try { await signInWithEmailAndPassword(auth, credentials.email, credentials.password); } 
    catch (error) { alert("Email atau kata sandi salah!"); }
});

btnRegister.addEventListener('click', async () => {
    const credentials = getInputs(); if (!credentials) return;
    try { 
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        alert("Akun berhasil dibuat!");
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') alert("Email sudah terdaftar.");
        else alert("Gagal mendaftar: " + error.message);
    }
});

btnSurprise.addEventListener('click', () => { lemparkanKonfeti(); buatBalonTerbang(); });
btnLogout.addEventListener('click', () => { signOut(auth); });