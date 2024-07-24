console.log("BeforeRender desde repo...");

debugger;

var $d = $(document);

dSession.foldersGetFromId(1003)

var fld = await dSession.foldersGetFromId(1003);
var res = await fld.search();

console.log(res);