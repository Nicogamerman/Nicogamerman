// sprites.js — Pixel-art sprite renderer for Insect RPG
// All sprites are 16×16 logical pixels drawn with Canvas 2D fillRect calls.

// ── helper: draw one pixel-block ──────────────────────────────────────────────
function _p(ctx, color, x, y, w, h, s) {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(x * s, y * s, w * s, h * s);
}

// ── individual sprite draw functions (origin = top-left of 16×16 grid) ────────

function _drawAnt(ctx, s, tick) {
  const K = '#181818', R = '#d02020', r = '#901010', L = '#f09090', W = '#f8f8f8';
  const bob = Math.floor(tick / 8) % 2;

  // antennae
  _p(ctx, K, 6, 0 + bob, 1, 1, s);
  _p(ctx, K, 5, 1 + bob, 1, 1, s);
  _p(ctx, K, 5, 2 + bob, 1, 1, s);
  _p(ctx, K, 9, 0 + bob, 1, 1, s);
  _p(ctx, K, 10, 1 + bob, 1, 1, s);
  _p(ctx, K, 10, 2 + bob, 1, 1, s);

  // head (5×4) centered at x=5..9, y=3..6
  _p(ctx, R, 5, 3 + bob, 6, 4, s);
  _p(ctx, K, 4, 3 + bob, 1, 4, s);
  _p(ctx, K, 11, 3 + bob, 1, 4, s);
  _p(ctx, K, 5, 2 + bob, 6, 1, s);
  _p(ctx, K, 5, 7 + bob, 6, 1, s);
  // eyes
  _p(ctx, W, 6, 4 + bob, 1, 1, s);
  _p(ctx, W, 9, 4 + bob, 1, 1, s);

  // petiole (2px wide, 2px tall)
  _p(ctx, r, 7, 8 + bob, 2, 2, s);
  _p(ctx, K, 6, 8 + bob, 1, 2, s);
  _p(ctx, K, 9, 8 + bob, 1, 2, s);

  // thorax (5×3)
  _p(ctx, R, 5, 10 + bob, 6, 3, s);
  _p(ctx, K, 4, 10 + bob, 1, 3, s);
  _p(ctx, K, 11, 10 + bob, 1, 3, s);
  _p(ctx, K, 5, 9 + bob, 6, 1, s);
  _p(ctx, K, 5, 13 + bob, 6, 1, s);

  // legs — 3 pairs
  // upper legs
  _p(ctx, K, 1, 10 + bob, 4, 1, s);
  _p(ctx, K, 11, 10 + bob, 4, 1, s);
  _p(ctx, K, 1, 9 + bob, 1, 1, s);
  _p(ctx, K, 14, 9 + bob, 1, 1, s);
  // mid legs
  _p(ctx, K, 0, 11 + bob, 4, 1, s);
  _p(ctx, K, 12, 11 + bob, 4, 1, s);
  // lower legs
  _p(ctx, K, 1, 12 + bob, 4, 1, s);
  _p(ctx, K, 11, 12 + bob, 4, 1, s);
  _p(ctx, K, 1, 13 + bob, 1, 1, s);
  _p(ctx, K, 14, 13 + bob, 1, 1, s);

  // abdomen (5×6 oval)
  _p(ctx, r, 5, 13 + bob, 6, 1, s); // already outline top done
  _p(ctx, R, 4, 14 + bob, 8, 5, s);
  _p(ctx, K, 3, 14 + bob, 1, 5, s);
  _p(ctx, K, 12, 14 + bob, 1, 5, s);
  _p(ctx, K, 4, 13 + bob, 8, 1, s);
  // keep inside 16 rows — clamp bottom to row 15
  _p(ctx, K, 4, 15 + (bob > 0 ? 0 : 0), 8, 1, s);
  // abdomen segment lines
  _p(ctx, r, 4, 15, 8, 1, s);
}

function _drawBeetle(ctx, s, tick) {
  const K = '#181818', B = '#2838b0', b = '#0c1860', Y = '#f8c000', W = '#f8f8f8';
  const bob = Math.floor(tick / 8) % 2;

  // horn (2×3 at top center)
  _p(ctx, Y, 7, 0 + bob, 2, 3, s);
  _p(ctx, K, 6, 0 + bob, 1, 3, s);
  _p(ctx, K, 9, 0 + bob, 1, 3, s);
  _p(ctx, K, 7, 0 + bob - (bob > 0 ? 0 : 0), 2, 1, s);

  // head (5×3)
  _p(ctx, B, 5, 3 + bob, 6, 3, s);
  _p(ctx, K, 4, 3 + bob, 1, 3, s);
  _p(ctx, K, 11, 3 + bob, 1, 3, s);
  _p(ctx, K, 5, 2 + bob, 6, 1, s);
  _p(ctx, K, 5, 6 + bob, 6, 1, s);
  // eyes
  _p(ctx, W, 5, 4 + bob, 2, 1, s);
  _p(ctx, W, 9, 4 + bob, 2, 1, s);

  // pronotum (7×2)
  _p(ctx, B, 4, 7 + bob, 8, 2, s);
  _p(ctx, K, 3, 7 + bob, 1, 2, s);
  _p(ctx, K, 12, 7 + bob, 1, 2, s);
  _p(ctx, K, 4, 6 + bob, 8, 1, s);
  _p(ctx, K, 4, 9 + bob, 8, 1, s);

  // elytra (9×7 rounded)
  _p(ctx, B, 3, 9 + bob, 10, 7, s);
  _p(ctx, K, 2, 9 + bob, 1, 7, s);
  _p(ctx, K, 13, 9 + bob, 1, 7, s);
  // round top corners
  _p(ctx, K, 3, 9 + bob, 1, 1, s);
  _p(ctx, K, 12, 9 + bob, 1, 1, s);
  // bottom corners
  _p(ctx, K, 3, 15 + bob, 1, 1, s);
  _p(ctx, K, 12, 15 + bob, 1, 1, s);
  // center split line
  _p(ctx, b, 7, 9 + bob, 2, 6, s);
  // shine pixels
  _p(ctx, W, 4, 10 + bob, 1, 1, s);
  _p(ctx, W, 5, 10 + bob, 1, 1, s);

  // legs — 3 pairs (stubby, sides of elytra)
  _p(ctx, K, 0, 10 + bob, 3, 1, s);
  _p(ctx, K, 13, 10 + bob, 3, 1, s);
  _p(ctx, K, 0, 11 + bob, 2, 1, s);
  _p(ctx, K, 14, 11 + bob, 2, 1, s);
  _p(ctx, K, 0, 12 + bob, 3, 1, s);
  _p(ctx, K, 13, 12 + bob, 3, 1, s);
  _p(ctx, K, 1, 13 + bob, 2, 1, s);
  _p(ctx, K, 13, 13 + bob, 2, 1, s);
  _p(ctx, K, 1, 14 + bob, 2, 1, s);
  _p(ctx, K, 13, 14 + bob, 2, 1, s);
  _p(ctx, K, 1, 15 + bob, 2, 1, s);
  _p(ctx, K, 13, 15 + bob, 2, 1, s);
}

function _drawMantis(ctx, s, tick) {
  const K = '#181818', E = '#20a040', e = '#0c5020', F = '#80e060', Y = '#f8f820', W = '#f8f8f8';
  const bob = Math.floor(tick / 8) % 2;

  // triangular head
  _p(ctx, E, 6, 1 + bob, 4, 3, s);
  _p(ctx, K, 5, 1 + bob, 1, 3, s);
  _p(ctx, K, 10, 1 + bob, 1, 3, s);
  _p(ctx, K, 6, 0 + bob, 4, 1, s);
  _p(ctx, K, 6, 4 + bob, 4, 1, s);
  // compound eyes (2×2 yellow-green)
  _p(ctx, Y, 5, 2 + bob, 2, 2, s);
  _p(ctx, Y, 9, 2 + bob, 2, 2, s);
  _p(ctx, K, 4, 2 + bob, 1, 2, s);
  _p(ctx, K, 11, 2 + bob, 1, 2, s);

  // long thin thorax (2px wide, 4px tall)
  _p(ctx, E, 7, 5 + bob, 2, 4, s);
  _p(ctx, K, 6, 5 + bob, 1, 4, s);
  _p(ctx, K, 9, 5 + bob, 1, 4, s);

  // raised forelegs in prayer pose — L-shaped left
  _p(ctx, E, 3, 5 + bob, 3, 1, s); // horizontal upper
  _p(ctx, F, 2, 5 + bob, 1, 1, s); // tip
  _p(ctx, K, 1, 5 + bob, 1, 1, s);
  _p(ctx, E, 3, 6 + bob, 1, 2, s); // vertical lower
  _p(ctx, K, 2, 6 + bob, 1, 2, s);
  _p(ctx, K, 4, 6 + bob, 1, 2, s);
  _p(ctx, F, 3, 8 + bob, 2, 1, s); // claw
  _p(ctx, K, 3, 9 + bob, 2, 1, s);

  // raised foreleg right
  _p(ctx, E, 10, 5 + bob, 3, 1, s);
  _p(ctx, F, 13, 5 + bob, 1, 1, s);
  _p(ctx, K, 14, 5 + bob, 1, 1, s);
  _p(ctx, E, 12, 6 + bob, 1, 2, s);
  _p(ctx, K, 11, 6 + bob, 1, 2, s);
  _p(ctx, K, 13, 6 + bob, 1, 2, s);
  _p(ctx, F, 11, 8 + bob, 2, 1, s);
  _p(ctx, K, 11, 9 + bob, 2, 1, s);

  // mid walking legs
  _p(ctx, E, 4, 7 + bob, 2, 1, s);
  _p(ctx, K, 3, 7 + bob, 1, 1, s);
  _p(ctx, E, 10, 7 + bob, 2, 1, s);
  _p(ctx, K, 12, 7 + bob, 1, 1, s);
  // lower walking legs
  _p(ctx, E, 4, 9 + bob, 2, 1, s);
  _p(ctx, K, 3, 9 + bob, 1, 1, s);
  _p(ctx, E, 10, 9 + bob, 2, 1, s);
  _p(ctx, K, 12, 9 + bob, 1, 1, s);

  // long thin abdomen (2px wide, 8px tall), tapered at tip
  _p(ctx, E, 7, 9 + bob, 2, 6, s);
  _p(ctx, K, 6, 9 + bob, 1, 6, s);
  _p(ctx, K, 9, 9 + bob, 1, 6, s);
  // taper
  _p(ctx, e, 7, 13 + bob, 2, 2, s);
  _p(ctx, K, 7, 15 + bob, 2, 1, s);
}

