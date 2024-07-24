console.log("BeforeRender desde repo...");

debugger;

var $d = $(document);

var fld = await dSession.foldersGetFromId(1003);
var res = await fld.search();

console.log(res);