console.log("BeforeRender desde repo...");

debugger;

var $d = $(document);

var fldAreas = await dSession.foldersGetFromId(1005);
var res = await fldAreas.search({
                                    fields: 'id, name',
                                    formula: 'id <> 1',
                                    order: 'id asc',
                                    maxDocs: 0
                                })

console.log(res);