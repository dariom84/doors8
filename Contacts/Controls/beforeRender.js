console.log("BeforeRender desde repo...");

var fn = await import(gitCdn({ repo: ctx.repo, path: '/Contacts/Controls/functions.mjs', fresh: true, url: true }));
console.log(fn.saludar());

debugger;

var $d = $(document);

var fldAreas = await dSession.foldersGetFromId(1008);
var res = await fldAreas.search({
                                    fields: 'id, area',
                                    formula: 'id <> 1',
                                    order: 'id asc',
                                    maxDocs: 0
                                })

console.log(res);