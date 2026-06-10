// ═══════════════════════════════════════════════
//  SISTEMA DE COMBATE
// ═══════════════════════════════════════════════

let combatState = null;

function startCombat(enemy, biome) {
  const e = JSON.parse(JSON.stringify(enemy));
  e.currentHp = e.hp;
  e.statusEffects = [];

  combatState = {
    enemy: e,
    biome,
    turnCount: 0,
    playerStunned: false,
    enemyStunned: false,
    playerBlind: false,
    enemyBlind: false,
    enemySlowed: false,
    enemyTrapped: false,
    playerPoisoned: false,
    enemyPoisoned: 0,
    enemyPoisonDmg: 0,
    enemySpawnedAllies: 0,
    summoned: null,
  };

  showScreen('screen-combat');
  renderCombat();
  logClear();
  addLog(`💥 ¡Un ${e.name} ${e.emoji} apareció!`, 'system');
}

function renderCombat() {
  if (!combatState) return;
  const { enemy } = combatState;
  const p = window.player;

  // Enemy side
  document.getElementById('enemy-sprite').innerHTML = enemy.emoji;
  document.getElementById('enemy-name').textContent = `${enemy.name} ${enemy.isBoss ? '⭐' : ''}`;
  updateBar('bar-enemy-hp', 'txt-enemy-hp', enemy.currentHp, enemy.hp);

  // Player side
  document.getElementById('player-sprite').innerHTML = p.currentEmoji;
  document.getElementById('player-combat-name').textContent = p.currentName;
  updateBar('bar-player-hp', 'txt-player-combat-hp', p.stats.hp, p.stats.maxHp);

  // Skills
  const s = p.skills;
  const btn1 = document.getElementById('btn-skill1');
  const btn2 = document.getElementById('btn-skill2');
  btn1.textContent = s[0] ? `${s[0].name} (CD:${s[0].currentCD})` : '';
  btn1.disabled = !s[0] || s[0].currentCD > 0;
  btn2.textContent = s[1] ? `${s[1].name} (CD:${s[1].currentCD})` : '';
  btn2.disabled = !s[1] || s[1].currentCD > 0;

  // Status effects
  const playerStatusEl = document.getElementById('player-status');
  const effects = [];
  if (combatState.playerStunned) effects.push('😵 Aturdido');
  if (combatState.playerPoisoned) effects.push('☠️ Envenenado');
  if (combatState.playerBlind) effects.push('👁️ Cegado');
  playerStatusEl.textContent = effects.join(' ');

  const enemyStatusEl = document.getElementById('enemy-status');
  const eEffects = [];
  if (combatState.enemyStunned) eEffects.push('😵');
  if (combatState.enemyPoisoned > 0) eEffects.push('☠️');
  if (combatState.enemyBlind) eEffects.push('🙈 Cegado');
  if (combatState.enemySlowed) eEffects.push('🐌 Lento');
  if (combatState.enemyTrapped) eEffects.push('🕸️ Atrapado');
  enemyStatusEl.textContent = eEffects.join(' ');
}

function updateBar(barId, textId, current, max) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const bar = document.getElementById(barId);
  bar.style.width = pct + '%';
  bar.className = 'bar-inner hp' + (pct < 25 ? ' critical' : pct < 50 ? ' low' : '');
  if (textId) document.getElementById(textId).textContent = `${Math.max(0, Math.floor(current))}/${Math.floor(max)}`;
}

