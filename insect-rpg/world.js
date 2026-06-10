// ═══════════════════════════════════════════════
//  MUNDO, BIOMAS Y ENEMIGOS
// ═══════════════════════════════════════════════

const BIOMES = [
  {
    id: 'garden',
    name: 'Jardín Salvaje',
    emoji: '🌿',
    desc: 'Hojas gigantes, raíces traicioneras. Los insectos pequeños luchan por cada grano de tierra.',
    minLevel: 1,
    color: '#2d5a27',
    enemies: [
      { name: 'Oruga Hambienta',   emoji: '🐛', hp: 30, atk: 6,  def: 3,  spd: 4,  eva: 2,  xp: 15, gold: 5,
        skills: [], loot: ['Hoja Curativa'] },
      { name: 'Gusano de Tierra',  emoji: '🪱', hp: 25, atk: 5,  def: 2,  spd: 3,  eva: 1,  xp: 12, gold: 4,
        skills: [], loot: [] },
      { name: 'Saltamontes Loco',  emoji: '🦗', hp: 40, atk: 9,  def: 4,  spd: 12, eva: 10, xp: 20, gold: 7,
        skills: [{ name: 'Salto', effect: 'dodge', chance: 0.3 }], loot: ['Antena Rota'] },
      { name: 'Mariquita Furiosa', emoji: '🐞', hp: 35, atk: 8,  def: 6,  spd: 8,  eva: 5,  xp: 18, gold: 6,
        skills: [], loot: ['Pigmento Rojo'] },
      { name: 'Caracol Gigante',   emoji: '🐌', hp: 60, atk: 7,  def: 15, spd: 2,  eva: 0,  xp: 30, gold: 12,
        skills: [{ name: 'Baba Ácida', effect: 'slow', chance: 0.4 }], loot: ['Concha Dura', 'Hoja Curativa'] }
    ]
  },
  {
    id: 'forest',
    name: 'Bosque Oscuro',
    emoji: '🌲',
    desc: 'Sombras entre los troncos caídos. Aquí viven depredadores que no conocen piedad.',
    minLevel: 4,
    color: '#1a3320',
    enemies: [
      { name: 'Ciempiés Venenoso', emoji: '🐛', hp: 55, atk: 14, def: 6,  spd: 14, eva: 8,  xp: 35, gold: 14,
        skills: [{ name: 'Veneno', effect: 'poison', chance: 0.5 }], loot: ['Garra de Ciempiés'] },
      { name: 'Avispa Asesina',    emoji: '🐝', hp: 45, atk: 18, def: 5,  spd: 18, eva: 15, xp: 38, gold: 15,
        skills: [{ name: 'Aguijonazo', effect: 'stun', chance: 0.35 }], loot: ['Aguijón Venenoso'] },
      { name: 'Escarabajo Stag',   emoji: '🪲', hp: 80, atk: 16, def: 14, spd: 8,  eva: 4,  xp: 45, gold: 18,
        skills: [{ name: 'Cornada', effect: 'heavy', chance: 0.5 }], loot: ['Cuerno Macizo'] },
      { name: 'Termita Reina',     emoji: '👑', hp: 100, atk: 12, def: 18, spd: 6,  eva: 3,  xp: 60, gold: 25,
        isBoss: true,
        skills: [{ name: 'Llamar Termitas', effect: 'summon', chance: 1 }], loot: ['Corona de Paja', 'Hoja Curativa'] }
    ]
  },
  {
    id: 'cave',
    name: 'Cueva Cristalina',
    emoji: '🪨',
    desc: 'Cristales brillantes iluminan pasajes imposibles. Criaturas ciegas pero letales acechan en la oscuridad.',
    minLevel: 8,
    color: '#2a1f3d',
    enemies: [
      { name: 'Escorpión Ciego',   emoji: '🦂', hp: 80, atk: 20, def: 10, spd: 12, eva: 6,  xp: 55, gold: 22,
        skills: [{ name: 'Cola Venenosa', effect: 'poison', chance: 0.6 }], loot: ['Pinza de Escorpión'] },
      { name: 'Grillo de Caverna', emoji: '🦗', hp: 65, atk: 15, def: 8,  spd: 16, eva: 14, xp: 48, gold: 20,
        skills: [{ name: 'Salto Sónico', effect: 'stun', chance: 0.4 }], loot: [] },
      { name: 'Polilla Oscura',    emoji: '🦋', hp: 70, atk: 17, def: 7,  spd: 20, eva: 18, xp: 52, gold: 21,
        skills: [{ name: 'Polvo de Escamas', effect: 'confuse', chance: 0.45 }], loot: ['Polvo Cegador'] },
      { name: 'Araña Cristal',     emoji: '💎', hp: 120, atk: 22, def: 16, spd: 14, eva: 10, xp: 75, gold: 35,
        isBoss: true,
        skills: [
          { name: 'Veneno Cristal', effect: 'poison', chance: 0.7 },
          { name: 'Tela de Cristal', effect: 'trap', chance: 0.5 }
        ], loot: ['Ojo de Cristal', 'Garra de Escorpión'] }
    ]
  },
  {
    id: 'swamp',
    name: 'Pantano Ancestral',
    emoji: '🌊',
    desc: 'Agua estancada, vapores tóxicos. Las criaturas del pantano son monstruos de una era olvidada.',
    minLevel: 13,
    color: '#1a2f1f',
    enemies: [
      { name: 'Chinche de Agua',   emoji: '🪲', hp: 90, atk: 18, def: 12, spd: 15, eva: 12, xp: 65, gold: 28,
        skills: [{ name: 'Buceo', effect: 'dodge', chance: 0.5 }], loot: ['Escama Acuática'] },
      { name: 'Mosca del Pantano', emoji: '🦟', hp: 75, atk: 22, def: 8,  spd: 22, eva: 20, xp: 70, gold: 30,
        skills: [{ name: 'Picadura Infecciosa', effect: 'poison', chance: 0.65 }], loot: ['Mandíbula Infecciosa'] },
      { name: 'Sanguijuela Reina', emoji: '🌀', hp: 110, atk: 16, def: 14, spd: 10, eva: 8,  xp: 80, gold: 33,
        skills: [{ name: 'Drenar Vida', effect: 'drain', chance: 0.6 }], loot: ['Glándula de Veneno'] },
      { name: '👁️ HORROR DEL PANTANO', emoji: '🐲', hp: 200, atk: 30, def: 20, spd: 18, eva: 14, xp: 200, gold: 100,
        isBoss: true, isFinalBoss: true,
        skills: [
          { name: 'Rugido Ancestral', effect: 'fear', chance: 0.7 },
          { name: 'Cola Venenosa', effect: 'poison', chance: 0.8 },
          { name: 'Aplastamiento', effect: 'heavy', chance: 0.6 }
        ], loot: ['Corona del Pantano', 'Esencia Primordial'] }
    ]
  }
];

