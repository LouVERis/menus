/* ===== Menus de la semaine : base de plats + moteur de proposition =====
   Quantités des ingrédients pour 4 portions.
   t : 'mijote' (cuisiné le dimanche, sert le lundi midi + portions à congeler)
       'midi'   (plat de gamelle préparé le dimanche)
       'soir'   (plat rapide, en général sans viande)
   s : saisons (a = automne, h = hiver, p = printemps, e = été)
   k : jours de conservation au frigo une fois cuit
   f : se congèle bien
   p : plat de pâtes (jeudi soir)
   m : contient un peu de viande (pénalisé le soir) */
(function (root) {
'use strict';

var RAYONS = ['Fruits & légumes', 'Boucherie & poisson', 'Crèmerie & frais', 'Épicerie', 'Surgelés', 'Boulangerie', 'Divers'];

var KW = [
  ['Surgelés', ['surgel', 'pommes noisette']],
  ['Épicerie', ['coulis', 'sauce tomate', 'concass', 'tomates pelées', 'bouillon', 'pesto', 'lait de coco', 'pois chiches', 'haricots rouges', 'lentilles', 'vin ', 'farine', 'curry', 'chapelure', 'olives']],
  ['Boucherie & poisson', ['bœuf', 'boeuf', 'veau', 'porc', 'poulet', 'dinde', 'agneau', 'saucisse', 'lardons', 'jambon', 'paupiette', 'poisson', 'cabillaud', 'saumon', 'colin', 'merlu', 'haché', 'hache', 'rôti', 'côte', 'escalope', 'chorizo', 'poitrine', 'chair à saucisse', 'joue', 'palette', 'morteau']],
  ['Crèmerie & frais', ['crème', 'beurre', 'lait', 'comté', 'gruyère', 'emmental', 'parmesan', 'mozzarella', 'chèvre', 'ricotta', 'œuf', 'oeuf', 'fromage', 'yaourt', 'feta', 'pâte brisée', 'pâte feuilletée', 'pâte à pizza', 'gnocchi', 'râpé']],
  ['Boulangerie', ['pain', 'baguette']],
  ['Fruits & légumes', ['carotte', 'poireau', 'oignon', 'ail', 'échalote', 'pomme', 'céleri', 'brocoli', 'courgette', 'tomate', 'potiron', 'butternut', 'potimarron', 'épinard', 'haricots verts', 'petits pois', 'champignon', 'poivron', 'aubergine', 'navet', 'chou', 'salade', 'concombre', 'citron', 'persil', 'basilic', 'fenouil', 'patate', 'betterave', 'panais', 'grenaille', 'herbes']]
];
function rayonOf(name) {
  var n = ' ' + name.toLowerCase() + ' ';
  for (var i = 0; i < KW.length; i++) for (var j = 0; j < KW[i][1].length; j++) if (n.indexOf(KW[i][1][j]) > -1) return KW[i][0];
  return 'Épicerie';
}

var UNITS = { g: 'g', kg: 'g', ml: 'ml', cl: 'ml', l: 'ml', boîte: 'boîte', boîtes: 'boîte', sachet: 'sachet', sachets: 'sachet', paquet: 'paquet', paquets: 'paquet', pot: 'pot', pots: 'pot', tranches: 'tranche', tranche: 'tranche', botte: 'botte', bottes: 'botte' };
var MULT = { kg: 1000, cl: 10, l: 1000 };
/* "600 g haricots verts" -> {q:600,u:'g',n:'haricots verts',r:'Fruits & légumes'} */
function parseIng(str) {
  var s = String(str).trim(), m = s.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/), q = 1, rest = s;
  if (m) { q = parseFloat(m[1].replace(',', '.')); rest = m[2]; }
  var w = rest.split(/\s+/), u = '', first = (w[0] || '').toLowerCase();
  if (m && UNITS[first] !== undefined) { u = UNITS[first]; q = q * (MULT[first] || 1); w.shift(); if ((w[0] || '').toLowerCase() === 'de' || (w[0] || '').toLowerCase() === "d'") w.shift(); }
  var n = w.join(' ').replace(/^d'/i, '').trim() || rest;
  return { q: q, u: u, n: n, r: rayonOf(n) };
}

function R(n, t, s, k, f, ings, extra) {
  var o = { n: n, t: t, s: s, k: k, f: !!f, i: ings };
  if (extra) for (var x in extra) o[x] = extra[x];
  return o;
}
var ALL = 'ahpe';
var BASE_LIST = [
  /* --- Mijotés du dimanche --- */
  R('Bœuf bourguignon & gratin de poireaux', 'mijote', 'ah', 4, 1, ['1 kg bœuf à braiser', '150 g lardons', '500 g carottes', '2 oignons', '250 g champignons', '75 cl vin rouge', '1 kg poireaux', '20 cl crème fraîche', '100 g gruyère râpé']),
  R('Pot-au-feu', 'mijote', 'ah', 4, 1, ['1.2 kg bœuf pot-au-feu', '6 carottes', '3 poireaux', '3 navets', '800 g pommes de terre', '1 oignon']),
  R('Potée aux choux', 'mijote', 'ah', 4, 1, ['1 chou vert', '400 g poitrine demi-sel', '1 saucisse de Morteau', '6 carottes', '800 g pommes de terre', '2 navets']),
  R('Blanquette de veau, riz', 'mijote', 'ahp', 4, 1, ['1 kg veau à blanquette', '4 carottes', '250 g champignons', '1 oignon', '20 cl crème fraîche', '1 citron', '400 g riz']),
  R('Rôti de porc, purée pommes de terre-céleri', 'mijote', 'ahp', 4, 1, ['1 kg rôti de porc', '800 g pommes de terre', '1 céleri-rave', '2 oignons', '20 cl lait']),
  R('Couscous de légumes & cuisses de poulet', 'mijote', ALL, 4, 1, ['4 cuisses de poulet', '3 courgettes', '4 carottes', '2 navets', '1 boîte pois chiches', '1 oignon', '400 g semoule']),
  R("Navarin d'agneau printanier", 'mijote', 'p', 4, 1, ["1 kg épaule d'agneau", '500 g carottes', '300 g petits pois', '500 g pommes de terre grenaille', '1 botte navets nouveaux']),
  R('Poulet basquaise, riz', 'mijote', 'ea', 4, 1, ['4 cuisses de poulet', '3 poivrons', '4 tomates', '2 oignons', '400 g riz']),
  R('Hachis parmentier aux carottes', 'mijote', 'ah', 4, 1, ['600 g bœuf haché', '1.2 kg pommes de terre', '4 carottes', '1 oignon', '30 cl lait', '80 g gruyère râpé']),
  R('Lasagnes bolognaise aux légumes', 'mijote', ALL, 4, 1, ['500 g bœuf haché', '1 paquet feuilles de lasagne', '2 courgettes', '2 carottes', '700 g coulis de tomate', '50 cl lait', '125 g mozzarella']),
  R('Chili doux, riz', 'mijote', 'ah', 4, 1, ['500 g bœuf haché', '2 boîtes haricots rouges', '2 poivrons', '1 boîte tomates concassées', '1 oignon', '400 g riz']),
  R('Sauté de porc aux carottes, pâtes', 'mijote', 'ah', 4, 1, ['800 g sauté de porc', '800 g carottes', '2 oignons', '400 g pâtes']),
  R('Joue de bœuf aux carottes, purée', 'mijote', 'ah', 4, 1, ['1 kg joue de bœuf', '800 g carottes', '2 oignons', '50 cl vin rouge', '1 kg pommes de terre', '20 cl lait']),
  R('Lentilles à la saucisse & carottes', 'mijote', 'ah', 4, 1, ['4 saucisses de Toulouse', '400 g lentilles vertes', '4 carottes', '1 oignon']),

  /* --- Midis (gamelles préparées le dimanche) --- */
  R('Boulettes de bœuf sauce tomate, riz, brocolis', 'midi', ALL, 3, 1, ['600 g bœuf haché', '700 g coulis de tomate', '1 oignon', '1 œuf', '400 g riz', '800 g brocolis']),
  R('Paupiettes, petits pois-carottes, pommes noisette', 'midi', 'ahp', 3, 1, ['4 paupiettes de veau', '600 g petits pois-carottes surgelés', '600 g pommes noisette surgelées']),
  R('Escalopes de veau à la crème, pâtes, haricots verts', 'midi', ALL, 3, 0, ['4 escalopes de veau', '20 cl crème fraîche', '250 g champignons', '400 g pâtes', '600 g haricots verts']),
  R('Filet de poulet, haricots verts, blé', 'midi', ALL, 3, 0, ['600 g filets de poulet', '600 g haricots verts', '400 g blé']),
  R('Filet de poulet, pommes noisette, haricots verts', 'midi', ALL, 3, 0, ['600 g filets de poulet', '600 g pommes noisette surgelées', '600 g haricots verts']),
  R('Côtes de porc, ratatouille, purée pommes de terre-céleri', 'midi', 'ea', 3, 0, ['4 côtes de porc', '2 courgettes', '1 aubergine', '2 poivrons', '4 tomates', '800 g pommes de terre', '1 céleri-rave']),
  R('Poisson, épinards, semoule', 'midi', ALL, 2, 0, ['600 g filets de poisson blanc', '600 g épinards', '300 g semoule']),
  R('Poisson, purée, brocolis', 'midi', ALL, 2, 0, ['600 g filets de poisson blanc', '1 kg pommes de terre', '800 g brocolis', '20 cl lait']),
  R('Tomates farcies, riz', 'midi', 'ea', 3, 1, ['8 tomates', '400 g chair à saucisse', '1 oignon', '300 g riz']),
  R('Pâtes aux saucisses, sauce tomate-courgettes', 'midi', ALL, 3, 0, ['6 saucisses', '400 g pâtes', '3 courgettes', '500 g coulis de tomate']),
  R('Saumon, fondue de poireaux, riz', 'midi', 'ahp', 2, 0, ['4 pavés de saumon', '1 kg poireaux', '20 cl crème fraîche', '300 g riz']),
  R('Curry doux de poulet aux carottes, riz', 'midi', ALL, 3, 1, ['600 g filets de poulet', '500 g carottes', '40 cl lait de coco', '1 oignon', '300 g riz']),
  R('Sauté de dinde aux champignons, pâtes, haricots verts', 'midi', ALL, 3, 0, ['600 g sauté de dinde', '250 g champignons', '400 g pâtes', '600 g haricots verts']),
  R('Parmentier de poisson au potiron', 'midi', 'ah', 3, 1, ['600 g filets de poisson blanc', '1 kg pommes de terre', '600 g potiron', '20 cl lait', '60 g gruyère râpé']),
  R('Cuisses de poulet rôties, légumes rôtis', 'midi', ALL, 3, 0, ['4 cuisses de poulet', '800 g pommes de terre', '500 g carottes', '2 oignons']),
  R('Steak haché, purée de carottes', 'midi', ALL, 2, 0, ['4 steaks hachés', '1 kg carottes', '400 g pommes de terre']),

  /* --- Soirs --- */
  R('Soupe de butternut', 'soir', 'ah', 4, 1, ['1 butternut', '2 pommes de terre', '1 oignon', '10 cl crème fraîche']),
  R('Velouté de potimarron', 'soir', 'a', 4, 1, ['1 potimarron', '2 pommes de terre', '1 oignon']),
  R('Soupe poireaux-pommes de terre', 'soir', 'ahp', 4, 1, ['4 poireaux', '600 g pommes de terre', '1 oignon']),
  R('Soupe de légumes', 'soir', 'ahp', 4, 1, ['4 carottes', '2 courgettes', '2 poireaux', '2 pommes de terre']),
  R('Velouté de courgettes au fromage frais', 'soir', 'ep', 3, 1, ['1 kg courgettes', '1 oignon', '150 g fromage frais']),
  R('Gaspacho', 'soir', 'e', 3, 0, ['1 kg tomates', '1 concombre', '1 poivron', '1 oignon']),
  R('Tarte poireaux-comté', 'soir', 'ahp', 3, 1, ['1 pâte brisée', '4 poireaux', '3 œufs', '20 cl crème fraîche', '100 g comté']),
  R('Quiche courgettes-chèvre', 'soir', 'ep', 3, 1, ['1 pâte brisée', '3 courgettes', '3 œufs', '20 cl crème fraîche', '150 g chèvre']),
  R('Gnocchi poêlés, brocolis vapeur', 'soir', ALL, 0, 0, ['800 g gnocchi', '600 g brocolis', '50 g parmesan']),
  R('Gnocchi poêlés, poêlée de courgettes', 'soir', 'epa', 0, 0, ['800 g gnocchi', '4 courgettes', '50 g parmesan']),
  R('Gnocchi, champignons & épinards', 'soir', 'ah', 0, 0, ['800 g gnocchi', '300 g champignons', '300 g épinards', '20 cl crème fraîche']),
  R('Croque-monsieur, carottes râpées', 'soir', ALL, 0, 0, ['8 tranches pain de mie', '4 tranches jambon', '100 g emmental râpé', '5 carottes'], { m: 1 }),
  R('Semoule, ratatouille', 'soir', 'ea', 4, 1, ['300 g semoule', '2 courgettes', '1 aubergine', '2 poivrons', '4 tomates', '1 oignon']),
  R('Omelette, poêlée de légumes', 'soir', ALL, 0, 0, ['8 œufs', '2 courgettes', '1 poivron', '1 oignon', '50 g gruyère râpé']),
  R('Risotto de potiron', 'soir', 'ah', 2, 0, ['300 g riz arborio', '600 g potiron', '1 oignon', '50 g parmesan', '1 bouillon de légumes']),
  R('Galettes œuf-fromage, salade', 'soir', ALL, 0, 0, ['4 galettes de sarrasin', '4 œufs', '100 g emmental râpé', '1 salade']),
  R('Purée maison, œufs au plat, carottes vapeur', 'soir', ALL, 2, 0, ['1 kg pommes de terre', '4 œufs', '600 g carottes', '20 cl lait']),
  R('Riz sauté aux légumes et à l’œuf', 'soir', ALL, 2, 0, ['300 g riz', '3 œufs', '300 g petits pois surgelés', '2 carottes', '1 oignon']),
  R('Pizza maison aux légumes', 'soir', ALL, 2, 1, ['1 pâte à pizza', '200 g coulis de tomate', '125 g mozzarella', '1 poivron', '150 g champignons', '1 courgette']),
  R('Dahl de lentilles corail, riz', 'soir', 'ah', 4, 1, ['300 g lentilles corail', '40 cl lait de coco', '1 boîte tomates concassées', '2 carottes', '1 oignon', '250 g riz']),
  R('Pâtes sauce tomate-légumes', 'soir', ALL, 3, 1, ['400 g pâtes', '700 g coulis de tomate', '2 courgettes', '2 carottes', '1 oignon', '50 g parmesan'], { p: 1 }),
  R('Pâtes au pesto, petits pois & courgettes', 'soir', 'ep', 0, 0, ['400 g pâtes', '1 pot pesto', '300 g petits pois surgelés', '2 courgettes'], { p: 1 }),
  R('Pâtes gratinées aux brocolis', 'soir', 'ahp', 2, 0, ['400 g pâtes', '600 g brocolis', '20 cl crème fraîche', '100 g gruyère râpé'], { p: 1 }),
  R('Pâtes courgettes-ricotta', 'soir', 'ep', 0, 0, ['400 g pâtes', '4 courgettes', '250 g ricotta', '50 g parmesan'], { p: 1 }),
  R('Pâtes à la crème de potiron', 'soir', 'ah', 2, 0, ['400 g pâtes', '600 g potiron', '20 cl crème fraîche', '50 g parmesan'], { p: 1 }),
  R('Pâtes aux poireaux & parmesan', 'soir', 'ahp', 0, 0, ['400 g pâtes', '4 poireaux', '20 cl crème fraîche', '50 g parmesan'], { p: 1 })
];

function slug(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}
var BASE = {};
BASE_LIST.forEach(function (r) { r.id = slug(r.n); BASE[r.id] = r; });

/* Semaines déjà vécues, recopiées des menus papier : c'est la base de l'apprentissage des habitudes. */
function W(w, midi, soir) { return { w: w, seed: 1, midi: midi.map(S), soir: soir.map(S) }; }
function S(n) { return n ? { id: slug(n) } : null; }
var SEED_WEEKS = [
  W('2026-09-28', ['Couscous de légumes & cuisses de poulet', null, 'Paupiettes, petits pois-carottes, pommes noisette', 'Côtes de porc, ratatouille, purée pommes de terre-céleri', 'Filet de poulet, pommes noisette, haricots verts'],
    ['Soupe de légumes', null, 'Tarte poireaux-comté', 'Pâtes sauce tomate-légumes', null]),
  W('2026-10-05', ['Potée aux choux', 'Escalopes de veau à la crème, pâtes, haricots verts', 'Boulettes de bœuf sauce tomate, riz, brocolis', null, null],
    ['Soupe de légumes', null, null, null, null]),
  W('2026-10-12', ['Bœuf bourguignon & gratin de poireaux', 'Boulettes de bœuf sauce tomate, riz, brocolis', 'Escalopes de veau à la crème, pâtes, haricots verts', null, null],
    ['Soupe de butternut', 'Semoule, ratatouille', null, null, null]),
  W('2026-10-19', ['Poisson, épinards, semoule', 'Tomates farcies, riz', 'Filet de poulet, pommes noisette, haricots verts', 'Pâtes aux saucisses, sauce tomate-courgettes', null],
    ['Soupe de légumes', 'Gnocchi poêlés, brocolis vapeur', 'Croque-monsieur, carottes râpées', 'Pâtes sauce tomate-légumes', 'Pâtes sauce tomate-légumes'])
];

/* ---------- Outils ---------- */
function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe'); }
var STOP = { de: 1, du: 1, des: 1, la: 1, le: 1, les: 1, et: 1, au: 1, aux: 1, a: 1, en: 1, frais: 1, fraiche: 1, surgeles: 1, surgelees: 1, surgele: 1, maison: 1, bio: 1, extra: 1, fins: 1 };
function words(s) { return norm(s).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 2 && !STOP[w]; }).map(function (w) { return w.replace(/s$/, ''); }); }
function seasonOf(date) { var m = date.getMonth() + 1; return m >= 3 && m <= 5 ? 'p' : m >= 6 && m <= 8 ? 'e' : m >= 9 && m <= 11 ? 'a' : 'h'; }
var SEASON_NAMES = { a: 'automne', h: 'hiver', p: 'printemps', e: 'été' };
function pad(x) { return (x < 10 ? '0' : '') + x; }
function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function parseIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
/* Lundi de la semaine à préparer : à partir du samedi, on prépare la semaine suivante. */
function targetMonday(now) {
  var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12), wd = (d.getDay() + 6) % 7; // 0 = lundi
  d.setDate(d.getDate() - wd + (wd >= 5 ? 7 : 0));
  return iso(d);
}
function addDays(isoStr, n) { var d = parseIso(isoStr); d.setDate(d.getDate() + n); return iso(d); }

