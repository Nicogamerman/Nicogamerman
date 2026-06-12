// ═══════════════════════════════════════════════
//  GAME CORE — init, screens, XP, evolution, HUD
// ═══════════════════════════════════════════════

window.player = null;

// ─── Screen management ───────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-select') _startSelectLoop();
  else if (id !== 'screen-select') _stopSelectLoop();
}

// ─── CHARACTER SELECT ────────────────────────
let _selectTick = 0;
let _selectRaf = null;
const _cardCanvases = [];

function _startSelectLoop() {
  if (_selectRaf) return;
  const loop = () => {
    _selectTick++;
    _cardCanvases.forEach(({ canvas, charId }) => {
      if (!canvas.isConnected) return;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (typeof drawSprite === 'function') {
        drawSprite(ctx, charId, canvas.width / 2, canvas.height / 2, 3, _selectTick);
      }
    });
    _selectRaf = requestAnimationFrame(loop);
  };
  _selectRaf = requestAnimationFrame(loop);
}

function _stopSelectLoop() {
  if (_selectRaf) cancelAnimationFrame(_selectRaf);
  _selectRaf = null;
}

function initCharSelect() {
  const grid = document.getElementById('char-cards');
  grid.innerHTML = '';
  _cardCanvases.length = 0;
  CHARACTERS.forEach(char => {
    const card = document.createElement('div');
    card.className = 'char-card';

    const canvas = document.createElement('canvas');
    canvas.width = 48; canvas.height = 48;
    canvas.className = 'card-sprite';
    _cardCanvases.push({ canvas, charId: char.id });

    const nameEl = document.createElement('div');
    nameEl.className = 'card-name';
    nameEl.textContent = char.name;

    const hintEl = document.createElement('div');
    hintEl.className = 'card-hint';
    hintEl.textContent = 'Click para ver detalles';

    card.appendChild(canvas);
    card.appendChild(nameEl);
    card.appendChild(hintEl);
    card.onclick = () => showCharDetail(char, card);
    grid.appendChild(card);
  });
  _startSelectLoop();
}

