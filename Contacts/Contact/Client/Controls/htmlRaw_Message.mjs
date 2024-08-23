export async function render(options){
    let area = await getArea(doc.fields('areaid').value);

    if (!doc.isNew) options.evDetail.$this.append(`<h3>${doc.fields('surname').value}, 
                                            ${doc.fields('NAME').value}, 
                                            Area: ${area}</h3>`);
}

//Ejemplo de un seach a la carpeta de areas por id
async function getArea(idArea){
    let area = '';

    if (idArea) {
        var fldAreas = await dSession.folders("/contacts_root/admin/area", 1001);
        var res = await fldAreas.search({
                                            fields: 'id, area',
                                            formula: `id = ${idArea}`,
                                            order: 'id asc',
                                            maxDocs: 0
                                        })
        area = res[0].AREA;
    }

    return area;
}