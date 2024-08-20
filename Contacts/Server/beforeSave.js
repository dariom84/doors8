var wkfMod = await mlib.gitImport({ repo: 'Global', path: 'worklow.mjs' });
wkfMod.setContext(ctx);

wkfMod.requeridos('surname');
wkfMod.raiseWkfErrors();