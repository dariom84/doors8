export async function render(options){
    //let area = await getArea(doc.fields('areaid').value);
    debugger;

    let opsSearch = {
                        fields: 'id, area',
                        formula: '',
                        order: 'id asc',
                        maxDocs: 0
                    }

    let opsTable =  {
                        path: '/contacts_root/admin/area',
                        id: 'areas',
                        columns: 'Nro,Area'
                    }

    let table = await drawTable(opsSearch, opsTable);

    if (!doc.isNew) {
        options.evDetail.$this.append(table);
    }
}

async function drawTable(opsSearch, opsTable){
    let table;
    let resSearch = await drawTableSearch(opsSearch, opsTable.path);

    let columnsValue = opsTable.columns;

    if (resSearch && columnsValue){
        table = "<table class='table table-striped'><thead class='table-dark'><tr>";

        let columnsArray = columnsValue.split(',');

        columnsArray.forEach(column => {
            table += `<th scope='col'>${column}</th>`;
        });

        table += "</tr</thead>";

        table += "<tbody>"



        table += "</tbody></table>"
    }

    return table;
}

async function drawTableSearch(opsSearch, pathSearch){
    var res = {};

    if (pathSearch) {
        var fld = await dSession.folders(pathSearch, 1001);
        res = await fld.search(opsSearch);
    }

    return res;
}