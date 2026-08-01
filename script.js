
/* ============================================================
   CONFIG — set her real birthday here before sending the gift
   ============================================================ */
const CORRECT_PASSWORD = "0423"; // format DDMMYYYY

/* Keep celebrations functional when the optional CDN is blocked or offline. */
if(typeof confetti !== 'function'){
  window.confetti = ({particleCount=30, colors=['#e8a3bb','#d8ae66','#fff']}={})=>{
    for(let i=0;i<Math.min(particleCount,90);i++){
      const particle = document.createElement('i');
      particle.textContent = Math.random() > .45 ? '✦' : '♥';
      particle.style.cssText = `position:fixed;z-index:20;pointer-events:none;left:${Math.random()*100}vw;top:${35+Math.random()*25}vh;color:${colors[i%colors.length]};font-size:${8+Math.random()*14}px;opacity:1;transition:transform 1.8s ease-out,opacity 1.8s ease-out;`;
      document.body.appendChild(particle);
      requestAnimationFrame(()=>{ particle.style.transform=`translate(${(Math.random()-.5)*240}px,${120+Math.random()*260}px) rotate(${Math.random()*360}deg)`; particle.style.opacity='0'; });
      setTimeout(()=>particle.remove(),1900);
    }
  };
}

/* ---------------- Image gallery enhancement ---------------- */
function hydratePhotos(){
  const files = ['0.jpeg','1.jpeg','2.jpeg','3.jpeg','4.jpeg','5.jpeg','6.jpeg','7.jpeg','8.jpeg','9.jpeg','11.jpeg'];
  document.querySelectorAll('.photo-ph').forEach((frame, index)=>{
    const file = files[index % files.length];
    const image = document.createElement('img');
    image.src = 'img/' + file;
    image.alt = 'A cherished memory';
    image.loading = index < 6 ? 'eager' : 'lazy';
    image.onerror = ()=>{ image.remove(); };
    frame.replaceChildren(image);
  });
  const wallpaper = document.querySelector('.wallpaper-tag');
  if(!wallpaper) return;
  wallpaper.textContent = '';
  wallpaper.style.backgroundImage = "linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.38)),url('img/0.jpeg')";
  wallpaper.style.backgroundSize = 'cover';
  wallpaper.style.backgroundPosition = 'center';
}
hydratePhotos();

/* ---------------- Tactile cinematic interactions ---------------- */
function addRipple(event){
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * .7;
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
  button.appendChild(ripple);
  ripple.addEventListener('animationend', ()=>ripple.remove());
}
document.querySelectorAll('button').forEach(button=>button.addEventListener('click', addRipple));

/* ---------------- Draggable side memories ---------------- */
document.querySelectorAll('.side-memory').forEach(memory=>{
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  memory.addEventListener('pointerdown', event=>{
    dragging = true;
    memory.setPointerCapture(event.pointerId);
    const rect = memory.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    memory.style.left = rect.left + 'px';
    memory.style.top = rect.top + 'px';
    memory.style.right = 'auto';
    memory.style.transform = 'rotate(0deg) scale(1.06)';
  });
  memory.addEventListener('pointermove', event=>{
    if(!dragging) return;
    const maxX = window.innerWidth - memory.offsetWidth - 4;
    const maxY = window.innerHeight - memory.offsetHeight - 4;
    const x = Math.max(4, Math.min(maxX, event.clientX - offsetX));
    const y = Math.max(4, Math.min(maxY, event.clientY - offsetY));
    memory.style.left = x + 'px';
    memory.style.top = y + 'px';
  });
  const stopDragging = event=>{
    if(!dragging) return;
    dragging = false;
    if(memory.hasPointerCapture(event.pointerId)) memory.releasePointerCapture(event.pointerId);
    memory.style.transform = 'rotate(0deg) scale(1)';
  };
  memory.addEventListener('pointerup', stopDragging);
  memory.addEventListener('pointercancel', stopDragging);
});

const cursorLight = document.getElementById('cursor-light');
window.addEventListener('pointermove', event=>{
  cursorLight.style.left = event.clientX + 'px';
  cursorLight.style.top = event.clientY + 'px';
  const active = document.querySelector('.scene:not(.hidden-scene)');
  if(active && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const x = (event.clientX / window.innerWidth - .5) * 10;
    const y = (event.clientY / window.innerHeight - .5) * 7;
    active.style.setProperty('--light-x', x + 'px');
    active.style.setProperty('--light-y', y + 'px');
  }
});

window.addEventListener('scroll', ()=>{
  const active = document.querySelector('.scene:not(.hidden-scene)');
  if(active) active.style.setProperty('--scroll-depth', (window.scrollY * .08) + 'px');
}, {passive:true});

