// ═══════════════════════════════════════════════
//  GAME CORE — init, screens, XP, evolution, HUD
// ═══════════════════════════════════════════════

window.player = null;

// ─── Screen management ───────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── CHARACTER SELECT ────────────────────────
function initCharSelect() {
  const grid = document.getElementById('char-cards');
  grid.innerHTML = '';
  CHARACTERS.forEach(char => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.innerHTML = `
      <div class="card-emoji">${char.emoji}</div>
      <div class="card-name">${char.name}</div>
      <div class="card-hint">Click para ver detalles</div>
    `;
    card.onclick = () => showCharDetail(char, card);
    grid.appendChild(card);
  });
}

function showCharDetail(char, cardEl) {
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
  if (cardEl) cardEl.classList.add('selected');

  const detail = document.getElementById('char-detail');
  detail.classList.remove('hidden');

  document.getElementById('detail-sprite').innerHTML = char.emoji;
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

// ─── MOTOR DE MAPA TOP-DOWN ──────────────────
let worldState = null;

const TILE_EMOJI = {
  garden: { '#': '🌳', ',': '🌿', 'H': '🌼', 'I': '🎁' },
  forest: { '#': '🌲', ',': '🌿', 'H': '🌼', 'I': '🎁' },
  cave:   { '#': '🪨', ',': '🍄', 'H': '🌼', 'I': '🎁' },
  swamp:  { '#': '🌴', ',': '🌾', 'H': '🌼', 'I': '🎁', '~': '〰️' },
};

const ENCOUNTER_RATE = 0.16;

function initWorld() {
  worldState = {
    biomeIndex: 0,
    maps: MAPS.map(m => m.map(row => row.split(''))),
    bossDefeated: BIOMES.map(() => false),
    x: 1, y: 1,
    lastMove: 0,
  };
  spawnAt('S');
  renderMap();
}

function currentMap() { return worldState.maps[worldState.biomeIndex]; }

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
  if (tile === '#' || tile === '~') return;

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
      mapMessage(`🔒 Necesitas nivel ${next.minLevel} para ${next.name}.`);
      return;
    }
    worldState.biomeIndex++;
    spawnAt('<');
    renderMap();
    mapMessage(`Entraste a ${next.name} ${next.emoji}`);
    return;
  }
  if (tile === '<') {
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
    mapMessage(`¡Encontraste ${ITEMS[item].emoji} ${item}!`);
  } else if (tile === 'H') {
    const p = window.player;
    if (p.stats.hp < p.stats.maxHp) {
      p.stats.hp = p.stats.maxHp;
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

function renderMap() {
  if (!worldState || !window.player) return;
  const vp = document.getElementById('map-viewport');
  if (!vp) return;

  const m = currentMap();
  const biome = BIOMES[worldState.biomeIndex];
  const emo = TILE_EMOJI[biome.id];
  vp.className = 'map-viewport biome-' + biome.id;
  vp.style.setProperty('--cols', m[0].length);
  document.getElementById('map-banner').textContent = `${biome.emoji} ${biome.name}`;

  let html = '';
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      const t = m[y][x];
      let cls = 'tile', content = '';
      if (t === '#')      { cls += ' t-wall';  content = emo['#']; }
      else if (t === '~') { cls += ' t-water'; content = emo['~'] || ''; }
      else if (t === ',') { cls += ' t-grass'; content = emo[',']; }
      else if (t === 'I') { cls += ' t-item';  content = emo['I']; }
      else if (t === 'H') { cls += ' t-heal';  content = emo['H']; }
      else if (t === 'B') { cls += ' t-boss';  content = (biome.enemies.find(e => e.isBoss) || {}).emoji || '❓'; }
      else if (t === '>') { cls += ' t-door';  content = '▶'; }
      else if (t === '<') { cls += ' t-door';  content = '◀'; }
      else                { cls += ' t-ground'; }

      const isPlayer = (x === worldState.x && y === worldState.y);
      html += `<div class="${cls}">${content}${isPlayer ? `<span class="map-player">${window.player.currentEmoji}</span>` : ''}</div>`;
    }
  }
  vp.innerHTML = html;
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

  showScreen('screen-evolution');
}

function finishEvolution() {
  showScreen('screen-world');
  refreshWorldHUD();
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
  showScreen('screen-title');
}

// ─── BOOTSTRAP ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCharSelect();
  bindControls();
});
