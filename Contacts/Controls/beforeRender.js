console.log("BeforeRender desde repo...");

debugger;

var $d = $(document);

var fld = await dSession.FoldersGetFromId(1001).app.folders("/contacts_root/Contacts");
var res = await fld.search();

console.log(res);