function showCharDetail(char, cardEl) {
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
  if (cardEl) cardEl.classList.add('selected');

  const detail = document.getElementById('char-detail');
  detail.classList.remove('hidden');

  const spriteDiv = document.getElementById('detail-sprite');
  const dCanvas = document.createElement('canvas');
  dCanvas.width = 96; dCanvas.height = 96;
  dCanvas.style.imageRendering = 'pixelated';
  spriteDiv.innerHTML = '';
  spriteDiv.appendChild(dCanvas);
  if (typeof drawSprite === 'function') {
    const ctx = dCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawSprite(ctx, char.id, 48, 48, 6, 0);
  }
  document.getElementById('detail-name').textContent = char.name;
  document.getElementById('detail-lore').textContent = char.lore;

  const stats = char.baseStats;
  const bars = document.getElementById('detail-bars');
  bars.innerHTML = [
    ['❤️ HP',  stats.hp,  130],
    ['⚔️ ATK', stats.atk, 30],
    ['🛡️ DEF', stats.def, 30],
    ['💨 VEL', stats.spd, 30],
    ['👁️ EVA', stats.eva, 30],
  ].map(([label, val, max]) => `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-bar-outer">
        <div class="stat-bar-inner" style="width:${(val/max)*100}%"></div>
      </div>
      <span class="stat-val">${val}</span>
    </div>
  `).join('');

  const pros = document.getElementById('detail-pros');
  pros.innerHTML = `<strong>✅ Fortalezas</strong>` + char.pros.map(p => `<div>• ${p}</div>`).join('');

  const cons = document.getElementById('detail-cons');
  cons.innerHTML = `<strong>❌ Debilidades</strong>` + char.cons.map(c => `<div>• ${c}</div>`).join('');

  const evoChain = document.getElementById('detail-evos');
  evoChain.innerHTML = '<strong>Evoluciones:</strong><div class="evo-list">' +
    char.evolutions.map(e => `<span title="Nv.${e.level}">${e.emoji} ${e.name}</span>`).join(' → ') +
    '</div>';

  document.getElementById('btn-select-char').onclick = () => startGame(char);
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── GAME START ───────────────────────────────
function startGame(char) {
  _stopSelectLoop();
  const base = JSON.parse(JSON.stringify(char.baseStats));
  window.player = {
    char,
    stats: { ...base },
    level: 1,
    xp: 0,
    xpToNext: 40,
    evoIndex: 0,
    currentName: char.evolutions[0].name,
    currentEmoji: char.evolutions[0].emoji,
    skills: JSON.parse(JSON.stringify(char.skills)),
    inventory: [],
    passives: [],
    gold: 0,
  };
  initWorld();
  showScreen('screen-world');
  refreshWorldHUD();
  playMusic('world');
}

// ─── WORLD HUD ────────────────────────────────
function refreshWorldHUD() {
  const p = window.player;
  if (!p) return;
  document.getElementById('hud-sprite').innerHTML = p.currentEmoji;
  document.getElementById('hud-name').textContent = p.currentName;
  document.getElementById('hud-evo').textContent = `Etapa ${p.evoIndex + 1}/4`;
  document.getElementById('hud-level').textContent = p.level;
  updateBar('bar-hp', 'txt-hp', p.stats.hp, p.stats.maxHp);
  const xpPct = (p.xp / p.xpToNext) * 100;
  document.getElementById('bar-xp').style.width = xpPct + '%';
  document.getElementById('txt-xp').textContent = `${p.xp}/${p.xpToNext}`;
  renderMap();
}

// ─── MOTOR DE MAPA TOP-DOWN (canvas) ─────────
let worldState = null;
const ENCOUNTER_RATE = 0.16;

// Tamaño lógico del canvas (Game Boy: 160×144 → usamos 9×9 tiles de 32px)
const TS = 32;   // tile size en píxeles
const VW = 9;    // tiles visibles ancho
const VH = 9;    // tiles visibles alto

// Paletas pixel-art por bioma
const PAL = {
  garden: { g1:'#98d058', g2:'#88c048', grs:'#3a6818', grl:'#5a9828',
            w1:'#1e4a0e', w2:'#132e08', tr:'#7a5030', ca:'#2a5010', cl:'#4a8020',
            wa:'#2898f8', wl:'#78c8ff', boss:'#c02020', door:'#181818' },
  forest: { g1:'#70a838', g2:'#609028', grs:'#244010', grl:'#406828',
            w1:'#122808', w2:'#091404', tr:'#604828', ca:'#1e3808', cl:'#365818',
            wa:'#1868e0', wl:'#68b0f8', boss:'#c02020', door:'#101010' },
  cave:   { g1:'#b0a890', g2:'#a09880', grs:'#504030', grl:'#706050',
            w1:'#302820', w2:'#181410', tr:'#483828', ca:'#281e14', cl:'#483828',
            wa:'#2848a0', wl:'#6088d8', boss:'#c02020', door:'#181818' },
  swamp:  { g1:'#789050', g2:'#687840', grs:'#243018', grl:'#405830',
            w1:'#182810', w2:'#0c1408', tr:'#384a28', ca:'#1c2e10', cl:'#304820',
            wa:'#1a6070', wl:'#3a98a8', boss:'#c02020', door:'#101818' },
};

// Colores del sprite del jugador por personaje
const CHAR_COL = {
  ant:       ['#d02020','#800808'],
  beetle:    ['#3848a0','#1c2460'],
  mantis:    ['#289040','#144820'],
  dragonfly: ['#1878d8','#0c3c80'],
  spider:    ['#181818','#000000'],
};

let _raf = null;
let _tick = 0;

function _startMapLoop() {
  if (_raf) return;
  function loop() {
    _tick++;
    if (worldState && window.player &&
        document.getElementById('screen-world').classList.contains('active')) {
      _drawCanvas();
    }
    _raf = requestAnimationFrame(loop);
  }
  _raf = requestAnimationFrame(loop);
}

function _stopMapLoop() {
  if (_raf) cancelAnimationFrame(_raf);
  _raf = null;
}

// ── Dibujado de tiles ─────────────────────────
function _tile(ctx, t, dx, dy, pal, isPlayer) {
  const S = TS, cx = dx + S/2|0, cy = dy + S/2|0;
  const blink = (_tick >> 3) & 1;    // alterna cada 8 frames
  const blink2 = (_tick >> 4) & 1;

  // Suelo base con tablero sutil
  ctx.fillStyle = (((dx/S|0) + (dy/S|0)) & 1) ? pal.g1 : pal.g2;
  ctx.fillRect(dx, dy, S, S);

  switch (t) {
    case '#': // Árbol/muro
      ctx.fillStyle = pal.w1;
      ctx.fillRect(dx, dy, S, S);
      ctx.fillStyle = pal.ca;
      ctx.fillRect(dx+2, dy+2, S-4, S-10);
      ctx.fillStyle = pal.cl;
      ctx.fillRect(dx+5, dy+4, 8, 7);
      ctx.fillStyle = pal.tr;
      ctx.fillRect(cx-3, dy+S-10, 6, 10);
      ctx.fillStyle = pal.w2;
      ctx.fillRect(dx, dy, S, 2); ctx.fillRect(dx, dy, 2, S);
      break;

    case ',': // Hierba alta
      ctx.fillStyle = pal.grs;
      ctx.fillRect(dx, dy, S, S);
      ctx.fillStyle = pal.grl;
      for (let i = 3; i < S-2; i += 5) {
        const h = (S>>1) + ((_tick + i*3) >> 5 & 1);
        ctx.fillRect(dx+i, dy+S-h-2, 2, h);
      }
      break;

    case '~': // Agua
      ctx.fillStyle = pal.wa;
      ctx.fillRect(dx, dy, S, S);
      ctx.fillStyle = pal.wl;
      for (let r = 0; r < 4; r++) {
        const ry = dy + ((_tick*2 + r*8) & (S-1));
        ctx.fillRect(dx+2, ry, S-4, 2);
      }
      break;

    case 'I': // Cofre de ítem
      ctx.fillStyle = '#805000';
      ctx.fillRect(cx-8, cy-2, 16, 11);
      ctx.fillStyle = '#f0b000';
      ctx.fillRect(cx-7, cy-6, 14, 9);
      ctx.fillStyle = '#ffd840';
      ctx.fillRect(cx-5, cy-5, 6, 5);
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx-2, cy, 4, 4);
      if (blink) { // destello
        ctx.fillStyle = '#fff8';
        ctx.fillRect(cx-10, cy-10, 3, 3);
        ctx.fillRect(cx+7,  cy-8,  3, 3);
      }
      break;

    case 'H': // Flor curativa
      ctx.fillStyle = '#208020'; ctx.fillRect(cx-1, cy, 2, 12);
      ctx.fillStyle = '#f870c0';
      ctx.fillRect(cx-8, cy-4, 6, 6); ctx.fillRect(cx+2, cy-4, 6, 6);
      ctx.fillRect(cx-3, cy-10, 6, 6); ctx.fillRect(cx-3, cy+2, 6, 6);
      ctx.fillStyle = '#f8e000'; ctx.fillRect(cx-4, cy-4, 8, 8);
      ctx.fillStyle = '#f8a000'; ctx.fillRect(cx-2, cy-2, 4, 4);
      break;

    case 'B': // Jefe
      ctx.fillStyle = blink ? '#b81818' : '#601010';
      ctx.fillRect(cx-9, cy-9, 18, 18);
      ctx.fillStyle = blink2 ? '#f8f000' : '#c0a000';
      ctx.fillRect(cx-6, cy-3, 4, 4); ctx.fillRect(cx+2, cy-3, 4, 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx-5, cy+3, 3, 3); ctx.fillRect(cx-1, cy+3, 3, 3); ctx.fillRect(cx+3, cy+3, 3, 3);
      // aura
      ctx.fillStyle = `rgba(200,0,0,${blink ? .25 : .08})`;
      ctx.fillRect(cx-12, cy-12, 24, 24);
      break;

    case '>': case '<': // Puerta
      ctx.fillStyle = pal.door;
      ctx.fillRect(dx, dy, S, S);
      ctx.fillStyle = '#f8f890';
      // Flecha manual pixel a pixel
      if (t === '>') {
        ctx.fillRect(cx-6, cy-1, 10, 3);
        ctx.fillRect(cx+1, cy-4, 3, 9);
        ctx.fillRect(cx+3, cy-6, 3, 3);
        ctx.fillRect(cx+3, cy+4, 3, 3);
      } else {
        ctx.fillRect(cx-4, cy-1, 10, 3);
        ctx.fillRect(cx-6, cy-4, 3, 9);
        ctx.fillRect(cx-8, cy-6, 3, 3);
        ctx.fillRect(cx-8, cy+4, 3, 3);
      }
      break;
  }

  // Sprite del jugador
  if (isPlayer) _drawPlayer(ctx, dx, dy);
}

