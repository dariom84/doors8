var wkMod = await mlib.gitImport({ repo: 'Global', path: 'worklow.mjs' });
wkMod.setContext(ctx);

wkMod.requeridos('surname');
wkMod.raiseWfErros();