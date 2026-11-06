/* Ricetta tipo per i prodotti dell'archivio (neutri, addensanti, basi...).
   Aggiunge a ogni scheda il pulsante "Ricetta consigliata" (e, se noto, il link al video del produttore).
   Funziona sulle pagine con l'archivio prodotti (#pgResults + #page-archive-data). IT e DE. */
(function () {
  'use strict';
  var results = document.getElementById('pgResults');
  var dataEl = document.getElementById('page-archive-data');
  if (!results || !dataEl) return;

  var DE = (document.documentElement.lang || 'it').slice(0, 2) === 'de';

  /* ---- video dei produttori: chiave "azienda|prodotto" oppure solo "azienda" ---- */
  var VIDEOS = {
  };

  /* ---- testi ---- */
  var T = DE ? {
    btn: '📖 Beispielrezept', video: '▶ Video des Herstellers', close: 'Schließen',
    title: 'Beispielrezept', warnT: 'Orientierungsrezept',
    warn: 'Dies ist ein allgemeines Beispielrezept, <strong>nicht das des Herstellers</strong> und nicht im Labor geprüft. Nur die Dosierung des Produkts stammt aus dem Datenblatt. Bitte immer Rezept, Hygieneplan (HACCP) und Herstellerangaben prüfen.',
    batch: 'Menge Mischung (kg)', dose: 'Dosierung (g pro kg Mischung)',
    doseSheet: 'Laut Datenblatt', doseApprox: 'Einheit nicht angegeben, als g/kg gelesen. Im Datenblatt prüfen.',
    doseNone: 'Dosierung nicht lesbar: bitte den Wert aus dem Datenblatt eintragen.',
    ing: 'Zutaten', g: 'g', comp: 'Berechnete Zusammensetzung (Richtwerte)',
    fat: 'Fett', snf: 'fettfreie Milchtrockenmasse', sug: 'Zucker gesamt', solids: 'Trockenmasse gesamt', pac: 'PAC (Gefrierpunkterniedrigung)',
    proc: 'Vorgehen', foot: 'Werte mit durchschnittlichen Zutatenzusammensetzungen berechnet. PAC mit Faktoren Saccharose 1, Dextrose 1,9, Laktose 1, Fruchtzucker 1,5. Alle Angaben ohne Gewähr.',
    neg: 'Mit dieser Dosierung ist kein Platz mehr für die Flüssigkeit: bitte Dosierung prüfen.',
    vegan: 'Das Produkt ist auch für vegane oder laktosefreie Rezepte gedacht. Dieses Beispiel nutzt Kuhmilch: Milch, Sahne und Magermilchpulver je nach Datenblatt ersetzen.',
    bothModes: 'Im Datenblatt prüfen, ob das Produkt kalt oder warm verarbeitet wird.',
    milk: 'Vollmilch (3,5 % Fett)', cream: 'Sahne (35 % Fett)', smp: 'Magermilchpulver', suc: 'Saccharose', dex: 'Dextrose',
    water: 'Wasser', fruit: 'Fruchtmark / Fruchtpüree', prod: 'Produkt',
    typeCream: 'Milch- bzw. Cremeeis (Basis)', typeSorb: 'Fruchteis / Sorbet',
    typeComplete: 'Komplettbasis (nur Flüssigkeit nötig)', typeVegan: 'Pflanzliches Eis (vegane Basis)',
    doseL: 'Dosierung (g pro Liter Flüssigkeit)', doseApproxL: 'Einheit nicht angegeben, als g/L gelesen. Im Datenblatt prüfen.',
    paste: 'Paste', typePaste: 'Eis mit Paste (Milch-/Cremebasis + Paste)', typeSyrup: 'Sorbet mit Sirup (Sirup + Fruchtmark)', sy: 'Sirup',
    noCompPaste: 'Die Paste bringt eigenes Fett und eigenen Zucker mit: Die Zusammensetzung der fertigen Mischung hängt von der Paste ab und wird nicht berechnet. Sahne und Zucker im Rezept nach Datenblatt anpassen.',
    noCompSyrup: 'Der Sirup enthält bereits Zucker und Stabilisator: Die Zusammensetzung wird nicht berechnet. Bitte dem Datenblatt folgen.', vfat: 'Pflanzliches Fett (z. B. Kokos)', liquid: 'Wasser oder Milch (laut Datenblatt)',
    noComp: 'Komplettbasis: Die Zusammensetzung hängt vom Rezept des Herstellers ab und wird nicht berechnet. Bitte dem Datenblatt folgen.',
    highDose: 'Hohe Dosierung: Ein Teil von Zucker und Fett kann schon in der Basis stecken. Datenblatt prüfen und Zucker und Sahne entsprechend senken.'
  } : {
    btn: '📖 Ricetta consigliata', video: '▶ Video del produttore', close: 'Chiudi',
    title: 'Ricetta tipo', warnT: 'Ricetta orientativa',
    warn: 'È una ricetta tipo generica, <strong>non del produttore</strong> e non verificata in laboratorio. Solo il dosaggio del prodotto viene dalla scheda. Adatta sempre ricetta, piano igienico (HACCP) e istruzioni del produttore.',
    batch: 'Quantità di miscela (kg)', dose: 'Dosaggio (g per kg di miscela)',
    doseSheet: 'Da scheda', doseApprox: 'Unità non indicata, letta come g/kg. Verifica sulla scheda.',
    doseNone: 'Dosaggio non leggibile: inserisci il valore della scheda.',
    ing: 'Ingredienti', g: 'g', comp: 'Composizione calcolata (valori indicativi)',
    fat: 'Grassi', snf: 'Residuo secco magro', sug: 'Zuccheri totali', solids: 'Solidi totali', pac: 'PAC (potere anticongelante)',
    proc: 'Procedimento', foot: 'Valori calcolati con composizioni medie degli ingredienti. PAC con coefficienti saccarosio 1, destrosio 1,9, lattosio 1, zuccheri della frutta 1,5. Dati indicativi, senza garanzia.',
    neg: 'Con questo dosaggio non resta spazio per il liquido: controlla il dosaggio.',
    vegan: 'Il prodotto è indicato anche per ricette vegane o senza lattosio. Questa ricetta usa latte vaccino: sostituisci latte, panna e latte in polvere secondo la scheda.',
    bothModes: 'Verifica sulla scheda se il prodotto si usa a caldo o a freddo.',
    milk: 'Latte intero (3,5% grassi)', cream: 'Panna (35% grassi)', smp: 'Latte scremato in polvere', suc: 'Saccarosio', dex: 'Destrosio',
    water: 'Acqua', fruit: 'Polpa / purea di frutta', prod: 'Prodotto',
    typeCream: 'Gelato al latte / alla crema (base)', typeSorb: 'Gelato alla frutta / sorbetto',
    typeComplete: 'Base completa (basta il liquido)', typeVegan: 'Gelato vegetale (base vegana)',
    doseL: 'Dosaggio (g per litro di liquido)', doseApproxL: 'Unità non indicata, letta come g/L. Verifica sulla scheda.',
    paste: 'Pasta', typePaste: 'Gelato con pasta (base latte/crema + pasta)', typeSyrup: 'Sorbetto con sciroppo (sciroppo + polpa di frutta)', sy: 'Sciroppo',
    noCompPaste: 'La pasta porta con sé grassi e zuccheri propri: la composizione della miscela finale dipende dalla pasta e non viene calcolata. Adatta panna e zucchero secondo la scheda.',
    noCompSyrup: 'Lo sciroppo contiene già zuccheri e stabilizzante: la composizione non viene calcolata. Segui la scheda.', vfat: 'Grasso vegetale (es. cocco)', liquid: 'Acqua o latte (secondo la scheda)',
    noComp: 'Base completa: la composizione dipende dalla ricetta del produttore e non viene calcolata. Segui la scheda.',
    highDose: 'Dosaggio alto: parte dello zucchero e dei grassi può essere già nella base. Controlla la scheda e riduci zucchero e panna di conseguenza.'
  };

  var STEPS = DE ? {
    hot: [
      'Das Produkt trocken mit etwa der 5- bis 10-fachen Menge Zucker aus dem Rezept vermischen, damit es nicht klumpt.',
      'Milch und Sahne auf etwa 40–45 °C erwärmen, Magermilchpulver, Dextrose und die Zucker-Produkt-Mischung unter Rühren einarbeiten.',
      'Gemäß Ihrem Hygieneplan (HACCP) pasteurisieren, zum Beispiel 85 °C für 15–30 s oder 65 °C für 30 min.',
      'Schnell auf 4 °C abkühlen und 4–12 Stunden reifen lassen.',
      'Frieren (mantecare) und bei der vorgesehenen Temperatur lagern.'
    ],
    cold: [
      'Das Produkt trocken mit etwa der 5- bis 10-fachen Menge Zucker aus dem Rezept vermischen.',
      'Bereits pasteurisierte Milch und Sahne (oder H-Milch) verwenden. Die Mischung mit dem Stabmixer einarbeiten, bis alles gelöst ist.',
      'Laut Datenblatt ruhen lassen (meist einige Stunden im Kühlschrank bei 4 °C).',
      'Frieren (mantecare) und bei der vorgesehenen Temperatur lagern.'
    ],
    paste: [
      'Die weiße Basis zubereiten: Milch und Sahne auf etwa 40–45 °C erwärmen, Magermilchpulver, Dextrose und Zucker unter Rühren einarbeiten.',
      'Gemäß Hygieneplan (HACCP) pasteurisieren, zum Beispiel 85 °C für 15–30 s oder 65 °C für 30 min, schnell auf 4 °C abkühlen.',
      'Die Paste mit etwas abgekühlter Mischung glattrühren und dann mit dem Stabmixer in die gesamte Mischung einarbeiten.',
      'Einige Stunden bei 4 °C reifen lassen, dann frieren (mantecare) und bei der vorgesehenen Temperatur lagern.'
    ],
    syrup: [
      'Den Sirup in einen Behälter geben und, falls im Datenblatt vorgesehen, mit Wasser auf die angegebene Konzentration bringen.',
      'Das Fruchtmark unterrühren (bei säurehaltiger Frucht auf Säurebeständigkeit des Produkts achten).',
      'Laut Datenblatt kurz ruhen lassen, dann frieren (mantecare) und bei der vorgesehenen Temperatur lagern.'
    ],
    complete: [
      'Wasser oder Milch (laut Datenblatt) bei Raumtemperatur oder lauwarm vorlegen.',
      'Die Basis unter Rühren einrieseln lassen oder mit dem Stabmixer einarbeiten, bis alles ohne Klumpen gelöst ist.',
      'Ist laut Datenblatt Erhitzen vorgesehen, gemäß Hygieneplan (HACCP) pasteurisieren; bei Kaltverfahren wie angegeben ruhen lassen (meist einige Stunden bei 4 °C).',
      'Frieren (mantecare) und bei der vorgesehenen Temperatur lagern.'
    ],
    vegan: [
      'Wasser auf etwa 40 °C erwärmen. Zucker, Dextrose und das Produkt trocken vormischen und unter Rühren einarbeiten.',
      'Das pflanzliche Fett (flüssig oder geschmolzen) zugeben und mit dem Stabmixer emulgieren.',
      'Gemäß Datenblatt und Hygieneplan (HACCP) pasteurisieren, schnell auf 4 °C abkühlen und einige Stunden reifen lassen.',
      'Frieren (mantecare) und bei der vorgesehenen Temperatur lagern.'
    ],
    sorb: [
      'Das Produkt trocken mit etwa der 5- bis 10-fachen Menge Zucker aus dem Rezept vermischen.',
      'Wasser auf etwa 40 °C erwärmen, Dextrose und die Mischung unter Rühren einarbeiten, wenn nötig kurz erhitzen, bis alles gelöst ist.',
      'Das Fruchtmark zum Schluss unterrühren (bei säurehaltiger Frucht darauf achten, dass das Produkt säurebeständig ist).',
      'Auf 4 °C abkühlen, einige Stunden ruhen lassen, dann frieren (mantecare).'
    ]
  } : {
    hot: [
      'Mescola a secco il prodotto con 5–10 volte il suo peso di zucchero preso dalla ricetta, per evitare i grumi.',
      'Scalda latte e panna a circa 40–45 °C, poi aggiungi latte in polvere, destrosio e la miscela zucchero + prodotto, mescolando.',
      'Pastorizza secondo il tuo piano igienico (HACCP), per esempio 85 °C per 15–30 secondi oppure 65 °C per 30 minuti.',
      'Raffredda in fretta a 4 °C e lascia maturare 4–12 ore.',
      'Manteca e conserva alla temperatura prevista.'
    ],
    cold: [
      'Mescola a secco il prodotto con 5–10 volte il suo peso di zucchero preso dalla ricetta.',
      'Usa latte e panna già pasteurizzati (o UHT). Incorpora la miscela con il frullatore a immersione fino a scioglierla bene.',
      'Lascia riposare come indicato dalla scheda (di solito alcune ore in frigorifero a 4 °C).',
      'Manteca e conserva alla temperatura prevista.'
    ],
    paste: [
      'Prepara la base bianca: scalda latte e panna a circa 40–45 °C, aggiungi latte in polvere, destrosio e zucchero mescolando.',
      'Pastorizza secondo il tuo piano igienico (HACCP), per esempio 85 °C per 15–30 secondi oppure 65 °C per 30 minuti, poi raffredda in fretta a 4 °C.',
      'Stempera la pasta con un po’ di miscela fredda, poi incorporala a tutta la miscela con il frullatore a immersione.',
      'Lascia maturare alcune ore a 4 °C, poi manteca e conserva alla temperatura prevista.'
    ],
    syrup: [
      'Versa lo sciroppo in un contenitore e, se la scheda lo prevede, portalo alla concentrazione indicata con acqua.',
      'Aggiungi la polpa di frutta mescolando (con frutta acida controlla che il prodotto sia indicato per ambienti acidi).',
      'Lascia riposare come indicato dalla scheda, poi manteca e conserva alla temperatura prevista.'
    ],
    complete: [
      'Versa acqua o latte (secondo la scheda) a temperatura ambiente o tiepido.',
      'Aggiungi la base a pioggia mescolando, oppure con il frullatore a immersione, fino a scioglierla senza grumi.',
      'Se la scheda prevede il caldo, pastorizza secondo il tuo piano igienico (HACCP); a freddo lascia riposare come indicato (di solito alcune ore a 4 °C).',
      'Manteca e conserva alla temperatura prevista.'
    ],
    vegan: [
      'Scalda l’acqua a circa 40 °C. Mescola a secco zucchero, destrosio e prodotto, poi incorporali mescolando.',
      'Aggiungi il grasso vegetale (liquido o fuso) ed emulsiona con il frullatore a immersione.',
      'Pastorizza secondo la scheda e il tuo piano igienico (HACCP), raffredda in fretta a 4 °C e lascia maturare alcune ore.',
      'Manteca e conserva alla temperatura prevista.'
    ],
    sorb: [
      'Mescola a secco il prodotto con 5–10 volte il suo peso di zucchero preso dalla ricetta.',
      'Scalda l’acqua a circa 40 °C, aggiungi destrosio e la miscela mescolando, scaldando un poco se serve per scioglierla bene.',
      'Aggiungi la polpa di frutta alla fine (con frutta acida controlla che il prodotto sia indicato per ambienti acidi).',
      'Raffredda a 4 °C, lascia riposare alcune ore, poi manteca.'
    ]
  };

  /* ---- dati prodotto ---- */
  var data = [];
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var byKey = {};
  data.forEach(function (p) { byKey[p.azienda + '|' + p.prodotto] = p; });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(s) { return parseFloat(String(s).replace(',', '.')); }
  function fmt(x, d) {
    var v = (d === undefined) ? (x >= 100 ? 0 : x >= 10 ? 1 : 2) : d;
    var r = (Math.round(x * Math.pow(10, v)) / Math.pow(10, v)).toFixed(v);
    if (v > 0) r = r.replace(/\.?0+$/, '');
    return r.replace('.', ',');
  }
  function field(p, re) {
    var f = p.fields || {};
    for (var k in f) { if (re.test(k)) return String(f[k]); }
    return '';
  }

  /* dosaggio dichiarato -> {min,max,approx} in g/kg */
  var N = '(\\d+(?:[.,]\\d+)?)', SEP = '\\s*[-–/]\\s*';
  function rng(a, b, approx) { var x = num(a), y = b ? num(b) : x; return { min: Math.min(x, y), max: Math.max(x, y), approx: !!approx }; }
  function parseDose(p) {
    var t = field(p, /dosagg|dosier/i); if (!t) return null; var m;
    if (/^\s*n\.?\s*d\./i.test(t)) return null;
    m = t.match(new RegExp('\\(\\s*' + N + '(?:' + SEP + N + ')?\\s*(?:g|gr)\\s*\\/\\s*(?:l|L|kg)'));
    if (m) return rng(m[1], m[2]);
    m = t.match(new RegExp(N + '(?:' + SEP + N + ')?\\s*(?:g|gr)\\s*(?:\\/\\s*(?:l|L|kg|litro)|per\\s*(?:1\\s*)?(?:l|L|litro|kg)\\b)'));
    if (m) return rng(m[1], m[2]);
    m = t.match(new RegExp(N + '\\s*(?:g|gr)\\s*(?:di\\s*)?(?:prodotto|base|produkt)\\s*\\+\\s*1\\s*(?:l|L)\\b'));
    if (m) return rng(m[1]);
    m = t.match(new RegExp('^\\s*' + N + '(?:' + SEP + N + ')?\\s*%'));
    if (m) { var r = rng(m[1], m[2], true); r.min *= 10; r.max *= 10; return r; }
    m = t.match(new RegExp('^\\s*' + N + '(?:' + SEP + N + ')?\\s*(?:g|gr)?\\s*(?:\\([^)]*\\))?\\s*$'));
    if (m) return rng(m[1], m[2], true);
    return null;
  }

  function hayOf(p) { return (p.prodotto + ' ' + field(p, /^(tipo|typ|produkttyp)$/i) + ' ' + field(p, /caratteristiche|merkmale/i)).toLowerCase(); }
  function typeOf(p) {
    var h = hayOf(p), h2 = h.replace(/proteine del latte|proteine (?:di|del) latte|milchprotein\w*/g, '');
    if (/sorbett|sorbet/.test(h)) return 'sorb';
    if (/frutta|fruit|frucht|acid|säure/.test(h2) && !/crem|latte|panna|milch|sahne/.test(h2)) return 'sorb';
    return 'cream';
  }
  /* tipo di ricetta: per le basi latte distingue basi complete, vegane, a basso dosaggio */
  function kindOf(p) {
    var base = typeOf(p), cat = String(p.categoria || ''), D = parseDose(p);
    var h = hayOf(p) + ' ' + cat.toLowerCase();
    if (/^past[ae]\b|^pasten/i.test(cat)) return /sorbett|sorbet/.test(h) ? 'sorb' : 'paste';
    if (!/^basi|^basen|^bases|^fruchtbasen/i.test(cat)) return base;
    if (/frutta|frucht/i.test(cat)) return (D && D.min > 200) ? 'syrup' : base;
    if (/complet|vollst|pronta|fertig/.test(h) || (D && D.min > 200)) return 'complete';
    if (/vegan|pflanzlich/.test(h)) return 'vegan';
    return base;
  }
  function modeOf(p) {
    var h = hayOf(p), hot = /a caldo|\bcaldo\b|warm|heiß/.test(h), cold = /a freddo|\bfreddo\b|kalt/.test(h);
    if (cold && !hot) return 'cold';
    if (hot && !cold) return 'hot';
    return (hot && cold) ? 'both' : 'unk';
  }

  /* ---- calcolo (per 1000 g di miscela) ---- */
  function calc(type, D) {
    var rows, o = {}, cream, smp, suc, dex, fruit;
    if (type === 'cream' || type === 'paste') {
      cream = 130; smp = 30; suc = 150; dex = 40;
      var milk = 1000 - cream - smp - suc - dex - D;
      rows = [['milk', milk], ['cream', cream], ['smp', smp], ['suc', suc], ['dex', dex], ['prod', D]];
      var fat = (milk * 3.5 + cream * 35 + smp * 0.8) / 100;
      var snf = (milk * 8.7 + cream * 5.6 + smp * 95.5) / 100;
      var lac = (milk * 4.8 + cream * 3.0 + smp * 51) / 100;
      o.fat = fat / 10; o.snf = snf / 10;
      o.sug = (suc + dex * 0.92 + lac) / 10;
      o.solids = (fat + snf + suc + dex * 0.92 + D) / 10;
      o.pac = suc + dex * 1.9 + lac;
      o.liquid = milk;
      if (type === 'paste') o.noComp = true;
    } else if (type === 'complete') {
      var sc = 1000 / (1000 + D);
      rows = [['liquid', 1000 * sc], ['prod', D * sc]];
      o.liquid = 1000 * sc; o.noComp = true;
    } else if (type === 'syrup') {
      var fr = 350, wsy = 1000 - fr - D;
      rows = [['fruit', fr], ['prod', D], ['water', wsy]];
      o.liquid = wsy; o.noComp = true;
    } else if (type === 'vegan') {
      var vf = 60; suc = 140; dex = 40;
      var wv = 1000 - vf - suc - dex - D;
      rows = [['water', wv], ['vfat', vf], ['suc', suc], ['dex', dex], ['prod', D]];
      o.fat = vf / 10;
      o.sug = (suc + dex * 0.92) / 10;
      o.solids = (vf + suc + dex * 0.92 + D) / 10;
      o.pac = suc + dex * 1.9;
      o.liquid = wv;
    } else {
      fruit = 350; suc = 200; dex = 45;
      var water = 1000 - fruit - suc - dex - D;
      rows = [['water', water], ['fruit', fruit], ['suc', suc], ['dex', dex], ['prod', D]];
      var fs = fruit * 0.095;
      o.sug = (suc + dex * 0.92 + fs) / 10;
      o.solids = (fruit * 0.12 + suc + dex * 0.92 + D) / 10;
      o.pac = suc + dex * 1.9 + fs * 1.5;
      o.liquid = water;
    }
    o.rows = rows; return o;
  }

  /* ---- finestra ---- */
  var css = document.createElement('style');
  css.textContent =
    '.rt-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}' +
    '.rt-actions .btn-lite,.rt-actions a.btn-lite{min-height:44px;display:inline-flex;align-items:center;text-decoration:none}' +
    '.rt-ov{position:fixed;inset:0;z-index:10000;background:rgba(30,20,12,.55);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow:auto}' +
    '.rt-box{background:var(--paper,#fffaf3);color:var(--ink,#2b2320);border-radius:14px;max-width:720px;width:100%;margin:auto;padding:20px 20px 24px;box-shadow:0 20px 60px rgba(0,0,0,.35)}' +
    '.rt-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}' +
    '.rt-box h3{margin:0 0 2px;font-size:1.25rem}' +
    '.rt-sub{color:var(--ink-soft,#6b5f58);font-size:.9rem;margin:0 0 10px}' +
    '.rt-x{min-height:44px;min-width:44px;border:1px solid var(--line,#e7dccd);background:#fff;border-radius:10px;font:inherit;font-weight:700;cursor:pointer;color:var(--brand,#c0392b);padding:0 14px}' +
    '.rt-warn{background:#fff7e0;border-left:5px solid #e0a100;border-radius:8px;padding:10px 14px;font-size:.88rem;margin:10px 0}' +
    '.rt-ctl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:12px 0}' +
    '.rt-ctl label{display:block;font-size:.82rem;font-weight:700;margin-bottom:4px}' +
    '.rt-ctl input{width:100%;min-height:44px;border:1px solid var(--line,#e7dccd);border-radius:10px;padding:8px 10px;font:inherit;background:#fff}' +
    '.rt-note{font-size:.78rem;color:var(--ink-soft,#6b5f58);margin:4px 0 0}' +
    '.rt-box h4{margin:16px 0 6px;font-size:1rem}' +
    '.rt-tab{width:100%;border-collapse:collapse;font-size:.92rem}' +
    '.rt-tab td{padding:6px 4px;border-bottom:1px solid var(--line,#e7dccd)}' +
    '.rt-tab td:last-child{text-align:right;font-weight:700;white-space:nowrap}' +
    '.rt-tab tr.rt-p td{color:var(--brand,#c0392b);font-weight:700}' +
    '.rt-box ol{margin:6px 0 0;padding-left:22px;font-size:.92rem}' +
    '.rt-box li{margin:4px 0}' +
    '.rt-err{color:#a12727;font-weight:700;font-size:.88rem;margin:8px 0}' +
    '.rt-foot{font-size:.76rem;color:var(--ink-soft,#6b5f58);margin-top:14px}' +
    '.rt-vid{display:inline-flex;align-items:center;min-height:44px;margin-top:10px;font-weight:700;color:var(--brand,#c0392b)}' +
    '.rt-x:focus-visible,.rt-ctl input:focus-visible,.rt-actions a:focus-visible,.rt-actions button:focus-visible,.rt-vid:focus-visible{outline:3px solid #ffb703;outline-offset:2px}';
  document.head.appendChild(css);

  var ov = null, lastFocus = null;
  function close() {
    if (!ov) return;
    document.removeEventListener('keydown', onKey, true);
    ov.parentNode.removeChild(ov); ov = null;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab' && ov) {
      var f = ov.querySelectorAll('button,input,a[href]'); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(p, trigger) {
    lastFocus = trigger; if (ov) close();
    var type = kindOf(p), mode = modeOf(p), dose = parseDose(p), vid = VIDEOS[p.azienda + '|' + p.prodotto] || VIDEOS[p.azienda];
    var def = dose ? Math.round((dose.min + dose.max) / 2 * 10) / 10 : (type === 'complete' ? 300 : (type === 'paste' ? 80 : (type === 'syrup' ? 250 : (/^basi|^basen|^bases/i.test(p.categoria || '') ? (type === 'vegan' ? 100 : 50) : 5))));
    var doseTxt = dose ? (dose.min === dose.max ? fmt(dose.min) : fmt(dose.min) + '–' + fmt(dose.max)) + (type === 'complete' ? ' g/L' : ' g/kg') : '';
    var steps = (type === 'sorb' || type === 'complete' || type === 'vegan' || type === 'paste' || type === 'syrup') ? STEPS[type] : (mode === 'cold' ? STEPS.cold : STEPS.hot);
    var typeLbl = { sorb: T.typeSorb, cream: T.typeCream, complete: T.typeComplete, vegan: T.typeVegan, paste: T.typePaste, syrup: T.typeSyrup }[type];
    var vegan = /vegan|senza lattosio|laktosefrei|lactose/i.test(hayOf(p));

    ov = document.createElement('div'); ov.className = 'rt-ov';
    ov.innerHTML =
      '<div class="rt-box" role="dialog" aria-modal="true" aria-labelledby="rt-t">' +
      '<div class="rt-head"><div><h3 id="rt-t">' + esc(T.title) + ': ' + esc(p.prodotto) + '</h3>' +
      '<p class="rt-sub">' + esc(p.azienda) + ' · ' + esc(typeLbl) + '</p></div>' +
      '<button type="button" class="rt-x" id="rt-close">' + esc(T.close) + ' ✕</button></div>' +
      '<div class="rt-warn"><strong>' + esc(T.warnT) + '.</strong> ' + T.warn + '</div>' +
      '<div class="rt-ctl">' +
      '<div><label for="rt-kg">' + esc(T.batch) + '</label><input id="rt-kg" type="number" inputmode="decimal" min="0.1" step="0.1" value="1"></div>' +
      '<div><label for="rt-dose">' + esc(type === 'complete' ? T.doseL : T.dose) + '</label><input id="rt-dose" type="number" inputmode="decimal" min="0" step="0.1" value="' + def + '">' +
      '<p class="rt-note">' + (dose ? esc(T.doseSheet) + ': ' + esc(doseTxt) + (dose.approx ? '. ' + esc(type === 'complete' ? T.doseApproxL : T.doseApprox) : '') : esc(T.doseNone)) + '</p></div>' +
      '</div>' +
      '<div id="rt-out" aria-live="polite"></div>' +
      '<h4>' + esc(T.proc) + '</h4><ol>' + steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      (mode === 'both' || mode === 'unk' ? '<p class="rt-note">' + esc(T.bothModes) + '</p>' : '') +
      (vegan && type !== 'vegan' ? '<p class="rt-note">' + esc(T.vegan) + '</p>' : '') +
      (type === 'cream' && dose && dose.min > 100 ? '<p class="rt-note">' + esc(T.highDose) + '</p>' : '') +
      (vid ? '<a class="rt-vid" href="' + esc(vid.url) + '" target="_blank" rel="noopener noreferrer">' + esc(T.video) + (vid.title ? ': ' + esc(vid.title) : '') + ' ↗</a>' : '') +
      '<p class="rt-foot">' + esc(T.foot) + '</p></div>';
    document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    var kgI = ov.querySelector('#rt-kg'), dI = ov.querySelector('#rt-dose'), out = ov.querySelector('#rt-out');

    function draw() {
      var kg = num(kgI.value), D = num(dI.value);
      if (!(kg > 0)) kg = 1; if (!(D >= 0)) D = 0;
      var r = calc(type, D);
      if (r.liquid < 0) { out.innerHTML = '<p class="rt-err">' + esc(T.neg) + '</p>'; return; }
      var tb = '<h4>' + esc(T.ing) + ' (' + fmt(kg, 2) + ' kg)</h4><table class="rt-tab"><tbody>' +
        r.rows.map(function (x) {
          var g = x[1] * kg, label = x[0] === 'prod' ? (type === 'paste' ? T.paste : type === 'syrup' ? T.sy : T.prod) + ': ' + p.prodotto : (x[0] === 'liquid' && /acqua|wasser/i.test(hayOf(p)) ? T.water : T[x[0]]);
          return '<tr' + (x[0] === 'prod' ? ' class="rt-p"' : '') + '><td>' + esc(label) + '</td><td>' + fmt(g, g < 10 ? 1 : 0) + ' ' + T.g + '</td></tr>';
        }).join('') + '</tbody></table>';
      if (r.noComp) { out.innerHTML = tb + '<p class="rt-note">' + esc(type === 'paste' ? T.noCompPaste : type === 'syrup' ? T.noCompSyrup : T.noComp) + '</p>'; return; }
      var cp = '<h4>' + esc(T.comp) + '</h4><table class="rt-tab"><tbody>' +
        (type === 'cream' ? '<tr><td>' + esc(T.fat) + '</td><td>' + fmt(r.fat, 1) + ' %</td></tr><tr><td>' + esc(T.snf) + '</td><td>' + fmt(r.snf, 1) + ' %</td></tr>' : '') +
        (type === 'vegan' ? '<tr><td>' + esc(T.fat) + '</td><td>' + fmt(r.fat, 1) + ' %</td></tr>' : '') +
        '<tr><td>' + esc(T.sug) + '</td><td>' + fmt(r.sug, 1) + ' %</td></tr>' +
        '<tr><td>' + esc(T.solids) + '</td><td>' + fmt(r.solids, 1) + ' %</td></tr>' +
        '<tr><td>' + esc(T.pac) + '</td><td>≈ ' + fmt(r.pac, 0) + '</td></tr></tbody></table>';
      out.innerHTML = tb + cp;
    }
    kgI.addEventListener('input', draw); dI.addEventListener('input', draw); draw();
    document.addEventListener('keydown', onKey, true);
    ov.querySelector('#rt-close').addEventListener('click', close);
    ov.querySelector('#rt-close').focus();
  }

  /* ---- pulsanti sulle schede ---- */
  function decorate() {
    Array.prototype.forEach.call(results.querySelectorAll('.torte-result-card'), function (c) {
      if (c.querySelector('.rt-actions')) return;
      var a = c.querySelector('.torte-azienda'), n = c.querySelector('.torte-prodotto'); if (!a || !n) return;
      var p = byKey[a.textContent + '|' + n.textContent]; if (!p || p.categoria === 'Proteine' || /^cremini/i.test(p.categoria || '')) return;
      var box = document.createElement('div'); box.className = 'rt-actions';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn-lite'; b.textContent = T.btn;
      b.addEventListener('click', function () { open(p, b); });
      box.appendChild(b);
      var v = VIDEOS[p.azienda + '|' + p.prodotto] || VIDEOS[p.azienda];
      if (v) { var l = document.createElement('a'); l.className = 'btn-lite'; l.href = v.url; l.target = '_blank'; l.rel = 'noopener noreferrer'; l.textContent = T.video + ' ↗'; box.appendChild(l); }
      c.appendChild(box);
    });
  }
  decorate();
  new MutationObserver(decorate).observe(results, { childList: true });
})();