function _drawPlayer(ctx, dx, dy) {
  const p = window.player;
  const S = TS, cx = dx + S/2|0, cy = dy + S/2|0;
  const [bc, sc] = CHAR_COL[p.char.id] || ['#888','#444'];
  const bob = (_tick >> 3) & 1;   // sube/baja 1px cada 8 frames

  // Sombra
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(cx-5, cy+8-bob, 10, 3);

  // Patas (detrás del cuerpo)
  ctx.fillStyle = sc;
  ctx.fillRect(cx-9, cy-1+bob, 6, 2);  // izq arriba
  ctx.fillRect(cx-9, cy+2+bob, 6, 2);  // izq abajo
  ctx.fillRect(cx+3, cy-1+bob, 6, 2);  // der arriba
  ctx.fillRect(cx+3, cy+2+bob, 6, 2);  // der abajo

  // Abdomen
  ctx.fillStyle = bc;
  ctx.fillRect(cx-4, cy-1+bob, 8, 8);
  ctx.fillStyle = sc;
  ctx.fillRect(cx-3, cy+1+bob, 6, 2);  // línea del segmento

  // Tórax + cabeza
  ctx.fillStyle = bc;
  ctx.fillRect(cx-3, cy-5+bob, 6, 6);
  ctx.fillRect(cx-2, cy-9+bob, 5, 5);

  // Ojos
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(cx-2, cy-8+bob, 2, 2);
  ctx.fillRect(cx+1, cy-8+bob, 2, 2);

  // Antenas
  ctx.fillStyle = sc;
  ctx.fillRect(cx-4, cy-13+bob, 2, 5);
  ctx.fillRect(cx+2, cy-13+bob, 2, 5);
  ctx.fillRect(cx-6, cy-14+bob, 2, 2);
  ctx.fillRect(cx+4, cy-14+bob, 2, 2);
}