function _drawDragonfly(ctx, s, tick) {
  const K = '#181818', D = '#1878d0', d = '#0c3870', C = '#a0e8f8', W = '#f8f8f8';
  const bob = Math.floor(tick / 4) % 2;

  // large round head
  _p(ctx, D, 5, 0 + bob, 6, 4, s);
  _p(ctx, K, 4, 0 + bob, 1, 4, s);
  _p(ctx, K, 11, 0 + bob, 1, 4, s);
  _p(ctx, K, 5, 0 + bob, 6, 1, s); // top
  _p(ctx, K, 5, 4 + bob, 6, 1, s); // bottom
  // huge compound eyes (cyan)
  _p(ctx, C, 4, 1 + bob, 3, 2, s);
  _p(ctx, C, 9, 1 + bob, 3, 2, s);
  _p(ctx, K, 3, 1 + bob, 1, 2, s);
  _p(ctx, K, 12, 1 + bob, 1, 2, s);
  _p(ctx, W, 5, 1 + bob, 1, 1, s);
  _p(ctx, W, 10, 1 + bob, 1, 1, s);

  // thin thorax
  _p(ctx, D, 6, 5 + bob, 4, 3, s);
  _p(ctx, K, 5, 5 + bob, 1, 3, s);
  _p(ctx, K, 10, 5 + bob, 1, 3, s);
  _p(ctx, K, 6, 4 + bob, 4, 1, s);
  _p(ctx, K, 6, 8 + bob, 4, 1, s);

  // Wings — two pairs, semi-transparent light cyan, wide
  // upper wing pair
  _p(ctx, C, 0, 4 + bob, 5, 2, s);   // left upper wing
  _p(ctx, C, 11, 4 + bob, 5, 2, s);  // right upper wing
  _p(ctx, K, 0, 3 + bob, 5, 1, s);   // top outline left
  _p(ctx, K, 11, 3 + bob, 5, 1, s);  // top outline right
  _p(ctx, K, 0, 6 + bob, 5, 1, s);   // bottom outline left
  _p(ctx, K, 11, 6 + bob, 5, 1, s);  // bottom outline right
  // vein lines left upper wing
  _p(ctx, d, 2, 4 + bob, 1, 2, s);
  _p(ctx, d, 4, 4 + bob, 1, 2, s);
  // vein lines right upper wing
  _p(ctx, d, 12, 4 + bob, 1, 2, s);
  _p(ctx, d, 14, 4 + bob, 1, 2, s);

  // lower wing pair
  _p(ctx, C, 0, 6 + bob, 5, 2, s);
  _p(ctx, C, 11, 6 + bob, 5, 2, s);
  _p(ctx, K, 0, 8 + bob, 5, 1, s);
  _p(ctx, K, 11, 8 + bob, 5, 1, s);
  _p(ctx, d, 1, 6 + bob, 1, 2, s);
  _p(ctx, d, 3, 6 + bob, 1, 2, s);
  _p(ctx, d, 12, 6 + bob, 1, 2, s);
  _p(ctx, d, 14, 6 + bob, 1, 2, s);

  // long thin abdomen with alternating segments
  for (let i = 0; i < 9; i++) {
    const col = i % 2 === 0 ? D : d;
    _p(ctx, col, 7, 9 + i + bob, 2, 1, s);
    _p(ctx, K, 6, 9 + i + bob, 1, 1, s);
    _p(ctx, K, 9, 9 + i + bob, 1, 1, s);
  }
}

function _drawSpider(ctx, s, tick) {
  const K = '#181818', S = '#280c18', s_ = '#100408', X = '#c01818', W = '#f8f8f8';
  const bob = Math.floor(tick / 10) % 2;

  // 4 pairs of legs radiating outward
  // left legs
  _p(ctx, K, 0, 4 + bob, 3, 1, s);
  _p(ctx, K, 0, 3 + bob, 1, 1, s);
  _p(ctx, K, 0, 6 + bob, 3, 1, s);
  _p(ctx, K, 0, 5 + bob, 1, 1, s);
  _p(ctx, K, 0, 8 + bob, 3, 1, s);
  _p(ctx, K, 0, 9 + bob, 1, 1, s);
  _p(ctx, K, 0, 10 + bob, 3, 1, s);
  _p(ctx, K, 0, 11 + bob, 1, 1, s);
  // right legs
  _p(ctx, K, 13, 4 + bob, 3, 1, s);
  _p(ctx, K, 15, 3 + bob, 1, 1, s);
  _p(ctx, K, 13, 6 + bob, 3, 1, s);
  _p(ctx, K, 15, 5 + bob, 1, 1, s);
  _p(ctx, K, 13, 8 + bob, 3, 1, s);
  _p(ctx, K, 15, 9 + bob, 1, 1, s);
  _p(ctx, K, 13, 10 + bob, 3, 1, s);
  _p(ctx, K, 15, 11 + bob, 1, 1, s);

  // cephalothorax (7×6)
  _p(ctx, S, 4, 3 + bob, 8, 6, s);
  _p(ctx, K, 3, 3 + bob, 1, 6, s);
  _p(ctx, K, 12, 3 + bob, 1, 6, s);
  _p(ctx, K, 4, 2 + bob, 8, 1, s);
  _p(ctx, K, 4, 9 + bob, 8, 1, s);
  // 6 tiny white eyes arranged in arc
  _p(ctx, W, 5, 4 + bob, 1, 1, s);
  _p(ctx, W, 7, 3 + bob, 1, 1, s);
  _p(ctx, W, 9, 3 + bob, 1, 1, s);
  _p(ctx, W, 11, 4 + bob, 1, 1, s);
  _p(ctx, W, 6, 5 + bob, 1, 1, s);
  _p(ctx, W, 10, 5 + bob, 1, 1, s);

  // abdomen (7×7 round)
  _p(ctx, S, 4, 9 + bob, 8, 6, s);
  _p(ctx, K, 3, 9 + bob, 1, 6, s);
  _p(ctx, K, 12, 9 + bob, 1, 6, s);
  _p(ctx, K, 4, 8 + bob, 8, 1, s);
  _p(ctx, K, 4, 15 + bob, 8, 1, s);
  // round corners
  _p(ctx, K, 4, 9 + bob, 1, 1, s);
  _p(ctx, K, 11, 9 + bob, 1, 1, s);
  _p(ctx, K, 4, 14 + bob, 1, 1, s);
  _p(ctx, K, 11, 14 + bob, 1, 1, s);

  // red hourglass on abdomen
  _p(ctx, X, 8, 10 + bob, 1, 1, s);
  _p(ctx, X, 6, 11 + bob, 4, 1, s);
  _p(ctx, X, 8, 12 + bob, 1, 1, s);
  _p(ctx, X, 7, 13 + bob, 2, 1, s);
}

function _drawCaterpillar(ctx, s, tick) {
  const K = '#181818', G = '#40a820', g = '#205010', L = '#80d840', W = '#f8f8f8', Y = '#f8d800';
  const bob = Math.floor(tick / 6) % 2;
  const yOff = 5 + bob;

  // head (left side, 4×5)
  _p(ctx, G, 0, yOff, 4, 5, s);
  _p(ctx, K, 0, yOff, 1, 5, s);
  _p(ctx, K, 0, yOff, 4, 1, s);
  _p(ctx, K, 0, yOff + 4, 4, 1, s);
  // eye
  _p(ctx, W, 1, yOff + 1, 1, 1, s);
  _p(ctx, K, 2, yOff + 1, 1, 1, s);

  // 5 body segments: each 2px wide, 4px tall, separated by 1px dividers
  const segColors = [L, G, L, G, L];
  for (let i = 0; i < 5; i++) {
    const x = 3 + i * 3;
    _p(ctx, segColors[i], x + 1, yOff, 2, 4, s);
    _p(ctx, K, x, yOff, 1, 4, s);       // left divider
    _p(ctx, K, x + 1, yOff, 2, 1, s);  // top outline
    _p(ctx, K, x + 1, yOff + 3, 2, 1, s); // bottom outline
    // shine pixel
    _p(ctx, W, x + 1, yOff + 1, 1, 1, s);
  }
  // right cap
  _p(ctx, K, 15, yOff, 1, 4, s);

  // 4 stubby prolegs below body
  for (let i = 0; i < 4; i++) {
    _p(ctx, g, 2 + i * 3, yOff + 4, 2, 2, s);
    _p(ctx, K, 2 + i * 3, yOff + 5, 2, 1, s);
  }
}

