import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

// --- 2. DADOS DO TREINO (WORKOUT PLAN) ---
const DEFAULT_VIDEO = "./videos/c225a2e2c990a187487b8cff1196bdb8c5cd8fc6";

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

function getTip(name) {
    const key = Object.keys(EXERCISE_TIPS).find(k => name.toLowerCase().includes(k.toLowerCase()));
    return key ? EXERCISE_TIPS[key] : "Mantenha a postura e concentre-se na execução.";
}

const WORKOUT_PLAN = {
    1: {
        title: "Treino 1: Inferior",
        description: "Foco: Pernas e Glúteos + Cardio",
        videoUrl: DEFAULT_VIDEO,
        segments: [
            { time: 30, label: "Mobilidade", sub: "00:30 - 01:35", icon: "move", color: "pink" },
            { time: 95, label: "Instruções", sub: "A partir de 01:35", icon: "list-video", color: "blue" }
        ],
        exercises: [
            { id: 't1_aq', type: 'single', title: 'Aquecimento', items: [{ name: 'Mobilidade Articular', details: 'Vídeo: 0:30 a 1:35' }], restTime: 0, specialAction: { label: 'Ver Mobilidade', time: 30 } },
            { id: 't1_b1', type: 'biset', title: 'Bloco 1 - Conjugado', items: [{ name: 'Afundo (Peso do corpo)', details: '3x 5 cada perna' }, { name: 'Stiff com Halteres', details: '3x 12 reps' }], restTime: 45 },
            { id: 't1_b2', type: 'biset', title: 'Bloco 2 - Conjugado', items: [{ name: 'Cadeira Flexora', details: '3x 12 reps' }, { name: 'Agachamento Halteres', details: '3x 10 reps' }], restTime: 60 },
            { id: 't1_b3', type: 'biset', title: 'Bloco 3 - Conjugado', items: [{ name: 'Cadeira Abdutora', details: '3x 12 reps' }, { name: 'Elevação de Quadril', details: '3x 20 reps' }], restTime: 60 },
            { id: 't1_fim', type: 'single', title: 'Finalizador', items: [{ name: 'Pedalada Forte/Leve', details: '8x (20s Forte + 10s Leve)' }], restTime: 0 }
        ]
    },
    2: {
        title: "Treino 2: Superior",
        description: "Foco: Braços, Costas e Peito",
        videoUrl: "https://stream.scaleup.com.br/player/v1/playlists/193c055d25c928c4b69844ace46f1a771d1bbe77?URLPrefix=1767927789&Expires=1767927789&Signature=7d4e0686c7d560f562ad5a786e4833050677c1df&accessToken=f5583bac-0f69-34b1-8814-0ab76c495af6&authorization=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJhY2Nlc3NUb2tlblwiOlwiZGZlZGE1M2YtMjI5Zi0zN2YwLWEwZWItOWM1NmYyOTZlMjgyXCIsXCJ1c2VyQWdlbnRcIjpcImF4aW9zLzEuNC4wXCIsXCJjdXN0b21lckNvZGVcIjpcIjk1MmMzMmYwLTUxM2EtMzc2Yy1iMTRiLWEyN2EwZjVkNjhhN1wiLFwiaXBcIjpcIjMuOTQuMTM4LjE3XCIsXCJ1c2VyXCI6e1wiaWRcIjoxMjUxOCxcImNvZGVcIjpcIjM4YmEzNDQyMDI1ZjRlYjZkNTNmODY0NDViNjQ4OTU2ZmQ2YzI4YmVcIixcIm9wZXJhdG9yXCI6ZmFsc2UsXCJvcGVyYXRvclVzZXJKdXN0Q3JlYXRlZFwiOmZhbHNlfSxcImNyZWF0ZWRBdFwiOlwiMjAyNi0wMS0wMlQwMDowMzowOS40NzZcIixcImV4cGlyZWRBdFwiOlwiMjAyNi0wMS0wNVQwMDowMzowOS40NzZcIn0iLCJleHAiOjE3Njc5Mjc3ODksImlhdCI6MTc2NzMyMjk4OX0.xngdCi2gyyjPP2i22aL5SgXmevm5ap3DFXaCQ5j_uFqs0fkYcOWU9wqYpwPcWzLmfiLURYcqbWOdAHItWKuVMw",
        segments: [{ time: 0, label: "Aula Completa", sub: "Reproduzir do início", icon: "play", color: "pink" }],
        exercises: [
            { id: 't2_aq', type: 'single', title: 'Aquecimento', items: [{ name: 'Mobilidade Geral', details: '3x 20s' }], restTime: 0, specialAction: { label: 'Ver Aquecimento', time: 0 } },
            { id: 't2_b1', type: 'biset', title: 'Bloco 1', items: [{ name: 'Flexão de Braço', details: '3x 5 reps' }, { name: 'Remada Curvada', details: '3x 10 reps' }], restTime: 60 },
            { id: 't2_b2', type: 'biset', title: 'Bloco 2', items: [{ name: 'Supino Barra', details: '3x 10 reps' }, { name: 'Rosca Alternada', details: '3x 12 reps' }], restTime: 60 },
            { id: 't2_b3', type: 'biset', title: 'Bloco 3', items: [{ name: 'Puxada Aberta', details: '3x 12 reps' }, { name: 'Tríceps Francês', details: '3x 8 reps' }], restTime: 60 },
            { id: 't2_b4', type: 'biset', title: 'Bloco 4', items: [{ name: 'Crucifixo', details: '3x 10 reps' }, { name: 'Tríceps Banco', details: '3x 8 reps' }], restTime: 60 },
            { id: 't2_fim', type: 'single', title: 'Core', items: [{ name: 'Prancha Abdominal', details: '4x Falha' }], restTime: 40 }
        ]
    },
    3: {
        title: "Treino 3: Full Body",
        description: "Pernas + Ombros e Costas",
        videoUrl: DEFAULT_VIDEO,
        exercises: [
            { id: 't3_aq', type: 'single', title: 'Aquecimento', items: [{ name: 'Desenv + Agach + Chão', details: '3x (5+10+15)' }], restTime: 0, specialAction: { label: 'Ver Aquecimento', time: 30 } },
            { id: 't3_b1', type: 'biset', title: 'Bloco 1', items: [{ name: 'Agachamento Búlgaro', details: '3x 8/perna' }, { name: 'Supino Máquina', details: '3x 10 reps' }], restTime: 60 },
            { id: 't3_b2', type: 'biset', title: 'Bloco 2', items: [{ name: 'Remada Unilateral', details: '3x 8/braço' }, { name: 'Cadeira Extensora', details: '3x 10' }], restTime: 60 },
            { id: 't3_b3', type: 'biset', title: 'Bloco 3', items: [{ name: 'Stiff Barra', details: '3x 12 reps' }, { name: 'Pull Down', details: '3x 10 reps' }], restTime: 60 },
            { id: 't3_b4', type: 'biset', title: 'Bloco 4', items: [{ name: 'Agachamento Barra', details: '3x 12 reps' }, { name: 'Desenvolvimento', details: '3x 10 reps' }], restTime: 60 },
            { id: 't3_fim', type: 'single', title: 'Final', items: [{ name: 'Burpee + Agach Salto', details: '5 Rounds' }], restTime: 0 }
        ]
    },
    4: {
        title: "Treino 4: Metabólico",
        description: "Queima Calórica e Resistência",
        videoUrl: DEFAULT_VIDEO,
        exercises: [{ id: 't4_main', type: 'single', title: 'Circuito', items: [{ name: 'Cardio Moderado', details: '3 Min' }, { name: 'Agachamentos', details: '20 reps' }, { name: 'Abdominal Remador', details: '10 reps' }], restTime: 0, note: "Semana 1: 5 Rounds. Aumentar 1 round/sem." }]
    },
    5: {
        title: "Treino 5: Pirâmide",
        description: "Reps 20-16-12-8",
        videoUrl: DEFAULT_VIDEO,
        exercises: [
            { id: 't5_main', type: 'single', title: 'Série Gigante', items: [{ name: 'Agachamento Sumô', details: 'Descrescente' }, { name: 'Leg Press', details: 'Descrescente' }, { name: 'Panturrilha', details: 'Descrescente' }, { name: 'Agachamento Iso', details: '20 seg fim' }], restTime: 60 },
            { id: 't5_fim', type: 'single', title: 'Cardio', items: [{ name: 'Intervalado 10min', details: '1min Forte/Leve' }], restTime: 0 }
        ]
    },
    6: {
        title: "Treino 6: Força",
        description: "Blocos 15-12-9 reps",
        videoUrl: DEFAULT_VIDEO,
        exercises: [
            { id: 't6_b1', type: 'single', title: 'Bloco 1', items: [{ name: 'Supino + Martelo', details: '15-12-9 reps' }], restTime: 0 },
            { id: 't6_b2', type: 'single', title: 'Bloco 2', items: [{ name: 'Remada + Testa', details: '15-12-9 reps' }], restTime: 0 },
            { id: 't6_b3', type: 'single', title: 'Bloco 3', items: [{ name: 'Thruster + Abd', details: '15-12-9 reps' }], restTime: 0 },
            { id: 't6_fim', type: 'single', title: 'Desafio', items: [{ name: 'Snatch + Crunch', details: '10-8-6-4-2' }], restTime: 0 }
        ]
    },
    7: {
        title: "Treino 7: Full Body",
        description: "4 Séries de 15 Repetições",
        videoUrl: DEFAULT_VIDEO,
        exercises: [
            { id: 't7_b1', type: 'biset', title: 'Bloco 1', items: [{ name: 'Cadeira Extensora', details: '4x 15' }, { name: 'Puxada Aberta', details: '4x 15' }], restTime: 60 },
            { id: 't7_b2', type: 'biset', title: 'Bloco 2', items: [{ name: 'Levantamento Terra', details: '4x 15' }, { name: 'Tríceps Corda', details: '4x 15' }], restTime: 60 },
            { id: 't7_b3', type: 'biset', title: 'Bloco 3', items: [{ name: 'Cadeira Flexora', details: '4x 15' }, { name: 'Remada Baixa', details: '4x 15' }], restTime: 60 },
            { id: 't7_fim', type: 'single', title: 'Final', items: [{ name: 'Agach Salto + Tap', details: '30-20-10' }], restTime: 0 }
        ]
    }
};