function _drawCanvas() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas || !worldState) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const m = currentMap();
  const { x: px, y: py, biomeIndex } = worldState;
  const pal = PAL[BIOMES[biomeIndex].id];

  const halfW = VW >> 1, halfH = VH >> 1;
  const maxLeft = Math.max(0, m[0].length - VW);
  const maxTop  = Math.max(0, m.length - VH);
  const vpLeft = Math.min(Math.max(0, px - halfW), maxLeft);
  const vpTop  = Math.min(Math.max(0, py - halfH), maxTop);

  for (let row = 0; row < VH; row++) {
    for (let col = 0; col < VW; col++) {
      const mx = vpLeft + col, my = vpTop + row;
      const t = (my >= 0 && my < m.length && mx >= 0 && mx < m[0].length) ? m[my][mx] : '#';
      _tile(ctx, t, col * TS, row * TS, pal, mx === px && my === py);
    }
  }
}

function initWorld() {
  worldState = {
    biomeIndex: 0,
    maps: MAPS.map(m => m.map(row => row.split(''))),
    bossDefeated: BIOMES.map(() => false),
    x: 1, y: 1,
    lastMove: 0,
  };
  spawnAt('S');
  _sizeCanvas();
  _startMapLoop();
}

function currentMap() { return worldState.maps[worldState.biomeIndex]; }