function _drawWorm(ctx, s, tick) {
  const K = '#181818', P = '#e080a0', p = '#b04060', W = '#f8f8f8';
  const wave = Math.floor(tick / 6) % 2;

  // 3 connected oval segments arranged diagonally
  // segment 1 (tail, upper-left)
  _p(ctx, p, 1, 2 + wave, 5, 4, s);
  _p(ctx, K, 0, 2 + wave, 1, 4, s);
  _p(ctx, K, 1, 1 + wave, 5, 1, s);
  _p(ctx, K, 1, 6 + wave, 5, 1, s);
  _p(ctx, P, 2, 3 + wave, 3, 2, s);

  // segment 2 (middle)
  _p(ctx, P, 5, 5 + wave, 5, 4, s);
  _p(ctx, K, 5, 4 + wave, 5, 1, s);
  _p(ctx, K, 5, 9 + wave, 5, 1, s);
  _p(ctx, K, 4, 5 + wave, 1, 4, s);
  _p(ctx, K, 10, 5 + wave, 1, 4, s);
  _p(ctx, p, 6, 5 + wave, 3, 1, s);

  // segment 3 (head, lower-right)
  _p(ctx, P, 9, 8 + wave, 5, 4, s);
  _p(ctx, K, 9, 7 + wave, 5, 1, s);
  _p(ctx, K, 14, 8 + wave, 1, 4, s);
  _p(ctx, K, 9, 12 + wave, 5, 1, s);
  _p(ctx, K, 8, 8 + wave, 1, 4, s);
  // eye on head
  _p(ctx, W, 12, 9 + wave, 1, 1, s);
  _p(ctx, K, 13, 9 + wave, 1, 1, s);
  // mouth
  _p(ctx, K, 13, 11 + wave, 2, 1, s);
}

function _drawGrasshopper(ctx, s, tick) {
  const K = '#181818', G = '#50a820', g = '#285010', L = '#90d840', W = '#f8f8f8';
  const bob = Math.floor(tick / 8) % 2;

  // antenna
  _p(ctx, K, 3, 0 + bob, 1, 1, s);
  _p(ctx, K, 4, 1 + bob, 1, 1, s);
  _p(ctx, K, 5, 2 + bob, 1, 1, s);

  // head
  _p(ctx, G, 4, 2 + bob, 4, 4, s);
  _p(ctx, K, 3, 2 + bob, 1, 4, s);
  _p(ctx, K, 8, 2 + bob, 1, 4, s);
  _p(ctx, K, 4, 1 + bob, 4, 1, s);
  _p(ctx, K, 4, 6 + bob, 4, 1, s);
  _p(ctx, W, 5, 3 + bob, 1, 1, s);
  _p(ctx, W, 7, 3 + bob, 1, 1, s);

  // thorax + wings
  _p(ctx, G, 3, 6 + bob, 7, 4, s);
  _p(ctx, K, 2, 6 + bob, 1, 4, s);
  _p(ctx, K, 10, 6 + bob, 1, 4, s);
  // folded wings (darker green overlay)
  _p(ctx, g, 3, 7 + bob, 7, 3, s);
  _p(ctx, L, 4, 7 + bob, 2, 2, s);

  // body/abdomen
  _p(ctx, G, 2, 10 + bob, 7, 4, s);
  _p(ctx, K, 1, 10 + bob, 1, 4, s);
  _p(ctx, K, 9, 10 + bob, 1, 4, s);
  _p(ctx, K, 2, 14 + bob, 7, 1, s);

  // small front/mid legs
  _p(ctx, K, 0, 7 + bob, 2, 1, s);
  _p(ctx, K, 10, 7 + bob, 2, 1, s);
  _p(ctx, K, 0, 9 + bob, 2, 1, s);
  _p(ctx, K, 10, 9 + bob, 2, 1, s);

  // HUGE back legs
  // left back leg: thick femur + long thin tibia folded
  _p(ctx, g, 0, 10 + bob, 2, 3, s);  // femur
  _p(ctx, K, 0, 13 + bob, 1, 1, s);  // knee
  _p(ctx, K, 0, 14 + bob, 1, 1, s);  // tibia
  _p(ctx, K, 0, 15 + bob, 2, 1, s);  // foot
  // right back leg
  _p(ctx, g, 10, 10 + bob, 2, 3, s);
  _p(ctx, K, 11, 13 + bob, 1, 1, s);
  _p(ctx, K, 11, 14 + bob, 2, 1, s);
  _p(ctx, K, 10, 15 + bob, 2, 1, s);
}

function _drawLadybug(ctx, s, tick) {
  const K = '#181818', R = '#d01010', W = '#f8f8f8', r = '#900808';
  const bob = Math.floor(tick / 8) % 2;

  // very round red body (near-circle 10×10)
  _p(ctx, R, 3, 6 + bob, 10, 8, s);
  _p(ctx, K, 2, 6 + bob, 1, 8, s);
  _p(ctx, K, 13, 6 + bob, 1, 8, s);
  _p(ctx, K, 3, 5 + bob, 10, 1, s);
  _p(ctx, K, 3, 14 + bob, 10, 1, s);
  _p(ctx, K, 4, 4 + bob, 8, 1, s);  // upper round
  _p(ctx, K, 4, 15 + bob, 8, 1, s); // lower round
  // round corners
  _p(ctx, K, 3, 6 + bob, 1, 1, s);
  _p(ctx, K, 12, 6 + bob, 1, 1, s);
  _p(ctx, K, 3, 13 + bob, 1, 1, s);
  _p(ctx, K, 12, 13 + bob, 1, 1, s);

  // black head
  _p(ctx, K, 4, 1 + bob, 8, 5, s);
  _p(ctx, K, 3, 2 + bob, 1, 3, s);
  _p(ctx, K, 12, 2 + bob, 1, 3, s);
  // head outline
  _p(ctx, K, 5, 0 + bob, 6, 1, s);
  // white eye spots on head
  _p(ctx, W, 5, 2 + bob, 2, 2, s);
  _p(ctx, W, 9, 2 + bob, 2, 2, s);
  // tiny antennae
  _p(ctx, K, 4, 0 + bob, 1, 1, s);
  _p(ctx, K, 11, 0 + bob, 1, 1, s);

  // center line on elytra
  _p(ctx, r, 8, 5 + bob, 1, 10, s);

  // 5 black spots: 2+2+1
  _p(ctx, K, 4, 7 + bob, 2, 2, s);   // left row 1
  _p(ctx, K, 10, 7 + bob, 2, 2, s);  // right row 1
  _p(ctx, K, 4, 10 + bob, 2, 2, s);  // left row 2
  _p(ctx, K, 10, 10 + bob, 2, 2, s); // right row 2
  _p(ctx, K, 7, 12 + bob, 2, 2, s);  // center bottom

  // 3 pairs tiny legs
  _p(ctx, K, 1, 7 + bob, 2, 1, s);
  _p(ctx, K, 13, 7 + bob, 2, 1, s);
  _p(ctx, K, 1, 9 + bob, 2, 1, s);
  _p(ctx, K, 13, 9 + bob, 2, 1, s);
  _p(ctx, K, 1, 11 + bob, 2, 1, s);
  _p(ctx, K, 13, 11 + bob, 2, 1, s);
}

function _drawSnail(ctx, s, tick) {
  const K = '#181818', G = '#40a030', B = '#8b4513', b = '#5c2f0e', Y = '#f8d800', W = '#f8f8f8';
  const bob = Math.floor(tick / 8) % 2;

  // body (green, left half)
  _p(ctx, G, 0, 10 + bob, 8, 4, s);
  _p(ctx, K, 0, 9 + bob, 8, 1, s);
  _p(ctx, K, 0, 14 + bob, 8, 1, s);
  _p(ctx, K, 0, 10 + bob, 1, 4, s);
  // head
  _p(ctx, G, 0, 7 + bob, 5, 4, s);
  _p(ctx, K, 0, 6 + bob, 5, 1, s);
  _p(ctx, K, 5, 7 + bob, 1, 4, s);
  _p(ctx, W, 3, 8 + bob, 1, 1, s); // eye
  // antennae
  _p(ctx, K, 1, 5 + bob, 1, 2, s);
  _p(ctx, K, 3, 4 + bob, 1, 3, s);

  // spiral shell (right, brown concentric layers)
  _p(ctx, B, 5, 2 + bob, 10, 10, s);
  _p(ctx, K, 5, 1 + bob, 10, 1, s);
  _p(ctx, K, 5, 12 + bob, 10, 1, s);
  _p(ctx, K, 4, 2 + bob, 1, 10, s);
  _p(ctx, K, 15, 2 + bob, 1, 10, s);
  // inner rings
  _p(ctx, b, 7, 4 + bob, 6, 6, s);
  _p(ctx, B, 9, 6 + bob, 2, 2, s); // shell center
  _p(ctx, K, 8, 5 + bob, 4, 1, s);
  _p(ctx, K, 8, 9 + bob, 4, 1, s);
  _p(ctx, K, 7, 6 + bob, 1, 3, s);
  _p(ctx, K, 13, 6 + bob, 1, 3, s);
}

