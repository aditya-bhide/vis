let features_table_data = [
    { name: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
    { name: "Monte Falterona", height: 1654, place: "Parco Foreste Casentinesi" },
    { name: "Poggio Scali", height: 1520, place: "Parco Foreste Casentinesi" },
    { name: "Pratomagno", height: 1592, place: "Parco Foreste Casentinesi" },
    { name: "Monte Amiata", height: 1738, place: "Siena" }
];
let feature_table = document.getElementById("mp-feature-table");
let header = features_table.createTHeadd();
var row = header.insertRow(0);
var cell = row.insertCell(0);
cell.innerHTML = "<b>This is a table header</b>";

function create_table() {

}