console.log("BeforeRender desde repo...");

debugger;

var $d = $(document);

var fldAreas = await dSession.foldersGetFromId(1005);
var res = await fldAreas.search();

console.log(res);