function _drawCentipede(ctx, s, tick) {
  const K = '#181818', O = '#c05820', o = '#803010', Y = '#f8c000', W = '#f8f8f8';
  const bob = Math.floor(tick / 5) % 2;

  // long horizontal body (8 segments, fills width)
  for (let i = 0; i < 8; i++) {
    const x = i * 2;
    const col = i % 2 === 0 ? O : o;
    _p(ctx, col, x, 6 + bob, 2, 4, s);
    _p(ctx, K, x, 5 + bob, 2, 1, s);
    _p(ctx, K, x, 10 + bob, 2, 1, s);
  }
  // side outlines
  _p(ctx, K, 0, 6 + bob, 1, 4, s);
  _p(ctx, K, 15, 6 + bob, 1, 4, s);

  // head (left, with yellow mandibles)
  _p(ctx, O, 0, 5 + bob, 3, 5, s);
  _p(ctx, Y, 0, 5 + bob, 1, 2, s);   // left mandible
  _p(ctx, Y, 0, 8 + bob, 1, 2, s);   // left mandible lower
  _p(ctx, K, 0, 4 + bob, 2, 1, s);

  // one pair of legs per segment (long, drooping downward)
  for (let i = 0; i < 8; i++) {
    const x = i * 2;
    _p(ctx, K, x, 11 + bob, 1, 2, s); // left leg
    _p(ctx, K, x, 11 + bob, 1, 1, s);
    _p(ctx, K, x + 1, 11 + bob, 1, 2, s); // right leg
    // upper legs
    _p(ctx, K, x, 4 + bob, 1, 1, s);
    _p(ctx, K, x + 1, 4 + bob, 1, 1, s);
  }
}

function _drawWasp(ctx, s, tick) {
  const K = '#181818', Y = '#f8d000', W = '#f8f8f8', C = '#c0e8f8';
  const bob = Math.floor(tick / 6) % 2;

  // dark head with large compound eyes
  _p(ctx, K, 5, 0 + bob, 6, 4, s);
  _p(ctx, W, 5, 1 + bob, 2, 2, s); // left eye
  _p(ctx, W, 9, 1 + bob, 2, 2, s); // right eye

  // thin wings spread upward
  _p(ctx, C, 0, 1 + bob, 4, 3, s);  // left wing
  _p(ctx, C, 12, 1 + bob, 4, 3, s); // right wing
  _p(ctx, K, 0, 0 + bob, 4, 1, s);  // wing outline top
  _p(ctx, K, 12, 0 + bob, 4, 1, s);
  _p(ctx, K, 0, 4 + bob, 4, 1, s);
  _p(ctx, K, 12, 4 + bob, 4, 1, s);
  _p(ctx, K, 0, 1 + bob, 1, 3, s);
  _p(ctx, K, 15, 1 + bob, 1, 3, s);
  // vein lines
  _p(ctx, K, 2, 1 + bob, 1, 3, s);
  _p(ctx, K, 13, 1 + bob, 1, 3, s);

  // thorax
  _p(ctx, K, 5, 4 + bob, 6, 3, s);
  _p(ctx, K, 4, 4 + bob, 1, 3, s);
  _p(ctx, K, 11, 4 + bob, 1, 3, s);

  // narrow waist (1px)
  _p(ctx, K, 7, 7 + bob, 2, 1, s);

  // abdomen with yellow-black stripes (4 stripes)
  _p(ctx, Y, 4, 8 + bob, 8, 1, s);  // stripe 1
  _p(ctx, K, 4, 9 + bob, 8, 1, s);  // stripe 2 (black)
  _p(ctx, Y, 4, 10 + bob, 8, 1, s); // stripe 3
  _p(ctx, K, 4, 11 + bob, 8, 1, s); // stripe 4 (black)
  _p(ctx, Y, 4, 12 + bob, 8, 1, s); // stripe 5
  _p(ctx, K, 4, 13 + bob, 8, 1, s); // stripe 6 (black)
  // abdomen outline
  _p(ctx, K, 3, 8 + bob, 1, 6, s);
  _p(ctx, K, 12, 8 + bob, 1, 6, s);
  _p(ctx, K, 4, 7 + bob, 8, 1, s);

  // pointed stinger
  _p(ctx, K, 7, 14 + bob, 2, 1, s);
  _p(ctx, K, 8, 15 + bob, 1, 1, s);

  // legs
  _p(ctx, K, 2, 6 + bob, 2, 1, s);
  _p(ctx, K, 12, 6 + bob, 2, 1, s);
  _p(ctx, K, 1, 7 + bob, 3, 1, s);
  _p(ctx, K, 12, 7 + bob, 3, 1, s);
}

function _drawStagbeetle(ctx, s, tick) {
  const K = '#181818', B = '#2838b0', b = '#0c1860', Y = '#f8c000', W = '#f8f8f8', O = '#c06010';
  const bob = Math.floor(tick / 8) % 2;

  // HUGE antler mandibles extending from head
  // left mandible
  _p(ctx, O, 0, 1 + bob, 2, 1, s);
  _p(ctx, O, 0, 2 + bob, 3, 1, s);
  _p(ctx, O, 1, 3 + bob, 2, 1, s);
  _p(ctx, K, 0, 0 + bob, 2, 1, s);
  _p(ctx, K, 0, 4 + bob, 2, 1, s);
  // right mandible
  _p(ctx, O, 14, 1 + bob, 2, 1, s);
  _p(ctx, O, 13, 2 + bob, 3, 1, s);
  _p(ctx, O, 13, 3 + bob, 2, 1, s);
  _p(ctx, K, 14, 0 + bob, 2, 1, s);
  _p(ctx, K, 14, 4 + bob, 2, 1, s);

  // head (5×3)
  _p(ctx, B, 5, 3 + bob, 6, 3, s);
  _p(ctx, K, 4, 3 + bob, 1, 3, s);
  _p(ctx, K, 11, 3 + bob, 1, 3, s);
  _p(ctx, K, 5, 2 + bob, 6, 1, s);
  _p(ctx, K, 5, 6 + bob, 6, 1, s);
  _p(ctx, W, 5, 4 + bob, 2, 1, s);
  _p(ctx, W, 9, 4 + bob, 2, 1, s);

  // pronotum
  _p(ctx, B, 4, 7 + bob, 8, 2, s);
  _p(ctx, K, 3, 7 + bob, 1, 2, s);
  _p(ctx, K, 12, 7 + bob, 1, 2, s);
  _p(ctx, K, 4, 6 + bob, 8, 1, s);

  // elytra
  _p(ctx, B, 3, 9 + bob, 10, 6, s);
  _p(ctx, K, 2, 9 + bob, 1, 6, s);
  _p(ctx, K, 13, 9 + bob, 1, 6, s);
  _p(ctx, K, 3, 8 + bob, 10, 1, s);
  _p(ctx, K, 3, 15 + bob, 10, 1, s);
  _p(ctx, b, 7, 9 + bob, 2, 6, s);
  _p(ctx, W, 4, 10 + bob, 1, 1, s);

  // legs
  _p(ctx, K, 0, 9 + bob, 3, 1, s);
  _p(ctx, K, 13, 9 + bob, 3, 1, s);
  _p(ctx, K, 0, 11 + bob, 3, 1, s);
  _p(ctx, K, 13, 11 + bob, 3, 1, s);
  _p(ctx, K, 0, 13 + bob, 3, 1, s);
  _p(ctx, K, 13, 13 + bob, 3, 1, s);
}

function _drawTermite(ctx, s, tick) {
  const K = '#181818', C = '#f0e8c0', c = '#c8b880', W = '#f8f8f8', G = '#806040';
  const bob = Math.floor(tick / 8) % 2;

  // antennae
  _p(ctx, K, 6, 0 + bob, 1, 2, s);
  _p(ctx, K, 5, 0 + bob, 1, 1, s);
  _p(ctx, K, 9, 0 + bob, 1, 2, s);
  _p(ctx, K, 10, 0 + bob, 1, 1, s);

  // head
  _p(ctx, C, 5, 2 + bob, 6, 4, s);
  _p(ctx, K, 4, 2 + bob, 1, 4, s);
  _p(ctx, K, 11, 2 + bob, 1, 4, s);
  _p(ctx, K, 5, 1 + bob, 6, 1, s);
  _p(ctx, K, 5, 6 + bob, 6, 1, s);
  _p(ctx, W, 6, 3 + bob, 1, 1, s);
  _p(ctx, W, 9, 3 + bob, 1, 1, s);

  // wings (semi-transparent, on sides)
  _p(ctx, c, 1, 7 + bob, 4, 2, s);
  _p(ctx, c, 11, 7 + bob, 4, 2, s);
  _p(ctx, K, 1, 6 + bob, 4, 1, s);
  _p(ctx, K, 11, 6 + bob, 4, 1, s);
  _p(ctx, K, 0, 7 + bob, 1, 2, s);
  _p(ctx, K, 15, 7 + bob, 1, 2, s);
  _p(ctx, K, 1, 9 + bob, 4, 1, s);
  _p(ctx, K, 11, 9 + bob, 4, 1, s);

  // darker thorax
  _p(ctx, G, 5, 7 + bob, 6, 3, s);
  _p(ctx, K, 4, 7 + bob, 1, 3, s);
  _p(ctx, K, 11, 7 + bob, 1, 3, s);
  _p(ctx, K, 5, 6 + bob, 6, 1, s);
  _p(ctx, K, 5, 10 + bob, 6, 1, s);

  // waist
  _p(ctx, K, 7, 10 + bob, 2, 1, s);

  // abdomen (cream/white)
  _p(ctx, C, 5, 11 + bob, 6, 4, s);
  _p(ctx, K, 4, 11 + bob, 1, 4, s);
  _p(ctx, K, 11, 11 + bob, 1, 4, s);
  _p(ctx, K, 5, 10 + bob, 6, 1, s);
  _p(ctx, K, 5, 15 + bob, 6, 1, s);

  // legs
  _p(ctx, K, 2, 8 + bob, 2, 1, s);
  _p(ctx, K, 12, 8 + bob, 2, 1, s);
  _p(ctx, K, 2, 9 + bob, 2, 1, s);
  _p(ctx, K, 12, 9 + bob, 2, 1, s);
}

