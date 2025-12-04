// CONFIGURATION
const REWARDS = [15000, 17500, 14200, 18800, 16500, 13000, 17000];
const NAMES = ['Zemmabi d lixo', 'Elvisson Daniel', 'Helmer Castilho', 'Sara Cuca', 'Eraldina Santos'];
const AMOUNTS = ['45.000', '67.000', '89.000', '102.000', '120.000'];

// VTURB CODES (Raw HTML)
const VIDEO_CODES = [
    `<vturb-smartplayer id="vid-692adee24fd612d7bf33701a" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/a32201f5-5e84-4186-86c3-fbc80b0de481/players/692adee24fd612d7bf33701a/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`,
    `<vturb-smartplayer id="vid-692adef1ec174641c2b1fb4b" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/a32201f5-5e84-4186-86c3-fbc80b0de481/players/692adef1ec174641c2b1fb4b/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`,
    `<vturb-smartplayer id="vid-692adedbeb5ec5285cec0c95" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/a32201f5-5e84-4186-86c3-fbc80b0de481/players/692adedbeb5ec5285cec0c95/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`,
    `<vturb-smartplayer id="vid-692adecff0b2d76420cab773" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/a32201f5-5e84-4186-86c3-fbc80b0de481/players/692adecff0b2d76420cab773/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`,
    `<vturb-smartplayer id="vid-692adebf4fd612d7bf336fd0" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/a32201f5-5e84-4186-86c3-fbc80b0de481/players/692adebf4fd612d7bf336fd0/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`,
    `<vturb-smartplayer id="vid-692a41124fd612d7bf32fa03" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/a32201f5-5e84-4186-86c3-fbc80b0de481/players/692a41124fd612d7bf32fa03/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`,
    `<vturb-smartplayer id="vid-692a40bef0b2d76420ca409f" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/a32201f5-5e84-4186-86c3-fbc80b0de481/players/692a40bef0b2d76420ca409f/v4/player.js", s.async=!0,document.head.appendChild(s); <\/script>`
];

// STATE
let state = {
    balance: 12000,
    videoIndex: 0,
    count: 0
};

// INITIALIZATION
window.onload = function () {
    console.log("App Started");
    createSnow();
    startNotifications();
};

// NAVIGATION
function showSection(id) {
    // Pause all videos before changing sections
    try {
        // Pause SmartPlayer instances
        if (window.smartplayer && window.smartplayer.instances) {
            window.smartplayer.instances.forEach(player => {
                try {
                    if (player && player.pause) player.pause();
                } catch (e) {
                    console.log('Error pausing player:', e);
                }
            });
        }

        // Pause all HTML5 videos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            try {
                video.pause();
                video.muted = true;
            } catch (e) {
                console.log('Error pausing video:', e);
            }
        });
    } catch (e) {
        console.log('Error in section change cleanup:', e);
    }

    // Change sections
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id + '-section').classList.remove('hidden');
    document.getElementById(id + '-section').classList.add('active');
}

// LOGIN
function startApp() {
    const val = document.getElementById('login-input').value;
    if (val.length > 0) {
        showSection('dashboard');
        loadVideo();
    } else {
        alert("Digite seus dados!");
    }
}

