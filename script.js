import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// --- 1. CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyChqHvRbf10WYWnKbb7Ud8XSgrv7jeNkzM",
  authDomain: "d21d-b9e4b.firebaseapp.com",
  databaseURL: "https://d21d-b9e4b-default-rtdb.firebaseio.com",
  projectId: "d21d-b9e4b",
  storageBucket: "d21d-b9e4b.firebasestorage.app",
  messagingSenderId: "154013035782",
  appId: "1:154013035782:web:66869287b474b2a181c287"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

const EMAIL_AUTORIZADO = "bompatricio@gmail.com"; 

const EXERCISE_TIPS = {
    'Afundo': "Dê um passo largo. Desça o joelho de trás em direção ao chão. Tronco reto.",
    'Stiff': "Pés na largura do quadril. Joelhos semi-flexionados. Empine o glúteo.",
    'Agachamento': "Jogue o quadril para trás. Joelhos seguem a ponta dos pés.",
    'Cadeira Flexora': "Contraia forte puxando para baixo, segure 1 seg e suba devagar.",
    'Cadeira Abdutora': "Incline o tronco levemente à frente. Empurre os joelhos para fora.",
    'Elevação de Quadril': "Suba o quadril contraindo o bumbum no topo. Segure 2 seg.",
    'Flexão de Braço': "Corpo reto. Apoie joelhos se precisar. Cotovelos a 45 graus.",
    'Remada Curvada': "Tronco inclinado. Puxe os pesos na direção da cintura.",
    'Supino': "Desça a barra na linha do peito. Cotovelos não muito abertos.",
    'Rosca Alternada': "Cotovelos colados na cintura. Gire o punho ao subir.",
    'Puxada Aberta': "Puxe a barra em direção à clavícula. Peito estufado.",
    'Tríceps Francês': "Cotovelos apontados para o teto. Desça o peso atrás da nuca.",
    'Crucifixo': "Braços levemente flexionados. Abra bem o peito.",
    'Tríceps Banco': "Desça o quadril rente ao banco. Cotovelos fechados.",
    'Prancha': "Cotovelos alinhados com ombros. Contraia glúteo e abdômen.",
    'Agachamento Búlgaro': "Força na perna da frente. Tronco levemente inclinado.",
    'Desenvolvimento': "Empurre acima da cabeça. Não arqueie as costas.",
    'Burpee': "Mãos no chão, prancha, volta e salto.",
    'Agachamento Sumô': "Pés afastados, pontas para fora. Desça verticalmente.",
    'Leg Press': "Empurre com o calcanhar. Não estique o joelho todo.",
    'Panturrilha': "Amplitude total: desça bem e suba tudo."
};

window.getTip = function(name) {
    const key = Object.keys(EXERCISE_TIPS).find(k => name.toLowerCase().includes(k.toLowerCase()));
    return key ? EXERCISE_TIPS[key] : "Mantenha a postura e concentre-se na execução.";
};

