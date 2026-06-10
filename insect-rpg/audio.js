// ═══════════════════════════════════════════════
//  AUDIO 8-BIT — Web Audio API puro, sin archivos
// ═══════════════════════════════════════════════

let _ac = null;
let _muted = false;
let _pendingMusic = null;

try { _muted = localStorage.getItem('metamorfosis-muted') === '1'; } catch (e) {}

// Tabla de frecuencias C2–B6  (R = silencio = 0)
const _N = (() => {
  const names = ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'];
  const out = { R: 0 };
  for (let oct = 2; oct <= 6; oct++)
    names.forEach((n, i) => { out[n + oct] = 440 * Math.pow(2, (i - 9) / 12 + (oct - 4)); });
  return out;
})();

// ── Unlock: llamado dentro de un gesto del usuario ───────────────
function _unlock() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  if (_ac.state === 'suspended') {
    _ac.resume().then(() => {
      if (_pendingMusic) { const s = _pendingMusic; _pendingMusic = null; _startMusic(s); }
    }).catch(() => {});
  } else if (_pendingMusic) {
    const s = _pendingMusic; _pendingMusic = null; _startMusic(s);
  }
}

['click', 'touchstart', 'keydown', 'pointerdown'].forEach(ev =>
  document.addEventListener(ev, _unlock, { passive: true, capture: true })
);

function _osc(freq, dur, { type = 'square', vol = 0.07, when = 0, slideTo = 0 } = {}) {
  if (_muted || !freq || !_ac || _ac.state !== 'running') return;
  try {
    const t = _ac.currentTime + when + 0.02;
    const o = _ac.createOscillator();
    const g = _ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(_ac.destination);
    o.start(t); o.stop(t + dur + 0.05);
  } catch (e) {}
}