function _drawScorpion(ctx, s, tick) {
  const K = '#181818', D = '#804820', d = '#401808', Y = '#f8c000', W = '#f8f8f8';
  const bob = Math.floor(tick / 9) % 2;

  // wide cephalothorax
  _p(ctx, D, 3, 7 + bob, 10, 6, s);
  _p(ctx, K, 2, 7 + bob, 1, 6, s);
  _p(ctx, K, 13, 7 + bob, 1, 6, s);
  _p(ctx, K, 3, 6 + bob, 10, 1, s);
  _p(ctx, K, 3, 13 + bob, 10, 1, s);
  // eyes
  _p(ctx, W, 6, 8 + bob, 1, 1, s);
  _p(ctx, W, 9, 8 + bob, 1, 1, s);

  // two large claws
  // left claw
  _p(ctx, D, 0, 5 + bob, 4, 2, s);
  _p(ctx, K, 0, 4 + bob, 4, 1, s);
  _p(ctx, K, 0, 7 + bob, 3, 1, s);
  _p(ctx, D, 0, 4 + bob, 2, 1, s); // upper jaw
  _p(ctx, K, 0, 3 + bob, 3, 1, s);
  // right claw
  _p(ctx, D, 12, 5 + bob, 4, 2, s);
  _p(ctx, K, 12, 4 + bob, 4, 1, s);
  _p(ctx, K, 13, 7 + bob, 3, 1, s);
  _p(ctx, D, 14, 4 + bob, 2, 1, s);
  _p(ctx, K, 13, 3 + bob, 3, 1, s);

  // 4 pairs of walking legs
  for (let i = 0; i < 4; i++) {
    _p(ctx, K, 1, 8 + i + bob, 2, 1, s);
    _p(ctx, K, 13, 8 + i + bob, 2, 1, s);
    _p(ctx, K, 0, 9 + i + bob, 1, 1, s);
    _p(ctx, K, 15, 9 + i + bob, 1, 1, s);
  }

  // segmented tail curving UP and over body (5 segments)
  _p(ctx, d, 8, 12 + bob, 2, 1, s); // tail base
  _p(ctx, d, 9, 10 + bob, 2, 2, s); // seg 1
  _p(ctx, d, 10, 8 + bob, 2, 2, s); // seg 2
  _p(ctx, d, 11, 6 + bob, 2, 2, s); // seg 3
  _p(ctx, d, 10, 4 + bob, 2, 2, s); // seg 4
  _p(ctx, d, 8, 3 + bob, 2, 2, s);  // seg 5
  // stinger
  _p(ctx, Y, 8, 1 + bob, 2, 2, s);
  _p(ctx, K, 9, 0 + bob, 1, 1, s);
  // tail outlines
  _p(ctx, K, 8, 9 + bob, 1, 2, s);
  _p(ctx, K, 13, 7 + bob, 1, 2, s);
}

function _drawCricket(ctx, s, tick) {
  const K = '#181818', B = '#604820', b = '#402808', L = '#a07040', W = '#f8f8f8';
  const bob = Math.floor(tick / 8) % 2;

  // long antennae
  _p(ctx, K, 5, 0 + bob, 1, 1, s);
  _p(ctx, K, 4, 1 + bob, 1, 1, s);
  _p(ctx, K, 3, 2 + bob, 1, 1, s);
  _p(ctx, K, 10, 0 + bob, 1, 1, s);
  _p(ctx, K, 11, 1 + bob, 1, 1, s);
  _p(ctx, K, 12, 2 + bob, 1, 1, s);

  // head
  _p(ctx, B, 4, 2 + bob, 5, 4, s);
  _p(ctx, K, 3, 2 + bob, 1, 4, s);
  _p(ctx, K, 9, 2 + bob, 1, 4, s);
  _p(ctx, K, 4, 1 + bob, 5, 1, s);
  _p(ctx, K, 4, 6 + bob, 5, 1, s);
  _p(ctx, W, 5, 3 + bob, 1, 1, s);
  _p(ctx, W, 7, 3 + bob, 1, 1, s);

  // thorax + dark wings
  _p(ctx, B, 3, 6 + bob, 7, 4, s);
  _p(ctx, b, 3, 7 + bob, 7, 3, s); // dark folded wings
  _p(ctx, K, 2, 6 + bob, 1, 4, s);
  _p(ctx, K, 10, 6 + bob, 1, 4, s);
  _p(ctx, L, 4, 7 + bob, 2, 1, s); // wing highlight

  // abdomen
  _p(ctx, B, 2, 10 + bob, 7, 4, s);
  _p(ctx, K, 1, 10 + bob, 1, 4, s);
  _p(ctx, K, 9, 10 + bob, 1, 4, s);
  _p(ctx, K, 2, 14 + bob, 7, 1, s);

  // cerci (tail wires)
  _p(ctx, K, 9, 13 + bob, 1, 1, s);
  _p(ctx, K, 10, 14 + bob, 1, 1, s);
  _p(ctx, K, 11, 15 + bob, 1, 1, s);
  _p(ctx, K, 8, 13 + bob, 1, 1, s);
  _p(ctx, K, 8, 14 + bob, 1, 1, s);
  _p(ctx, K, 7, 15 + bob, 1, 1, s);

  // HUGE back legs
  _p(ctx, b, 0, 10 + bob, 2, 3, s);
  _p(ctx, K, 0, 13 + bob, 1, 2, s);
  _p(ctx, b, 10, 10 + bob, 2, 3, s);
  _p(ctx, K, 11, 13 + bob, 1, 2, s);

  // front legs
  _p(ctx, K, 0, 7 + bob, 2, 1, s);
  _p(ctx, K, 10, 7 + bob, 2, 1, s);
  _p(ctx, K, 0, 9 + bob, 2, 1, s);
  _p(ctx, K, 10, 9 + bob, 2, 1, s);
}

function _drawMoth(ctx, s, tick) {
  const K = '#181818', G = '#786050', g = '#483020', W = '#f8f8f8', Y = '#f8d000', T = '#c8a060';
  const wing = Math.floor(tick / 4) % 2;

  // wide fuzzy wings (spread out)
  // upper wings
  _p(ctx, T, 0, 3 - wing, 6, 5, s);
  _p(ctx, T, 10, 3 - wing, 6, 5, s);
  _p(ctx, K, 0, 2 - wing, 6, 1, s);
  _p(ctx, K, 10, 2 - wing, 6, 1, s);
  _p(ctx, K, 0, 8 - wing, 6, 1, s);
  _p(ctx, K, 10, 8 - wing, 6, 1, s);
  _p(ctx, K, 0, 3 - wing, 1, 5, s);
  _p(ctx, K, 15, 3 - wing, 1, 5, s);
  // eyespot on left wing
  _p(ctx, K, 2, 4 - wing, 2, 2, s);
  _p(ctx, Y, 2, 4 - wing, 1, 1, s);
  // eyespot on right wing
  _p(ctx, K, 12, 4 - wing, 2, 2, s);
  _p(ctx, Y, 12, 4 - wing, 1, 1, s);

  // lower wings
  _p(ctx, G, 1, 8 + wing, 5, 4, s);
  _p(ctx, G, 10, 8 + wing, 5, 4, s);
  _p(ctx, K, 0, 8 + wing, 1, 4, s);
  _p(ctx, K, 15, 8 + wing, 1, 4, s);
  _p(ctx, K, 1, 12 + wing, 5, 1, s);
  _p(ctx, K, 10, 12 + wing, 5, 1, s);

  // fluffy thorax
  _p(ctx, G, 5, 3, 6, 6, s);
  _p(ctx, K, 4, 3, 1, 6, s);
  _p(ctx, K, 11, 3, 1, 6, s);
  _p(ctx, g, 5, 4, 6, 4, s); // fuzzy texture
  _p(ctx, G, 6, 4, 4, 3, s);
  _p(ctx, W, 6, 4, 1, 1, s); // fluff highlight

  // head
  _p(ctx, G, 6, 0, 4, 4, s);
  _p(ctx, K, 5, 0, 1, 4, s);
  _p(ctx, K, 10, 0, 1, 4, s);
  _p(ctx, K, 6, 0, 4, 1, s);
  _p(ctx, W, 6, 1, 1, 1, s);
  _p(ctx, W, 9, 1, 1, 1, s);
  // antennae (feathery)
  _p(ctx, K, 5, 0, 1, 1, s);
  _p(ctx, K, 4, 0, 1, 1, s);
  _p(ctx, K, 10, 0, 1, 1, s);
  _p(ctx, K, 11, 0, 1, 1, s);

  // abdomen
  _p(ctx, G, 6, 9, 4, 6, s);
  _p(ctx, K, 5, 9, 1, 6, s);
  _p(ctx, K, 10, 9, 1, 6, s);
  _p(ctx, K, 6, 15, 4, 1, s);
}

