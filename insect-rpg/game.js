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

  document.getElementById('detail-sprite').textContent = char.emoji;
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
  initBiomeGrid();
  showScreen('screen-world');
  refreshWorldHUD();
}

// ─── WORLD HUD ────────────────────────────────
function refreshWorldHUD() {
  const p = window.player;
  if (!p) return;
  document.getElementById('hud-sprite').textContent = p.currentEmoji;
  document.getElementById('hud-name').textContent = p.currentName;
  document.getElementById('hud-evo').textContent = `Etapa ${p.evoIndex + 1}/4`;
  document.getElementById('hud-level').textContent = p.level;
  updateBar('bar-hp', 'txt-hp', p.stats.hp, p.stats.maxHp);
  const xpPct = (p.xp / p.xpToNext) * 100;
  document.getElementById('bar-xp').style.width = xpPct + '%';
  document.getElementById('txt-xp').textContent = `${p.xp}/${p.xpToNext}`;
}

// ─── BIOME GRID ───────────────────────────────
function initBiomeGrid() {
  const grid = document.getElementById('biome-grid');
  grid.innerHTML = '';
  BIOMES.forEach(biome => {
    const card = document.createElement('div');
    card.className = 'biome-card';
    card.id = `biome-${biome.id}`;
    card.style.setProperty('--biome-color', biome.color);
    card.innerHTML = `
      <div class="biome-emoji">${biome.emoji}</div>
      <div class="biome-name">${biome.name}</div>
      <div class="biome-desc">${biome.desc}</div>
      <div class="biome-req">Nivel mín: ${biome.minLevel}</div>
    `;
    card.onclick = () => enterBiome(biome);
    grid.appendChild(card);
  });
  updateBiomeLocks();
}

function updateBiomeLocks() {
  const p = window.player;
  BIOMES.forEach(biome => {
    const card = document.getElementById(`biome-${biome.id}`);
    if (!card) return;
    const locked = p.level < biome.minLevel;
    card.classList.toggle('locked', locked);
    card.querySelector('.biome-req').textContent = locked
      ? `🔒 Requiere Nivel ${biome.minLevel}`
      : `✅ Disponible (Nv. ${biome.minLevel}+)`;
  });
}

function enterBiome(biome) {
  const p = window.player;
  if (p.level < biome.minLevel) {
    alert(`Necesitas nivel ${biome.minLevel} para entrar al ${biome.name}.`);
    return;
  }
  // Scale enemies slightly with player level
  const enemies = biome.enemies;
  const enemy = enemies[Math.floor(Math.random() * enemies.length)];
  const scaledEnemy = scaleEnemy(enemy, p.level);
  window._lastEnemy = scaledEnemy;
  window._lastBiome = biome;
  startCombat(scaledEnemy, biome);
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
    updateBiomeLocks();

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

  document.getElementById('evo-before').textContent = before.emoji;
  document.getElementById('evo-after').textContent = evo.emoji;
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
  document.getElementById('screen-select').addEventListener('click', () => {});
});