// ═══════════════════════════════════════════════
//  MAPAS TOP-DOWN (uno por bioma)
//  Leyenda: # muro/árbol · . suelo · , hierba alta (encuentros)
//           ~ agua · I ítem · H flor curativa · B jefe
//           > salida al siguiente bioma · < volver · S spawn inicial
// ═══════════════════════════════════════════════

const MAPS = [
  [ // Jardín Salvaje
    '##################',
    '#S..,,,..I...,,,.#',
    '#.#.,,#.####.,,#.#',
    '#.#...#..I.#...,,#',
    '#,,##.####.#.##,,#',
    '#,,I..#H...#..,,.#',
    '#.###.#.####.#.#.#',
    '#..,,...,,,..#I..#',
    '#.#,,#.#,,#..#.#.#',
    '#.#..,.#.,,,....,#',
    '#...#..#..,,..,,.>',
    '##################',
  ],
  [ // Bosque Oscuro
    '##################',
    '#<.,,,..##..,,,..#',
    '#.##,,#.##.#,,##.#',
    '#..#...I...#..I..#',
    '#,.####.##.####.,#',
    '#,,..H#.##.#..,,.#',
    '#.##.##.,,.##.##.#',
    '#..#.I..,,...#...#',
    '#.##.####.##.##.##',
    '#.,,,.#....#,,,.##',
    '#..,,.#.I..#.,B.>#',
    '##################',
  ],
  [ // Cueva Cristalina
    '##################',
    '#<...##...,,..##.#',
    '##.#.##.#.##.#.#.#',
    '#..#....#..#.#..,#',
    '#.##.###.#.#.##.,#',
    '#..#.#I..#.#..#..#',
    '#,.#.#.###H#.#.#.#',
    '#,.....#...#.#I..#',
    '#.###.##.###.###.#',
    '#...#.,,,..#.....#',
    '#.I.#.,,,..#.B..>#',
    '##################',
  ],
  [ // Pantano Ancestral
    '##################',
    '#<..,,..~~..,,,..#',
    '#.#.,,#.~~.#,,##.#',
    '#.#...#....#...,,#',
    '#,,##.#.##.#.##,,#',
    '#,,..H#.~~.#..,,.#',
    '#.###.#.~~.##.#..#',
    '#..,,...~~...#.I.#',
    '#.#,,#.#~~#..#.#.#',
    '#I#..,.#..,,....,#',
    '#...#..#..,,...B.#',
    '##################',
  ],
];