function protein(r) {
  var t = norm(r.i.join(' ') + ' ' + r.n);
  if (/poisson|saumon|cabillaud|colin|merlu|thon/.test(t)) return 'poisson';
  if (/poulet|dinde|volaille/.test(t)) return 'volaille';
  if (/boeuf|veau|porc|agneau|saucisse|jambon|lardon|paupiette|steak/.test(t)) return 'viande';
  return 'vege';
}
function starch(r) {
  var t = norm(r.i.map(function (x) { return typeof x === 'string' ? x : x.n; }).join(' '));
  if (/pates|lasagne|gnocchi/.test(t)) return 'pates';
  if (/\briz\b/.test(t)) return 'riz';
  if (/semoule|\bble\b/.test(t)) return 'semoule';
  if (/pommes? de terre|noisette|grenaille/.test(t)) return 'pdt';
  if (/lentille/.test(t)) return 'lentilles';
  return '';
}
function isSoup(r) { return /^(soupe|veloute|gaspacho)/.test(norm(r.n)); }
function isGnocchi(r) { return /gnocchi/.test(norm(r.n)); }
function ingsOf(r) { return (r.i || []).map(function (x) { return typeof x === 'string' ? parseIng(x) : x; }); }

/* ---------- Stock des congélos ---------- */
var PLAT_CATS = { 'Plat préparé maison': 1, 'Soupe, potage': 1 };
/* Même règle que l'onglet « à consommer » de l'appli congélos : DLC à moins de 30 jours, ou plus d'un an au congélo. */
function freezerPriority(it, now) {
  now = now || Date.now();
  if (it.dlc) { var days = (new Date(it.dlc) - now) / 86400000; if (days < 30) return 1000 - days; }
  if (it.date) { var age = (now - new Date(it.date)) / 86400000; if (age >= 365) return age; if (age >= 180) return age / 4; }
  return 0;
}
function matchFreezer(ingName, items) {
  var iw = words(ingName); if (!iw.length) return null;
  var best = null;
  items.forEach(function (it) {
    if (!(it.qty > 0) || PLAT_CATS[it.cat]) return;
    var fw = words(it.name), hit = 0;
    iw.forEach(function (w) { if (fw.indexOf(w) > -1) hit++; });
    if (hit >= Math.min(2, iw.length) && (!best || hit > best.hit)) best = { it: it, hit: hit };
  });
  return best && best.it;
}

