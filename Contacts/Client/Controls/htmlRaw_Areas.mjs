export async function render(options){
    debugger;

    var mjsRenderTable = await import(gitCdn({ owner: options.ctx.owner, repo: options.ctx.repo, path: '/Contacts/Client/Common/renderTable.mjs', fresh: true, url: true }));

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

    let table = await mjsRenderTable.drawTable(opsSearch, opsTable);

    if (!doc.isNew) {
        options.evDetail.$this.append(table);
    }
}

/*async function drawTable(opsSearch, opsTable){
    let table;

    let resSearch = await drawTableSearch(opsSearch, opsTable.path);
    let columnsValue = opsTable.columns;

    if (resSearch && columnsValue){
        let fieldsValue = opsSearch.fields;

        table = `<table id='${opsTable.id}' class='table table-striped'><thead class='table-dark'><tr>`;

        let columnsArray = columnsValue.split(',');
        let fieldsArray = fieldsValue.split(',')

        //Armo la cabecera con las columnas
        columnsArray.forEach(column => {
            table += `<th scope='col'>${column}</th>`;
        });

        table += `</tr></thead><tbody>`;

        //Armo el body de la tabla
        resSearch.forEach(elem => {
            table += `<tr>`;

            fieldsArray.forEach(field => {
                let sField = field.trim().toUpperCase();
                table += `<td>${elem[sField]}</td>`;
            });

            table += `</tr>`;
        });

        table += `</tbody></table>`;
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
}*/