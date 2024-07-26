export function renderHtmlRawMessage(ctx){
    if (!doc.isNew) ctx.$this.append(`<h3>${doc.fields('surname').value}, ${doc.fields('NAME').value}</h3>`);
}