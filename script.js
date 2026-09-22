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

window.saveWorkoutCompletion = async function(completedWorkoutKey, performanceData = {}) {
    const user = auth.currentUser;
    if (!user) return;

    const updates = {};
    const dateStr = new Date().toISOString().split('T')[0];
    
    updates[`users/${user.uid}/profile/lastWorkoutKey`] = completedWorkoutKey;
    
    updates[`users/${user.uid}/history/${dateStr}`] = {
        workoutKey: completedWorkoutKey,
        completedAt: new Date().toISOString(),
        performance: performanceData
    };

    try {
        await update(ref(db), updates);
        console.log(`Treino ${completedWorkoutKey} e métricas salvos com sucesso!`);
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

    // Coleta as métricas inseridas nos inputs
    const performanceData = {};
    const plan = WORKOUT_PLAN[workoutKey];
    
    plan.exercises.forEach(ex => {
        ex.items.forEach((item, index) => {
            const cargaInput = document.getElementById(`carga_${ex.id}_${index}`);
            const repsInput = document.getElementById(`reps_${ex.id}_${index}`);
            
            if (cargaInput && repsInput) {
                performanceData[`${ex.id}_${index}`] = {
                    name: item.name,
                    carga: cargaInput.value || '',
                    reps: repsInput.value || ''
                };
            }
        });
    });

    await window.saveWorkoutCompletion(workoutKey, performanceData);
    
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

window.renderWorkout = async function(key) {
    currentWorkoutKey = key;
    const plan = WORKOUT_PLAN[key];
    const appDiv = document.getElementById('app');
    
    // Mostra tela de carregamento enquanto busca o histórico de evolução
    appDiv.innerHTML = `
        <div class="h-screen w-full flex items-center justify-center bg-slate-50">
            <p class="text-pink-500 font-bold animate-pulse">Resgatando suas métricas anteriores...</p>
        </div>
    `;

    // Busca as cargas do treino anterior
    let lastPerformance = {};
    const user = auth.currentUser;
    if (user) {
        try {
            const historyRef = ref(db, `users/${user.uid}/history`);
            const snapshot = await get(historyRef);
            if (snapshot.exists()) {
                const history = snapshot.val();
                const sortedDates = Object.keys(history).sort((a,b) => new Date(b) - new Date(a));
                // Procura a última vez que este treino (A, B, C ou D) foi feito e pega os dados
                const lastSessionDate = sortedDates.find(d => history[d].workoutKey === key && history[d].performance);
                if (lastSessionDate) {
                    lastPerformance = history[lastSessionDate].performance;
                }
            }
        } catch (e) {
            console.error("Erro ao buscar histórico:", e);
        }
    }

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
                
                <div class="space-y-4 mb-4">
        `;
        
        ex.items.forEach((item, index) => {
            const inputId = `${ex.id}_${index}`;
            const lastData = lastPerformance[inputId] || {};
            const lastCarga = lastData.carga ? lastData.carga : '';
            const lastReps = lastData.reps ? lastData.reps : '';

            html += `
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col gap-3">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-slate-700 text-sm flex items-center gap-2">
                            <span class="bg-slate-200 text-slate-500 rounded-full min-w-[20px] h-5 flex items-center justify-center text-[10px]">${index + 1}</span>
                            ${item.name}
                        </span>
                        <span class="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-md text-right">${item.details}</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 mt-1">
                        <div class="relative">
                            <span class="absolute -top-2 left-2 bg-slate-50 text-[10px] font-bold text-slate-400 px-1">Carga (kg)</span>
                            <input type="number" id="carga_${inputId}" value="${lastCarga}" class="input-compact !text-sm !p-2 border-slate-200 shadow-inner" placeholder="Ex: 20">
                        </div>
                        <div class="relative">
                            <span class="absolute -top-2 left-2 bg-slate-50 text-[10px] font-bold text-slate-400 px-1">Repetições</span>
                            <input type="number" id="reps_${inputId}" value="${lastReps}" class="input-compact !text-sm !p-2 border-slate-200 shadow-inner" placeholder="Ex: 12">
                        </div>
                    </div>
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
        appDiv.innerHTML = `<div class="p-5 text-center mt-10">Faça login para ver o dashboard.</div>`;
        return;
    }

    appDiv.innerHTML = `
        <div class="h-screen w-full flex items-center justify-center bg-slate-50">
            <div class="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
    `;

    try {
        const historyRef = ref(db, `users/${user.uid}/history`);
        const snapshot = await get(historyRef);
        
        if (!snapshot.exists()) {
            appDiv.innerHTML = `
                <div class="p-5 text-center mt-10">
                    <h3 class="font-bold text-slate-700 mb-2">Nenhum dado encontrado</h3>
                    <p class="text-sm text-slate-500 mb-5">Conclua seu primeiro treino para gerar o dashboard.</p>
                    <button onclick="window.renderHome()" class="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold">Voltar</button>
                </div>`;
            return;
        }

        const historyData = snapshot.val();
        // Ordenação cronológica (antigo para novo) para calcular evolução
        const datesAsc = Object.keys(historyData).sort((a,b) => new Date(a) - new Date(b));
        
        let totalWorkouts = datesAsc.length;
        let counts = { A: 0, B: 0, C: 0, D: 0 };
        let exerciseHistory = {};

        // Processamento dos dados brutos
        datesAsc.forEach(date => {
            const session = historyData[date];
            if(counts[session.workoutKey] !== undefined) {
                counts[session.workoutKey]++;
            }

            if(session.performance) {
                Object.keys(session.performance).forEach(exId => {
                    const ex = session.performance[exId];
                    if(ex.carga || ex.reps) {
                        if(!exerciseHistory[ex.name]) exerciseHistory[ex.name] = [];
                        exerciseHistory[ex.name].push({ 
                            date, 
                            carga: parseFloat(ex.carga) || 0, 
                            reps: parseInt(ex.reps) || 0 
                        });
                    }
                });
            }
        });

        // Lógica de Evolução (Compara último com penúltimo)
        let progressionScore = 0;
        let htmlProgressionList = '';

        Object.keys(exerciseHistory).forEach(name => {
            const history = exerciseHistory[name];
            if(history.length >= 2) {
                const last = history[history.length - 1];
                const prev = history[history.length - 2];
                
                // Critério: Carga maior, OU (Carga igual e repetições maiores) = Progressão
                let isProgression = (last.carga > prev.carga) || (last.carga === prev.carga && last.reps > prev.reps);
                let isRegression = (last.carga < prev.carga) || (last.carga === prev.carga && last.reps < prev.reps);
                
                let diffLabel = "";
                let icon = 'minus';
                let color = 'text-slate-400';

                if (isProgression) {
                    progressionScore++;
                    icon = 'trending-up';
                    color = 'text-green-500';
                    diffLabel = last.carga > prev.carga ? `+${last.carga - prev.carga}kg` : `+reps`;
                } else if (isRegression) {
                    progressionScore--;
                    icon = 'trending-down';
                    color = 'text-red-500';
                    diffLabel = last.carga < prev.carga ? `${last.carga - prev.carga}kg` : `-reps`;
                }

                htmlProgressionList += `
                    <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2">
                        <span class="text-xs font-bold text-slate-700 truncate w-[45%]">${name}</span>
                        <div class="flex items-center justify-end gap-2 w-[55%]">
                            <span class="text-xs font-bold text-slate-400">${prev.carga}kg</span>
                            <i data-lucide="arrow-right" width="12" class="text-slate-300"></i>
                            <span class="text-xs font-black ${color}">${last.carga}kg</span>
                            <div class="flex items-center bg-white px-1.5 py-0.5 rounded border border-slate-100 min-w-[40px] justify-center">
                                <i data-lucide="${icon}" width="12" class="${color} mr-1"></i>
                                <span class="text-[10px] font-bold ${color}">${diffLabel}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        if (htmlProgressionList === '') {
            htmlProgressionList = `<p class="text-xs text-slate-400 text-center py-4">Faça o mesmo exercício pelo menos duas vezes preenchendo as cargas para ver sua evolução.</p>`;
        }

        // Definição do Status Global
        let statusTitle = "Estagnada ⚖️";
        let statusDesc = "Suas cargas e repetições se mantiveram nos últimos treinos.";
        let statusColorBg = "bg-yellow-100";
        let statusColorText = "text-yellow-700";

        if (progressionScore > 0) {
            statusTitle = "Progredindo 🚀";
            statusDesc = "Você aumentou cargas ou repetições na maioria dos exercícios recentes!";
            statusColorBg = "bg-green-100";
            statusColorText = "text-green-700";
        } else if (progressionScore < 0) {
            statusTitle = "Regredindo 📉";
            statusDesc = "Suas cargas caíram recentemente. Atenção à alimentação pré-treino e descanso.";
            statusColorBg = "bg-red-100";
            statusColorText = "text-red-700";
        }

        // Renderização do HTML Final
        let html = `
            <div class="bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
                <button onclick="window.renderHome()" class="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <i data-lucide="arrow-left" width="22"></i>
                </button>
                <div class="text-center">
                    <h1 class="font-bold text-base text-slate-800">Dashboard</h1>
                </div>
                <div class="w-8"></div>
            </div>

            <div class="p-5 space-y-6 fade-in pb-32">
                
                <!-- KPI Card -->
                <div class="flex gap-4">
                    <div class="flex-1 bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg shadow-slate-900/20">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>
                        <p class="text-[10px] uppercase font-bold text-pink-400 tracking-wider mb-1">Total Concluído</p>
                        <h2 class="text-4xl font-black">${totalWorkouts}<span class="text-sm font-medium text-slate-400 ml-1">treinos</span></h2>
                    </div>
                </div>

                <!-- Status de Evolução -->
                <div class="${statusColorBg} rounded-2xl p-5 border border-white shadow-sm">
                    <h3 class="font-black text-lg ${statusColorText} mb-1">${statusTitle}</h3>
                    <p class="text-xs ${statusColorText} opacity-80 leading-relaxed font-medium">${statusDesc}</p>
                </div>

                <!-- Distribuição dos Treinos -->
                <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 class="font-black text-slate-800 text-sm mb-4">Distribuição do Ciclo</h3>
                    <div class="space-y-3">
                        ${['A', 'B', 'C', 'D'].map(key => {
                            const pct = totalWorkouts > 0 ? Math.round((counts[key] / totalWorkouts) * 100) : 0;
                            return `
                                <div>
                                    <div class="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                        <span>Treino ${key}</span>
                                        <span>${counts[key]}x (${pct}%)</span>
                                    </div>
                                    <div class="w-full bg-slate-100 rounded-full h-2.5">
                                        <div class="bg-pink-500 h-2.5 rounded-full" style="width: ${pct}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Lista de Evolução por Exercício -->
                <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 class="font-black text-slate-800 text-sm mb-1">Evolução por Exercício</h3>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Última vs Penúltima Execução</p>
                    ${htmlProgressionList}
                </div>

            </div>
        `;
        
        appDiv.innerHTML = html;
        if(window.lucide) lucide.createIcons();

    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        appDiv.innerHTML = `
            <div class="p-5 text-center mt-10">
                <button onclick="window.renderHome()" class="mb-5 text-pink-500 font-bold bg-pink-50 px-4 py-2 rounded-lg">Voltar</button>
                <p class="text-slate-500">Erro ao carregar os dados analíticos.</p>
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



if(!auth.currentUser) {
    window.renderHome();
}