/* ---------------- Ambient floating background ---------------- */
(function ambient(){
  const wrap = document.getElementById('ambient');
  const items = ['❤️','💕','🌸','✨','🦋'];
  for(let i=0;i<26;i++){
    const el = document.createElement('div');
    el.className = 'amb-item';
    el.textContent = items[Math.floor(Math.random()*items.length)];
    const size = 12 + Math.random()*22;
    el.style.fontSize = size+'px';
    el.style.left = Math.random()*100+'vw';
    el.style.top = Math.random()*100+'vh';
    wrap.appendChild(el);
    gsap.to(el, {
      y: '-=' + (80 + Math.random()*160),
      x: '+=' + (Math.random()*60-30),
      rotation: Math.random()*40-20,
      opacity: 0.15 + Math.random()*0.5,
      duration: 6 + Math.random()*8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random()*4
    });
  }
})();

/* ---------------- Lock screen clock ---------------- */
function updateClock(){
  if(!document.getElementById('lock-time') || !document.getElementById('lock-date')) return;
  const now = new Date();
  let h = now.getHours(); const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; h = h ? h : 12;
  document.getElementById('lock-time').textContent = h + ':' + String(m).padStart(2,'0');
  document.getElementById('lock-date').textContent = now.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});
}
updateClock();
setInterval(updateClock, 15000);

/* ---------------- Scene navigation ---------------- */
function goTo(id){
  document.querySelectorAll('.scene').forEach(s=>s.classList.add('hidden-scene'));
  const target = document.getElementById(id);
  target.classList.remove('hidden-scene');
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
  target.scrollIntoView({behavior:'auto'});
  const track = target.querySelector('.fade-track');
  requestAnimationFrame(()=>{ if(track) track.classList.add('show'); });
  if(id==='scene-cake') setTimeout(()=>{},0);
  if(id==='scene-gallery') animateGallery();
  if(id==='scene-reasons') animateReasons();
  if(id==='scene-timeline') animateTimeline();
  if(id==='scene-final') { buildStars(); fireEnding(); }
}

/* ---------------- Unlock flow ---------------- */
const passwordInput = document.getElementById('password-input');
const unlockBtn = document.getElementById('unlock-btn');
const passwordError = document.getElementById('password-error');
const musicEl = document.getElementById('bg-music');
const keypadDisplay = document.getElementById('keypad-display');
const keypad = document.getElementById('keypad');

function updateKeypadDisplay(){
  const value = passwordInput.value;
  keypadDisplay.innerHTML = value ? `<span class="keypad-dots">${'● '.repeat(value.length).trim()}</span>` : '<span class="keypad-dots">♡ ♡ ♡ ♡ ♡ ♡ ♡ ♡</span>';
}
keypad.addEventListener('click', event=>{
  const key = event.target.closest('[data-key]')?.dataset.key;
  if(!key) return;
  if(key === 'clear') passwordInput.value = '';
  else if(key === 'delete') passwordInput.value = passwordInput.value.slice(0,-1);
  else if(passwordInput.value.length < 8) passwordInput.value += key;
  updateKeypadDisplay();
  passwordError.textContent = '';
});

function tryUnlock(){
  const val = passwordInput.value.trim();
  if(val === CORRECT_PASSWORD){
    passwordError.textContent = '';
    const card = document.querySelector('.welcome-card');
    gsap.to(card, {
      scale: 1.06, boxShadow:'0 0 120px rgba(255,220,180,0.8)', duration:0.5, ease:'power2.out',
      onComplete(){
        gsap.to('#scene-lock', {opacity:0, duration:0.7, onComplete(){
          goTo('scene-cake');
          launchConfetti();
          musicEl.volume = 0;
          musicEl.play().catch(()=>{});
          gsap.to(musicEl, {volume:0.5, duration:2});
        }});
      }
    });
  } else {
    passwordError.textContent = '❌ Wrong Password — Try Again ❤️';
    passwordInput.classList.add('shake-anim');
    gsap.fromTo(passwordInput, {x:0}, {x:0, duration:0.4, onStart(){
      passwordInput.style.animation = 'shake 0.4s ease';
      setTimeout(()=>passwordInput.style.animation='', 400);
    }});
  }
}
unlockBtn.addEventListener('click', tryUnlock);
passwordInput.addEventListener('keydown', e=>{ if(e.key==='Enter') tryUnlock(); });

