import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// --- CONFIGURAÇÃO DO FIREBASE ---
// Substitua pelos dados do seu projeto no Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChqHvRbf10WYWnKbb7Ud8XSgrv7jeNkzM",
  authDomain: "d21d-b9e4b.firebaseapp.com",
  databaseURL: "https://d21d-b9e4b-default-rtdb.firebaseio.com",
  projectId: "d21d-b9e4b",
  storageBucket: "d21d-b9e4b.firebasestorage.app",
  messagingSenderId: "154013035782",
  appId: "1:154013035782:web:66869287b474b2a181c287"
};

// Inicialização das instâncias
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

const EMAIL_AUTORIZADO = "seu-email@gmail.com"; 

// --- GESTÃO DE INTERFACE E LOGIN ---

/**
 * Renderiza a tela de bloqueio caso o utilizador não esteja autenticado
 */
function renderLoginScreen() {
    const appDiv = document.getElementById('app');
    if (!appDiv) return;

    appDiv.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-6 text-center">
            <div class="w-20 h-20 bg-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
                <i data-lucide="lock" class="text-white" width="32"></i>
            </div>
            <h1 class="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
            <p class="text-slate-400 mb-8 text-sm">Faça login com a sua conta autorizada para gerir os seus treinos.</p>
            <button onclick="loginPeloGoogle()" class="w-full max-w-xs bg-white text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18">
                Entrar com Google
            </button>
        </div>
    `;
    if (window.lucide) lucide.createIcons();
}

/**
 * Função global para processar o login com Google Popup
 */
window.loginPeloGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        if (result.user.email !== EMAIL_AUTORIZADO) {
            alert("Acesso negado: Este e-mail não tem permissão.");
            await signOut(auth);
            location.reload();
        }
    } catch (error) {
        console.error("Erro no login:", error);
    }
};

/**
 * Monitor do estado de autenticação
 */
onAuthStateChanged(auth, (user) => {
    if (user && user.email === EMAIL_AUTORIZADO) {
        console.log("Acesso concedido para:", user.email);
        // Sincroniza dados antes de renderizar a home
        syncDataFromFirebase().then(() => {
            if (window.renderHome) window.renderHome();
        });
    } else {
        renderLoginScreen();
    }
});

// --- PERSISTÊNCIA DE DADOS (FIREBASE + LOCAL) ---

/**
 * Guarda dados do exercício no Firebase associados ao UID do utilizador
 */
window.saveExerciseData = async (exId, data) => {
    const user = auth.currentUser;
    if (!user) return;

    const today = new Date().toLocaleDateString('pt-BR');
    
    // Atualização Local
    const localKey = `gym_data_${exId}`;
    const currentLocal = JSON.parse(localStorage.getItem(localKey) || '{}');
    const updated = { ...currentLocal, ...data, lastUpdate: today };
    localStorage.setItem(localKey, JSON.stringify(updated));

    // Persistência na Nuvem
    try {
        await set(ref(db, `users/${user.uid}/exercises/${exId}`), updated);
        console.log(`Dados salvos: ${exId}`);
    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
    }
};

/**
 * Recupera dados do LocalStorage (previamente sincronizados)
 */
window.getExerciseData = (exId) => {
    return JSON.parse(localStorage.getItem(`gym_data_${exId}`) || '{}');
};

/**
 * Sincroniza os dados do Realtime Database para o LocalStorage
 */
async function syncDataFromFirebase() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const snapshot = await get(ref(db, `users/${user.uid}/exercises`));
        if (snapshot.exists()) {
            const allData = snapshot.val();
            Object.keys(allData).forEach(exId => {
                localStorage.setItem(`gym_data_${exId}`, JSON.stringify(allData[exId]));
            });
            console.log("Sincronização completa.");
        }
    } catch (error) {
        console.error("Erro na sincronização:", error);
    }
}

// --- FUNÇÕES DE INTERAÇÃO (CHAMADAS PELO HTML) ---

window.saveInput = (exId, itemIdx, field, val) => {
    const curr = window.getExerciseData(exId);
    const items = curr.items || {};
    if (!items[itemIdx]) items[itemIdx] = {};
    items[itemIdx][field] = val;
    window.saveExerciseData(exId, { items });
};

window.toggleDone = (exId) => {
    const curr = window.getExerciseData(exId);
    const newState = !curr.done;
    window.saveExerciseData(exId, { done: newState });
    
    // Feedback visual imediato
    const card = document.getElementById(`card-${exId}`);
    const btn = document.getElementById(`btn-check-${exId}`);

    if (newState) {
        if (card) card.classList.add('card-done');
        if (btn) {
            btn.classList.add('checked');
            btn.innerHTML = `<i data-lucide="check-circle-2" width="18"></i> Feito`;
        }
        if (window.confetti) window.confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
    } else {
        if (card) card.classList.remove('card-done');
        if (btn) {
            btn.classList.remove('checked');
            btn.innerHTML = `<i data-lucide="circle" width="18"></i> Concluir`;
        }
    }
    if (window.lucide) lucide.createIcons();
};

window.logout = () => signOut(auth).then(() => location.reload());