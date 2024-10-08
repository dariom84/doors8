export async function render(options){
    debugger;

    var mjsRenderTable = await import(gitCdn({ owner: options.ctx.owner, repo: options.ctx.repo, path: '/Contacts/Contact/Client/Common/renderTable.mjs', fresh: options.ctx.fresh, url: true }));

    let opsSearch = {
                        fields: 'id, area',
                        formula: '',
                        order: 'id asc',
                        maxDocs: 0
                    }

    let opsTable =  {
                        path: '/contacts_root/admin/area',
                        id: 'areas',
                        columns: 'Nro,Area'
                    }

    let table = await mjsRenderTable.drawTable(opsSearch, opsTable);

    if (!doc.isNew) {
        options.evDetail.$this.append(table);
    }
}