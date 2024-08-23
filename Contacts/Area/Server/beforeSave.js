//Para que funcione intelliSense, copiar el modulo en el proyecto pero no es que toma el import
/** @type {import('../../../_types/workflow.mjs')} */
/** @type {import('../../../_types/doorsapi2.mjs')} */

var wkfMod = await mlib.gitImport({ repo: 'Global', path: 'workflow.mjs' });
wkfMod.setContext(ctx);

wkfMod.requeridos('area');
wkfMod.raiseWkfErrors();

doc.fields("id").value = await dSession.db.nextVal("areas");