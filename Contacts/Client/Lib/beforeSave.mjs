export async function beforeSaveActions(options){
    console.log("beforeSave desde repo");
    doc.fields("name").value = "...";
}