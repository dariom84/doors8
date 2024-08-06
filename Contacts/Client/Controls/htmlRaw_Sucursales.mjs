export async function render(options){
    debugger;

    var mjsRenderTable = await import(gitCdn({ owner: options.ctx.owner, repo: options.ctx.repo, path: '/Contacts/Client/Common/renderTable.mjs', fresh: true, url: true }));

    let opsSearch = {
                        fields: 'id, name, city, country',
                        formula: '',
                        order: 'id asc',
                        maxDocs: 0
                    }

    let opsTable =  {
                        path: '/contacts_root/admin/branches',
                        id: 'sucursales',
                        columns: 'Nro,Sucursal,Ciudad,País'
                    }

    let table = await mjsRenderTable.drawTable(opsSearch, opsTable);

    if (!doc.isNew) {
        options.evDetail.$this.append(table);
    }
}