function _drawCrystalspider(ctx, s, tick) {
  const K = '#181818', C = '#80d0f0', c = '#40a0d0', X = '#e0f8ff', W = '#f8f8f8', B = '#4080b0';
  const bob = Math.floor(tick / 10) % 2;

  // 4 pairs of legs (geometric, angular)
  // left legs
  _p(ctx, B, 0, 3 + bob, 3, 1, s);
  _p(ctx, B, 0, 5 + bob, 3, 1, s);
  _p(ctx, B, 0, 7 + bob, 3, 1, s);
  _p(ctx, B, 0, 9 + bob, 3, 1, s);
  _p(ctx, K, 0, 2 + bob, 1, 1, s);
  _p(ctx, K, 0, 4 + bob, 1, 1, s);
  _p(ctx, K, 0, 6 + bob, 1, 1, s);
  _p(ctx, K, 0, 8 + bob, 1, 1, s);
  // right legs
  _p(ctx, B, 13, 3 + bob, 3, 1, s);
  _p(ctx, B, 13, 5 + bob, 3, 1, s);
  _p(ctx, B, 13, 7 + bob, 3, 1, s);
  _p(ctx, B, 13, 9 + bob, 3, 1, s);
  _p(ctx, K, 15, 2 + bob, 1, 1, s);
  _p(ctx, K, 15, 4 + bob, 1, 1, s);
  _p(ctx, K, 15, 6 + bob, 1, 1, s);
  _p(ctx, K, 15, 8 + bob, 1, 1, s);

  // cephalothorax (geometric, 7×6)
  _p(ctx, C, 4, 2 + bob, 8, 6, s);
  _p(ctx, K, 3, 2 + bob, 1, 6, s);
  _p(ctx, K, 12, 2 + bob, 1, 6, s);
  _p(ctx, K, 4, 1 + bob, 8, 1, s);
  _p(ctx, K, 4, 8 + bob, 8, 1, s);
  _p(ctx, X, 5, 3 + bob, 6, 1, s); // crystal shine
  // 6 tiny white eyes
  _p(ctx, W, 5, 3 + bob, 1, 1, s);
  _p(ctx, W, 7, 2 + bob, 1, 1, s);
  _p(ctx, W, 9, 2 + bob, 1, 1, s);
  _p(ctx, W, 11, 3 + bob, 1, 1, s);
  _p(ctx, W, 6, 4 + bob, 1, 1, s);
  _p(ctx, W, 10, 4 + bob, 1, 1, s);

  // abdomen (geometric crystal)
  _p(ctx, c, 4, 8 + bob, 8, 6, s);
  _p(ctx, K, 3, 8 + bob, 1, 6, s);
  _p(ctx, K, 12, 8 + bob, 1, 6, s);
  _p(ctx, K, 4, 7 + bob, 8, 1, s);
  _p(ctx, K, 4, 14 + bob, 8, 1, s);
  _p(ctx, X, 5, 9 + bob, 2, 2, s); // crystal facets
  _p(ctx, X, 9, 9 + bob, 2, 2, s);
  _p(ctx, C, 5, 11 + bob, 6, 2, s);
}

function _drawWaterbug(ctx, s, tick) {
  const K = '#181818', D = '#282828', G = '#404840', W = '#f8f8f8', B = '#383830';
  const bob = Math.floor(tick / 8) % 2;

  // flat oval dark body
  _p(ctx, D, 3, 4 + bob, 10, 8, s);
  _p(ctx, K, 2, 4 + bob, 1, 8, s);
  _p(ctx, K, 13, 4 + bob, 1, 8, s);
  _p(ctx, K, 3, 3 + bob, 10, 1, s);
  _p(ctx, K, 3, 12 + bob, 10, 1, s);
  _p(ctx, K, 4, 2 + bob, 8, 1, s);
  _p(ctx, K, 4, 13 + bob, 8, 1, s);
  // round corners
  _p(ctx, K, 3, 4 + bob, 1, 1, s);
  _p(ctx, K, 12, 4 + bob, 1, 1, s);
  _p(ctx, K, 3, 11 + bob, 1, 1, s);
  _p(ctx, K, 12, 11 + bob, 1, 1, s);

  // head
  _p(ctx, G, 5, 2 + bob, 6, 3, s);
  _p(ctx, K, 4, 2 + bob, 1, 3, s);
  _p(ctx, K, 11, 2 + bob, 1, 3, s);
  _p(ctx, K, 5, 1 + bob, 6, 1, s);
  _p(ctx, W, 6, 2 + bob, 1, 1, s);
  _p(ctx, W, 9, 2 + bob, 1, 1, s);

  // 6 oar-like legs (3 per side)
  _p(ctx, K, 0, 5 + bob, 3, 2, s);   // left oar 1
  _p(ctx, K, 0, 8 + bob, 3, 2, s);   // left oar 2
  _p(ctx, K, 0, 11 + bob, 3, 2, s);  // left oar 3
  _p(ctx, K, 13, 5 + bob, 3, 2, s);  // right oar 1
  _p(ctx, K, 13, 8 + bob, 3, 2, s);  // right oar 2
  _p(ctx, K, 13, 11 + bob, 3, 2, s); // right oar 3
  // oar paddles
  _p(ctx, K, 0, 6 + bob, 1, 1, s);
  _p(ctx, K, 0, 9 + bob, 1, 1, s);
  _p(ctx, K, 0, 12 + bob, 1, 1, s);
  _p(ctx, K, 15, 6 + bob, 1, 1, s);
  _p(ctx, K, 15, 9 + bob, 1, 1, s);
  _p(ctx, K, 15, 12 + bob, 1, 1, s);

  // center line on body
  _p(ctx, B, 8, 3 + bob, 1, 10, s);
}

function _drawSwampfly(ctx, s, tick) {
  const K = '#181818', G = '#2a4820', g = '#183010', B = '#4a6030', W = '#f8f8f8', D = '#384020';
  const wing = Math.floor(tick / 4) % 2;

  // large round head with compound eyes
  _p(ctx, G, 5, 0, 6, 4, s);
  _p(ctx, K, 4, 0, 1, 4, s);
  _p(ctx, K, 11, 0, 1, 4, s);
  _p(ctx, K, 5, 0, 6, 1, s);
  _p(ctx, K, 5, 4, 6, 1, s);
  _p(ctx, B, 4, 1, 3, 2, s); // left eye
  _p(ctx, B, 9, 1, 3, 2, s); // right eye
  _p(ctx, K, 3, 1, 1, 2, s);
  _p(ctx, K, 12, 1, 1, 2, s);
  _p(ctx, W, 5, 1, 1, 1, s);
  _p(ctx, W, 10, 1, 1, 1, s);

  // thorax
  _p(ctx, G, 6, 4, 4, 4, s);
  _p(ctx, K, 5, 4, 1, 4, s);
  _p(ctx, K, 10, 4, 1, 4, s);
  _p(ctx, K, 6, 3, 4, 1, s);
  _p(ctx, K, 6, 8, 4, 1, s);

  // smaller wings (dark green/brown)
  _p(ctx, D, 1, 4 - wing, 4, 3, s);
  _p(ctx, D, 11, 4 - wing, 4, 3, s);
  _p(ctx, K, 0, 4 - wing, 1, 3, s);
  _p(ctx, K, 15, 4 - wing, 1, 3, s);
  _p(ctx, K, 1, 3 - wing, 4, 1, s);
  _p(ctx, K, 11, 3 - wing, 4, 1, s);
  _p(ctx, K, 1, 7 - wing, 4, 1, s);
  _p(ctx, K, 11, 7 - wing, 4, 1, s);
  // vein
  _p(ctx, g, 3, 4 - wing, 1, 3, s);
  _p(ctx, g, 13, 4 - wing, 1, 3, s);

  // long abdomen with segments
  for (let i = 0; i < 7; i++) {
    const col = i % 2 === 0 ? G : g;
    _p(ctx, col, 7, 8 + i, 2, 1, s);
    _p(ctx, K, 6, 8 + i, 1, 1, s);
    _p(ctx, K, 9, 8 + i, 1, 1, s);
  }

  // legs
  _p(ctx, K, 3, 6, 2, 1, s);
  _p(ctx, K, 11, 6, 2, 1, s);
  _p(ctx, K, 2, 7, 3, 1, s);
  _p(ctx, K, 11, 7, 3, 1, s);
}

function _drawLeech(ctx, s, tick) {
  const K = '#181818', D = '#281818', d = '#180808', P = '#602020', W = '#f8f8f8';
  const wave = Math.floor(tick / 6) % 2;

  // dark oval segmented body, horizontal
  _p(ctx, D, 1, 5 + wave, 14, 6, s);
  _p(ctx, K, 0, 5 + wave, 1, 6, s);
  _p(ctx, K, 15, 5 + wave, 1, 6, s);
  _p(ctx, K, 1, 4 + wave, 14, 1, s);
  _p(ctx, K, 1, 11 + wave, 14, 1, s);
  // round caps
  _p(ctx, K, 1, 5 + wave, 1, 1, s);
  _p(ctx, K, 14, 5 + wave, 1, 1, s);
  _p(ctx, K, 1, 10 + wave, 1, 1, s);
  _p(ctx, K, 14, 10 + wave, 1, 1, s);

  // segment dividers
  for (let i = 1; i < 6; i++) {
    _p(ctx, K, 1 + i * 2, 5 + wave, 1, 6, s);
  }

  // belly lighter
  _p(ctx, P, 2, 7 + wave, 12, 2, s);

  // sucker mouth on left end
  _p(ctx, d, 0, 5 + wave, 2, 6, s);
  _p(ctx, K, 0, 4 + wave, 2, 1, s);
  _p(ctx, K, 0, 11 + wave, 2, 1, s);
  _p(ctx, W, 1, 6 + wave, 1, 1, s);  // sucker ring highlight
  _p(ctx, K, 0, 7 + wave, 1, 2, s);
  _p(ctx, W, 0, 8 + wave, 1, 1, s);

  // tail end slightly pointed
  _p(ctx, K, 14, 6 + wave, 1, 4, s);
  _p(ctx, K, 15, 7 + wave, 1, 2, s);
}

