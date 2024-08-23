//https://cdn.cloudycrm.net/ghcv/global/workflow.mjs

console.log("beforesave server");

//Para que funcione intelliSense, copiar el modulo en el proyecto pero no es que toma el import
/** @type {import('../../_types/workflow.mjs')} */
/** @type {import('../../_types/doorsapi2.mjs')} */

var wkfMod = await mlib.gitImport({ repo: 'Global', path: 'workflow.mjs' });
wkfMod.setContext(ctx);

wkfMod.requeridos('surname');
wkfMod.raiseWkfErrors();

//Busco si existe la nueva area
if (doc.fields("newarea").valueChanged){
    var fldAreas = await dSession.folders("/contacts_root/admin/area", 1001);
    res = await fldAreas.search({
                                fields: 'id',
                                formula: 'area = ' + dSession.db.sqlEnc(doc.fields("newarea").value, 1)
                            });
    
    if (res.length == 0){
        var docArea = await fldAreas.documentsNew();
        docArea.fields("id").value = 5;
        docArea.fields("area").value = doc.fields("newarea").value;
        await docArea.save();
    }
}