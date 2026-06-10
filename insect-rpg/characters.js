// ═══════════════════════════════════════════════
//  DEFINICIÓN DE PERSONAJES
// ═══════════════════════════════════════════════

const CHARACTERS = [
  {
    id: 'ant',
    name: 'Hormiga Roja',
    emoji: '🐜',
    lore: 'Nacida en el corazón de la colonia, la Hormiga Roja es maestra de la fuerza bruta y el trabajo en equipo. Puede invocar aliadas de la colonia para abrumar al enemigo.',
    pros: ['Puede llamar aliados al combate', 'Ácido fórmico corroe la armadura', 'Alta vida base'],
    cons: ['Evasión muy baja', 'Vulnerable al veneno', 'Sin ataques aéreos'],
    baseStats: { hp: 90, maxHp: 90, atk: 15, def: 12, spd: 11, eva: 5 },
    skills: [
      { id: 'acid', name: '🧪 Ácido Fórmico', desc: 'Reduce la DEF del enemigo 30% por 3 turnos.', mpCost: 0, cooldown: 3, currentCD: 0 },
      { id: 'swarm', name: '🐜 Llamar Colonia', desc: 'Invoca aliadas que atacan una vez por turno durante 2 turnos.', mpCost: 0, cooldown: 4, currentCD: 0 }
    ],
    evolutions: [
      { level: 1,  name: 'Hormiga Roja',       emoji: '🐜',  bonuses: {} },
      { level: 5,  name: 'Hormiga Soldado',     emoji: '🪲',  bonuses: { hp: 30, atk: 8, def: 5 } },
      { level: 10, name: 'Hormiga Reina',       emoji: '👑',  bonuses: { hp: 50, atk: 12, def: 8, spd: 3 } },
      { level: 15, name: 'Titán de la Tierra',  emoji: '🦂',  bonuses: { hp: 80, atk: 20, def: 15, spd: 5, eva: 8 } }
    ]
  },
  {
    id: 'beetle',
    name: 'Escarabajo Rinoceronte',
    emoji: '🪲',
    lore: 'El Escarabajo Rinoceronte es una fortaleza andante. Su exoesqueleto resiste los golpes más devastadores y su cuerno puede lanzar enemigos por el aire.',
    pros: ['Defensa más alta del juego', 'Carga rompe la guardia enemiga', 'Regenera HP cada turno'],
    cons: ['Muy lenta velocidad', 'Casi sin evasión', 'Baja en daño mágico'],
    baseStats: { hp: 130, maxHp: 130, atk: 13, def: 22, spd: 5, eva: 3 },
    skills: [
      { id: 'charge', name: '💥 Embestida', desc: 'Daño triple, pero el Escarabajo queda aturdido 1 turno.', mpCost: 0, cooldown: 4, currentCD: 0 },
      { id: 'regen', name: '🛡️ Coraza Dura', desc: 'Aumenta DEF un 50% y regenera 15 HP por 3 turnos.', mpCost: 0, cooldown: 5, currentCD: 0 }
    ],
    evolutions: [
      { level: 1,  name: 'Escarabajo Rinoceronte', emoji: '🪲',  bonuses: {} },
      { level: 5,  name: 'Escarabajo Titán',        emoji: '🦕',  bonuses: { hp: 50, atk: 5, def: 12 } },
      { level: 10, name: 'Mastodonte Blindado',      emoji: '🦏',  bonuses: { hp: 80, atk: 10, def: 20 } },
      { level: 15, name: 'Rey Coraza',               emoji: '👾',  bonuses: { hp: 120, atk: 18, def: 30, eva: 5 } }
    ]
  },
  {
    id: 'mantis',
    name: 'Mantis Religiosa',
    emoji: '🦗',
    lore: 'Depredadora de instinto puro. La Mantis golpea antes de que el enemigo pueda reaccionar y tiene alta probabilidad de golpes críticos letales.',
    pros: ['Mayor daño de ataque básico', 'Alta probabilidad de crítico (25%)', 'Golpea primero siempre'],
    cons: ['HP muy baja', 'Defensa frágil', 'Sin recuperación de vida'],
    baseStats: { hp: 60, maxHp: 60, atk: 24, def: 6, spd: 18, eva: 15 },
    skills: [
      { id: 'lightning', name: '⚡ Golpe Relámpago', desc: 'Ataca dos veces en el mismo turno con 35% de crítico cada golpe.', mpCost: 0, cooldown: 3, currentCD: 0 },
      { id: 'deathblow', name: '💀 Mandíbula Fatal', desc: 'Si el enemigo tiene menos de 30% HP, inflige daño masivo garantizado.', mpCost: 0, cooldown: 5, currentCD: 0 }
    ],
    evolutions: [
      { level: 1,  name: 'Mantis Religiosa',    emoji: '🦗',  bonuses: {} },
      { level: 5,  name: 'Mantis Cazadora',      emoji: '🔪',  bonuses: { atk: 12, spd: 5, eva: 8 } },
      { level: 10, name: 'Depredadora Sombra',   emoji: '🥷',  bonuses: { atk: 20, spd: 8, eva: 12, hp: 20 } },
      { level: 15, name: 'Señor de las Cuchillas', emoji: '⚔️', bonuses: { atk: 30, spd: 12, eva: 18, hp: 30, def: 8 } }
    ]
  },
  {
    id: 'dragonfly',
    name: 'Libélula Cazadora',
    emoji: '🦟',
    lore: 'La Libélula domina los cielos. Su velocidad sobrehumana le permite esquivar casi cualquier golpe y atacar desde ángulos imposibles.',
    pros: ['Mayor velocidad y evasión', 'Ataques aéreos ignoran defensa terrestre', 'Puede huir siempre con éxito'],
    cons: ['Defensa muy baja', 'Frágil si recibe impactos', 'Daño moderado'],
    baseStats: { hp: 65, maxHp: 65, atk: 14, def: 7, spd: 24, eva: 22 },
    skills: [
      { id: 'dive', name: '🌀 Picada Aérea', desc: 'Ignora la DEF del enemigo. Daño puro basado en velocidad.', mpCost: 0, cooldown: 3, currentCD: 0 },
      { id: 'wind', name: '💨 Viento Cortante', desc: 'Ataca a todos los aliados del enemigo, reduce su SPD un 40% por 2 turnos.', mpCost: 0, cooldown: 4, currentCD: 0 }
    ],
    evolutions: [
      { level: 1,  name: 'Libélula Cazadora',  emoji: '🦟',  bonuses: {} },
      { level: 5,  name: 'Libélula Predadora',  emoji: '🛸',  bonuses: { spd: 8, eva: 10, atk: 5 } },
      { level: 10, name: 'Señora del Cielo',    emoji: '🦅',  bonuses: { spd: 12, eva: 15, atk: 10, hp: 20 } },
      { level: 15, name: 'Wyrm Alado',          emoji: '🐉',  bonuses: { spd: 18, eva: 20, atk: 18, hp: 35, def: 10 } }
    ]
  },
  {
    id: 'spider',
    name: 'Araña Viuda Negra',
    emoji: '🕷️',
    lore: 'Paciente y letal. La Viuda Negra teje trampas invisibles y envenena con su mordisco. Sus enemigos mueren lentamente sin entender qué los mató.',
    pros: ['Veneno hace daño cada turno', 'Tela atrapa y paraliza enemigos', 'Daño acumulativo devastador'],
    cons: ['Débil en combate directo', 'Vulnerable al fuego', 'Requiere varias rondas para ser eficaz'],
    baseStats: { hp: 70, maxHp: 70, atk: 14, def: 9, spd: 14, eva: 13 },
    skills: [
      { id: 'web', name: '🕸️ Tela Trampa', desc: 'El enemigo queda paralizado 1-2 turnos, sin poder atacar.', mpCost: 0, cooldown: 4, currentCD: 0 },
      { id: 'poison', name: '☠️ Veneno Mortal', desc: 'Envenena al enemigo: pierde 15% de su HP máx. por turno durante 4 turnos.', mpCost: 0, cooldown: 3, currentCD: 0 }
    ],
    evolutions: [
      { level: 1,  name: 'Araña Viuda Negra',    emoji: '🕷️', bonuses: {} },
      { level: 5,  name: 'Araña Reina',           emoji: '🕸️', bonuses: { atk: 7, spd: 4, eva: 5, hp: 20 } },
      { level: 10, name: 'Tejedora de Sombras',   emoji: '🌑',  bonuses: { atk: 12, spd: 8, eva: 10, hp: 35 } },
      { level: 15, name: 'Arácnida Ancestral',    emoji: '👁️', bonuses: { atk: 22, spd: 12, eva: 15, hp: 50, def: 12 } }
    ]
  }
];