/* ---------- Apprentissage depuis l'historique ---------- */
function stats(weeks, beforeMonday) {
  var count = {}, last = {}, d0 = parseIso(beforeMonday);
  Object.keys(weeks).forEach(function (w) {
    if (w >= beforeMonday) return;
    var wk = weeks[w], age = Math.round((d0 - parseIso(w)) / 604800000);
    (wk.midi || []).concat(wk.soir || []).forEach(function (s) {
      if (!s || !s.id) return;
      count[s.id] = (count[s.id] || 0) + 1;
      if (last[s.id] === undefined || age < last[s.id]) last[s.id] = age;
    });
  });
  return { count: count, last: last };
}

/* ---------- Moteur de proposition ---------- */
var DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
function makeCtx(o) {
  var recipes = o.recipes, monday = o.monday, season = seasonOf(parseIso(monday));
  var st = stats(o.weeks || {}, monday), items = (o.freezer || []).filter(function (i) { return i.qty > 0; });
  var prioIngr = items.filter(function (i) { return freezerPriority(i) > 0 && !PLAT_CATS[i.cat]; });
  return { recipes: recipes, monday: monday, season: season, st: st, items: items, prioIngr: prioIngr, hidden: o.hidden || {}, rnd: o.rnd || Math.random };
}
function fzBonus(r, ctx) {
  var b = 0, used = [];
  ingsOf(r).forEach(function (g) {
    var it = matchFreezer(g.n, ctx.prioIngr);
    if (it && used.indexOf(it.id) < 0) { used.push(it.id); b += 1; }
  });
  return Math.min(b, 2);
}
function scoreRecipe(r, ctx, slot, week) {
  var sc = 10, c = ctx.st.count[r.id] || 0, l = ctx.st.last[r.id];
  sc += Math.min(c, 4) * 3;                       // plats habituels
  if (l === 0) sc -= 18; else if (l === 1) sc -= 9; else if (l === 2) sc -= 3; // pas trop souvent
  sc += fzBonus(r, ctx) * 7;                       // écouler le congélo
  if (slot.meal === 'soir' && r.m) sc -= 6;        // en général pas de viande le soir
  if (slot.meal === 'midi' && slot.day > 0 && r.k < slot.day + 1) sc -= 3; // devra passer par le congélo
  if (week) {
    var pr = protein(r), prev = slot.meal === 'midi' && slot.day > 0 ? week.midi[slot.day - 1] : null;
    if (prev && prev.id && ctx.recipes[prev.id] && protein(ctx.recipes[prev.id]) === pr) sc -= 5;
    var st = starch(r);
    if (st) week[slot.meal].forEach(function (s) { if (s && s.id && ctx.recipes[s.id] && starch(ctx.recipes[s.id]) === st) sc -= 6; });
    if (slot.meal === 'midi' && pr === 'poisson' && !week.midi.some(function (s) { return s && s.id && ctx.recipes[s.id] && protein(ctx.recipes[s.id]) === 'poisson'; })) sc += 4;
  }
  return sc + ctx.rnd() * 10;
}
function used(week, id) {
  return week.midi.concat(week.soir).some(function (s) { return s && s.id === id; });
}
function candidates(ctx, slot, week, exclude) {
  var out = [];
  Object.keys(ctx.recipes).forEach(function (id) {
    var r = ctx.recipes[id];
    if (ctx.hidden[id] || (exclude && exclude.indexOf(id) > -1)) return;
    if (r.s && r.s.indexOf(ctx.season) < 0) return;
    if (week && used(week, id)) return;
    if (slot.meal === 'midi') {
      if (slot.day === 0) { if (r.t !== 'mijote') return; }
      else {
        if (r.t !== 'midi') return;
        if (r.k < slot.day + 1 && !r.f) return;    // ne tient pas jusqu'au jour J, ni au congélo
      }
    } else {
      if (r.t !== 'soir') return;
      if (slot.day === 3 && !r.p) return;           // jeudi soir : pâtes
      if (slot.day !== 3 && r.p) return;
      if (week) {
        var soups = week.soir.filter(function (s) { return s && s.id && ctx.recipes[s.id] && isSoup(ctx.recipes[s.id]); }).length;
        if (isSoup(r) && soups >= 2) return;
        if (isGnocchi(r) && week.soir.some(function (s) { return s && s.id && ctx.recipes[s.id] && isGnocchi(ctx.recipes[s.id]); })) return;
      }
    }
    out.push({ id: id, sc: scoreRecipe(r, ctx, slot, week) });
  });
  return out.sort(function (a, b) { return b.sc - a.sc; });
}
/* Plats maison déjà au congélo, proposés tels quels (jeudi / vendredi midi, et soupes le soir) */
function freezerMeals(ctx, meal) {
  return ctx.items.filter(function (it) {
    if (meal === 'midi') return it.cat === 'Plat préparé maison';
    return it.cat === 'Soupe, potage';
  }).map(function (it) { return { it: it, sc: 14 + (freezerPriority(it) > 0 ? 20 : 0) + ctx.rnd() * 8 }; })
    .sort(function (a, b) { return b.sc - a.sc; });
}
/* Évite de proposer le bourguignon du congélo la semaine où l'on cuisine déjà un bourguignon */
function similarInWeek(it, week, ctx) {
  var iw = words(it.name).filter(function (w) { return ['soupe', 'veloute', 'plat', 'potage'].indexOf(w) < 0; });
  if (!iw.length) return false;
  return week.midi.concat(week.soir).some(function (s) {
    if (!s || !s.id || !ctx.recipes[s.id]) return false;
    var rw = words(ctx.recipes[s.id].n);
    return iw.some(function (w) { return rw.indexOf(w) > -1; });
  });
}
function fzSlot(it) { return { fz: it.id, n: it.name }; }

