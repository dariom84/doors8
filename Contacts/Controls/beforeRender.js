console.log("BeforeRender desde repo...");

debugger;

var $d = $(document);

var fld = await folder.folders('contacts');
var res = await fld.search();

console.log(res);