function _noise(dur, vol = 0.08, when = 0) {
  if (_muted || !_ac || _ac.state !== 'running') return;
  try {
    const t = _ac.currentTime + when + 0.02;
    const len = Math.floor(_ac.sampleRate * dur);
    const buf = _ac.createBuffer(1, len, _ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = _ac.createBufferSource();
    src.buffer = buf;
    const g = _ac.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(g); g.connect(_ac.destination);
    src.start(t);
  } catch (e) {}
}

// ── Música ────────────────────────────────────
const SONGS = {
  world: {
    tempo: 132,
    melody: [
      ['G4',.5],['A4',.5],['C5',1],['C5',.5],['D5',.5],['E5',1],
      ['G5',1],['E5',1],['D5',.5],['C5',.5],['D5',1],
      ['E5',.5],['D5',.5],['C5',1],['A4',.5],['G4',.5],['A4',1],
      ['C5',2],['R',2],
      ['G4',.5],['A4',.5],['C5',1],['C5',.5],['D5',.5],['E5',1],
      ['G5',1],['A5',1],['G5',.5],['E5',.5],['D5',1],
      ['C5',.5],['D5',.5],['E5',1],['D5',.5],['C5',.5],['D5',1],
      ['C5',2],['R',2],
    ],
    bass: [
      ['C3',1],['G3',1],['C3',1],['G3',1],
      ['F3',1],['A3',1],['G3',1],['G3',1],
    ],
  },
  battle: {
    tempo: 168,
    melody: [
      ['A4',.5],['A4',.5],['C5',.5],['A4',.5],['E5',1],['D5',.5],['C5',.5],
      ['B4',.5],['B4',.5],['D5',.5],['B4',.5],['F5',1],['E5',.5],['D5',.5],
      ['C5',.5],['E5',.5],['A5',1],['G5',.5],['E5',.5],['D5',.5],['C5',.5],
      ['B4',.5],['D5',.5],['B4',.5],['Gs4',.5],['A4',1],['R',1],
    ],
    bass: [
      ['A2',.5],['A2',.5],['A2',.5],['E2',.5],
      ['A2',.5],['A2',.5],['G2',.5],['E2',.5],
    ],
  },
};

let _song = null, _mi = 0, _bi = 0;
let _melodyTimer = null, _bassTimer = null;

function playMusic(name) {
  stopMusic();
  if (_muted) return;
  if (!_ac || _ac.state !== 'running') { _pendingMusic = name; _unlock(); return; }
  _startMusic(name);
}

function _startMusic(name) {
  stopMusic();
  if (_muted) return;
  _song = SONGS[name];
  if (!_song) return;
  _mi = 0; _bi = 0;
  _tickMelody(); _tickBass();
}

function stopMusic() {
  clearTimeout(_melodyTimer); clearTimeout(_bassTimer);
  _song = null; _pendingMusic = null;
}

function _tickMelody() {
  if (!_song) return;
  const [note, beats] = _song.melody[_mi % _song.melody.length];
  const dur = beats * 60 / _song.tempo;
  _osc(_N[note], dur * 0.82, { type: 'square', vol: 0.042 });
  _mi++;
  _melodyTimer = setTimeout(_tickMelody, dur * 1000);
}

function _tickBass() {
  if (!_song) return;
  const [note, beats] = _song.bass[_bi % _song.bass.length];
  const dur = beats * 60 / _song.tempo;
  _osc(_N[note], dur * 0.82, { type: 'triangle', vol: 0.065 });
  _bi++;
  _bassTimer = setTimeout(_tickBass, dur * 1000);
}

// ── SFX ───────────────────────────────────────
function sfxClick()     { _osc(880, 0.06, { vol: 0.04 }); }
function sfxBump()      { _osc(90, 0.1, { vol: 0.08 }); }
function sfxDoor()      { _osc(523, 0.07); _osc(784, 0.07, { when: 0.08 }); }
function sfxItem()      { [523,659,784,1047].forEach((f,i) => _osc(f, 0.09, { when: i*0.09, vol: 0.06 })); }
function sfxHeal()      { [392,494,587,784].forEach((f,i) => _osc(f, 0.14, { type:'triangle', when: i*0.1, vol: 0.08 })); }
function sfxHit()       { _noise(0.1, 0.07); _osc(150, 0.12, { slideTo: 60, vol: 0.09 }); }
function sfxEncounter() { _osc(1200, 0.45, { slideTo: 200, vol: 0.07 }); _osc(900, 0.45, { slideTo: 150, when: 0.06, vol: 0.05 }); }
function sfxFlee()      { _osc(300, 0.3, { slideTo: 1200, vol: 0.06 }); }
function sfxLevelUp()   { [523,659,784,1047,1319].forEach((f,i) => _osc(f, 0.1, { when: i*0.08, vol: 0.06 })); }
function sfxEvolve()    { [392,523,659,784,1047,784,1047,1319].forEach((f,i) => _osc(f, 0.14, { when: i*0.12, vol: 0.07 })); }
function sfxVictory() {
  [[392,0],[523,.12],[659,.24],[784,.36]].forEach(([f,w]) => _osc(f, 0.12, { when: w, vol: 0.07 }));
  _osc(784,.5,{when:.52,vol:.07}); _osc(659,.5,{when:.52,vol:.05}); _osc(523,.5,{when:.52,type:'triangle',vol:.06});
}
function sfxDefeat()    { [330,311,294,262].forEach((f,i) => _osc(f, 0.3, { type:'triangle', when: i*0.28, vol: 0.08 })); }

// ── Mute ──────────────────────────────────────
function toggleMute() {
  _muted = !_muted;
  try { localStorage.setItem('metamorfosis-muted', _muted ? '1' : '0'); } catch (e) {}
  if (_muted) stopMusic();
  document.querySelectorAll('.mute-btn').forEach(b => b.textContent = _muted ? '🔇' : '🔊');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mute-btn').forEach(b => b.textContent = _muted ? '🔇' : '🔊');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && !b.classList.contains('btn-action') && !b.classList.contains('dpad-btn') && !b.classList.contains('mute-btn'))
      sfxClick();
  }, true);
});
