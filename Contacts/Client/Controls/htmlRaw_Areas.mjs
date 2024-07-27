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
                    }

    let table = await drawTable(opsSearch, opsTable);

    if (!doc.isNew) options.evDetail.$this.append(`<h4>Listado de Areas</h4>`);
}

async function drawTable(opsSearch, opsTable){
    let table = "<p>aca va mi tabla</>"
    let resSearch = await drawTableSearch(opsSearch, opsTable.path);

    if (resSearch){

    }

    return table;
}

async function drawTableSearch(opsSearch, pathSearch){
    var res = {};

    if (pathFolder) {
        var fld = await dSession.folders(pathSearch, 1001);
        res = await fld.search(opsSearch);
    }

    return res;
}