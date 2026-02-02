const animeItemsRaw = (typeof animes !== 'undefined') ? animes.filter(x => x.home) : [];
const dramaItemsRaw = (typeof kdramas !== 'undefined') ? kdramas.filter(x => x.home) : [];

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const animeItems = shuffle([...animeItemsRaw]);
const dramaItems = shuffle([...dramaItemsRaw]);

function animateValue(id, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const el = document.getElementById(id);
        if(el) el.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function initStats() {
    if(typeof animes !== 'undefined' && typeof kdramas !== 'undefined') {
        animateValue('home-s-a', 0, animes.length, 1500);
        animateValue('home-s-k', 0, kdramas.length, 1500);
        animateValue('home-s-total', 0, animes.length + kdramas.length, 1500);
    }
}
initStats();

const engine = {
    a: { 
        i: animeItems.length > 0 ? Math.floor(Math.random() * animeItems.length) : 0, 
        flip: true, 
        prefix: 'home-a' 
    },
    k: { 
        i: dramaItems.length > 0 ? Math.floor(Math.random() * dramaItems.length) : 0, 
        flip: true, 
        prefix: 'home-k' 
    }
};

function rotate(key) {
    const list = key === 'a' ? animeItems : dramaItems;
    if (!list || list.length === 0) return;

    const state = engine[key];
    const item = list[state.i];
    
    const b1 = document.getElementById(`${state.prefix}bg-1`);
    const b2 = document.getElementById(`${state.prefix}bg-2`);
    const img = document.getElementById(`${state.prefix}poster`);
    const title = document.getElementById(`${state.prefix}title`);
    const hook = document.getElementById(`${state.prefix}hook`);

    if(!b1 || !b2 || !title) return;

    const preloader = new Image();
    preloader.src = item.poster;

    preloader.onload = () => {
        title.style.opacity = 0;
        if(img) img.style.opacity = 0;
        if(hook) hook.style.opacity = 0;

        setTimeout(() => {
            const nextBg = state.flip ? b2 : b1;
            const prevBg = state.flip ? b1 : b2;

            nextBg.style.backgroundImage = `url('${item.poster}')`;
            if(img) img.src = item.poster;
            title.innerText = item.name;
            if(hook) hook.innerText = item.hook || "";

            nextBg.style.opacity = 1;
            prevBg.style.opacity = 0;
            if(img) img.style.opacity = 1;
            title.style.opacity = 1;
            if(hook) hook.style.opacity = 1;

            state.i = (state.i + 1) % list.length;
            state.flip = !state.flip;
        }, 500);
    };

    preloader.onerror = () => {
        state.i = (state.i + 1) % list.length;
        rotate(key);
    };
}

rotate('a');
rotate('k');

setInterval(() => rotate('a'), 10000);
setInterval(() => rotate('k'), 10000);

