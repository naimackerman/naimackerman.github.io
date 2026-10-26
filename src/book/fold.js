// Paper-fold geometry for page turns.
//
// A turning page is a flat sheet hinged at the spine. Grab any point P0 on it
// and drag it to P: the crease is the perpendicular bisector of P0→P, the part
// of the sheet beyond the crease is reflected across it (showing its back),
// and the rest stays flat. The sheet can't stretch, so P is kept within reach
// of both ends of the spine.
//
// "Leaf" coordinates: the spine is x = 0 and the page runs to x = W (mirrored
// for a left-hand page), y = 0 at the top. Everything drawn is in the wrap's
// own pixel coordinates, with the spine at x = spineX.

const SPINE_SLACK = 0.5;

// Keep P within reach of the spine's top (0,0) and bottom (0,H) ends.
export function constrain(P, P0, H) {
  const r1 = Math.hypot(P0.x, P0.y) - SPINE_SLACK;
  const r2 = Math.hypot(P0.x, P0.y - H) - SPINE_SLACK;
  let { x, y } = P;
  for (let i = 0; i < 4; i++) {
    let d = Math.hypot(x, y);
    if (d > r1) {x *= r1 / d;y *= r1 / d;}
    d = Math.hypot(x, y - H);
    if (d > r2) {x *= r2 / d;y = H + (y - H) * r2 / d;}
  }
  return { x, y };
}

// Sutherland–Hodgman: keep the part of `poly` on one side of the crease.
function clipHalf(poly, m, n, keep) {
  const side = (p) => keep * ((p.x - m.x) * n.x + (p.y - m.y) * n.y);
  const out = [];
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const sa = side(a),sb = side(b);
    if (sa >= 0) out.push(a);
    if (sa >= 0 !== sb >= 0) {
      const t = sa / (sa - sb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  });
  return out;
}