const WORKOUT_PLAN = {
    'A': {
        title: "Treino A: Inferior (Anterior)",
        description: "Foco: Quadríceps, Glúteo e Panturrilha",
        videoUrl: "",
        exercises: [
            { 
                id: 'ta_b1', 
                type: 'biset', 
                title: 'Bloco 1 - Base e Estabilidade', 
                summary: 'O agachamento atua como construtor de força global para membros inferiores. O afundo, executado na sequência, recruta os estabilizadores do quadril e corrige assimetrias por ser unilateral. Faça a transição sem descanso.',
                items: [
                    { name: 'Agachamento (Livre ou Barra)', details: '3x 10 a 12 reps' }, 
                    { name: 'Afundo', details: '3x 10 reps (cada perna)' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'ta_b2', 
                type: 'biset', 
                title: 'Bloco 2 - Volume e Isolamento', 
                summary: 'Trabalho de potência no Leg Press, permitindo empurrar mais carga com o tronco estabilizado, seguido do isolamento do glúteo médio na cadeira abdutora (essencial para proteger o joelho nos agachamentos).',
                items: [
                    { name: 'Leg Press', details: '3x 12 reps' }, 
                    { name: 'Cadeira Abdutora', details: '3x 15 reps' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'ta_b3', 
                type: 'biset', 
                title: 'Bloco 3 - Exaustão e Contração', 
                summary: 'A cadeira extensora leva o quadríceps à falha muscular sem carga axial na coluna. Na elevação pélvica, o foco é o pico de contração: suba o quadril com potência e aperte o glúteo por 2 segundos antes de descer.',
                items: [
                    { name: 'Cadeira Extensora', details: '3x 12 reps' }, 
                    { name: 'Elevação Pélvica', details: '3x 12 reps (segura 2s)' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'ta_b4', 
                type: 'biset', 
                title: 'Bloco 4 - Core e Panturrilha', 
                summary: 'A panturrilha exige amplitude máxima (desça o calcanhar o máximo possível e suba na ponta dos pés). A prancha recruta o core de forma isométrica para fortalecer o cinturão abdominal.',
                items: [
                    { name: 'Panturrilha', details: '4x 15 a 20 reps' }, 
                    { name: 'Prancha Abdominal', details: '4x 40 a 60 segundos' }
                ], 
                restTime: 45, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            }
        ]
    },
    'B': {
        title: "Treino B: Superior (Completo)",
        description: "Foco: Peito, Costas e Braços",
        videoUrl: "",
        exercises: [
            { 
                id: 'tb_b1', 
                type: 'biset', 
                title: 'Bloco 1 - Antagônicos Base', 
                summary: 'Biset de músculos opostos. A puxada aberta foca na expansão da grande dorsal (largura das costas). O supino recruta o peitoral maior em conjunto com o deltoide anterior. Essa oposição mantém alto fluxo sanguíneo superior.',
                items: [
                    { name: 'Puxada Aberta', details: '3x 12 reps' }, 
                    { name: 'Supino (Barra ou Máquina)', details: '3x 10 a 12 reps' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'tb_b2', 
                type: 'biset', 
                title: 'Bloco 2 - Espessura e Alongamento', 
                summary: 'A remada curvada foca na espessura (miolo) das costas, exigindo estabilização lombar. O crucifixo trabalha o alongamento transversal das fibras do peito, proporcionando um estímulo de hipertrofia diferente do supino.',
                items: [
                    { name: 'Remada Curvada (ou Unilateral)', details: '3x 12 reps' }, 
                    { name: 'Crucifixo', details: '3x 12 reps' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'tb_b3', 
                type: 'biset', 
                title: 'Bloco 3 - Isolamento Costas e Falha', 
                summary: 'O pull down isola a asa das costas (dorsal) sem usar o bíceps como músculo auxiliar. A flexão de braço atua como um movimento finalizador até a falha para esgotar completamente o peito e o tríceps.',
                items: [
                    { name: 'Pull Down', details: '3x 12 reps' }, 
                    { name: 'Flexão de Braço', details: '3x Falha' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'tb_b4', 
                type: 'biset', 
                title: 'Bloco 4 - Foco em Braços', 
                summary: 'Isolamento exclusivo de extremidades. A rosca alternada permite concentrar a força no giro de punho (supinação) ativando o bíceps. O tríceps banco atua empurrando o peso corporal, garantindo o pump final nos braços.',
                items: [
                    { name: 'Rosca Alternada', details: '3x 12 reps (cada braço)' }, 
                    { name: 'Tríceps Banco (ou Francês)', details: '3x 12 reps' }
                ], 
                restTime: 45, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            }
        ]
    },
    'C': {
        title: "Treino C: Inferior (Posterior)",
        description: "Foco: Posteriores de Coxa e Glúteo",
        videoUrl: "",
        exercises: [
            { 
                id: 'tc_b1', 
                type: 'biset', 
                title: 'Bloco 1 - Cadeia Posterior Pesada', 
                summary: 'O levantamento terra (ou stiff pesado) ativa toda a cadeia posterior (isquiotibiais, glúteo e lombar). O agachamento búlgaro direciona a tensão para uma única perna, promovendo um alto nível de estresse muscular no glúteo e vasto medial.',
                items: [
                    { name: 'Levantamento Terra (ou Stiff Barra)', details: '3x 10 reps' }, 
                    { name: 'Agachamento Búlgaro', details: '3x 10 reps (cada perna)' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'tc_b2', 
                type: 'biset', 
                title: 'Bloco 2 - Isolamento e Adutores', 
                summary: 'A cadeira flexora gera tensão contínua e exclusividade para a musculatura posterior da coxa. O agachamento sumô entra recrutando a parte interna (adutores) e exigindo descida vertical para foco no glúteo.',
                items: [
                    { name: 'Cadeira Flexora', details: '3x 12 a 15 reps' }, 
                    { name: 'Agachamento Sumô', details: '3x 12 reps' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'tc_b3', 
                type: 'biset', 
                title: 'Bloco 3 - Alongamento e Isometria', 
                summary: 'O stiff com halteres promove um alongamento máximo das fibras isquiotibiais sob carga. Finalize o combo com o agachamento isométrico (sustentação na parede), impondo exaustão pela falta de oxigenação muscular temporária.',
                items: [
                    { name: 'Stiff Halteres', details: '3x 12 reps' }, 
                    { name: 'Agachamento Isométrico', details: '3x Máximo tempo possível' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'tc_b4', 
                type: 'biset', 
                title: 'Bloco 4 - Core e Aceleração', 
                summary: 'Transição para o sistema cardiovascular. O abdominal remador recruta o reto abdominal de ponta a ponta. Os tiros de cardio obrigam o corpo a usar o glicogênio restante e otimizam o ambiente metabólico.',
                items: [
                    { name: 'Abdominal Remador', details: '3x 15 a 20 reps' }, 
                    { name: 'Tiros de Cardio (Bike/Elíptico)', details: '3 minutos (30s forte / 30s leve)' }
                ], 
                restTime: 45, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            }
        ]
    },
    'D': {
        title: "Treino D: Full Body Metabólico",
        description: "Foco: Ombros, Core e Queima Calórica",
        videoUrl: "",
        exercises: [
            { 
                id: 'td_b1', 
                type: 'biset', 
                title: 'Bloco 1 - Potência Vertical', 
                summary: 'O desenvolvimento constrói ombros fortes e estáveis. O agachamento com salto transforma a força em potência, elevando imediatamente a frequência cardíaca e recrutando fibras de contração rápida nas pernas.',
                items: [
                    { name: 'Desenvolvimento', details: '3x 12 reps' }, 
                    { name: 'Agachamento com Salto', details: '3x 15 reps' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'td_b2', 
                type: 'biset', 
                title: 'Bloco 2 - Tração e Corpo Inteiro', 
                summary: 'A remada baixa exige contração do miolo das costas com ritmo controlado. O thruster (agacha e empurra) é um exercício sistêmico que consome alta energia ao transferir força da perna diretamente para os braços.',
                items: [
                    { name: 'Remada Baixa', details: '3x 12 reps' }, 
                    { name: 'Thruster (Agachamento + Press)', details: '3x 12 reps' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'td_b3', 
                type: 'biset', 
                title: 'Bloco 3 - Braços Integrados', 
                summary: 'A rosca martelo atinge o bíceps e o braquiorradial (antebraço), melhorando a pegada geral. O tríceps corda enfatiza a cabeça lateral do tríceps, exigindo a "abertura" da corda no fim do movimento para máxima eficácia.',
                items: [
                    { name: 'Rosca Martelo', details: '3x 12 reps' }, 
                    { name: 'Tríceps Corda', details: '3x 12 reps' }
                ], 
                restTime: 60, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            },
            { 
                id: 'td_b4', 
                type: 'biset', 
                title: 'Bloco 4 - Desafio Final', 
                summary: 'O burpee é um ativador cardíaco sistêmico que testa a resistência ao lactato. A prancha abdominal imediatamente depois ensina o core a se estabilizar e proteger a coluna mesmo sob fadiga respiratória extrema.',
                items: [
                    { name: 'Burpee', details: '3x 10 a 12 reps' }, 
                    { name: 'Prancha Abdominal', details: '3x 40 a 60 segundos' }
                ], 
                restTime: 45, 
                specialAction: { label: 'Registrar Execução', time: 0 } 
            }
        ]
    }
};

let currentWorkoutKey = null;

// --- GESTÃO DE ROTAÇÃO E PERSISTÊNCIA NO FIREBASE ---

const ORDER = ['A', 'B', 'C', 'D'];

async function getNextWorkoutKey() {
    const user = auth.currentUser;
    if (!user) return 'A';

    const profileRef = ref(db, `users/${user.uid}/profile`);
    try {
        const snapshot = await get(profileRef);
        if (snapshot.exists() && snapshot.val().lastWorkoutKey) {
            const lastKey = snapshot.val().lastWorkoutKey;
            const currentIndex = ORDER.indexOf(lastKey);
            return ORDER[(currentIndex + 1) % ORDER.length];
        }
    } catch (error) {
        console.error("Erro ao buscar último treino:", error);
    }
    return 'A'; 
}

window.saveWorkoutCompletion = async function(completedWorkoutKey) {
    const user = auth.currentUser;
    if (!user) return;

    const updates = {};
    const dateStr = new Date().toISOString().split('T')[0];
    
    updates[`users/${user.uid}/profile/lastWorkoutKey`] = completedWorkoutKey;
    
    updates[`users/${user.uid}/history/${dateStr}`] = {
        workoutKey: completedWorkoutKey,
        completedAt: new Date().toISOString()
    };

    try {
        await update(ref(db), updates);
        console.log(`Treino ${completedWorkoutKey} salvo com sucesso!`);
    } catch (error) {
        console.error("Erro ao salvar conclusão do treino:", error);
    }
};

window.finalizarTreino = async function(workoutKey) {
    const btn = document.getElementById('btn-concluir');
    if (btn) {
        btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> Salvando...`;
        btn.disabled = true;
        btn.classList.add('opacity-70');
    }

    await window.saveWorkoutCompletion(workoutKey);
    
    if (window.confetti) {
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    setTimeout(() => {
        window.renderHome();
    }, 1500);
};

// --- GESTÃO DE INTERFACE (UI) ---

window.renderHome = async function() {
    currentWorkoutKey = null;
    const appDiv = document.getElementById('app');
    
    appDiv.innerHTML = `
        <div class="h-screen w-full flex items-center justify-center bg-slate-900">
            <p class="text-pink-500 font-bold animate-pulse">Carregando seu próximo treino...</p>
        </div>
    `;

    const todayKey = await getNextWorkoutKey();
    
    let html = `
        <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 pb-16 rounded-b-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
            
            <div class="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <p class="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-1">Ciclo Contínuo</p>
                    <h1 class="text-2xl font-bold tracking-tight">Olá, Bruna!</h1>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.renderProgress()" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5 flex items-center justify-center">
                        <i data-lucide="bar-chart-2" width="18"></i>
                    </button>
                    <a href="https://fithome.cademi.com.br/auth/login?redirect=%2F" target="_blank" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5 flex items-center justify-center">
                        <i data-lucide="external-link" width="18"></i>
                    </a>
                    <button onclick="window.logout()" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95 border border-white/5">
                        <i data-lucide="log-out" width="18"></i>
                    </button>
                </div>
            </div>

            <div onclick="window.renderWorkout('${todayKey}')" class="bg-white text-slate-900 p-6 rounded-2xl shadow-xl cursor-pointer active:scale-[0.98] transition-all relative z-10 group">
                <div class="flex justify-between items-start mb-3">
                    <span class="bg-pink-100 text-pink-700 text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">Próximo da Lista</span>
                    <i data-lucide="arrow-right-circle" class="text-slate-300 group-hover:text-pink-500 transition-colors"></i>
                </div>
                <h2 class="text-2xl font-black mb-1">${WORKOUT_PLAN[todayKey].title}</h2>
                <p class="text-sm text-slate-500 font-medium">${WORKOUT_PLAN[todayKey].description}</p>
            </div>
        </div>

        <div class="px-5 -mt-8 pb-24 relative z-20 space-y-3 fade-in">
            <h3 class="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 pl-2">Biblioteca do Ciclo</h3>
    `;
    
    Object.keys(WORKOUT_PLAN).forEach(key => {
        if (key === todayKey) return; 
        const plan = WORKOUT_PLAN[key];
        html += `
            <button onclick="window.renderWorkout('${key}')" class="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 text-left active:bg-slate-50 hover:border-pink-200 transition-all">
                <div class="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 font-bold flex items-center justify-center text-lg border border-slate-100 shadow-inner">${key}</div>
                <div>
                    <h4 class="font-bold text-slate-700 text-sm">${plan.title}</h4>
                    <p class="text-xs text-slate-400 truncate w-48 font-medium">${plan.description}</p>
                </div>
            </button>
        `;
    });
    
    html += `</div>`;
    appDiv.innerHTML = html;
    if(window.lucide) lucide.createIcons();
};

window.renderWorkout = function(key) {
    currentWorkoutKey = key;
    const plan = WORKOUT_PLAN[key];
    const appDiv = document.getElementById('app');
    
    let html = `
        <div class="bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
            <button onclick="window.renderHome()" class="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <i data-lucide="arrow-left" width="22"></i>
            </button>
            <div class="text-center">
                <h1 class="font-bold text-base text-slate-800">${plan.title}</h1>
            </div>
            <div class="w-8"></div>
        </div>

        <div class="p-5 pb-10 space-y-6 fade-in">
            <p class="text-sm text-slate-500 bg-slate-100 p-4 rounded-xl border border-slate-200">${plan.description}</p>
    `;

    plan.exercises.forEach(ex => {
        html += `
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 class="font-black text-slate-800 mb-2">${ex.title}</h3>
                <p class="text-xs text-slate-500 mb-4 leading-relaxed">${ex.summary}</p>
                
                <div class="space-y-3 mb-4">
        `;
        
        ex.items.forEach((item, index) => {
            html += `
                <div class="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span class="font-bold text-slate-700 text-sm flex items-center gap-2">
                        <span class="bg-slate-200 text-slate-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">${index + 1}</span>
                        ${item.name}
                    </span>
                    <span class="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-md">${item.details}</span>
                </div>
            `;
        });

        html += `
                </div>
                <div class="flex items-center justify-between text-xs font-bold bg-slate-800 text-white p-3 rounded-xl">
                    <span class="flex items-center gap-1"><i data-lucide="timer" width="14"></i> Descanso</span>
                    <span>${ex.restTime} Segundos</span>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="px-5 pb-10 pt-5 mt-4 border-t border-slate-100 bg-white sticky bottom-0 z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <button 
                id="btn-concluir"
                onclick="window.finalizarTreino('${key}')" 
                class="w-full bg-pink-600 hover:bg-pink-700 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-pink-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <i data-lucide="check-circle" width="22"></i>
                Concluir Treino
            </button>
        </div>
    `;
    
    appDiv.innerHTML = html;
    if(window.lucide) lucide.createIcons();
};

window.renderProgress = async function() {
    const appDiv = document.getElementById('app');
    const user = auth.currentUser;
    
    if (!user) {
        appDiv.innerHTML = `<div class="p-5 text-center mt-10">Faça login para ver o progresso.</div>`;
        return;
    }

    appDiv.innerHTML = `<div class="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-500">Buscando histórico...</div>`;

    try {
        const historyRef = ref(db, `users/${user.uid}/history`);
        const snapshot = await get(historyRef);
        let recentActivityHtml = '';
        
        if (snapshot.exists()) {
            const historyData = snapshot.val();
            const dates = Object.keys(historyData).sort((a,b) => new Date(b) - new Date(a));
            
            dates.forEach(date => {
                const session = historyData[date];
                const dateObj = new Date(date);
                dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
                const formattedDate = dateObj.toLocaleDateString('pt-BR');
                
                recentActivityHtml += `
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-3 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="bg-pink-100 text-pink-600 w-10 h-10 flex items-center justify-center rounded-lg font-black text-lg shadow-sm">
                                ${session.workoutKey}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-700 text-sm">${formattedDate}</h4>
                                <p class="text-xs text-slate-500 font-medium">Treino Concluído</p>
                            </div>
                        </div>
                        <i data-lucide="check-circle" class="text-green-500" width="20"></i>
                    </div>
                `;
            });
        } else {
            recentActivityHtml = `<p class="text-slate-500 text-sm text-center py-8">Nenhum treino concluído ainda no Firebase.</p>`;
        }

        let html = `
            <div class="bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
                <button onclick="window.renderHome()" class="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <i data-lucide="arrow-left" width="22"></i>
                </button>
                <div class="text-center">
                    <h1 class="font-bold text-base text-slate-800">Meu Progresso</h1>
                </div>
                <div class="w-8"></div>
            </div>

            <div class="p-5 space-y-6 fade-in pb-32">
                <h3 class="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 pl-2">Histórico de Treinos (Nuvem)</h3>
                ${recentActivityHtml}
            </div>
        `;
        
        appDiv.innerHTML = html;
        if(window.lucide) lucide.createIcons();

    } catch (error) {
        console.error("Erro ao carregar progresso:", error);
        appDiv.innerHTML = `
            <div class="p-5">
                <button onclick="window.renderHome()" class="mb-5 text-pink-500 font-bold">Voltar</button>
                <p>Erro ao carregar os dados. Tente novamente.</p>
            </div>
        `;
    }
};

window.logout = function() {
    signOut(auth).then(() => {
        console.log("Usuário deslogado");
    }).catch((error) => {
        console.error("Erro ao deslogar", error);
    });
};

window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    if(modal) modal.classList.add('hidden');
    if(iframe) iframe.src = ''; 
};

window.closeTimerModal = function() {
    const modal = document.getElementById('timer-modal');
    if(modal) modal.classList.add('hidden');
};

// Monitoramento de Autenticação e Inicialização
onAuthStateChanged(auth, (user) => {
    const statusDiv = document.getElementById('connection-status');
    if (user) {
        if(statusDiv) {
            statusDiv.textContent = "Conectado";
            statusDiv.classList.add('show');
            setTimeout(() => statusDiv.classList.remove('show'), 2000);
        }
        window.renderHome();
    } else {
        // Fluxo de login provisório se não houver usuário autenticado
        // Descomente a linha abaixo para forçar o login automático via Google para testes
        // signInWithPopup(auth, provider); 
        
        const appDiv = document.getElementById('app');
        if(appDiv) {
            appDiv.innerHTML = `
                <div class="h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-8 text-center">
                    <h1 class="text-white text-2xl font-bold mb-4">Desafio D21D</h1>
                    <p class="text-slate-400 mb-8">Faça login para acessar seus treinos e salvar seu progresso.</p>
                    <button onclick="signInWithPopup(auth, provider)" class="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg">
                        Entrar com Google
                    </button>
                </div>
            `;
        }
    }
});

// Força a renderização inicial caso o onAuthStateChanged demore
if(!auth.currentUser) {
    window.renderHome();
}