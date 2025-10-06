
let currentBackground = 0;

setTimeout(() => {
    document.getElementById('loading-screen').className = 'hidden';
    document.getElementById('desktop').className = 'active';
}, 1000);

function loadingAnimation() {
    document.getElementById('loading-screen').className = 'active';
    document.getElementById('desktop').className = 'hidden';

    setTimeout(() => {
        document.getElementById('loading-screen').className = 'hidden';
        document.getElementById('desktop').className = 'active';
        location.href = 'pages/birthday-letter.html';
    }, 2000);

}

// Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
updateClock();
setInterval(updateClock, 1000);

// Window management
let activeWindow = null;
let isDragging = false;
let currentX, currentY, initialX, initialY;
let zIndexCounter = 101;

function openWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('active');
    win.style.zIndex = zIndexCounter++;
    activeWindow = win;
    updateTaskbar();
    // Initialize heart animation if this is the gifts window
    if (id === 'gifts') {
        setTimeout(initHeartAnim, 100);
    }
}

function closeWindow(id) {
    document.getElementById(id).classList.remove('active');
    updateTaskbar();
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    win.style.display = 'none';
    setTimeout(() => {
        win.classList.remove('active');
        win.style.display = '';
    }, 10);
    updateTaskbar();
}

function maximizeWindow(id) {
    const win = document.getElementById(id);
    const isMaximized = win.classList.contains('maximized');
    
    if (isMaximized) {
        win.classList.remove('maximized');
        win.style.width = '900px';
        win.style.height = '600px';
        win.style.left = win.dataset.origLeft || '100px';
        win.style.top = win.dataset.origTop || '80px';
    } else {
        win.dataset.origLeft = win.style.left;
        win.dataset.origTop = win.style.top;
        win.classList.add('maximized');
        win.style.left = '0';
        win.style.top = '0';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 50px)';
    }
}

// Update taskbar with open windows
function updateTaskbar() {
    const taskbarCenter = document.querySelector('.taskbar-center');
    taskbarCenter.innerHTML = '';
    
    document.querySelectorAll('.window.active').forEach(win => {
        const title = win.querySelector('.window-title').textContent;
        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.textContent = title;
        taskbarApp.onclick = () => {
            if (win.style.display === 'none' || !win.classList.contains('active')) {
                win.style.display = '';
                win.classList.add('active');
                win.style.zIndex = zIndexCounter++;
            } else {
                win.style.zIndex = zIndexCounter++;
            }
        };
        taskbarCenter.appendChild(taskbarApp);
    });
}

// Dragging functionality
document.querySelectorAll('.window-titlebar').forEach(titlebar => {
    titlebar.addEventListener('mousedown', dragStart);
    
    // Double click to maximize
    titlebar.addEventListener('dblclick', (e) => {
        const win = e.target.closest('.window');
        if (win) {
            maximizeWindow(win.id);
        }
    });
});

function dragStart(e) {
    if (e.target.classList.contains('window-control')) return;
    
    const win = e.target.closest('.window');
    if (!win || win.classList.contains('maximized')) return;

    isDragging = true;
    activeWindow = win;
    activeWindow.style.zIndex = zIndexCounter++;
    
    initialX = e.clientX - win.offsetLeft;
    initialY = e.clientY - win.offsetTop;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    activeWindow.style.left = currentX + 'px';
    activeWindow.style.top = currentY + 'px';
}

function dragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
}

// Floating hearts animation
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.opacity = '0.7';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9998';
    heart.style.transition = 'all 4s ease-out';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.top = '-100px';
        heart.style.opacity = '0';
        heart.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
    }, 50);
    
    setTimeout(() => heart.remove(), 4000);
}


// Desktop icon selection
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', function() {
        document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Start button menu
const startButton = document.querySelector('.start-button');
let startMenuOpen = false;

startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu();
});

function toggleStartMenu() {
    let menu = document.getElementById('start-menu');
    
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'start-menu';
        menu.className = 'start-menu';
        menu.innerHTML = `
            <div class="menu-item" onclick="createFloatingHeart(); hideContextMenu();">💖 Изпрати любов</div>
            <div class="menu-item" onclick="showLoveMessage()">💕 Любовно съобщение</div>
            <div class="menu-item" onclick="changeBackground()">🎨 Промяна на фона</div>
            <div class="menu-item" onclick="closeAllWindows()">🔄 Затвори всички прозорци</div>
            <div class="menu-item" onclick="alert('Направено с ❤️ за теб!')">ℹ️ За LoveOS</div>
        `;
        document.body.appendChild(menu);
    }
    
    startMenuOpen = !startMenuOpen;
    menu.style.display = startMenuOpen ? 'block' : 'none';
}