const polygon = (pts, map) =>
pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map((p) => map(p).map((v) => `${v.toFixed(2)}px`).join(" ")).join(", ")})`;

// A shading strip whose left edge lies on the crease (through `at`) and which
// extends `reach` px in direction `dir`, in its parent's coordinates.
function band(el, at, dir, reach, opacity) {
  if (!el) return;
  el.style.width = `${Math.max(1, reach)}px`;
  el.style.opacity = opacity;
  el.style.transform = `translate(${at.x}px, ${at.y}px) rotate(${Math.atan2(dir.y, dir.x)}rad) translateY(-50%)`;
}

// Lay out one sheet — its flat front piece and its reflected back flap — and
// return the crease so the caller can cast a shadow from it.
// nodes: { front, flap, back, backShade, backOver? }
//
// wrapRadius (single-page view): there's no page past the hinge to land on —
// the paper rolls round the binding and under. Whatever of the flap crosses
// the hinge is squeezed into a strip `wrapRadius` wide (drawn in nodes.backOver,
// under the coil), the way a page looks curling round a ring.
export function foldSheet(nodes, { W, H, spineX, s, P0, P, lift, wrapRadius }) {
  const real = (p) => ({ x: spineX + s * p.x, y: p.y });
  const pageLeft = s > 0 ? spineX : spineX - W; // the leaf, lying flat
  const landLeft = s > 0 ? spineX - W : spineX; // where it lands once turned
  nodes.front.style.left = `${pageLeft}px`;

  const a = real(P0),b = real(P);
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len < 0.5) {
    nodes.front.style.clipPath = "";
    nodes.back.style.visibility = "hidden";
    if (nodes.backOver) nodes.backOver.style.visibility = "hidden";
    return null;
  }

  const n = { x: (b.x - a.x) / len, y: (b.y - a.y) / len }; // points from the folded side to the flat side
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const page = [
  { x: pageLeft, y: 0 }, { x: pageLeft + W, y: 0 },
  { x: pageLeft + W, y: H }, { x: pageLeft, y: H }];

  const flat = clipHalf(page, m, n, 1);
  const folded = clipHalf(page, m, n, -1);

  nodes.front.style.clipPath = polygon(flat, (p) => [p.x - pageLeft, p.y]);

  // The back face is laid out as the page it becomes once landed (x = landLeft + u).
  // Mirror it onto the leaf, then reflect across the crease. Two reflections
  // make a rigid motion, so the text on the back reads the right way round.
  const c = 2 * spineX - landLeft;
  const k = 2 * (m.x * n.x + m.y * n.y);
  const r00 = 1 - 2 * n.x * n.x,r01 = -2 * n.x * n.y,r11 = 1 - 2 * n.y * n.y;
  const A = [-r00, -r01, r01, r11, r00 * c + k * n.x, r01 * c + k * n.y]; // CSS matrix(a, b, c, d, e, f)
  const toU = (p) => ({ x: c - p.x, y: p.y });
  let backPoly = folded.map(toU);

  if (wrapRadius != null && nodes.backOver) {
    // Split the back at the hinge: where A puts it left of spineX it wraps.
    const hingeN = { x: A[0], y: A[2] }; // A(u).x = A0·u + A2·y + A4
    const hingeM = { x: (spineX - A[4]) * A[0] / (A[0] ** 2 + A[2] ** 2), y: (spineX - A[4]) * A[2] / (A[0] ** 2 + A[2] ** 2) };
    const over = clipHalf(backPoly, hingeM, hingeN, -1);
    backPoly = clipHalf(backPoly, hingeM, hingeN, 1);
    // How far past the hinge the flat geometry would reach, squeezed to the ring's width.
    const reach = over.reduce((r, p) => Math.max(r, spineX - (A[0] * p.x + A[2] * p.y + A[4])), 0);
    const squeeze = reach > wrapRadius ? wrapRadius / reach : 1;
    const Ao = [A[0] * squeeze, A[1], A[2] * squeeze, A[3], A[4] * squeeze + spineX * (1 - squeeze), A[5]];
    nodes.backOver.style.visibility = over.length >= 3 ? "visible" : "hidden";
    nodes.backOver.style.transform = `matrix(${Ao.join(", ")})`;
    nodes.backOver.style.clipPath = polygon(over, (p) => [p.x, p.y]);
  }

  nodes.back.style.visibility = backPoly.length >= 3 ? "visible" : "hidden";
  nodes.back.style.transform = `matrix(${A.join(", ")})`;
  nodes.back.style.clipPath = polygon(backPoly, (p) => [p.x, p.y]);

  // Light: the flap is darkest in the crease. The shadow it throws on the flat
  // page around it follows its outline, so it's a drop-shadow on the flap.
  const shade = Math.pow(lift, 0.6);
  band(nodes.backShade, { x: c - m.x, y: m.y }, { x: n.x, y: -n.y }, W * 0.6, shade);
  // The flap sits above the spine shadow (it's lifted), so it carries its own
  // half of the gutter, fading in as it lies down to match the page it becomes.
  if (nodes.backGutter) {
    const turned = Math.min(1, Math.max(0, (P0.x - P.x) / (2 * P0.x)));
    const t = Math.min(1, Math.max(0, (turned - 0.6) / 0.4));
    nodes.backGutter.dataset.spine = s > 0 ? "right" : "left";
    nodes.backGutter.style.opacity = (t * t * (3 - 2 * t)).toFixed(3);
  }
  if (nodes.flap) {
    nodes.flap.style.filter = `drop-shadow(0 0 ${(4 + 10 * shade).toFixed(1)}px rgba(0,0,0,${(0.22 * shade).toFixed(3)}))`;
  }
  return { m, n, len, pageLeft, shade };
}

// Shadow the lifted flap casts onto whatever the turn uncovers.
export function castShadow(box, strip, crease, W) {
  if (!box || !strip) return;
  if (!crease) {strip.style.opacity = 0;return;}
  const { m, n, len, pageLeft, shade } = crease;
  box.style.left = `${pageLeft}px`;
  // Only the curl at the crease stands off the page, so its shadow stays a
  // narrow band right against the crease rather than spreading across the page.
  band(strip, { x: m.x - pageLeft, y: m.y }, { x: -n.x, y: -n.y }, Math.min(W * 0.1, 10 + len * 0.05), shade);
}