function generate(o) {
  var ctx = makeCtx(o), keep = o.keep || {}, week = { midi: [null, null, null, null, null], soir: [null, null, null, null, null] };
  ['midi', 'soir'].forEach(function (m) { (keep[m] || []).forEach(function (s, d) { if (s && s.l) week[m][d] = s; }); });
  var fzUsed = week.midi.concat(week.soir).filter(function (s) { return s && s.fz; }).map(function (s) { return s.fz; });
  var fzCount = fzUsed.length;
  /* Midis : lundi = mijoté du dimanche, puis mardi → vendredi */
  for (var d = 0; d < 5; d++) {
    if (week.midi[d]) continue;
    var slot = { meal: 'midi', day: d }, c = candidates(ctx, slot, week);
    if (d >= 3 && fzCount < 2) {
      var fm = freezerMeals(ctx, 'midi').filter(function (x) { return fzUsed.indexOf(x.it.id) < 0 && !similarInWeek(x.it, week, ctx); })[0];
      if (fm && (!c[0] || fm.sc > c[0].sc)) { week.midi[d] = fzSlot(fm.it); fzUsed.push(fm.it.id); fzCount++; continue; }
    }
    week.midi[d] = c[0] ? { id: c[0].id } : null;
  }
  /* Soirs : jeudi pâtes ; on commence par jeudi pour qu'il ait toujours ses pâtes */
  [3, 0, 1, 2, 4].forEach(function (d) {
    if (week.soir[d]) return;
    var slot = { meal: 'soir', day: d }, c = candidates(ctx, slot, week);
    if (d !== 3 && fzCount < 3) {
      var fm = freezerMeals(ctx, 'soir').filter(function (x) { return fzUsed.indexOf(x.it.id) < 0 && !similarInWeek(x.it, week, ctx); })[0];
      var soups = week.soir.filter(function (s) { return s && (s.fz || (s.id && ctx.recipes[s.id] && isSoup(ctx.recipes[s.id]))); }).length;
      if (fm && soups < 2 && (!c[0] || fm.sc > c[0].sc)) { week.soir[d] = fzSlot(fm.it); fzUsed.push(fm.it.id); fzCount++; return; }
    }
    week.soir[d] = c[0] ? { id: c[0].id } : null;
  });
  return week;
}
/* Autre proposition pour une case : tirage parmi les 5 meilleurs, hors plat actuel */
function reroll(o, week, meal, day) {
  var ctx = makeCtx(o), cur = week[meal][day], w2 = { midi: week.midi.slice(), soir: week.soir.slice() };
  w2[meal][day] = null;
  var c = candidates(ctx, { meal: meal, day: day }, w2, cur && cur.id ? [cur.id] : []).slice(0, 5);
  var opts = c.map(function (x) { return { id: x.id }; });
  if (meal === 'midi' && day >= 2 || meal === 'soir' && day !== 3) {
    freezerMeals(ctx, meal).slice(0, 2).forEach(function (x) {
      var inWeek = week.midi.concat(week.soir).some(function (s) { return s && s.fz === x.it.id; });
      if (!inWeek && !(cur && cur.fz === x.it.id) && !similarInWeek(x.it, w2, ctx)) opts.push(fzSlot(x.it));
    });
  }
  if (!opts.length) return cur;
  return opts[Math.floor(ctx.rnd() * opts.length)];
}
/* Remarque de conservation pour une case midi */
function keepNote(r, day) {
  if (!r || r.t === 'soir') return '';
  if (r.t === 'mijote') return '';
  if (r.k < day + 1) return r.f ? 'à congeler dimanche, sortir la veille' : 'ne se garde pas jusque-là';
  return '';
}

