//https://cdn.cloudycrm.net/ghcv/global/workflow.mjs

console.log("beforesave server");

//Para que funcione intelliSense, copiar el modulo en el proyecto pero no es que toma el import
/** @type {import('../../_types/workflow.mjs')} */

var wkfMod = await mlib.gitImport({ repo: 'Global', path: 'workflow.mjs' });
wkfMod.setContext(ctx);

wkfMod.requeridos('surname');
wkfMod.raiseWkfErrors();