function addLog(msg, type = 'normal') {
  const log = document.getElementById('log-entries');
  const div = document.createElement('div');
  div.className = `log-entry log-${type}`;
  div.textContent = msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function logClear() {
  document.getElementById('log-entries').innerHTML = '';
}

function calcDamage(atk, def, crit = false) {
  const base = Math.max(1, atk - Math.floor(def * 0.6));
  const variance = 0.85 + Math.random() * 0.3;
  const dmg = Math.floor(base * variance * (crit ? 2 : 1));
  return Math.max(1, dmg);
}

function rollCrit(evoLevel) {
  const critChance = evoLevel >= 3 ? 0.35 : evoLevel >= 2 ? 0.25 : 0.15;
  return Math.random() < critChance;
}

async function playerAction(action) {
  if (!combatState) return;
  disableActions(true);

  const p = window.player;
  const { enemy } = combatState;

  // Tick player cooldowns
  p.skills.forEach(s => { if (s.currentCD > 0) s.currentCD--; });

  if (action === 'flee') {
    const fleeChance = p.char.id === 'dragonfly' ? 1 : 0.5;
    if (Math.random() < fleeChance) {
      addLog('💨 Huiste exitosamente.', 'system');
      await delay(800);
      endCombat(false, true);
      return;
    } else {
      addLog('❌ ¡No pudiste huir!', 'player');
    }
  } else if (action === 'item') {
    const usable = p.inventory.filter(i => {
      const def = ITEMS[i];
      return def && (def.effect === 'heal' || def.effect === 'blind' || def.effect === 'poison_item');
    });
    if (usable.length === 0) {
      addLog('🎒 No tienes items usables en combate.', 'system');
      disableActions(false);
      return;
    }
    const item = usable[0];
    const def = ITEMS[item];
    if (def.effect === 'heal') {
      const healed = Math.min(def.value, p.stats.maxHp - p.stats.hp);
      p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + def.value);
      addLog(`🍃 Usaste ${item}: recuperas ${healed} HP.`, 'player');
      removeFromInventory(item);
    } else if (def.effect === 'blind') {
      combatState.enemyBlind = true;
      combatState.enemyBlindTurns = 2;
      addLog(`✨ Usaste ${item}: ¡${enemy.name} está cegado!`, 'player');
      removeFromInventory(item);
    } else if (def.effect === 'poison_item') {
      combatState.enemyPoisoned = 3;
      combatState.enemyPoisonDmg = Math.floor(enemy.hp * 0.25);
      addLog(`☠️ Usaste ${item}: ¡veneno masivo en ${enemy.name}!`, 'player');
      removeFromInventory(item);
    }
  } else if (action === 'attack') {
    await doPlayerAttack();
  } else if (action === 'skill1') {
    await useSkill(0);
  } else if (action === 'skill2') {
    await useSkill(1);
  }

  if (enemy.currentHp <= 0) { await endCombat(true); return; }

  // Enemy turn
  await delay(600);
  await enemyTurn();

  if (p.stats.hp <= 0) { await endCombat(false); return; }

  combatState.turnCount++;
  renderCombat();
  disableActions(false);
}

async function doPlayerAttack(multiplier = 1, ignoreDefense = false) {
  const p = window.player;
  const { enemy } = combatState;
  if (combatState.playerBlind && Math.random() < 0.7) {
    addLog('👁️ ¡Fallaste por estar cegado!', 'player');
    return 0;
  }
  const crit = p.char.id === 'mantis' ? Math.random() < 0.25 : rollCrit(p.evoIndex);
  const def = ignoreDefense ? 0 : enemy.def;
  const dmg = Math.floor(calcDamage(p.stats.atk, def) * multiplier);
  enemy.currentHp -= dmg;

  const critTxt = crit ? ' ⚡CRÍTICO!' : '';
  addLog(`⚔️ Atacas a ${enemy.name} por ${dmg} de daño.${critTxt}`, 'player');

  // Passive: venom on attack
  if (p.passives && p.passives.includes('venom_atk') && !combatState.enemyPoisoned) {
    if (Math.random() < 0.25) {
      combatState.enemyPoisoned = 3;
      combatState.enemyPoisonDmg = 8;
      addLog('☠️ Tu ataque envenenó al enemigo.', 'player');
    }
  }

  animateHit('enemy-sprite');
  await delay(400);
  renderCombat();
  return dmg;
}

