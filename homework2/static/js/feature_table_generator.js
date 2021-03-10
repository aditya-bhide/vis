function show_table(feature_data) {
    node = document.getElementById("imp-features-table-div")

    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    feature_table_values = feature_data
    var table = document.createElement("TABLE");
    table.setAttribute("id", "imp-feature-table");
    document.getElementById("imp-features-table-div").appendChild(table)

    var header = table.createTHead();
    var row = header.insertRow(0);
    row.setAttribute("class", "head-table")
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "<b>Features</b>";
    var cell2 = row.insertCell(1);
    cell2.innerHTML = "<b>Sum of squared loadings</b>"

    for (var key in feature_table_values) {
        var newRow = table.insertRow(table.length);
        newRow.setAttribute("class", "table-content")
        var cell1 = newRow.insertCell();
        cell1.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);;
        var cell2 = newRow.insertCell();
        cell2.innerHTML = feature_table_values[key];
    }
}