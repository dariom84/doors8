export async function render(ctx){
    let area = await getArea();

    if (!doc.isNew) ctx.$this.append(`<h3>${doc.fields('surname').value}, ${doc.fields('NAME').value}, area: ${area}</h3>`);
}

async function getArea(){
    //Ejemplo de un seach a la carpeta de areas por id
    //await dSession.folders("/brevo_root/connections",1001)
    var fldAreas = await dSession.foldersGetFromId(1008);
    var res = await fldAreas.search({
                                        fields: 'id, area',
                                        formula: 'id <> 1',
                                        order: 'id asc',
                                        maxDocs: 0
                                    })

    return res[0].AREA;
}