async function useSkill(idx) {
  const p = window.player;
  const skill = p.skills[idx];
  if (!skill || skill.currentCD > 0) return;
  skill.currentCD = skill.cooldown;

  const { enemy } = combatState;

  if (skill.id === 'acid') {
    combatState.enemyDefReduced = true;
    combatState.enemyDefReducedTurns = 3;
    combatState.enemyDefMult = 0.7;
    addLog(`🧪 Lanzas Ácido Fórmico: DEF de ${enemy.name} reducida 30% por 3 turnos.`, 'player');

  } else if (skill.id === 'swarm') {
    const swarmDmg = Math.floor(p.stats.atk * 0.6);
    for (let i = 0; i < 2; i++) {
      enemy.currentHp -= swarmDmg;
      addLog(`🐜 Hormiga aliada ataca por ${swarmDmg}!`, 'player');
      await delay(300);
    }
    combatState.summoned = { turns: 2, dmg: swarmDmg };
    renderCombat();

  } else if (skill.id === 'charge') {
    const dmg = await doPlayerAttack(3);
    combatState.playerStunned = true;
    combatState.playerStunnedTurns = 1;
    addLog('💥 ¡Embestida! Quedas aturdido 1 turno.', 'player');

  } else if (skill.id === 'regen') {
    combatState.playerRegen = true;
    combatState.playerRegenTurns = 3;
    combatState.playerRegenAmt = 15;
    addLog('🛡️ Coraza Dura: DEF +50% y regeneración 15 HP/turno por 3 turnos.', 'player');

  } else if (skill.id === 'lightning') {
    addLog('⚡ ¡Golpe Relámpago!', 'player');
    for (let i = 0; i < 2; i++) {
      const crit = Math.random() < 0.35;
      const dmg = calcDamage(p.stats.atk, enemy.def) * (crit ? 2 : 1);
      enemy.currentHp -= dmg;
      addLog(`  → Golpe ${i+1}: ${Math.floor(dmg)}${crit ? ' CRÍTICO!' : ''}`, 'player');
      await delay(300);
    }
    renderCombat();

  } else if (skill.id === 'deathblow') {
    const hpPct = enemy.currentHp / enemy.hp;
    if (hpPct < 0.30) {
      const dmg = Math.floor(p.stats.atk * 3.5);
      enemy.currentHp -= dmg;
      addLog(`💀 ¡MANDÍBULA FATAL! ${dmg} de daño devastador.`, 'player');
      animateHit('enemy-sprite');
    } else {
      const dmg = calcDamage(p.stats.atk, enemy.def);
      enemy.currentHp -= dmg;
      addLog(`💀 Mandíbula Fatal: el enemigo tiene más de 30% HP. Daño normal: ${dmg}.`, 'player');
    }
    renderCombat();

  } else if (skill.id === 'dive') {
    const dmg = Math.floor(p.stats.spd * 1.5);
    enemy.currentHp -= dmg;
    addLog(`🌀 ¡Picada Aérea! Ignoras la defensa: ${dmg} de daño puro.`, 'player');
    animateHit('enemy-sprite');
    renderCombat();

  } else if (skill.id === 'wind') {
    const dmg = calcDamage(p.stats.atk, enemy.def * 0.5);
    enemy.currentHp -= dmg;
    combatState.enemySlowed = true;
    combatState.enemySlowedTurns = 2;
    addLog(`💨 Viento Cortante: ${dmg} daño y ${enemy.name} pierde velocidad.`, 'player');
    renderCombat();

  } else if (skill.id === 'web') {
    combatState.enemyTrapped = true;
    combatState.enemyTrappedTurns = 1 + (Math.random() < 0.5 ? 1 : 0);
    addLog(`🕸️ ¡Tela Trampa! ${enemy.name} queda paralizado ${combatState.enemyTrappedTurns} turno(s).`, 'player');

  } else if (skill.id === 'poison') {
    combatState.enemyPoisoned = 4;
    combatState.enemyPoisonDmg = Math.floor(enemy.hp * 0.15);
    addLog(`☠️ Veneno Mortal aplicado a ${enemy.name}: ${combatState.enemyPoisonDmg} HP/turno por 4 turnos.`, 'player');
  }

  await delay(400);
  renderCombat();
}

