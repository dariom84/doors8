console.log("BeforeRender desde repo...");

debugger;

//Ejemplo include de un modulo de funciones
var fn = await import(gitCdn({ owner: ctx.owner, repo: ctx.repo, path: '/Contacts/functions.mjs', fresh: true, url: true }));
console.log(fn.saludar());

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
    var ctx = ev.detail;
    var ctlName = ctx.ctl.NAME;

    switch (ctlName) {
        case 'name':
            debugger;
            break;
        case 'date_birth':
            debugger;
            bsctl.datetimerpicker('disabledDates', ['26/7/2024'])
            break;
    }
});