/* ---------------- Confetti / fireworks ---------------- */
function launchConfetti(){
  const colors = ['#e8a3bb','#d8ae66','#cbb7e0','#ffffff'];
  const duration = 2500;
  const end = Date.now() + duration;
  (function frame(){
    confetti({particleCount:5, angle:60, spread:65, origin:{x:0}, colors});
    confetti({particleCount:5, angle:120, spread:65, origin:{x:1}, colors});
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
  setTimeout(()=>{
    confetti({particleCount:120, spread:100, origin:{y:0.5}, colors});
  }, 300);
}

/* ---------------- Cake / candles ---------------- */
document.getElementById('blow-btn').addEventListener('click', ()=>{
  ['f1','f2','f3','f4'].forEach((id,i)=>{
    setTimeout(()=>document.getElementById(id).classList.add('out'), i*150);
  });
  setTimeout(()=>{
    confetti({particleCount:80, spread:90, origin:{y:0.6}, colors:['#d8ae66','#e8a3bb','#fff']});
    gsap.to('#make-wish-text', {opacity:1, y:0, duration:0.8, ease:'power2.out'});
  }, 700);
});

/* ---------------- Gallery reveal ---------------- */
function animateGallery(){
  const cards = document.querySelectorAll('#gallery-grid .polaroid');
  cards.forEach((c,i)=>{
    setTimeout(()=>c.classList.add('show'), i*220);
  });
}

/* ---------------- Love letter ---------------- */
const envelope = document.getElementById('envelope');
const letterFull = document.getElementById('letter-full');
const letterText = `My Princess,

Every moment with you is my favorite memory.

You are my happiness.
My peace.
My smile.
My home.

No matter where life takes us,
I will always wish to see you smiling.

Happy Birthday, My Love ❤️`;
let letterTyped = false;
envelope.addEventListener('click', ()=>{
  envelope.classList.add('open');
  if(letterTyped) return;
  letterTyped = true;
  setTimeout(()=>typeLetter(letterText, letterFull), 900);
});
function typeLetter(text, el){
  el.textContent='';
  const cursor = document.createElement('span');
  cursor.className='cursor-blink';
  cursor.textContent='|';
  let i=0;
  const interval = setInterval(()=>{
    el.textContent = text.slice(0,i);
    el.appendChild(cursor);
    i++;
    if(i>text.length){
      clearInterval(interval);
      document.getElementById('letter-next').classList.remove('hidden-scene');
      document.getElementById('letter-next').style.display='inline-block';
    }
  }, 32);
}

/* ---------------- Reasons cards ---------------- */
function animateReasons(){
  const cards = document.querySelectorAll('#reasons-grid .reason-card');
  cards.forEach((c,i)=> setTimeout(()=>c.classList.add('show'), i*180));
}

/* ---------------- Gift box ---------------- */
document.getElementById('gift-btn').addEventListener('click', ()=>{
  document.getElementById('gift-box').classList.add('open');
  document.getElementById('gift-box-wrap').classList.add('open');
  confetti({particleCount:100, spread:120, origin:{y:0.55}, colors:['#d8ae66','#f3e0b8','#fff']});
});

/* ---------------- Timeline ---------------- */
function animateTimeline(){
  const items = document.querySelectorAll('#timeline .tl-item');
  items.forEach((it,i)=> setTimeout(()=>it.classList.add('show'), i*260));
}

/* ---------------- Final scene stars ---------------- */
function buildStars(){
  const box = document.getElementById('stars');
  if(box.dataset.built) return;
  box.dataset.built = '1';
  for(let i=0;i<80;i++){
    const s = document.createElement('div');
    const size = Math.random()*2+1;
    s.style.position='absolute';
    s.style.width=size+'px'; s.style.height=size+'px';
    s.style.borderRadius='50%';
    s.style.background='#fff';
    s.style.left=Math.random()*100+'%';
    s.style.top=Math.random()*100+'%';
    s.style.opacity=0.2+Math.random()*0.8;
    box.appendChild(s);
    gsap.to(s, {opacity:0.1, duration:1+Math.random()*2, repeat:-1, yoyo:true, delay:Math.random()*3});
  }
}
function fireEnding(){
  const colors = ['#e8a3bb','#d8ae66','#cbb7e0','#ffffff'];
  confetti({particleCount:150, spread:160, origin:{y:0.4}, colors});
  setTimeout(()=>confetti({particleCount:100, spread:120, origin:{x:0.2,y:0.5}, colors}), 400);
  setTimeout(()=>confetti({particleCount:100, spread:120, origin:{x:0.8,y:0.5}, colors}), 700);
}

/* ---------------- Replay ---------------- */
document.getElementById('replay-btn').addEventListener('click', ()=>{
  document.querySelectorAll('.polaroid, .reason-card, .tl-item').forEach(el=>el.classList.remove('show'));
  document.getElementById('letter-full').textContent='';
  letterTyped = false;
  envelope.classList.remove('open');
  document.getElementById('letter-next').style.display='none';
  document.getElementById('gift-box').classList.remove('open');
  document.getElementById('gift-box-wrap').classList.remove('open');
  ['f1','f2','f3','f4'].forEach(id=>document.getElementById(id).classList.remove('out'));
  gsap.set('#make-wish-text', {opacity:0, y:10});
  passwordInput.value='';
  updateKeypadDisplay();
  passwordError.textContent='';
  gsap.set('#scene-lock', {opacity:1});
  goTo('scene-lock');
  musicEl.pause();
  musicEl.currentTime = 0;
});

