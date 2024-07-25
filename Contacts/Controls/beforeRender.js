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
        case 'date_birth': //control de tipo datepicker, le deshabilito una fecha
            debugger;
            ctx.bsctl.datetimepicker('disabledDates', ['26/7/2024']);
            break;
        case 'htmlRaw_Message':
            debugger;
            ctx.$this.append(`<h3>${doc.fields('surname').value}, ${doc.fields('NAME').value}</h3>`);
            break;
    }
});