async function enemyTurn() {
  const p = window.player;
  const { enemy } = combatState;

  // Apply poison to enemy
  if (combatState.enemyPoisoned > 0) {
    enemy.currentHp -= combatState.enemyPoisonDmg;
    addLog(`☠️ ${enemy.name} sufre ${combatState.enemyPoisonDmg} de daño por veneno.`, 'enemy');
    combatState.enemyPoisoned--;
    if (combatState.enemyPoisoned === 0) addLog(`☠️ El veneno en ${enemy.name} se disipó.`, 'system');
    renderCombat();
    if (enemy.currentHp <= 0) return;
    await delay(400);
  }

  // Tick enemy status
  if (combatState.enemyDefReducedTurns > 0) { combatState.enemyDefReducedTurns--; if (!combatState.enemyDefReducedTurns) combatState.enemyDefMult = 1; }
  if (combatState.enemySlowedTurns > 0) { combatState.enemySlowedTurns--; if (!combatState.enemySlowedTurns) combatState.enemySlowed = false; }
  if (combatState.enemyBlindTurns > 0) { combatState.enemyBlindTurns--; if (!combatState.enemyBlindTurns) combatState.enemyBlind = false; }

  // Enemy trapped — skip attack
  if (combatState.enemyTrapped) {
    combatState.enemyTrappedTurns--;
    if (combatState.enemyTrappedTurns <= 0) combatState.enemyTrapped = false;
    addLog(`🕸️ ${enemy.name} está atrapado y no puede atacar.`, 'system');
    await delay(400);
    return;
  }

  // Player regen
  if (combatState.playerRegen) {
    p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + combatState.playerRegenAmt);
    addLog(`🛡️ Regeneras ${combatState.playerRegenAmt} HP.`, 'player');
    combatState.playerRegenTurns--;
    if (!combatState.playerRegenTurns) combatState.playerRegen = false;
    renderCombat();
  }

  // Player stunned — skip defense? No, just means player was stunned after charge (handled)
  if (combatState.playerStunned) {
    combatState.playerStunnedTurns--;
    if (!combatState.playerStunnedTurns) combatState.playerStunned = false;
  }

  // Summoned allies
  if (combatState.summoned) {
    enemy.currentHp -= combatState.summoned.dmg;
    addLog(`🐜 Hormiga aliada ataca a ${enemy.name} por ${combatState.summoned.dmg}!`, 'player');
    combatState.summoned.turns--;
    if (!combatState.summoned.turns) combatState.summoned = null;
    renderCombat();
    if (enemy.currentHp <= 0) return;
    await delay(300);
  }

  // Enemy attack
  let attackSkill = null;
  if (enemy.skills && enemy.skills.length > 0 && Math.random() < 0.4) {
    attackSkill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
  }

  if (combatState.enemyBlind && Math.random() < 0.7) {
    addLog(`🙈 ${enemy.name} falla por estar cegado.`, 'enemy');
    return;
  }

  const evasionRoll = Math.random() * 100 < p.stats.eva;
  if (evasionRoll) {
    addLog(`💨 ¡Esquivas el ataque de ${enemy.name}!`, 'player');
    return;
  }

  let playerDef = p.stats.def;
  if (combatState.playerRegen) playerDef = Math.floor(playerDef * 1.5);

  if (attackSkill) {
    await applyEnemySkill(attackSkill, enemy, p, playerDef);
  } else {
    const dmg = calcDamage(enemy.atk, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - dmg);
    addLog(`💥 ${enemy.name} te ataca por ${dmg} de daño.`, 'enemy');
    animateHit('player-sprite');
    renderCombat();
  }
  await delay(400);
}