function _sizeCanvas() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  canvas.width  = VW * TS;
  canvas.height = VH * TS;
}

function renderMap() {
  // Actualiza solo el banner de nombre; el canvas se redibuya via RAF
  if (!worldState) return;
  const biome = BIOMES[worldState.biomeIndex];
  const banner = document.getElementById('map-banner');
  if (banner) banner.textContent = `${biome.emoji} ${biome.name}`;
}

function spawnAt(ch) {
  const m = currentMap();
  for (let y = 0; y < m.length; y++)
    for (let x = 0; x < m[y].length; x++)
      if (m[y][x] === ch) { worldState.x = x; worldState.y = y; return; }
}

function movePlayer(dx, dy) {
  if (!worldState || !window.player) return;
  if (typeof combatState !== 'undefined' && combatState) return;
  if (!document.getElementById('screen-world').classList.contains('active')) return;

  const now = Date.now();
  if (now - worldState.lastMove < 110) return;
  worldState.lastMove = now;

  const m = currentMap();
  const nx = worldState.x + dx, ny = worldState.y + dy;
  if (ny < 0 || ny >= m.length || nx < 0 || nx >= m[0].length) return;

  const tile = m[ny][nx];
  if (tile === '#' || tile === '~') { sfxBump(); return; }

  const biome = BIOMES[worldState.biomeIndex];

  // Jefe bloqueando el paso: pelear sin moverse
  if (tile === 'B') {
    const boss = biome.enemies.find(e => e.isBoss);
    if (boss && !worldState.bossDefeated[worldState.biomeIndex]) {
      mapMessage(`¡${boss.name} bloquea el paso!`);
      startWildBattle(boss);
      return;
    }
    m[ny][nx] = '.';
  }

  // Puertas entre biomas
  if (tile === '>') {
    const next = BIOMES[worldState.biomeIndex + 1];
    if (!next) return;
    if (window.player.level < next.minLevel) {
      sfxBump();
      mapMessage(`🔒 Necesitas nivel ${next.minLevel} para ${next.name}.`);
      return;
    }
    sfxDoor();
    worldState.biomeIndex++;
    spawnAt('<');
    renderMap();
    mapMessage(`Entraste a ${next.name} ${next.emoji}`);
    return;
  }
  if (tile === '<') {
    sfxDoor();
    worldState.biomeIndex--;
    spawnAt(worldState.biomeIndex === 0 ? 'S' : '>');
    renderMap();
    mapMessage(`Volviste a ${BIOMES[worldState.biomeIndex].name}`);
    return;
  }

  worldState.x = nx;
  worldState.y = ny;

  if (tile === 'I') {
    m[ny][nx] = '.';
    const pool = MAP_ITEMS[biome.id];
    const item = pool[Math.floor(Math.random() * pool.length)];
    window.player.inventory.push(item);
    applyPermanentItem(item);
    sfxItem();
    mapMessage(`¡Encontraste ${ITEMS[item].emoji} ${item}!`);
  } else if (tile === 'H') {
    const p = window.player;
    if (p.stats.hp < p.stats.maxHp) {
      p.stats.hp = p.stats.maxHp;
      sfxHeal();
      mapMessage('🌼 Descansaste entre las flores. ¡HP restaurado!');
      refreshWorldHUD();
      return;
    }
  } else if (tile === ',') {
    if (Math.random() < ENCOUNTER_RATE) {
      const pool = biome.enemies.filter(e => !e.isBoss);
      const enemy = pool[Math.floor(Math.random() * pool.length)];
      renderMap();
      startWildBattle(enemy);
      return;
    }
  }
  renderMap();
}