// VIDEO LOADING (ROBUST - FIXED)
function loadVideo() {
    const slot = document.getElementById('video-slot');

    if (state.videoIndex < VIDEO_CODES.length) {
        // 1. DESTROY OLD PLAYERS FIRST
        try {
            // Pause and destroy all SmartPlayer instances
            if (window.smartplayer && window.smartplayer.instances) {
                window.smartplayer.instances.forEach(player => {
                    try {
                        if (player && player.pause) player.pause();
                        if (player && player.destroy) player.destroy();
                    } catch (e) {
                        console.log('Error destroying player:', e);
                    }
                });
                // Clear instances array
                window.smartplayer.instances = [];
            }

            // Pause and remove all HTML5 videos
            const videos = slot.querySelectorAll('video');
            videos.forEach(video => {
                try {
                    video.pause();
                    video.src = '';
                    video.load();
                    video.remove();
                } catch (e) {
                    console.log('Error removing video:', e);
                }
            });

            // Remove all old scripts from slot
            const oldScripts = slot.querySelectorAll('script');
            oldScripts.forEach(script => script.remove());

        } catch (e) {
            console.log('Error cleaning up:', e);
        }

        // 2. CLEAR SLOT COMPLETELY
        slot.innerHTML = '';

        // 3. WAIT A BIT BEFORE LOADING NEW VIDEO (prevents conflicts)
        setTimeout(() => {
            // 4. Create Temp Wrapper
            const temp = document.createElement('div');
            temp.innerHTML = VIDEO_CODES[state.videoIndex];

            // 5. Move and Execute Scripts
            while (temp.firstChild) {
                const child = temp.firstChild;
                if (child.tagName === 'SCRIPT') {
                    const newScript = document.createElement('script');
                    newScript.type = 'text/javascript';
                    Array.from(child.attributes).forEach(attr => {
                        if (attr.name !== 'type') {
                            newScript.setAttribute(attr.name, attr.value);
                        }
                    });
                    newScript.textContent = child.textContent;
                    slot.appendChild(newScript);
                    temp.removeChild(child);
                } else {
                    slot.appendChild(child);
                }
            }
        }, 300); // Small delay to ensure cleanup is complete
    }
}

// RATING
function selectBtn(btn) {
    if (btn.classList.contains('action-btn-tk')) {
        btn.parentElement.querySelectorAll('.action-btn-tk').forEach(b => b.classList.remove('selected'));
    } else {
        btn.parentElement.querySelectorAll('.action-btn').forEach(b => b.classList.remove('selected'));
    }
    btn.classList.add('selected');
}

function submitRating() {
    const btn = document.querySelector('.controls .btn-main');
    const originalText = btn.innerText;
    btn.innerText = "Enviando...";

    // FORÇA PARADA E LIMPEZA COMPLETA DO VÍDEO
    const videoSlot = document.getElementById('video-slot');

    // 1. Pause and destroy SmartPlayer instances IMEDIATAMENTE
    try {
        if (window.smartplayer && window.smartplayer.instances) {
            window.smartplayer.instances.forEach(player => {
                try {
                    if (player && player.pause) player.pause();
                    if (player && player.destroy) player.destroy();
                } catch (e) {
                    console.log('Could not destroy SmartPlayer:', e);
                }
            });
            // Clear instances
            window.smartplayer.instances = [];
        }
    } catch (e) {
        console.log('Could not access SmartPlayer:', e);
    }

    // 2. Pause and remove all HTML5 videos IMEDIATAMENTE
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        try {
            video.pause();
            video.muted = true;
            video.currentTime = 0;
            video.src = '';
            video.load();
        } catch (e) {
            console.log('Could not pause video:', e);
        }
    });

    // 3. Remove all scripts from video slot
    try {
        const scripts = videoSlot.querySelectorAll('script');
        scripts.forEach(script => script.remove());
    } catch (e) {
        console.log('Could not remove scripts:', e);
    }

    // 4. Se for o último vídeo, LIMPA O SLOT IMEDIATAMENTE
    if (state.count + 1 >= REWARDS.length) {
        if (videoSlot) {
            videoSlot.innerHTML = '<div style="background: #000; width: 100%; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #666;">Vídeo finalizado</div>';
        }
    }

    setTimeout(() => {
        btn.innerText = originalText;

        // Update State
        const reward = REWARDS[state.videoIndex] || 15000;
        state.balance += reward;
        state.count++;
        state.videoIndex++;

        // Update UI
        document.getElementById('balance-val').innerText = state.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 });
        document.getElementById('balance-val-final').innerText = state.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 });

        // Show Popup
        document.getElementById('popup-amount').innerText = reward.toLocaleString('pt-AO') + " KZS";
        document.getElementById('popup').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('popup').classList.add('hidden');

            // Next Step
            if (state.count >= REWARDS.length) {
                document.getElementById('final-amount-display').innerText = state.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 }) + " KZS";
                showSection('limit');
            } else {
                loadVideo();
                // Reset buttons
                document.querySelectorAll('.selected').forEach(b => b.classList.remove('selected'));
            }
        }, 1500);

    }, 1000);
}

