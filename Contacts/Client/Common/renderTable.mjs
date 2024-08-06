export async function drawTable(opsSearch, opsTable){
    let table;

    let resSearch = await tableSearch(opsSearch, opsTable.path);
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

async function tableSearch(opsSearch, pathSearch){
    var res = {};

    if (pathSearch) {
        var fld = await dSession.folders(pathSearch, 1001);
        res = await fld.search(opsSearch);
    }

    return res;
}