function startWildBattle(enemy) {
  const scaled = scaleEnemy(enemy, window.player.level);
  window._lastEnemy = scaled;
  window._lastBiome = BIOMES[worldState.biomeIndex];
  startCombat(scaled, window._lastBiome);
}

// Llamado desde combat.js al ganar: limpia el tile del jefe
function onEnemyDefeated(e) {
  if (e.isBoss && worldState) {
    worldState.bossDefeated[worldState.biomeIndex] = true;
    const m = currentMap();
    for (let y = 0; y < m.length; y++)
      for (let x = 0; x < m[y].length; x++)
        if (m[y][x] === 'B') m[y][x] = '.';
  }
}


let _msgTimer = null;
function mapMessage(text) {
  const el = document.getElementById('map-message');
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(_msgTimer);
  _msgTimer = setTimeout(() => el.classList.add('hidden'), 2400);
}

// ─── CONTROLES ────────────────────────────────
const KEY_DIRS = {
  arrowup: [0, -1], w: [0, -1],
  arrowdown: [0, 1], s: [0, 1],
  arrowleft: [-1, 0], a: [-1, 0],
  arrowright: [1, 0], d: [1, 0],
};

function bindControls() {
  document.addEventListener('keydown', (e) => {
    const dir = KEY_DIRS[e.key.toLowerCase()];
    if (!dir) return;
    if (!document.getElementById('screen-world').classList.contains('active')) return;
    if (!document.getElementById('modal-inventory').classList.contains('hidden')) return;
    if (!document.getElementById('modal-status').classList.contains('hidden')) return;
    if (!document.getElementById('modal-worldmap').classList.contains('hidden')) return;
    e.preventDefault();
    movePlayer(dir[0], dir[1]);
  });

  document.querySelectorAll('.dpad-btn').forEach(btn => {
    const dx = +btn.dataset.dx, dy = +btn.dataset.dy;
    let iv = null;
    const start = (e) => {
      e.preventDefault();
      movePlayer(dx, dy);
      iv = setInterval(() => movePlayer(dx, dy), 160);
    };
    const stop = () => { clearInterval(iv); iv = null; };
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointerleave', stop);
    btn.addEventListener('pointercancel', stop);
  });
}

function scaleEnemy(enemy, playerLevel) {
  const e = JSON.parse(JSON.stringify(enemy));
  const scale = 1 + (playerLevel - 1) * 0.05;
  e.hp = Math.floor(e.hp * scale);
  e.atk = Math.floor(e.atk * scale);
  e.def = Math.floor(e.def * scale);
  e.xp = Math.floor(e.xp * (1 + (playerLevel - 1) * 0.1));
  return e;
}

// ─── XP & LEVELING ───────────────────────────
function gainXP(amount) {
  const p = window.player;
  p.xp += amount;
  refreshWorldHUD();

  if (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level++;
    p.xpToNext = Math.floor(40 * Math.pow(1.35, p.level - 1));

    // Stat growth per level
    p.stats.maxHp += 8;
    p.stats.hp = Math.min(p.stats.hp + 8, p.stats.maxHp);
    p.stats.atk += 2;
    p.stats.def += 1;
    p.stats.spd += 1;
    sfxLevelUp();

    refreshWorldHUD();

    // Check evolution
    const nextEvo = p.char.evolutions[p.evoIndex + 1];
    if (nextEvo && p.level >= nextEvo.level) {
      triggerEvolution(nextEvo);
      return true;
    }
  }
  return false;
}