function _drawHorror(ctx, s, tick) {
  const K = '#181818', D = '#200818', d = '#100408', R = '#c01820', Y = '#f8d000', W = '#f8f8f8', P = '#8020c0';
  const pulse = Math.floor(tick / 3) % 3;

  // purple energy aura around border
  _p(ctx, P, 0, 0, 16, 1, s);
  _p(ctx, P, 0, 15, 16, 1, s);
  _p(ctx, P, 0, 0, 1, 16, s);
  _p(ctx, P, 15, 0, 1, 16, s);
  // pulsing aura layer
  if (pulse === 0) {
    _p(ctx, P, 1, 1, 14, 1, s);
    _p(ctx, P, 1, 14, 14, 1, s);
    _p(ctx, P, 1, 1, 1, 14, s);
    _p(ctx, P, 14, 1, 1, 14, s);
  }

  // HUGE dark body filling most of canvas
  _p(ctx, D, 2, 2, 12, 12, s);
  _p(ctx, d, 3, 3, 10, 10, s);
  _p(ctx, K, 1, 1, 14, 14, s); // This acts as a mask outline

  // re-draw body over outline
  _p(ctx, D, 2, 2, 12, 12, s);
  _p(ctx, d, 3, 3, 10, 10, s);

  // 3 glowing yellow eyes (2×2 each)
  _p(ctx, Y, 4, 4, 2, 2, s);  // left eye
  _p(ctx, Y, 7, 3, 2, 2, s);  // center eye
  _p(ctx, Y, 10, 4, 2, 2, s); // right eye
  _p(ctx, W, 4, 4, 1, 1, s);  // eye glints
  _p(ctx, W, 7, 3, 1, 1, s);
  _p(ctx, W, 10, 4, 1, 1, s);
  // eye glow halos
  _p(ctx, R, 3, 3, 1, 1, s);
  _p(ctx, R, 6, 3, 1, 1, s);
  _p(ctx, R, 9, 3, 1, 1, s);

  // wide jagged mouth with white teeth
  _p(ctx, K, 3, 9, 10, 3, s);
  // teeth
  _p(ctx, W, 4, 9, 1, 2, s);
  _p(ctx, W, 6, 9, 1, 2, s);
  _p(ctx, W, 8, 9, 1, 2, s);
  _p(ctx, W, 10, 9, 1, 2, s);
  _p(ctx, W, 4, 11, 1, 1, s);
  _p(ctx, W, 6, 11, 1, 1, s);
  _p(ctx, W, 8, 11, 1, 1, s);
  _p(ctx, W, 10, 11, 1, 1, s);
  // mouth cavity
  _p(ctx, d, 5, 10, 6, 1, s);
  _p(ctx, R, 5, 11, 6, 1, s); // red inside

  // multiple limb-like appendages at corners
  // top-left
  _p(ctx, K, 0, 0, 2, 1, s);
  _p(ctx, K, 0, 1, 1, 2, s);
  _p(ctx, D, 1, 1, 1, 1, s);
  // top-right
  _p(ctx, K, 14, 0, 2, 1, s);
  _p(ctx, K, 15, 1, 1, 2, s);
  _p(ctx, D, 14, 1, 1, 1, s);
  // bottom-left
  _p(ctx, K, 0, 14, 1, 2, s);
  _p(ctx, K, 0, 13, 2, 1, s);
  _p(ctx, D, 1, 14, 1, 1, s);
  // bottom-right
  _p(ctx, K, 15, 13, 1, 2, s);
  _p(ctx, K, 14, 15, 2, 1, s);
  _p(ctx, D, 14, 14, 1, 1, s);

  // pulsing red aura on pulse frames
  if (pulse === 1) {
    _p(ctx, R, 2, 2, 12, 1, s);
    _p(ctx, R, 2, 13, 12, 1, s);
    _p(ctx, R, 2, 2, 1, 12, s);
    _p(ctx, R, 13, 2, 1, 12, s);
  }
}

// ── sprite lookup table ───────────────────────────────────────────────────────
const SPRITE_DRAW_FN = {
  ant:          _drawAnt,
  beetle:       _drawBeetle,
  mantis:       _drawMantis,
  dragonfly:    _drawDragonfly,
  spider:       _drawSpider,
  caterpillar:  _drawCaterpillar,
  worm:         _drawWorm,
  grasshopper:  _drawGrasshopper,
  ladybug:      _drawLadybug,
  snail:        _drawSnail,
  centipede:    _drawCentipede,
  wasp:         _drawWasp,
  stagbeetle:   _drawStagbeetle,
  termite:      _drawTermite,
  scorpion:     _drawScorpion,
  cricket:      _drawCricket,
  moth:         _drawMoth,
  crystalspider: _drawCrystalspider,
  waterbug:     _drawWaterbug,
  swampfly:     _drawSwampfly,
  leech:        _drawLeech,
  horror:       _drawHorror,
};

// ── public API ────────────────────────────────────────────────────────────────

/**
 * Draw a sprite centered at (cx, cy) with scale s px/pixel.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} id  — sprite ID
 * @param {number} cx  — center X on canvas
 * @param {number} cy  — center Y on canvas
 * @param {number} s   — scale: how many canvas pixels per sprite pixel
 * @param {number} [tick=0] — animation tick
 * @param {boolean} [flipX=false] — mirror horizontally
 */
