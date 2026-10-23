// Annunci del mercatino. Aggiorna solo questo file per pubblicare, modificare o togliere annunci.
// Formato di ogni annuncio (esempio, da copiare dentro le parentesi quadre e separare con la virgola):
// {"id":"M-001","prodotto":"Nome prodotto","marca":"Marca","categoria":"Basi latte","quantita":"10","unita":"kg",
//  "scadenza":"2027-03-31","paese":"Italia","regione":"Puglia","tipo":"azienda","prezzo":"","scambio":false,"note":""}
// La categoria e il paese devono avere lo stesso nome usato nei filtri della pagina (italiano su gelateriaingredienti, tedesco su eisdieleinfo).
// Gli annunci con scadenza a meno di 30 giorni, o già scaduta, spariscono da soli dalla griglia.
window.MERCATINO_ANNUNCI = [
  {"id": "ESEMPIO-1", "esempio": true, "prodotto": "Base Frutta - Frutta", "marca": "MEC3", "categoria": "Basi frutta", "quantita": "1", "unita": "sacchetto da 2 kg", "scadenza": "2027-07-31", "prezzo": "", "scambio": false, "note": "Annuncio di esempio per mostrare come funziona il Mercatino: il prodotto non è in vendita.", "foto": "esempio-mec3-base-frutta.jpg"},
  {"id": "ESEMPIO-2", "esempio": true, "prodotto": "DPO Super 100 F Classic", "marca": "Aromitalia", "categoria": "Basi latte", "quantita": "1", "unita": "sacchetto", "scadenza": "2027-07-31", "prezzo": "", "scambio": false, "note": "Annuncio di esempio per mostrare come funziona il Mercatino: il prodotto non è in vendita.", "foto": "esempio-aromitalia-dpo-super-100f.jpg"}
];