// ─── EVOLUTION ────────────────────────────────
function triggerEvolution(evo) {
  const p = window.player;
  const before = { name: p.currentName, emoji: p.currentEmoji };

  document.getElementById('evo-before').innerHTML = before.emoji;
  document.getElementById('evo-after').innerHTML = evo.emoji;
  document.getElementById('evo-title').textContent = `¡Evolución! → ${evo.name}`;

  const bonuses = evo.bonuses;
  let bonusText = '📈 Bonificaciones de evolución:\n';
  Object.entries(bonuses).forEach(([stat, val]) => {
    bonusText += `  +${val} ${stat.toUpperCase()}\n`;
    if (stat === 'hp') { p.stats.maxHp += val; p.stats.hp += val; }
    else p.stats[stat] = (p.stats[stat] || 0) + val;
  });

  document.getElementById('evo-desc').textContent = `${before.name} se transforma en ${evo.name}.`;
  document.getElementById('evo-stat-changes').textContent = bonusText;

  p.currentName = evo.name;
  p.currentEmoji = evo.emoji;
  p.evoIndex++;

  stopMusic();
  sfxEvolve();
  showScreen('screen-evolution');
}

function finishEvolution() {
  showScreen('screen-world');
  refreshWorldHUD();
  playMusic('world');
}

// ─── INVENTORY ────────────────────────────────
function showInventory() {
  const p = window.player;
  const list = document.getElementById('inventory-list');
  if (p.inventory.length === 0) {
    list.innerHTML = '<p>Tu mochila está vacía.</p>';
  } else {
    const counts = {};
    p.inventory.forEach(i => counts[i] = (counts[i] || 0) + 1);
    list.innerHTML = Object.entries(counts).map(([name, count]) => {
      const def = ITEMS[name] || {};
      return `<div class="inv-item">
        <span>${def.emoji || '📦'} ${name}</span>
        <span class="inv-count">x${count}</span>
        <span class="inv-desc">${def.desc || ''}</span>
        ${def.effect === 'stat' || def.effect === 'stat_multi' || def.effect === 'all_stats'
          ? `<button onclick="useItemFromInventory('${name}')">Usar</button>` : ''}
      </div>`;
    }).join('');
  }
  document.getElementById('modal-inventory').classList.remove('hidden');
}

function useItemFromInventory(name) {
  const p = window.player;
  const def = ITEMS[name];
  if (!def) return;

  if (def.effect === 'heal') {
    p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + def.value);
  } else if (def.effect === 'stat') {
    p.stats[def.stat] = (p.stats[def.stat] || 0) + def.value;
    if (def.stat === 'hp') p.stats.maxHp += def.value;
  } else if (def.effect === 'stat_multi') {
    Object.entries(def.stats).forEach(([s, v]) => { p.stats[s] = (p.stats[s] || 0) + v; });
  } else if (def.effect === 'all_stats') {
    ['atk','def','spd','eva'].forEach(s => p.stats[s] += def.value);
    p.stats.maxHp += def.value * 5;
    if (def.heal) p.stats.hp = p.stats.maxHp;
  } else if (def.effect === 'passive') {
    if (!p.passives.includes(def.passive)) p.passives.push(def.passive);
  }

  removeFromInventory(name);
  refreshWorldHUD();
  showInventory();
}

function removeFromInventory(name) {
  const p = window.player;
  const idx = p.inventory.indexOf(name);
  if (idx !== -1) p.inventory.splice(idx, 1);
}

function applyPermanentItem(name) {
  // Only passive items auto-apply on pickup
  const def = ITEMS[name];
  if (!def) return;
  if (def.effect === 'passive') {
    const p = window.player;
    if (!p.passives.includes(def.passive)) p.passives.push(def.passive);
  }
}

