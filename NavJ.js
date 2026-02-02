/* ==========================================
   ELEMENTS & MODAL CACHE
   ========================================== */
const navDock = document.getElementById('nav-main-dock');
const navFab = document.getElementById('nav-fab-trigger');

const navDiscordModal = document.getElementById('nav-discord-modal');
const navShareModal = document.getElementById('nav-share-modal');
const navLangModal = document.getElementById('nav-lang-modal');
const navRedirWarning = document.getElementById('nav-share-redirect-warning');
const navRedirLink = document.getElementById('nav-redir-final-link');
const navChatModal = document.getElementById('nav-chat-modal');
const navSearchChoiceModal = document.getElementById('nav-search-choice-modal');
const navSearchModal = document.getElementById('nav-search-modal');

let currentCategory = '';
let currentList = [];
function navToggle(show) {
    if(show) { 
        navDock.classList.add('nav-active'); 
        navFab.classList.add('nav-is-hidden'); 
    } else { 
        navDock.classList.remove('nav-active'); 
        setTimeout(() => {
            if(!navDock.classList.contains('nav-active')) {
                navFab.classList.remove('nav-is-hidden'); 
            }
        }, 400);
        navReset(); 
    }
}

function navAct(element) { 
    navReset(); 
    element.classList.add('nav-active'); 
}

function navReset() { 
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('nav-active')); 
}

/* ==========================================
   HOME SCROLL LOGIC
   ========================================== */
const navHomeModal = document.getElementById('nav-home-modal');

function navOpenHomeWarn(element) {
    if (element) navAct(element);
    navHomeModal.classList.add('nav-home-show');
}

function navCloseHomeWarn() {
    navHomeModal.classList.remove('nav-home-show');
    navReset();
}

function navConfirmScrollTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    navCloseHomeWarn();
}

/* ==========================================
   FULL MUSIC ENGINE
   ========================================== */
const navAudio = new Audio();
let trackIdx = 0;
let isPlaying = false;
let wasPlayingBeforeInterference = false;