// Ítems que pueden aparecer en los tiles "I" de cada bioma
const MAP_ITEMS = {
  garden: ['Hoja Curativa', 'Pigmento Rojo', 'Concha Dura', 'Antena Rota'],
  forest: ['Hoja Curativa', 'Garra de Ciempiés', 'Aguijón Venenoso', 'Cuerno Macizo'],
  cave:   ['Polvo Cegador', 'Ojo de Cristal', 'Pinza de Escorpión', 'Hoja Curativa'],
  swamp:  ['Glándula de Veneno', 'Escama Acuática', 'Mandíbula Infecciosa', 'Hoja Curativa'],
};

const ITEMS = {
  'Hoja Curativa':      { emoji: '🍃', desc: 'Recupera 30 HP.', effect: 'heal', value: 30 },
  'Antena Rota':        { emoji: '📡', desc: 'Aumenta SPD +3 permanentemente.', effect: 'stat', stat: 'spd', value: 3 },
  'Pigmento Rojo':      { emoji: '🔴', desc: 'Aumenta ATK +2 permanentemente.', effect: 'stat', stat: 'atk', value: 2 },
  'Concha Dura':        { emoji: '🐚', desc: 'Aumenta DEF +4 permanentemente.', effect: 'stat', stat: 'def', value: 4 },
  'Garra de Ciempiés':  { emoji: '💅', desc: 'Aumenta ATK +5 permanentemente.', effect: 'stat', stat: 'atk', value: 5 },
  'Aguijón Venenoso':   { emoji: '🗡️', desc: 'Tus ataques básicos envenenan (25% de chance).', effect: 'passive', passive: 'venom_atk' },
  'Cuerno Macizo':      { emoji: '🦌', desc: 'Aumenta ATK +6 y DEF +3.', effect: 'stat_multi', stats: { atk: 6, def: 3 } },
  'Corona de Paja':     { emoji: '👑', desc: 'Aumenta todos los stats +3.', effect: 'all_stats', value: 3 },
  'Pinza de Escorpión': { emoji: '🦞', desc: 'Aumenta ATK +7.', effect: 'stat', stat: 'atk', value: 7 },
  'Polvo Cegador':      { emoji: '✨', desc: 'Úsalo en combate: ciega al enemigo 2 turnos (0% precisión).', effect: 'blind', uses: 2 },
  'Ojo de Cristal':     { emoji: '💎', desc: 'Aumenta EVA +10.', effect: 'stat', stat: 'eva', value: 10 },
  'Garra de Escorpión': { emoji: '🦂', desc: 'Aumenta ATK +8 y añade veneno (40%).', effect: 'stat', stat: 'atk', value: 8 },
  'Escama Acuática':    { emoji: '🐟', desc: 'Aumenta DEF +8.', effect: 'stat', stat: 'def', value: 8 },
  'Mandíbula Infecciosa': { emoji: '🦷', desc: 'Tus ataques envenenan (50% chance).', effect: 'passive', passive: 'venom_atk_50' },
  'Glándula de Veneno': { emoji: '☠️', desc: 'Úsalo en combate: veneno masivo, el enemigo pierde 25% HP/turno por 3 turnos.', effect: 'poison_item', uses: 1 },
  'Corona del Pantano': { emoji: '🏆', desc: '¡Prueba de ser el insecto más poderoso del pantano!', effect: 'trophy' },
  'Esencia Primordial':  { emoji: '🌟', desc: 'Aumenta todos los stats +8 y restaura todo el HP.', effect: 'all_stats', value: 8, heal: true }
};
