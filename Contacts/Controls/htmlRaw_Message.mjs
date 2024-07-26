export async function render(ctx){
    let area = await getArea();

    if (!doc.isNew) ctx.$this.append(`<h3>${doc.fields('surname').value}, ${doc.fields('NAME').value}, area: ${area}</h3>`);
}

async function getArea(){
    //Ejemplo de un seach a la carpeta de areas por id
    var fldAreas = await dSession.folders("/contacts_root/admin/area", 1001);
    var res = await fldAreas.search({
                                        fields: 'id, area',
                                        formula: 'id <> 1',
                                        order: 'id asc',
                                        maxDocs: 0
                                    })

    return res[0].AREA;
}