console.log("BeforeRender desde repo...");

debugger;

//Ejemplo include de un modulo de renderControls
var rc = await import(gitCdn({ owner: ctx.owner, repo: ctx.repo, path: '/Contacts/renderControls.mjs', fresh: true, url: true }));

//Ejemplo de un seach a la carpeta de areas por id
var fldAreas = await dSession.foldersGetFromId(1008);
var res = await fldAreas.search({
                                    fields: 'id, area',
                                    formula: 'id <> 1',
                                    order: 'id asc',
                                    maxDocs: 0
                                })

console.log(res);

//pagina/documento actual que se esta dibujando
var $d = $(document);

//Me subo al evento renderControl y pregunto por cada control que va dibujar
$d.on('renderControl', (ev) => {
    rc.renderControls(ev.detail);
});


$d.on('afterRender', (ev) => {
    console.log("afterRender desde repo");
});

$d.on('afterFillControls', (ev) => {
    console.log("afterFillControls desde repo");
});