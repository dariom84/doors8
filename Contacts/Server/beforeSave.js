console.log("beforesave server");

var wkfMod = await mlib.gitImport({ repo: 'Global', path: 'workflow.mjs' });
wkfMod.setContext(ctx);

wkfMod.requeridos('surname');
wkfMod.raiseWkfErrors();