function closeAllWindows() {
    document.querySelectorAll('.window').forEach(win => {
        win.classList.remove('active');
    });
    updateTaskbar();
    if (document.getElementById('start-menu')) {
        document.getElementById('start-menu').style.display = 'none';
    }
}

function changeBackground() {
    const backgrounds = [
        'url("./images/background.jpg") no-repeat center center/cover',
        'url("./images/background2.png") no-repeat center center/cover',
        'url("./images/background3.jpg") no-repeat center center/cover',
        'url("./images/background4.png") no-repeat center center/cover',
        'linear-gradient(135deg, #ff6b9d 0%, #c06c84 50%, #f67280 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
    ];
    currentBackground++;
    
    if (currentBackground >= backgrounds.length) {
        currentBackground = 0;
    }
    document.getElementById('desktop').style.background = backgrounds[currentBackground];
    if (document.getElementById('start-menu')) {
        document.getElementById('start-menu').style.display = 'none';
    }
}

// Close start menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('start-menu');
    if (menu && !e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
        menu.style.display = 'none';
        startMenuOpen = false;
    }
});

// Right click context menu on desktop
document.querySelector('.desktop-area').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.pageX, e.pageY);
});

function showContextMenu(x, y) {
    let menu = document.getElementById('context-menu');
    
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="menu-item" onclick="createFloatingHeart(); hideContextMenu();">💖 Изпрати любов</div>
            <div class="menu-item" onclick="showLoveMessage()">💕 Любовно съобщение</div>
            <div class="menu-item" onclick="changeBackground(); hideContextMenu();">🎨 Промяна на фона</div>
            <div class="menu-item" onclick="hideContextMenu();">❌ Затвори</div>
        `;
        document.body.appendChild(menu);
    }
    
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'block';
}

function hideContextMenu() {
    const menu = document.getElementById('context-menu');
    if (menu) menu.style.display = 'none';
}

document.addEventListener('click', hideContextMenu);

// Countdown Timer Functionality
let countdownInterval;
const reunionDate = new Date('2026-01-02T00:00:00');

function updateCountdown() {
    const now = new Date();
    const timeDiff = reunionDate - now;

    if (timeDiff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        clearInterval(countdownInterval);
        
        // Celebrate with hearts!
        for (let i = 0; i < 20; i++) {
            setTimeout(createFloatingHeart, i * 100);
        }
        return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    document.getElementById('countdown-message').textContent = "Липсваш ми... 💕";
}

// Start countdown immediately
updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);

// Image Carousel Functionality
let currentSlide = 0;
const carouselImages = [];

for(let i = 1; i <= 18; i++)    
{
    let extension = 'jpeg';

    if (i === 10 || i === 18) {
        extension = 'gif';
    }
    

    carouselImages.push({
        url: `images/image${i}.${extension}`
    });
}

function initCarousel() {
    const dotsContainer = document.getElementById('carousel-dots');
    dotsContainer.innerHTML = '';
    
    carouselImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    showSlide(0);
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= carouselImages.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = carouselImages.length - 1;
    }
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function showSlide(index) {
    const img = document.getElementById('carousel-image');
    const dots = document.querySelectorAll('.dot');
    
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = carouselImages[index].url;
        img.style.opacity = '1';
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }, 250);
}

// Initialize carousel when page loads
initCarousel();


// Heart Animation for Gifts Window
var heartAnimLoaded = false;
var initHeartAnim = function () {
    if (heartAnimLoaded) return;
    heartAnimLoaded = true;
    
    var mobile = window.isDevice || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase());
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById('heart-canvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var width = canvas.width = koef * canvas.offsetWidth;
    var height = canvas.height = koef * canvas.offsetHeight;
    var rand = Math.random;
    
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    var heartPosition = function (rad) {
        return [Math.pow(Math.sin(rad), 3), 
            -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    };
    
    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    var traceCount = mobile ? 20 : 50;
    var pointsOrigin = [];
    var i;
    var dr = mobile ? 0.3 : 0.1;
    
    for (i = 0; i < Math.PI * 2; i += dr) 
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) 
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) 
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    
    var heartPointsCount = pointsOrigin.length;

    var targetPoints = [];
    var pulse = function (kx, ky) {
        for (i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    };

    var e = [];
    for (i = 0; i < heartPointsCount; i++) {
        var x = rand() * width;
        var y = rand() * height;
        e[i] = {
            vx: 0,
            vy: 0,
            R: 2,
            speed: rand() + 5,
            q: ~~(rand() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: "hsla(0," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
            trace: []
        };
        for (var k = 0; k < traceCount; k++) e[i].trace[k] = {x: x, y: y};
    }

    var config = {
        traceK: 0.4,
        timeDelta: 0.01
    };

    var time = 0;
    var loop = function () {
        var n = -Math.cos(time);
        pulse((1 + n) * .5, (1 + n) * .5);
        time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);
        for (i = e.length; i--;) {
            var u = e[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                if (0.95 < rand()) {
                    u.q = ~~(rand() * heartPointsCount);
                }
                else {
                    if (0.99 < rand()) {
                        u.D *= -1;
                    }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) {
                        u.q += heartPointsCount;
                    }
                }
            }
            u.vx += -dx / length * u.speed;
            u.vy += -dy / length * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;
            for (k = 0; k < u.trace.length - 1;) {
                var T = u.trace[k];
                var N = u.trace[++k];
                N.x -= config.traceK * (N.x - T.x);
                N.y -= config.traceK * (N.y - T.y);
            }
            ctx.fillStyle = u.f;
            for (k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }
        window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

const loveMessages = [
    "Обичам те повече с всеки изминал ден. 💕",
    "Ти си моето слънце в мрачните дни. ☀️",
    "Сърцето ми бие само за теб. ❤️",
    "Без теб светът ми е празен. 🌍",
    "Ти си най-хубавият ми подарък. 🎁",
    "С теб всяка секунда е приказка. ✨",
    "Обичам начина, по който ме караш да се усмихвам. 😊",
    "Мисля за теб всяка сутрин, когато се събудя. 🌅",
    "Ти си моето завинаги. ♾️",
    "С теб съм у дома. 🏡",
    "Ти си моята сила и вдъхновение. 💪",
    "Нямам нужда от мечти – ти си реалност. 🌸",
    "Ти си най-красивата част от живота ми. 🌹",
    "С теб времето спира. ⏳",
    "Влюбвам се в теб отново и отново. 💖",
    "С теб съм най-щастливият човек на света. 🌎",
    "Обичам начина, по който гледаш на мен. 👀",
    "Ти си моята музика и моят ритъм. 🎶",
    "Моето сърце принадлежи на теб. 💓",
    "Ти си причината за моята усмивка. 😍",
    "Нищо няма смисъл без теб. 🌌",
    "Ти си моето чудо. 🌟",
    "С теб всеки ден е празник. 🎉",
    "Ти си моята мечта, сбъдната в реалността. 🌠",
    "С теб дори тишината е красива. 🤍",
    "Никога не искам да те пусна. 🤲",
    "Ти си моето сърце, моята душа. 💞",
    "Обичам те повече, отколкото думите могат да опишат. 📝",
    "Ти си всичко, за което съм мечтал. 💭",
    "С теб съм пълен. 🍀",
    "Ти си моето начало и моят край. 🔗",
    "Любовта ми към теб няма граници. 🌊",
    "Обичам те така, както звездите обичат нощта. 🌌",
    "Ти си моето щастие. 🌈",
    "С теб всичко е възможно. 🚀",
    "Никога няма да спра да те обичам. 🔥",
    "Ти си моят ангел. 😇",
    "Ти си най-красивата мисъл в ума ми. 💡",
    "С теб животът е песен. 🎵",
    "Обичам те повече, отколкото вчера, но по-малко от утре. 🕊️",
    "Ти си моята светлина в тъмното. 🔦",
    "С теб се чувствам цял. 🧩",
    "Ти си моята любов, моята вселена. 🌌",
    "Никога няма да се уморя да казвам: обичам те. 💋",
    "Ти си причината да вярвам в любовта. 💍",
    "С теб винаги е уютно. 🕯️",
    "Обичам начина, по който ме разбираш. 💌",
    "Ти си моето сърце, биещо завинаги за теб. ❤️‍🔥",
    "Любовта ми към теб е вечна. ⏳"
];

// Pick random message
function showLoveMessage() {
    const index = Math.floor(Math.random() * loveMessages.length);
    alert(loveMessages[index]);
}

// Playlist functionality
let isPlaying = false;
let currentSongIndex = 0;

const songs = [
    { title: "Barbie & Ken", artist: "V:RGO, DARA", duration: "2:10", src: "music/song1.mp3", cover: "music/song1.jpg"},
    { title: "Mi amor", artist: "Dessita", duration: "3:19", src: "music/song2.mp3", cover: "music/song2.jpg" },
    { title: "Dvamata", artist: "V:RGO, Mishell", duration: "3:54", src: "music/song3.mp3", cover: "music/song3.jpg" },
    { title: "Obichai me", artist: "Emilia, Boris Dali", duration: "5:25", src: "music/song4.mp3", cover: "music/song4.jpg" },
    { title: "Obsessed with you", artist: "Central Cee", duration: "1.58", src: "music/song5.mp3", cover: "music/song5.jpg" },
    { title: "Razkaji i", artist: "Dessita", duration: "3:30", src: "music/song6.mp3", cover: "music/song6.jpg" },
    { title: "Pitam te posledno", artist: "Emanuela", duration: "4:18", src: "music/song7.mp3", cover: "music/song7.jpg" },
    { title: "MMA", artist: "Azis", duration: "3:52", src: "music/song8.mp3", cover: "music/song8.jpg"  }
];

function togglePlay() {
    const audio = document.getElementById('audio-player');
    const playIcon = document.getElementById('play-icon');
    
    if(!audio.src) {
        audio.src = songs[0].src;
        document.querySelector('.current-song-title').textContent = songs[0].title;
        document.querySelector('.current-song-artist').textContent = songs[0].artist;
    }

    if (isPlaying) {
        audio.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    } else {
        audio.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }

    isPlaying = !isPlaying;
}

function playSong(index) {
    const audio = document.getElementById('audio-player');

    // Remove active class from all songs
    const allSongs = document.querySelectorAll('.song');
    allSongs.forEach(song => song.classList.remove('active'));
    
    // Add active class to selected song
    allSongs[index].classList.add('active');
    
    // Update current song info
    document.querySelector('.current-song-title').textContent = songs[index].title;
    document.querySelector('.current-song-artist').textContent = songs[index].artist;
    
    // Update cover
    const coverDiv = document.querySelector('.current-song-cover');
    coverDiv.style.backgroundImage = `url('${songs[index].cover}')`;
    coverDiv.style.backgroundSize = 'cover';
    coverDiv.style.backgroundPosition = 'center';
    
    // Update progress time
    document.querySelector('.progress-time:last-child').textContent = songs[index].duration;
    
    // Set audio source and play
    audio.src = songs[index].src;
    audio.play();
    isPlaying = true;
    document.getElementById('play-icon').classList.remove('fa-play');
    document.getElementById('play-icon').classList.add('fa-pause');

    currentSongIndex = index;
    
    // If not playing, start playing
    if (!isPlaying) {
        togglePlay();
    }
}

// Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();


const audio = document.getElementById('audio-player');
audio.addEventListener('ended', () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) currentSongIndex = 0;
    playSong(currentSongIndex);
});

const audioPlayer = document.getElementById('audio-player');
const progressTimeElements = document.querySelectorAll('.progress-time'); // [current, duration]
const progressBarContainer = document.querySelector('.progress-bar');
const progressBar = document.querySelector('.progress');
const volumeBarContainer = document.querySelector('.volume-bar');
const volumeLevel = document.querySelector('.volume-level');

// Format seconds as mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// --- Playback Progress ---
audioPlayer.addEventListener('timeupdate', () => {
    progressTimeElements[0].textContent = formatTime(audioPlayer.currentTime);
    if (progressBar) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = percent + '%';
    }
});

audioPlayer.addEventListener('loadedmetadata', () => {
    progressTimeElements[1].textContent = formatTime(audioPlayer.duration);
});

// Click on progress bar to seek
progressBarContainer.addEventListener('click', (e) => {
    const rect = progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
});

// --- Volume Control ---
function setVolume(percent) {
    audioPlayer.volume = percent;
    volumeLevel.style.width = (percent * 100) + '%';
}

// Click to set volume
volumeBarContainer.addEventListener('click', (e) => {
    const rect = volumeBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
    setVolume(percent);
});

// Drag to adjust volume
let isAdjustingVolume = false;

volumeBarContainer.addEventListener('mousedown', () => isAdjustingVolume = true);
document.addEventListener('mouseup', () => isAdjustingVolume = false);
document.addEventListener('mousemove', (e) => {
    if (!isAdjustingVolume) return;
    const rect = volumeBarContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percent = Math.min(Math.max(mouseX / rect.width, 0), 1);
    setVolume(percent);
});

// Initialize volume
setVolume(0.8); // default 80%

// Spinning Wheel Functionality
const wheelGifts = [
    { text: "Прегръдка 🤗", color: "#ff6b9d" },
    { text: "Целувка 💋", color: "#c06c84" },
    { text: "Разходка 🌳", color: "#f67280" },
    { text: "Масаж 💆", color: "#ffa07a" },
    { text: "Целувка X2 💋", color: "#ff9ff3" },
    { text: "Танц заедно 💃", color: "#feca57" },
    { text: "Вечеря 🍽️", color: "#ff6348" },
    { text: "Изненада 🎁", color: "#ff7979" }
];

let isSpinning = false;
let currentRotation = 0;

function drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    const sliceAngle = (2 * Math.PI) / wheelGifts.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    
    // Draw wheel slices
    wheelGifts.forEach((gift, index) => {
        const startAngle = index * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = gift.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(gift.text, radius * 0.65, 5);
        ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.restore();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    document.getElementById('spin-button').disabled = true;
    document.getElementById('wheel-result').textContent = '';
    
    const spinDuration = 4000;
    const minSpins = 5;
    const randomSpins = Math.random() * 3;
    const totalRotation = (minSpins + randomSpins) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const finalRotation = currentRotation + totalRotation + randomOffset;
    
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = currentRotation + (finalRotation - currentRotation) * easeOut * 0.1;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentRotation = finalRotation % (2 * Math.PI);
            drawWheel();
            showResult();
            isSpinning = false;
            document.getElementById('spin-button').disabled = false;
        }
    }
    
    animate();
}

function showResult() {
    const sliceAngle = (2 * Math.PI) / wheelGifts.length;
    const normalizedRotation = (2 * Math.PI - (currentRotation % (2 * Math.PI))) % (2 * Math.PI);
    const selectedIndex = Math.floor(normalizedRotation / sliceAngle) % wheelGifts.length;
    const selectedGift = wheelGifts[selectedIndex];
    
    document.getElementById('wheel-result').innerHTML = `
        Спечели: <br><span style="color: ${selectedGift.color}">${selectedGift.text}</span>
        <br><button onclick="downloadVoucher('${selectedGift.text}', '${selectedGift.color}')" style="margin-top: 15px; padding: 10px 25px; font-size: 16px; background: ${selectedGift.color}; color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
            📥 Изтегли ваучер
        </button>
    `;
    
    for (let i = 0; i < 10; i++) {
        setTimeout(createFloatingHeart, i * 100);
    }
}


function downloadVoucher(giftText, giftColor) {
    // Create a canvas for the voucher
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, giftColor);
    gradient.addColorStop(1, adjustColor(giftColor, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add decorative border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Add inner border
    ctx.strokeStyle = adjustColor(giftColor, 40);
    ctx.lineWidth = 5;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);
    
    // Draw decorative corners
    drawCornerDecoration(ctx, 50, 50, giftColor);
    drawCornerDecoration(ctx, canvas.width - 50, 50, giftColor);
    drawCornerDecoration(ctx, 50, canvas.height - 50, giftColor);
    drawCornerDecoration(ctx, canvas.width - 50, canvas.height - 50, giftColor);
    
    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fillText('💝 ЛЮБОВЕН ВАУЧЕР 💝', canvas.width / 2, 120);
    
    // Gift text
    ctx.font = 'bold 60px Arial';
    ctx.fillText(giftText, canvas.width / 2, 250);
    
    // Subtitle
    ctx.font = '28px Arial';
    ctx.fillText('Валиден винаги и навсякъде', canvas.width / 2, 320);
    
    // Bottom text
    ctx.font = 'italic 24px Arial';
    ctx.fillText('С любов от Хакан ❤️', canvas.width / 2, 420);
    
    // Get current date
    const date = new Date().toLocaleDateString('bg-BG');
    ctx.font = '20px Arial';
    ctx.fillText(`Издаден: ${date}`, canvas.width / 2, 460);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Convert canvas to PNG and download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `voucher.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    });
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
    const clamp = (val) => Math.min(255, Math.max(0, val));
    const num = parseInt(color.replace('#', ''), 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00FF) + amount);
    const b = clamp((num & 0x0000FF) + amount);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Helper function to draw corner decorations
function drawCornerDecoration(ctx, x, y, color) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = adjustColor(color, 40);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

// Initialize wheel when page loads
setTimeout(() => {
    if (document.getElementById('wheel-canvas')) {
        drawWheel();
    }
}, 100);