const tracks = [
    { title: "Columbina", artist: "miHoyo", file: "audio5.mp3", img: "https://preview.redd.it/columbina-in-6-3-domain-v0-vho135mtp15g1.jpeg?auto=webp&s=99b26c9115c4e64d36ba516c348a0b5768cf1114" },
    { title: "Calm Reading", artist: "Youtube", file: "audio7.mp3", img: "https://images.pexels.com/photos/6802965/pexels-photo-6802965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { title: "Interstellar Drift", artist: "miHoyo", file: "audio6.mp3", img: "https://i.ytimg.com/vi/wzW7ovdmnsg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCKQGxZBpVGZ2Q7aUtqZNvsQdiy_g" },
    { title: "Neon Nights", artist: "Audio One", file: "audio1.mp3", img: "https://i.ytimg.com/vi/EN84zyEcqBY/maxresdefault.jpg" },
    { title: "Reading Music", artist: "Youtube", file: "audio4.mp3", img: "https://i1.sndcdn.com/artworks-Ab77AS6NZO57z7fs-i5kjCw-t500x500.jpg" },
    { title: "Midnight City", artist: "", file: "audio2.mp3", img: "https://cdn-images-3.listennotes.com/podcasts/piano-music-calm-meditation-background-tXYx2DTs0R--AdFo8V_1PJ4.1400x1403.jpg" },
    { title: "Sinner Finale", artist: "miHoyo", file: "audio9.mp3", img: "https://preview.redd.it/the-opera-of-noirceur-and-blancheur-fan-art-v0-sv3xt223beec1.jpeg?auto=webp&s=130887d90f014e73de9dc1f77163a892b914c148" },
    { title: "Crescent Moon", artist: "Youtube", file: "audio3.mp3", img: "https://f4.bcbits.com/img/a2126921304_16.jpg" },
    { title: "Star Odyssey", artist: "miHoyo", file: "audio8.mp3", img: "https://i.scdn.co/image/ab67616d0000b273ee2eae96e7fcf6465b7cfb15" }
];

function navOpenMusic(btn) {
    navAct(btn);
    document.getElementById('nav-music-modal').classList.add('nav-show');
    if (!navAudio.src) navLoadTrack(0);
}

function navCloseMusic() {
    document.getElementById('nav-music-modal').classList.remove('nav-show');
}

function navLoadTrack(idx) {
    trackIdx = idx;
    const t = tracks[idx];
    document.getElementById('nav-track-title').innerText = t.title;
    document.getElementById('nav-track-artist').innerText = t.artist;
    document.getElementById('nav-main-art').src = t.img;
    document.getElementById('nav-img-bg').style.backgroundImage = `url('${t.img}')`;
    navAudio.src = t.file;

    if (isPlaying) showNowPlayingAlert(t.title);
}

function navTogglePlay() {
    const btn = document.getElementById('nav-play-btn');
    if (navAudio.paused) {
        navAudio.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        
        showNowPlayingAlert(tracks[trackIdx].title);
    } else {
        navPauseMusic();
    }
}

function navPauseMusic(isInterference = false) {
    navAudio.pause();
    document.getElementById('nav-play-btn').innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    if (!isInterference) wasPlayingBeforeInterference = false;
}

function navNext() {
    trackIdx = (trackIdx + 1) % tracks.length;
    navLoadTrack(trackIdx);
    if (isPlaying) navAudio.play();
}

function navPrev() {
    trackIdx = (trackIdx - 1 + tracks.length) % tracks.length;
    navLoadTrack(trackIdx);
    if (isPlaying) navAudio.play();
}

navAudio.onended = () => navNext();

navAudio.ontimeupdate = () => {
    if (isNaN(navAudio.duration)) return;
    const pct = (navAudio.currentTime / navAudio.duration) * 100;
    document.getElementById('nav-progress-bar').style.width = pct + "%";
    document.getElementById('nav-time-cur').innerText = fmtTime(navAudio.currentTime);
    document.getElementById('nav-time-dur').innerText = fmtTime(navAudio.duration);
};

function fmtTime(s) {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r < 10 ? '0' + r : r}`;
}

function navSetProgress(e) {
    const w = e.currentTarget.clientWidth;
    const x = e.offsetX;
    if (navAudio.duration) navAudio.currentTime = (x / w) * navAudio.duration;
}

function isAnyOtherMediaActive() {
    const allMedia = document.querySelectorAll('video, audio');
    for (let media of allMedia) {
        if (media !== navAudio && !media.paused && !media.ended && media.readyState > 2) {
            return true;
        }
    }
    return false;
}

window.addEventListener('play', (e) => { 
    if (e.target !== navAudio) {
        if (isPlaying) {
            wasPlayingBeforeInterference = true; 
            navPauseMusic(true); 
        }
    }
}, true);

const attemptResume = (e) => {
    if (e.target !== navAudio && wasPlayingBeforeInterference) {
        setTimeout(() => {
            if (wasPlayingBeforeInterference && !isAnyOtherMediaActive()) {
                navAudio.play();
                document.getElementById('nav-play-btn').innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
                wasPlayingBeforeInterference = false;
            }
        }, 2000);
    }
};

window.addEventListener('pause', attemptResume, true);
window.addEventListener('ended', attemptResume, true);

setInterval(() => {
    if (wasPlayingBeforeInterference && !isAnyOtherMediaActive()) {
        attemptResume({ target: null }); 
    }
}, 5000);


/* ==========================================
   AUTO-PROMPT
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
    const prompt = document.getElementById('nav-music-prompt');
    const bar = document.getElementById('nav-prompt-progress');
    
    const showMusicPrompt = () => {
        if (!prompt) return;
        prompt.classList.add('nav-show');
        setTimeout(() => { if (bar) bar.style.width = '0%'; }, 100);
        setTimeout(() => { if (prompt.classList.contains('nav-show')) navClosePrompt(false); }, 5100);
    };
    
    if (window.isLoadingComplete) {
        setTimeout(showMusicPrompt, 400);
    } else {
        window.addEventListener('loadingComplete', () => {
            setTimeout(showMusicPrompt, 1000);
        });
    }
});

function navClosePrompt(play) {
    const prompt = document.getElementById('nav-music-prompt');
    if (prompt) prompt.classList.remove('nav-show');
    if (play) {
        if (!navAudio.src) navLoadTrack(0);
        navTogglePlay();
    }
}

function navOpenMusicFromPrompt() {
    navClosePrompt(false);
    const musicBtn = document.querySelector('.nav-music');
    if (musicBtn) {
        navOpenMusic(musicBtn);
    }
}

function showNowPlayingAlert(title) {
    const alert = document.getElementById('nav-nowplaying-alert');
    const bar = document.getElementById('nav-np-bar');
    document.getElementById('nav-np-title').innerText = title;
    
    alert.classList.remove('nav-show');
    bar.style.transition = 'none';
    bar.style.width = '100%';

    setTimeout(() => {
        alert.classList.add('nav-show');
        bar.style.transition = 'width 3s linear';
        bar.style.width = '0%';
    }, 50);

    setTimeout(() => { alert.classList.remove('nav-show'); }, 3000);
}

/* ==========================================
   ChangeLog LOGIC
   ========================================== */

const navLogModal = document.getElementById('nav-log-modal');

function navOpenLog(element) {
    if (element) navAct(element);
    navLogModal.classList.add('nav-active');
}

function navCloseLog() {
    navLogModal.classList.remove('nav-active');
    navReset();
}

/* ==========================================
   Search LOGIC
   ========================================== */
function navOpenSearch(element) {
    if (element) navAct(element);
    document.getElementById('nav-search-choice-modal').classList.add('nav-search-choice-show');
}

function navCloseSearchChoice() {
    document.getElementById('nav-search-choice-modal').classList.remove('nav-search-choice-show');
}

function navSelectCategory(category) {
    currentCategory = category;
    navCloseSearchChoice();
    document.getElementById('nav-search-modal').classList.add('nav-search-show');
    
    const input = document.getElementById('nav-search-input');
    input.value = '';
    if (window.innerWidth > 768) {
        input.focus();
    }
    document.getElementById('nav-search-results').innerHTML = '';

    const scriptId = 'nav-list-loader';
    if(document.getElementById(scriptId)) document.getElementById(scriptId).remove();
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = category === 'anime' ? 'ListA.js' : 'ListK.js';
    script.onload = () => {
        currentList = category === 'anime' ? window.animes : window.kdramas;
    };
    document.head.appendChild(script);
}

function navCloseSearch() {
    document.getElementById('nav-search-modal').classList.remove('nav-search-show');
    navReset();
}

document.getElementById('nav-search-input').addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    
    if (!currentList || query.length === 0) {
        navSearchResults.innerHTML = '';
        return;
    }

    let results = currentList.filter(item => item.name.toLowerCase().startsWith(query));
    if (results.length === 0) {
        results = currentList.filter(item => item.name.toLowerCase().includes(query));
    }

    if (results.length === 0) {
        navSearchResults.innerHTML = '<p style="color:gray; text-align:center; padding:20px;">Not found</p>';
        return;
    }

    results.sort(() => Math.random() - 0.5);
    results = results.slice(0, 2);
    
    let html = '';
    results.forEach((item, index) => {
        const rating = item.rating || "N/A";
        const season = item.season || "1";
        const eps = item.episodes || "??";
        const seriesIndex = currentList.indexOf(item);

        html += `
            <div class="nav-search-item" style="animation-delay: ${index * 0.1}s" data-series-index="${seriesIndex}">
                <img src="${item.poster}" class="nav-search-poster">
                <div class="nav-search-info">
                    <h4 class="nav-search-item-name">${item.name}</h4>
                    <div class="nav-search-meta-row">
                        <span class="nav-search-tag">${rating}</span>
                        <span class="nav-search-tag">${season}</span>
                        <span class="nav-search-tag">${eps} EP</span>
                    </div>
                    <p class="nav-search-hook">${item.hook}</p>
                </div>
            </div>
        `;
    });
    navSearchResults.innerHTML = html;

    requestAnimationFrame(() => {
        document.querySelectorAll('.nav-search-item').forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                const seriesIndex = parseInt(this.getAttribute('data-series-index'));
                const seriesData = currentList[seriesIndex];
                
                if (seriesData) {
                    const modalData = {
                        name: seriesData.name || '',
                        poster: seriesData.poster || '',
                        hook: seriesData.hook || '',
                        episodes: seriesData.episodes || '-',
                        seasons: seriesData.season || '-',
                        rating: seriesData.rating || '-',
                        studio: seriesData.studio || '-',
                        mood: seriesData.mood || '-',
                        genre: seriesData.genre || '-',
                        storyline: seriesData.story || '-',
                        watchLink: seriesData.watch || '',
                        trailerLink: seriesData.trailer || '',
                        spotifyLink: seriesData.spotify || '',
                        laughLink: seriesData.laugh || ''
                    };
                    
                    sdOpenModal(modalData);
                    navCloseSearch();
                }
            });
        });
    });
});

/* ==========================================
   LANGUAGE LOGIC
   ========================================== */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        includedLanguages: 'en,es,fr,de,zh-CN,ja,ko,ar,hi,pt,ru,it,nl,sv,tr,bn,ur,id,th,vi,pl,uk'
    }, 'google_translate_element');
}

function navOpenLang(element) {
    if (element) navAct(element);
    navLangModal.classList.add('nav-lang-show');
}

function navCloseLang() {
    navLangModal.classList.remove('nav-lang-show');
}

/* ==========================================
   SHARE LOGIC
   ========================================== */
function navOpenShare(element) {
    navAct(element);
    navShareModal.classList.add('nav-visible');
}

function navCloseShare() {
    navShareModal.classList.remove('nav-visible');
}

function navCopyLink() {
    const copyText = document.getElementById("nav-share-input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    
    const btn = document.querySelector('.nav-share-copy-btn');
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => { btn.innerHTML = originalIcon; }, 2000);
}

/* ==========================================
   EXTERNAL LINKS & REDIRECTS
   ========================================== */
function navOpenDiscordWarn(element) {
    if (element) navAct(element);
    navDiscordModal.classList.add('nav-ds-show');
}

function navCloseDiscordWarn() {
    navDiscordModal.classList.remove('nav-ds-show');
}

function navConfirmShare(targetUrl) {
    navRedirLink.href = targetUrl;
    navRedirWarning.classList.add('nav-active');
}

function navCancelRedirect() {
    navRedirWarning.classList.remove('nav-active');
}

function navHandleDiscordPriority(anchor) {
    const link = anchor.href;
    if (link.includes('discord://')) {
        window.location.href = link;
        setTimeout(() => {
            if (document.hasFocus()) { window.open('https://discord.com/channels/@me', '_blank'); }
        }, 2000);
    }
    navCancelRedirect();
}

/* ==========================================
   ASSISTANT CHAT MODAL (ENHANCED)
   ========================================== */
const faqData = [
    { q: "What is this site?", a: "This website is a personal library containing all the Anime and K-drama series I’ve watched over the years." },
    { q: "How to join Discord?", a: "Join our community for the latest updates, series discussions, and direct support.", link: "navOpenDiscordWarn()" },
    { q: "Change Language?", a: "You can translate the entire site into your preferred language using our translate tool.", link: "navOpenLang()" },
    { q: "How to reach you?", a: "The best way to contact me is through our Discord server. I'm always happy to chat!", link: "navOpenDiscordWarn()" },
    { q: "Is this open source?", a: "No, this is a personal project created for my own use and to share my watchlists with friends." },
    { q: "Does it work on mobile?", a: "Absolutely! The interface is fully responsive and optimized for a great mobile experience." },
    { q: "Can I share the site?", a: "Yes! Feel free to share the site with your friends using our sharing menu.", link: "navOpenShare()" },
    { q: "Why did you create this?", a: "My friend Amanda kept asking for my watch history and opinions, so I built this to keep everything organized (and get some peace! 😛)." },
    { q: "What does the music icon do?", a: "It opens the music section where you can find my curated playlists and favorite tracks.", link: "navOpenMusic()" },
    { q: "Where are the logs?", a: "The document icon leads to the project changelog, detailing every update and bug fix.", link: "navOpenLog()" },
    { q: "Who built this site?", a: "This entire site was designed and coded by me (Toutis) from scratch." },
    { q: "New features coming?", a: "This is likely the final major UI upgrade, but I will constantly update the content with new series I watch!" },
    { q: "Is Google Translate safe?", a: "Yes, we utilize the official Google Translate API for secure and fast translations." },
    { q: "Why this new version?", a: "This version was released to significantly boost performance and provide a much smoother user experience." },
    { q: "How do I search?", a: "Click the magnifying glass icon and type the name of the series you are looking for.", link: "navOpenSearch()" },
    { q: "Who are you?", a: "I am a college student currently studying Computer Science. This site started as a practical application of my knowledge." },
    { q: "Is there a light mode?", a: "Currently, this theme is exclusively optimized for reduce eye strain." },
    { q: "Which browsers are supported?", a: "The site is optimized for Chrome. It should work on others, but Chrome provides the best experience." },
    { q: "How long did this take?", a: "The project started 2 years ago (April 2024). It took 6 versions to get here, with this specific version taking 2 months." },
    { q: "Can I check previous versions?", a: "Definitely, the previous versions are located on the discord server in the #review-link channel.", link: "navOpenDiscordWarn()" },
    { q: "Future widgets?", a: "Stay tuned! I might add small widgets in the future. Check Discord for any announcements.", link: "navOpenDiscordWarn()" }
];

let isBotThinking = false;

function navOpenChat(element) {
    if (element) navAct(element);
    navChatModal.classList.add('nav-chat-show');
    renderQuestions();
}

function navCloseChat() {
    navChatModal.classList.remove('nav-chat-show');
}

function renderQuestions() {
    const optionsContainer = document.getElementById('nav-chat-options');
    optionsContainer.innerHTML = '';
    
    const shuffled = faqData.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);

    selected.forEach((item, index) => {
        const btn = document.createElement('div');
        btn.className = 'nav-chat-opt';
        btn.style.animation = `navPop 0.3s ease-out ${index * 0.1}s forwards`;
        btn.textContent = item.q;
        btn.onclick = () => navAsk(item.q, btn);
        optionsContainer.appendChild(btn);
    });
}

function navAsk(question, btn) {
    if (isBotThinking) return; 
    isBotThinking = true;

    const display = document.getElementById('nav-chat-display');
    
    btn.style.opacity = '0';
    btn.style.transform = 'scale(0.9)';
    btn.style.pointerEvents = 'none';
    setTimeout(() => btn.remove(), 300);

    const userDiv = document.createElement('div');
    userDiv.className = 'nav-msg user-msg';
    userDiv.textContent = question;
    display.appendChild(userDiv);
    display.scrollTop = display.scrollHeight;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'nav-msg bot-msg nav-typing-wrap';
    typingDiv.id = 'nav-current-typing';
    typingDiv.innerHTML = `
        <div class="nav-typing">
            <div class="nav-dot"></div>
            <div class="nav-dot"></div>
            <div class="nav-dot"></div>
        </div>
    `;
    display.appendChild(typingDiv);
    display.scrollTop = display.scrollHeight;

    setTimeout(() => {
        const typing = document.getElementById('nav-current-typing');
        if (typing) typing.remove();

        const botDiv = document.createElement('div');
        botDiv.className = 'nav-msg bot-msg';
        
        const data = faqData.find(f => f.q === question);
        let responseHTML = data ? data.a : "I'm sorry, I don't have an answer for that yet.";
        
        if (data && data.link) {
            responseHTML += `<br><span class="nav-chat-link" onclick="${data.link}">Click here!</span>`;
        }

        botDiv.innerHTML = responseHTML;
        display.appendChild(botDiv);
        display.scrollTop = display.scrollHeight;

        setTimeout(() => {
            const optionsContainer = document.getElementById('nav-chat-options');
            const currentQuestions = Array.from(document.querySelectorAll('.nav-chat-opt')).map(opt => opt.textContent);
            
            const available = faqData.filter(f => !currentQuestions.includes(f.q) && f.q !== question);
            if (available.length > 0) {
                const newItem = available[Math.floor(Math.random() * available.length)];
                const newBtn = document.createElement('div');
                newBtn.className = 'nav-chat-opt';
                newBtn.style.animation = 'navPop 0.3s ease-out forwards';
                newBtn.textContent = newItem.q;
                newBtn.onclick = () => navAsk(newItem.q, newBtn);
                optionsContainer.appendChild(newBtn);
            }
            isBotThinking = false;
        }, 500);
    }, 1200);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const warningOverlay = document.getElementById('nav-details-modal');
        if (warningOverlay && warningOverlay.classList.contains('nav-dcd-show')) {
            sdCloseExternalLinkWarning();
            return;
        }
        
        navCloseLang();
        navCloseShare();
        navCloseChat();
        navCloseDiscordWarn();
        navCancelRedirect();
        navCloseLog();
        navCloseHomeWarn();
        navCloseSearchChoice();
        navCloseSearch();
        navCloseMusic();
        sdCloseModal();
    }
});


/* ==========================================
   ANTI-SELECTION & SMART CONTEXT MENU
   ========================================== */
document.addEventListener('selectstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

document.addEventListener('contextmenu', (e) => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    
    if (isMobile) {
        e.preventDefault();
    }
});


/* ==========================================
   SERIES DETAILS MODAL
   ========================================== */

const sdModalOverlay = document.getElementById('sd-modal-overlay');
const navSearchInput = document.getElementById('nav-search-input');
const navSearchResults = document.getElementById('nav-search-results');
const navDockElement = document.getElementById('nav-main-dock');
const navFabElement = document.getElementById('nav-fab-trigger');

/**
 * @param {Object} seriesData - Series information object
 * @param {string} seriesData.name - Series title
 * @param {string} seriesData.poster - Poster image URL
 * @param {string} seriesData.episodes - Number of episodes
 * @param {string} seriesData.seasons - Number of seasons
 * @param {string} seriesData.rating - Series rating
 * @param {string} seriesData.studio - Production studio
 * @param {string} seriesData.storyline - Series description/storyline
 * @param {string} seriesData.watchLink - URL or identifier for watch action
 * @param {string} seriesData.trailerLink - Trailer URL
 * @param {string} seriesData.spotifyLink - Spotify playlist/album URL
 * @param {string} seriesData.laughLink - Comedy/laugh related URL
 */

function sdOpenModal(seriesData) {
    if (!seriesData || typeof seriesData !== 'object') {
        console.error('Invalid series data provided to sdOpenModal');
        return;
    }

    const posterImg = document.getElementById('sd-poster-img');
    posterImg.src = seriesData.poster || '';
    posterImg.onerror = () => {
        posterImg.src = 'https://via.placeholder.com/400x300?text=No+Image';
    };

    document.getElementById('sd-title').textContent = seriesData.name || 'Unknown Series';

    document.getElementById('sd-hook').textContent = seriesData.hook || 'No hook available.';

    document.getElementById('sd-episodes').textContent = seriesData.episodes || '-';
    document.getElementById('sd-seasons').textContent = seriesData.seasons || '-';
    document.getElementById('sd-rating').textContent = seriesData.rating || '-';
    document.getElementById('sd-studio').textContent = seriesData.studio || '-';
    document.getElementById('sd-mood').textContent = seriesData.mood || '-';
    document.getElementById('sd-genre').textContent = seriesData.genre || '-';

    document.getElementById('sd-storyline').textContent = seriesData.storyline || 'No description available.';

    const trailerContainer = document.getElementById('sd-trailer-container');
    const trailerEmbed = document.getElementById('sd-trailer-embed');
    if (seriesData.trailerLink) {
        let embedUrl = seriesData.trailerLink;
        if (embedUrl.includes('youtube.com/watch?v=')) {
            const videoId = embedUrl.split('v=')[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (embedUrl.includes('youtu.be/')) {
            const videoId = embedUrl.split('youtu.be/')[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        trailerEmbed.src = embedUrl;
        trailerContainer.style.display = 'block';
    } else {
        trailerContainer.style.display = 'none';
    }

    const spotifyContainer = document.getElementById('sd-spotify-container');
    const spotifyEmbed = document.getElementById('sd-spotify-embed');
    if (seriesData.spotifyLink) {
        spotifyEmbed.src = seriesData.spotifyLink;
        spotifyContainer.style.display = 'block';
    } else {
        spotifyContainer.style.display = 'none';
    }

    setupActionButton('sd-watch-link', seriesData.watchLink, 'Watch');
    setupActionButton('sd-laugh-link', seriesData.laughLink, 'Laugh');
    
    setupReturnButton('return');

    sdModalOverlay.classList.add('sd-show');
    document.body.style.overflow = 'hidden';
    if (navDockElement) navDockElement.style.pointerEvents = 'none';
    if (navFabElement) navFabElement.style.pointerEvents = 'none';
}

/**
 * Show external link warning modal
 * @param {string} targetUrl - The URL to redirect to when confirmed
 */
function sdShowExternalLinkWarning(targetUrl) {
    const warningOverlay = document.getElementById('nav-details-modal');
    const confirmLink = warningOverlay.querySelector('.nav-dcd-confirm');
    
    confirmLink.href = targetUrl;
    confirmLink.target = '_blank';
    
    warningOverlay.classList.add('nav-dcd-show');
}


function sdCloseExternalLinkWarning() {
    const warningOverlay = document.getElementById('nav-details-modal');
    warningOverlay.classList.remove('nav-dcd-show');
}

/**
 * Setup action button with link and callback
 * @param {string} elementId - Button element ID
 * @param {string|Function} action - URL or callback function
 * @param {string} actionType - Type of action for display
 */
function setupActionButton(elementId, action, actionType) {
    const btn = document.getElementById(elementId);
    
    if (!action) {
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
        btn.title = `${actionType} not available`;
        return;
    }

    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.title = actionType;

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    const updatedBtn = document.getElementById(elementId);
    updatedBtn.onclick = (e) => {
        e.preventDefault();
        
        if (typeof action === 'function') {
            action();
        } else if (typeof action === 'string' && action.length > 0) {
            if (action.startsWith('http') || action.startsWith('spotify:') || action.startsWith('youtube.com')) {
                sdShowExternalLinkWarning(action);
            } else {
                console.log(`Action: ${actionType} -`, action);
            }
        }
    };
}

/**
 * Handle Return/Refresh button action
 * Returns to search modal with same search input and category
 * @param {Event} event - Click event
 */
function sdReturnToSearch(event) {
    if (event) event.preventDefault();
    
    sdCloseModal();
    
    const currentSearchInput = document.getElementById('nav-search-input');
    if (currentSearchInput && currentSearchInput.value.trim()) {
        document.getElementById('nav-search-modal').classList.add('nav-search-show');
        currentSearchInput.focus();
        currentSearchInput.dispatchEvent(new Event('input'));
    } else {
        document.getElementById('nav-search-choice-modal').classList.add('nav-search-choice-show');
    }
}

/**
 * Setup Return/Refresh button - flexible configuration
 * @param {string} buttonType - 'return', 'refresh', 'both', or 'none'
 */
function setupReturnButton(buttonType = 'return') {
    const returnBtn = document.getElementById('sd-return-link');
    
    if (buttonType === 'none') {
        returnBtn.style.display = 'none';
        return;
    }
    
    returnBtn.style.display = '';
    let icon = '';
    let text = '';
    
    if (buttonType === 'return') {
        icon = '<i class="fas fa-arrow-left"></i>';
        text = 'Return';
    } else if (buttonType === 'refresh') {
        icon = '<i class="fas fa-sync-alt"></i>';
        text = 'Refresh';
    } else if (buttonType === 'both') {
        icon = '<i class="fas fa-exchange-alt"></i>';
        text = 'Return';
    }
    
    returnBtn.innerHTML = `${icon} <span>${text}</span>`;
    returnBtn.onclick = sdReturnToSearch;
    returnBtn.style.opacity = '1';
    returnBtn.style.pointerEvents = 'auto';
}

function sdCloseModal() {
    sdModalOverlay.classList.remove('sd-show');
    document.body.style.overflow = 'auto';
    
    if (navDockElement) {
        navDockElement.style.pointerEvents = 'auto';
    }
    if (navFabElement) {
        navFabElement.style.pointerEvents = 'auto';
    }
    
    document.getElementById('sd-title').textContent = 'Series Title';
    document.getElementById('sd-hook').textContent = 'No hook available.';
    document.getElementById('sd-episodes').textContent = '-';
    document.getElementById('sd-seasons').textContent = '-';
    document.getElementById('sd-rating').textContent = '-';
    document.getElementById('sd-studio').textContent = '-';
    document.getElementById('sd-mood').textContent = '-';
    document.getElementById('sd-genre').textContent = '-';
    document.getElementById('sd-storyline').textContent = 'No description available.';
    document.getElementById('sd-poster-img').src = '';
    
    document.getElementById('sd-trailer-embed').src = '';
    document.getElementById('sd-spotify-embed').src = '';
    document.getElementById('sd-trailer-container').style.display = 'none';
    document.getElementById('sd-spotify-container').style.display = 'none';
    
    const watchBtn = document.getElementById('sd-watch-link');
    const laughBtn = document.getElementById('sd-laugh-link');
    const returnBtn = document.getElementById('sd-return-link');
    
    watchBtn.style.opacity = '0.5';
    watchBtn.style.pointerEvents = 'none';
    laughBtn.style.opacity = '0.5';
    laughBtn.style.pointerEvents = 'none';
    returnBtn.style.opacity = '0.5';
    returnBtn.style.pointerEvents = 'none';
}