// ─── STATUS SCREEN ────────────────────────────
function showStatus() {
  const p = window.player;
  const s = p.stats;
  document.getElementById('status-content').innerHTML = `
    <div class="status-grid">
      <div class="stat-big">${p.currentEmoji}</div>
      <div class="stat-detail">
        <div><strong>${p.currentName}</strong> — Nivel ${p.level}</div>
        <div>XP: ${p.xp}/${p.xpToNext}</div>
        <div>Etapa de evolución: ${p.evoIndex + 1}/4</div>
        <div>Oro: ${p.gold} 🪙</div>
      </div>
      <table class="stat-table">
        <tr><td>❤️ HP</td><td>${Math.floor(s.hp)}/${s.maxHp}</td></tr>
        <tr><td>⚔️ ATK</td><td>${s.atk}</td></tr>
        <tr><td>🛡️ DEF</td><td>${s.def}</td></tr>
        <tr><td>💨 VEL</td><td>${s.spd}</td></tr>
        <tr><td>👁️ EVA</td><td>${s.eva}%</td></tr>
      </table>
      <div><strong>Habilidades:</strong> ${p.skills.map(sk => sk.name).join(', ')}</div>
      <div><strong>Pasivos:</strong> ${p.passives.length ? p.passives.join(', ') : 'Ninguno'}</div>
    </div>
  `;
  document.getElementById('modal-status').classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// ─── END SCREEN ───────────────────────────────
function showEndScreen(victory) {
  const p = window.player;
  if (victory) {
    document.getElementById('end-icon').textContent = '🏆';
    document.getElementById('end-title').textContent = '¡LEYENDA DEL PANTANO!';
    document.getElementById('end-msg').textContent =
      `${p.currentName} ha derrotado al Horror del Pantano y se convirtió en el insecto más poderoso de la Tierra. Nivel ${p.level} alcanzado.`;
  } else {
    document.getElementById('end-icon').textContent = '💀';
    document.getElementById('end-title').textContent = 'CAÍDO EN BATALLA';
    document.getElementById('end-msg').textContent =
      `${p.currentName} fue derrotado. Pero cada insecto que muere alimenta la tierra para que otro nazca más fuerte.`;
  }
  showScreen('screen-end');
}

function resetGame() {
  window.player = null;
  window._lastEnemy = null;
  _stopMapLoop();
  _stopSelectLoop();
  stopMusic();
  showScreen('screen-title');
}

// ─── MAPA DEL MUNDO (resumen de progreso) ────
function showWorldMap() {
  const p = window.player;
  const content = document.getElementById('worldmap-content');
  content.innerHTML = '<div class="worldmap-list">' + BIOMES.map((b, i) => {
    const isCurrent = worldState && worldState.biomeIndex === i;
    const unlocked = p.level >= b.minLevel;
    const boss = b.enemies.find(e => e.isBoss);
    const bossDone = worldState && worldState.bossDefeated[i];
    let status;
    if (isCurrent) status = '📍 Estás aquí';
    else if (!unlocked) status = `🔒 Nivel ${b.minLevel}`;
    else status = '✅ Disponible';
    const bossTxt = boss ? (bossDone ? ` · Jefe vencido ✅` : ` · Jefe: ${boss.emoji} ${boss.name}`) : '';
    return `<div class="worldmap-row ${isCurrent ? 'current' : ''} ${unlocked ? '' : 'locked'}">
      <span class="wm-emoji">${b.emoji}</span>
      <span class="wm-name">${b.name}</span>
      <span class="wm-status">${status}${bossTxt}</span>
    </div>`;
  }).join('<div class="wm-arrow">▼</div>') + '</div>';
  document.getElementById('modal-worldmap').classList.remove('hidden');
}

// ─── BOOTSTRAP ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCharSelect();
  bindControls();
});