/* ---------- Vacances scolaires (source : service-public.gouv.fr, calendrier 2026-2027) ----------
   Chaque période : [premier jour sans école, jour de reprise]. Toussaint, Noël et été sont communs aux 3 zones. */
var COMMUN = [['2026-07-04', '2026-09-01'], ['2026-10-17', '2026-11-02'], ['2026-12-19', '2027-01-04'], ['2027-07-03', '2027-09-01']];
var VACANCES = {
  A: COMMUN.concat([['2027-02-13', '2027-03-01'], ['2027-04-10', '2027-04-26']]),
  B: COMMUN.concat([['2027-02-20', '2027-03-08'], ['2027-04-17', '2027-05-03']]),
  C: COMMUN.concat([['2027-02-06', '2027-02-22'], ['2027-04-03', '2027-04-19']]),
  '': COMMUN
};
function isHoliday(isoDay, zone) {
  var list = VACANCES[zone || ''] || COMMUN;
  for (var i = 0; i < list.length; i++) if (isoDay >= list[i][0] && isoDay < list[i][1]) return true;
  var m = +isoDay.slice(5, 7);
  return isoDay > '2027-09-01' && (m === 7 || m === 8); // au-delà du calendrier connu : été
}
/* Portions du midi pour chaque jour du lundi au vendredi */
function midiPortions(monday, set) {
  set = set || {};
  var vac = set.pm || 4, sco = set.pms == null ? vac : set.pms;
  return [0, 1, 2, 3, 4].map(function (d) { return isHoliday(addDays(monday, d), set.zone) ? vac : sco; });
}