let currentWorkoutKey = null;

// --- 3. GESTÃO DE INTERFACE (UI) ---

// Anexar ao window para poder ser chamado pelo HTML
window.renderHome = function() {
    currentWorkoutKey = null;
    const appDiv = document.getElementById('app');
    const today = new Date().getDay(); 
    const schedule = { 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 0:'7' };
    const todayKey = schedule[today];
    
    let html = `
        <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 pb-16 rounded-b-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
            
            <div class="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <p class="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-1">Desafio 30+</p>
                    <h1 class="text-2xl font-bold tracking-tight">Olá, Bruna!</h1>
                </div>
                <div class="flex gap-2">
                    <a href="https://fithome.cademi.com.br/auth/login?redirect=%2F" target="_blank" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/5 flex items-center justify-center">
                        <i data-lucide="external-link" width="18"></i>
                    </a>
                    <button onclick="logout()" class="p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95 border border-white/5">
                        <i data-lucide="log-out" width="18"></i>
                    </button>
                </div>
            </div>

            ${todayKey ? `
            <div onclick="renderWorkout('${todayKey}')" class="bg-white text-slate-900 p-6 rounded-2xl shadow-xl cursor-pointer active:scale-[0.98] transition-all relative z-10 group">
                <div class="flex justify-between items-start mb-3">
                    <span class="bg-pink-100 text-pink-700 text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">Treino de Hoje</span>
                    <i data-lucide="arrow-right-circle" class="text-slate-300 group-hover:text-pink-500 transition-colors"></i>
                </div>
                <h2 class="text-2xl font-black mb-1">${WORKOUT_PLAN[todayKey].title}</h2>
                <p class="text-sm text-slate-500 font-medium">${WORKOUT_PLAN[todayKey].description}</p>
            </div>
            ` : ''}
        </div>

        <div class="px-5 -mt-8 pb-24 relative z-20 space-y-3 fade-in">
            <h3 class="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 pl-2">Biblioteca de Treinos</h3>
    `;
    
    Object.keys(WORKOUT_PLAN).forEach(key => {
        if (key === todayKey) return;
        const plan = WORKOUT_PLAN[key];
        html += `
            <button onclick="renderWorkout('${key}')" class="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 text-left active:bg-slate-50 hover:border-pink-200 transition-all">
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
            <button onclick="renderHome()" class="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <i data-lucide="arrow-left" width="22"></i>
            </button>
            <div class="text-center">
                <h1 class="font-bold text-base text-slate-800">${plan.title}</h1>
            </div>
            <button onclick="openVideoModal(0)" class="p-2 text-pink-600 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors">
                <i data-lucide="video" width="20"></i>
            </button>
        </div>

        <div class="p-4 space-y-6 fade-in pb-32 pt-6">
    `;

    plan.exercises.forEach((ex) => {
        const stored = window.getExerciseData(ex.id);
        const isDone = stored.done;

        let itemsHtml = '';
        ex.items.forEach((item, idx) => {
            const savedW = stored.items?.[idx]?.w || '';
            const savedR = stored.items?.[idx]?.r || '';
            const tip = getTip(item.name);

            itemsHtml += `
                <div class="mb-6 last:mb-0">
                    <div class="flex flex-col gap-1 mb-3">
                        <h4 class="font-bold text-slate-800 text-base leading-tight">${item.name}</h4>
                        <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md self-start">${item.details}</span>
                    </div>
                    <div class="tip-box"><p class="tip-text">${tip}</p></div>
                    <div class="flex gap-3">
                        <div class="relative w-1/2">
                            <input type="text" value="${savedW}" onchange="saveInput('${ex.id}', ${idx}, 'w', this.value)" class="input-compact pl-8" inputmode="decimal" placeholder="-">
                            <span class="absolute left-3 top-3.5 text-[10px] text-slate-400 font-bold">KG</span>
                        </div>
                        <div class="relative w-1/2">
                            <input type="text" value="${savedR}" onchange="saveInput('${ex.id}', ${idx}, 'r', this.value)" class="input-compact" inputmode="numeric" placeholder="Reps">
                        </div>
                    </div>
                </div>
            `;
        });

        let specialActionHtml = '';
        if(ex.specialAction) {
            specialActionHtml = `
                <button onclick="openVideoModal(${ex.specialAction.time})" class="w-full mt-3 py-3 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors">
                    <i data-lucide="play-circle" width="16"></i> ${ex.specialAction.label}
                </button>
            `;
        }

        html += `
            <div id="card-${ex.id}" class="bg-white rounded-3xl p-5 shadow-sm card-base ${isDone ? 'card-done' : ''}">
                <div class="flex justify-between items-center mb-5 pb-3 border-b border-slate-50">
                    <span class="badge-bi">${ex.title}</span>
                    ${ex.restTime > 0 ? `<span class="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg"><i data-lucide="clock" width="12"></i> ${ex.restTime}s</span>` : ''}
                </div>
                ${ex.note ? `<div class="mb-4 bg-amber-50 text-amber-700 text-xs font-medium p-3 rounded-xl border border-amber-100 flex gap-2 items-start"><i data-lucide="alert-triangle" width="14" class="shrink-0 mt-0.5"></i> ${ex.note}</div>` : ''}
                <div>${itemsHtml}</div>
                ${specialActionHtml}
                <div class="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                    ${ex.restTime > 0 ? `<button onclick="openTimer('rest', 'Descanso', ${ex.restTime})" class="action-btn btn-rest flex-1 shadow-sm"><i data-lucide="timer" width="18"></i> ${ex.restTime}s</button>` : ''}
                    <button onclick="toggleDone('${ex.id}')" id="btn-check-${ex.id}" class="action-btn btn-check flex-1 ${isDone ? 'checked' : ''}">
                        ${isDone ? `<i data-lucide="check-circle-2" width="18"></i> Feito` : `<i data-lucide="circle" width="18"></i> Concluir`}
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    appDiv.innerHTML = html;
    if(window.lucide) lucide.createIcons();
    window.scrollTo(0,0);
};

// --- 4. VIDEO E MODAIS ---
window.openVideoModal = function(startTime = 0) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    const link = document.getElementById('video-external-link');
    const subtitle = document.getElementById('video-subtitle');
    const segmentsContainer = document.getElementById('video-segments-container');
    
    const currentPlan = WORKOUT_PLAN[currentWorkoutKey];
    const videoUrl = currentPlan?.videoUrl || DEFAULT_VIDEO;
    
    const timeParam = startTime > 0 ? `&t=${startTime}` : ''; 
    const finalUrl = videoUrl + timeParam;
    
    iframe.src = finalUrl;
    link.href = finalUrl;
    
    if (startTime > 0) {
        subtitle.innerText = `Iniciando em ${formatTime(startTime)}`;
    } else {
        subtitle.innerText = "Aula Completa";
    }

    let segmentsHtml = '';
    const segments = currentPlan?.segments || [];
    
    if(segments.length > 0) {
        segments.forEach(seg => {
            segmentsHtml += `
                <button onclick="seekVideo(${seg.time}, '${seg.label}')" class="w-full text-left bg-slate-800 hover:bg-slate-700 p-3 rounded-xl flex items-center justify-between group transition-all border border-slate-700 hover:border-${seg.color || 'pink'}-500">
                    <div class="flex items-center gap-3">
                        <div class="bg-${seg.color || 'pink'}-600/20 text-${seg.color || 'pink'}-500 p-2 rounded-lg">
                            <i data-lucide="${seg.icon || 'play'}" width="16"></i>
                        </div>
                        <div>
                            <span class="text-white font-bold text-sm block">${seg.label}</span>
                            <span class="text-slate-500 text-xs">${seg.sub || ''}</span>
                        </div>
                    </div>
                    <i data-lucide="play" width="14" class="text-slate-500 group-hover:text-${seg.color || 'pink'}-500"></i>
                </button>
            `;
        });
    } else {
        segmentsHtml = `<p class="text-slate-600 text-xs italic text-center py-2">Nenhum capítulo disponível para este vídeo.</p>`;
    }
    
    segmentsContainer.innerHTML = segmentsHtml;
    if(window.lucide) lucide.createIcons();
    modal.classList.remove('hidden');
};

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
}

window.seekVideo = function(time, label) {
    window.openVideoModal(time);
};

window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    iframe.src = ""; 
    modal.classList.add('hidden');
};

// --- 5. TIMER ---
let timerInt = null;
let timerTime = 0;
let timerTotal = 0;

window.openTimer = function(mode, title, seconds) {
    const modal = document.getElementById('timer-modal');
    timerTime = seconds;
    timerTotal = seconds;
    updateTimerDisplay();
    
    document.getElementById('modal-title').innerText = title;
    document.getElementById('btn-toggle-timer').onclick = startTimer;
    document.getElementById('lbl-toggle').innerText = "INICIAR";
    
    modal.classList.remove('hidden');
};

window.closeTimerModal = function() {
    clearInterval(timerInt);
    document.getElementById('timer-modal').classList.add('hidden');
};

function updateTimerDisplay() {
    const m = Math.floor(timerTime / 60);
    const s = timerTime % 60;
    document.getElementById('timer-display').innerText = `${m}:${s<10?'0':''}${s}`;
}

function startTimer() {
    clearInterval(timerInt);
    document.getElementById('lbl-toggle').innerText = "PAUSAR";
    document.getElementById('btn-toggle-timer').onclick = pauseTimer;
    const btn = document.getElementById('btn-toggle-timer');
    btn.classList.remove('bg-pink-600');
    btn.classList.add('bg-slate-700');
    
    timerInt = setInterval(() => {
        timerTime--;
        updateTimerDisplay();
        if(timerTime <= 0) {
            clearInterval(timerInt);
            if(navigator.vibrate) navigator.vibrate([200, 100, 200]);
            window.closeTimerModal();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInt);
    document.getElementById('lbl-toggle').innerText = "CONTINUAR";
    document.getElementById('btn-toggle-timer').onclick = startTimer;
    const btn = document.getElementById('btn-toggle-timer');
    btn.classList.add('bg-pink-600');
    btn.classList.remove('bg-slate-700');
}

// Configurar o botão de reset do timer
// Nota: getElementById pode não estar pronto se o script rodar antes do HTML, 
// mas como é module, roda deferido.
const btnReset = document.getElementById('btn-reset-timer');
if(btnReset) {
    btnReset.onclick = () => {
        clearInterval(timerInt);
        timerTime = timerTotal;
        updateTimerDisplay();
        pauseTimer();
        document.getElementById('lbl-toggle').innerText = "INICIAR";
    };
}

// --- 6. AUTH & LOGIN (LÓGICA ANTERIOR MANTIDA E REVISADA) ---

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

onAuthStateChanged(auth, (user) => {
    if (user && user.email === EMAIL_AUTORIZADO) {
        console.log("Acesso concedido para:", user.email);
        syncDataFromFirebase().then(() => {
            // Agora renderHome JÁ EXISTE e pode ser chamada
            if (window.renderHome) window.renderHome();
        });
    } else {
        renderLoginScreen();
    }
});

// --- 7. PERSISTÊNCIA DE DADOS ---

window.saveExerciseData = async (exId, data) => {
    const user = auth.currentUser;
    if (!user) return;

    const today = new Date().toLocaleDateString('pt-BR');
    
    const localKey = `gym_data_${exId}`;
    const currentLocal = JSON.parse(localStorage.getItem(localKey) || '{}');
    const updated = { ...currentLocal, ...data, lastUpdate: today };
    localStorage.setItem(localKey, JSON.stringify(updated));

    try {
        await set(ref(db, `users/${user.uid}/exercises/${exId}`), updated);
        console.log(`Dados salvos: ${exId}`);
    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
    }
};

window.getExerciseData = (exId) => {
    return JSON.parse(localStorage.getItem(`gym_data_${exId}`) || '{}');
};

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

// Funções chamadas pelo HTML
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
