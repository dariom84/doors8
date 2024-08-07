console.log("BeforeRender desde repo...");

//Ejemplo include de un modulo de renderControls
var rc = await import(gitCdn({ owner: ctx.owner, repo: ctx.repo, path: '/Contacts/Client/Lib/renderControls.mjs', fresh: ctx.fresh, url: true }));

//pagina/documento actual que se esta dibujando 
var $d = $(document);

//Me subo al evento renderControl y pregunto por cada control que va dibujar
$d.on('renderControl', async (ev) => {
    await rc.renderControl({
                                ctx: ctx,
                                evDetail: ev.detail
                            });
});

$d.on('afterRender', (ev) => {
    console.log("afterRender desde repo");
});

$d.on('afterFillControls', (ev) => {
    console.log("afterFillControls desde repo");
});

$d.on('beforeSave', (ev) => {
    console.log("beforeSave desde repo");
    doc.fields("name").value = "probando...";
});