async function applyEnemySkill(skill, enemy, p, playerDef) {
  if (skill.effect === 'poison' && Math.random() < skill.chance) {
    const poisonDmg = calcDamage(enemy.atk, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - poisonDmg);
    combatState.playerPoisoned = true;
    combatState.playerPoisonTurns = 3;
    combatState.playerPoisonDmg = Math.floor(p.stats.maxHp * 0.08);
    addLog(`☠️ ${enemy.name} te envenena con ${skill.name}! ${poisonDmg} daño + veneno.`, 'enemy');
  } else if (skill.effect === 'stun' && Math.random() < skill.chance) {
    const dmg = calcDamage(enemy.atk, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - dmg);
    combatState.playerStunned = true;
    combatState.playerStunnedTurns = 1;
    addLog(`😵 ${enemy.name} te aturde con ${skill.name}! ${dmg} daño.`, 'enemy');
  } else if (skill.effect === 'heavy') {
    const dmg = calcDamage(enemy.atk * 2, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - dmg);
    addLog(`💥 ¡GOLPE PESADO de ${enemy.name}: ${dmg} daño!`, 'enemy');
  } else if (skill.effect === 'dodge') {
    addLog(`${enemy.name} usa ${skill.name} y se prepara.`, 'enemy');
  } else if (skill.effect === 'drain') {
    const dmg = calcDamage(enemy.atk, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - dmg);
    enemy.currentHp = Math.min(enemy.hp, enemy.currentHp + Math.floor(dmg * 0.5));
    addLog(`🌀 ${enemy.name} te drena ${dmg} HP y se cura la mitad.`, 'enemy');
    renderCombat();
  } else if (skill.effect === 'fear' && Math.random() < skill.chance) {
    combatState.playerBlind = true;
    combatState.playerBlindTurns = 2;
    addLog(`😱 ¡${enemy.name} ruge con ${skill.name}! Quedas aterrado 2 turnos.`, 'enemy');
  } else if (skill.effect === 'summon') {
    const dmg = calcDamage(enemy.atk * 0.5, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - dmg);
    addLog(`${enemy.name} llama refuerzos: ${dmg} daño adicional.`, 'enemy');
  } else if (skill.effect === 'trap' && Math.random() < skill.chance) {
    combatState.playerStunned = true;
    combatState.playerStunnedTurns = 1;
    const dmg = calcDamage(enemy.atk, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - dmg);
    addLog(`🕸️ ${enemy.name} te atrapa: ${dmg} daño y pierdes 1 turno.`, 'enemy');
  } else {
    const dmg = calcDamage(enemy.atk, playerDef);
    p.stats.hp = Math.max(0, p.stats.hp - dmg);
    addLog(`💥 ${enemy.name} te ataca por ${dmg} de daño.`, 'enemy');
  }
  animateHit('player-sprite');
  renderCombat();
}

async function endCombat(victory, fled = false) {
  const e = window._lastEnemy;
  combatState = null;
  const p = window.player;

  if (fled) {
    await delay(500);
    showScreen('screen-world');
    refreshWorldHUD();
    return;
  }

  if (victory && e) {
    p.gold = (p.gold || 0) + e.gold;
    addLog(`✅ ¡Venciste a ${e.name}!`, 'system');
    addLog(`+${e.xp} XP | +${e.gold} 🪙 Oro`, 'system');

    if (e.loot && e.loot.length > 0) {
      e.loot.forEach(item => {
        p.inventory.push(item);
        addLog(`🎁 Obtuviste: ${item}`, 'system');
        applyPermanentItem(item);
      });
    }

    await delay(1000);
    const leveled = gainXP(e.xp);

    if (e.isFinalBoss) {
      await delay(1000);
      showEndScreen(true);
      return;
    }

    await delay(1200);
    if (leveled) return;
    showScreen('screen-world');
    refreshWorldHUD();
  } else if (!victory) {
    await delay(800);
    showEndScreen(false);
  }
}

function animateHit(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 400);
}

function disableActions(disabled) {
  document.querySelectorAll('.btn-action').forEach(b => b.disabled = disabled);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