// WITHDRAW
function showWithdraw() {
    showSection('withdraw');
}

function selectMethod(el) {
    document.querySelectorAll('.method').forEach(m => m.classList.remove('active'));
    el.classList.add('active');
}

function processWithdraw() {
    const iban = document.getElementById('iban-input').value;
    if (iban.length > 5) {
        const btn = document.querySelector('#withdraw-section .btn-main');
        const originalText = btn.innerText;
        btn.innerText = "Processando...";

        setTimeout(() => {
            btn.innerText = originalText;

            // Update error message with actual balance
            const finalAmount = state.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 }) + " KZS";
            document.getElementById('error-amount').innerText = finalAmount;

            showSection('error');
        }, 1500);
    } else {
        alert("Insira um IBAN ou número válido");
    }
}

function showInstructions() {
    showSection('instructions');
}

function showVSL() {
    // Update VSL balance display
    document.getElementById('vsl-balance-val').innerText = state.balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 });

    // Hide notification banner on VSL page
    const banner = document.getElementById('notification-banner');
    if (banner) {
        banner.style.display = 'none';
    }

    // Scroll to top
    window.scrollTo(0, 0);

    showSection('vsl');

    // Try to prevent video autoplay
    setTimeout(() => {
        try {
            // Try to access SmartPlayer API
            const smartplayer = window.smartplayer;
            if (smartplayer && smartplayer.instances) {
                const playerInstance = smartplayer.instances[0];
                if (playerInstance && playerInstance.pause) {
                    playerInstance.pause();
                }
            }

            // Also try to pause any video elements
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
                video.currentTime = 0;
            });
        } catch (e) {
            console.log('Could not control video autoplay:', e);
        }
    }, 500);

    // Show button after 110 seconds (1 minute and 50 seconds)
    setTimeout(() => {
        const vslButton = document.querySelector('.btn-vsl-clean');
        if (vslButton) {
            vslButton.classList.add('visible');
        }
    }, 110000); // 110 seconds = 1 min 50 sec
}

// NOTIFICATIONS
function startNotifications() {
    const banner = document.getElementById('notification-banner');
    const text = document.getElementById('notify-text');

    // Initially hide on login page
    if (document.getElementById('login-section').classList.contains('active')) {
        banner.style.display = 'none';
    }

    setInterval(() => {
        // Check if we are on login or VSL page
        const isLogin = document.getElementById('login-section').classList.contains('active');
        const isVSL = document.getElementById('vsl-section').classList.contains('active');

        if (isLogin || isVSL) {
            banner.style.display = 'none';
            return;
        } else {
            banner.style.display = 'flex';
        }

        const name = NAMES[Math.floor(Math.random() * NAMES.length)];
        const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];

        banner.style.opacity = '0';
        setTimeout(() => {
            text.innerText = `${name} sacou ${amount} KZS`;
            banner.style.opacity = '1';
        }, 500);
    }, 8000);
}

// SNOW
function createSnow() {
    const container = document.getElementById('snow-container');
    for (let i = 0; i < 30; i++) {
        const s = document.createElement('div');
        s.className = 'snowflake';
        s.innerHTML = '❄';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.fontSize = (Math.random() * 10 + 10) + 'px';
        s.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(s);
        s.addEventListener('animationend', () => {
            s.style.top = '-10px';
            s.style.left = Math.random() * 100 + 'vw';
        });
    }
}