function drawSprite(ctx, id, cx, cy, s, tick = 0, flipX = false) {
  const fn = SPRITE_DRAW_FN[id];
  if (!fn) {
    // fallback: draw a question-mark box
    ctx.save();
    ctx.fillStyle = '#c00';
    ctx.fillRect(cx - s * 8, cy - s * 8, s * 16, s * 16);
    ctx.fillStyle = '#fff';
    ctx.font = `${s * 10}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', cx, cy);
    ctx.restore();
    return;
  }

  ctx.save();
  // translate so top-left of 16×16 grid is at the right spot
  ctx.translate(cx - s * 8, cy - s * 8);
  if (flipX) {
    ctx.translate(s * 16, 0);
    ctx.scale(-1, 1);
  }
  fn(ctx, s, tick);
  ctx.restore();
}

/**
 * Draw the pixel-art battle background for the given biome.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} canvasW
 * @param {number} canvasH
 * @param {string} biomeId — 'garden' | 'forest' | 'cave' | 'swamp'
 */
function drawBattleBackground(ctx, canvasW, canvasH, biomeId) {
  const W = canvasW, H = canvasH;
  const skyH   = Math.floor(H * 0.60);
  const groundH = H - skyH;
  const px = Math.max(1, Math.floor(W / 80)); // 1 "pixel" size for details

  ctx.save();

  if (biomeId === 'garden') {
    // sky gradient (pixel bands)
    const skyColors = ['#4890e8', '#5ca0f0', '#70b0f8', '#90c8f8', '#b0d8f8'];
    const band = Math.floor(skyH / skyColors.length);
    for (let i = 0; i < skyColors.length; i++) {
      ctx.fillStyle = skyColors[i];
      ctx.fillRect(0, i * band, W, band + (i === skyColors.length - 1 ? skyH - band * skyColors.length : 0));
    }
    // clouds (pixel rectangles)
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(px * 5, px * 3, px * 12, px * 3);
    ctx.fillRect(px * 4, px * 4, px * 14, px * 2);
    ctx.fillRect(px * 30, px * 6, px * 10, px * 2);
    ctx.fillRect(px * 29, px * 7, px * 12, px * 2);
    ctx.fillRect(px * 55, px * 4, px * 8, px * 2);
    ctx.fillRect(px * 54, px * 5, px * 10, px * 2);

    // ground base
    ctx.fillStyle = '#40a020';
    ctx.fillRect(0, skyH, W, groundH);
    // dirt layer
    ctx.fillStyle = '#906830';
    ctx.fillRect(0, skyH + px * 4, W, groundH - px * 4);
    // grass top layer
    ctx.fillStyle = '#50c030';
    ctx.fillRect(0, skyH, W, px * 4);

    // pixel flowers at ground level
    const flowerColors = ['#f82020', '#f8c000', '#f840f0', '#f8f820', '#20a0f8'];
    for (let i = 0; i < 14; i++) {
      const fx = Math.floor((i * 0.137 + 0.05) * W);
      const fy = skyH + px;
      const fc = flowerColors[i % flowerColors.length];
      // stem
      ctx.fillStyle = '#30a010';
      ctx.fillRect(fx + px, fy + px * 2, px, px * 3);
      // petals
      ctx.fillStyle = fc;
      ctx.fillRect(fx, fy, px * 3, px);
      ctx.fillRect(fx + px, fy - px, px, px);
      ctx.fillRect(fx + px, fy + px, px, px);
      ctx.fillStyle = '#f8e000';
      ctx.fillRect(fx + px, fy, px, px);
    }
    // ground grass blades
    ctx.fillStyle = '#68d040';
    for (let i = 0; i < 25; i++) {
      const bx = Math.floor((i / 25) * W) + px;
      ctx.fillRect(bx, skyH - px * 2, px, px * 3);
      ctx.fillRect(bx + px, skyH - px, px, px * 2);
    }

  } else if (biomeId === 'forest') {
    // dark forest top (tree canopy silhouette)
    ctx.fillStyle = '#0c2808';
    ctx.fillRect(0, 0, W, skyH);
    // lighter sky gaps through canopy
    const gapColor = '#1a4818';
    ctx.fillStyle = gapColor;
    for (let i = 0; i < 8; i++) {
      const gx = Math.floor((i / 8) * W + W * 0.05);
      ctx.fillRect(gx, 0, px * 6, skyH - px * 5);
    }
    // canopy texture (dark tree tops)
    ctx.fillStyle = '#143810';
    for (let i = 0; i < 12; i++) {
      const tx = Math.floor((i / 12) * W);
      const th = Math.floor(skyH * 0.4) + (i % 3) * px * 5;
      ctx.fillRect(tx, skyH - th, Math.floor(W / 10), th);
    }
    // tree trunks
    ctx.fillStyle = '#3c2010';
    for (let i = 0; i < 6; i++) {
      const tx = Math.floor((i / 6) * W + W * 0.07);
      ctx.fillRect(tx, skyH - px * 20, px * 4, px * 20);
    }
    // a few firefly-like light dots
    ctx.fillStyle = '#d0f840';
    for (let i = 0; i < 12; i++) {
      const lx = Math.floor(((i * 53 + 17) % 100) / 100 * W);
      const ly = Math.floor(((i * 37 + 11) % 100) / 100 * skyH);
      ctx.fillRect(lx, ly, px, px);
    }

    // dirt/roots bottom
    ctx.fillStyle = '#302010';
    ctx.fillRect(0, skyH, W, groundH);
    ctx.fillStyle = '#482818';
    ctx.fillRect(0, skyH, W, px * 3);
    // roots
    ctx.fillStyle = '#3c2010';
    for (let i = 0; i < 8; i++) {
      const rx = Math.floor((i / 8) * W + W * 0.05);
      ctx.fillRect(rx, skyH + px * 3, px * 2, groundH - px * 3);
      ctx.fillRect(rx - px * 2, skyH + px * 5, px * 6, px * 2);
    }
    // moss
    ctx.fillStyle = '#205018';
    ctx.fillRect(0, skyH, W, px * 2);

  } else if (biomeId === 'cave') {
    // dark gray/purple background
    ctx.fillStyle = '#181020';
    ctx.fillRect(0, 0, W, H);
    // cave ceiling/top gradient
    ctx.fillStyle = '#201828';
    ctx.fillRect(0, 0, W, skyH);
    // purple tint upper
    ctx.fillStyle = '#28183c';
    ctx.fillRect(0, 0, W, skyH / 2);

    // stalactites hanging from ceiling
    ctx.fillStyle = '#383050';
    for (let i = 0; i < 10; i++) {
      const sx = Math.floor((i / 10) * W + W * 0.04);
      const sl = px * 5 + (i % 4) * px * 3;
      const sw = px * 3 + (i % 2) * px;
      ctx.fillRect(sx, 0, sw, sl);
      // tip
      ctx.fillRect(sx + px, sl, px, px);
    }
    // secondary smaller stalactites
    ctx.fillStyle = '#302848';
    for (let i = 0; i < 7; i++) {
      const sx = Math.floor((i / 7) * W + W * 0.08);
      const sl = px * 3 + (i % 3) * px * 2;
      ctx.fillRect(sx, 0, px * 2, sl);
    }

    // crystal blue floor
    ctx.fillStyle = '#102838';
    ctx.fillRect(0, skyH, W, groundH);
    ctx.fillStyle = '#1840508';
    ctx.fillRect(0, skyH, W, groundH);
    ctx.fillStyle = '#184058';
    ctx.fillRect(0, skyH, W, groundH);
    // crystal formations on floor
    const crystalColors = ['#40a8d0', '#60c8f0', '#2080b0', '#80d8f8'];
    for (let i = 0; i < 8; i++) {
      const cx = Math.floor((i / 8) * W + W * 0.05);
      const ch = px * 4 + (i % 3) * px * 3;
      const cc = crystalColors[i % crystalColors.length];
      ctx.fillStyle = cc;
      ctx.fillRect(cx, skyH + groundH - ch, px * 3, ch);
      ctx.fillRect(cx + px, skyH + groundH - ch - px, px, px);
      // crystal shine
      ctx.fillStyle = '#c0f0ff';
      ctx.fillRect(cx, skyH + groundH - ch, px, px);
    }
    // stalagmites
    ctx.fillStyle = '#283040';
    for (let i = 0; i < 6; i++) {
      const sx = Math.floor((i / 6) * W + W * 0.07);
      const sl = px * 3 + (i % 3) * px * 2;
      ctx.fillRect(sx, skyH + groundH - sl, px * 2, sl);
    }
    // glowing mineral veins in wall
    ctx.fillStyle = '#4060a0';
    for (let i = 0; i < 6; i++) {
      const vx = Math.floor(((i * 41 + 7) % 90) / 100 * W);
      const vy = Math.floor(((i * 29 + 13) % 80) / 100 * skyH);
      ctx.fillRect(vx, vy, px * 4, px);
    }

  } else if (biomeId === 'swamp') {
    // murky dark green/teal throughout
    ctx.fillStyle = '#101c10';
    ctx.fillRect(0, 0, W, H);
    // murky water bands
    const swampColors = ['#0c1810', '#102018', '#142818', '#183020'];
    const swampBand = Math.floor(H / swampColors.length);
    for (let i = 0; i < swampColors.length; i++) {
      ctx.fillStyle = swampColors[i];
      ctx.fillRect(0, i * swampBand, W, swampBand);
    }
    // foggy upper layer (lighter)
    ctx.fillStyle = '#203830';
    ctx.fillRect(0, 0, W, skyH * 0.4);
    ctx.fillStyle = '#182c20';
    ctx.fillRect(0, skyH * 0.3, W, skyH * 0.3);

    // dead tree silhouettes
    ctx.fillStyle = '#0a1208';
    for (let i = 0; i < 4; i++) {
      const tx = Math.floor((i / 4) * W + W * 0.07);
      // trunk
      ctx.fillRect(tx, px * 3, px * 3, skyH - px * 3);
      // branches
      ctx.fillRect(tx - px * 4, px * 6, px * 4, px * 2);
      ctx.fillRect(tx + px * 3, px * 8, px * 5, px * 2);
      ctx.fillRect(tx - px * 2, px * 12, px * 3, px);
    }

    // swampy ground/water
    ctx.fillStyle = '#0c1c14';
    ctx.fillRect(0, skyH, W, groundH);
    ctx.fillStyle = '#102018';
    ctx.fillRect(0, skyH, W, px * 4);
    // lily pads
    ctx.fillStyle = '#204018';
    for (let i = 0; i < 6; i++) {
      const lx = Math.floor((i / 6) * W + px * 2);
      ctx.fillRect(lx, skyH + px * 2, px * 8, px * 3);
      ctx.fillStyle = '#283820';
      ctx.fillRect(lx + px, skyH + px * 3, px * 6, px * 2);
      ctx.fillStyle = '#204018';
    }

    // bubbles (circles approximated with squares)
    ctx.fillStyle = '#304830';
    for (let i = 0; i < 16; i++) {
      const bx = Math.floor(((i * 61 + 13) % 95) / 100 * W);
      const by = Math.floor(skyH + ((i * 37 + 7) % 90) / 100 * groundH);
      const bs = (i % 3 + 1) * px;
      ctx.fillRect(bx, by, bs, bs);
    }
    // bubble ring highlights
    ctx.fillStyle = '#506850';
    for (let i = 0; i < 8; i++) {
      const bx = Math.floor(((i * 71 + 23) % 93) / 100 * W);
      const by = Math.floor(skyH + ((i * 43 + 9) % 85) / 100 * groundH);
      ctx.fillRect(bx, by, px, px);
    }

    // foggy wisps near mid
    ctx.fillStyle = '#1a3028';
    for (let i = 0; i < 5; i++) {
      const wx = Math.floor((i / 5) * W);
      ctx.fillRect(wx, skyH - px * 6, Math.floor(W / 6), px * 4);
    }
  } else {
    // fallback: black
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.restore();
}

// ── enemy sprite map ──────────────────────────────────────────────────────────
const ENEMY_SPRITE_MAP = {
  'Oruga Hambienta':   'caterpillar',
  'Gusano de Tierra':  'worm',
  'Saltamontes Loco':  'grasshopper',
  'Mariquita Furiosa': 'ladybug',
  'Caracol Gigante':   'snail',
  'Ciempiés Venenoso': 'centipede',
  'Avispa Asesina':    'wasp',
  'Escarabajo Stag':   'stagbeetle',
  'Termita Reina':     'termite',
  'Escorpión Ciego':   'scorpion',
  'Grillo de Caverna': 'cricket',
  'Polilla Oscura':    'moth',
  'Araña Cristal':     'crystalspider',
  'Chinche de Agua':   'waterbug',
  'Mosca del Pantano': 'swampfly',
  'Sanguijuela Reina': 'leech',
  '👁️ HORROR DEL PANTANO': 'horror',
};