/* ---------- Liste de courses ---------- */
function fmtQty(q, u) {
  if (u === 'g') return q >= 1000 ? (Math.round(q / 100) / 10).toString().replace('.', ',') + ' kg' : Math.round(q / 10) * 10 + ' g';
  if (u === 'ml') return q >= 1000 ? (Math.round(q / 100) / 10).toString().replace('.', ',') + ' L' : Math.round(q / 10) + ' cl';
  var n = Math.max(1, Math.ceil(q - 0.01));
  return n + (u ? ' ' + u + (n > 1 && u !== 'botte' ? 's' : '') : '');
}
function shopping(o) {
  var week = o.week, recipes = o.recipes, set = o.settings || {}, ps = set.ps || 4, fz = set.fz == null ? 4 : set.fz;
  var pmd = o.monday ? midiPortions(o.monday, set) : [0, 1, 2, 3, 4].map(function () { return set.pm || 4; });
  var agg = {}, items = (o.freezer || []).filter(function (i) { return i.qty > 0; });
  function add(r, factor) {
    ingsOf(r).forEach(function (g) {
      var key = norm(g.n).replace(/s\b/g, '') + '|' + g.u;
      if (!agg[key]) agg[key] = { key: key, n: g.n, u: g.u, q: 0, r: g.r, for: [] };
      agg[key].q += g.q * factor;
      if (agg[key].for.indexOf(r.n) < 0) agg[key].for.push(r.n);
    });
  }
  week.midi.forEach(function (s, d) {
    if (!s || !s.id || !recipes[s.id]) return;
    var r = recipes[s.id];
    add(r, d === 0 && r.t === 'mijote' ? (pmd[d] + fz) / 4 : pmd[d] / 4);
  });
  week.soir.forEach(function (s) { if (s && s.id && recipes[s.id]) add(recipes[s.id], ps / 4); });
  return Object.keys(agg).map(function (k) {
    var a = agg[k], it = matchFreezer(a.n, items);
    a.label = fmtQty(a.q, a.u) + ' ' + a.n;
    if (it) a.fz = it.name + ' (' + (Math.round(it.qty * 100) / 100) + ' ' + it.unit + ')';
    return a;
  }).sort(function (a, b) { return RAYONS.indexOf(a.r) - RAYONS.indexOf(b.r) || a.n.localeCompare(b.n, 'fr'); });
}

var API = {
  RAYONS: RAYONS, BASE: BASE, SEED_WEEKS: SEED_WEEKS, DAYS: DAYS, SEASON_NAMES: SEASON_NAMES, PLAT_CATS: PLAT_CATS,
  parseIng: parseIng, rayonOf: rayonOf, slug: slug, norm: norm, seasonOf: seasonOf, targetMonday: targetMonday, addDays: addDays,
  parseIso: parseIso, iso: iso, generate: generate, reroll: reroll, candidates: candidates, makeCtx: makeCtx, keepNote: keepNote,
  shopping: shopping, isHoliday: isHoliday, midiPortions: midiPortions, fmtQty: fmtQty, freezerPriority: freezerPriority, matchFreezer: matchFreezer, protein: protein, isSoup: isSoup, stats: stats, ingsOf: ingsOf
};
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.MENUS = API;
})(this);
