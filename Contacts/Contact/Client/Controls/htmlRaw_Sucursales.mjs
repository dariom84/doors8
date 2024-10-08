export async function render(options){
    debugger;

    var mjsRenderTable = await import(gitCdn({ owner: options.ctx.owner, repo: options.ctx.repo, path: '/Contacts/Contact/Client/Common/renderTable.mjs', fresh: options.ctx.fresh, url: true }));

    let opsSearch = {
                        fields: 'id, name, city, country',
                        formula: '',
                        order: 'id asc',
                        maxDocs: 0
                    }

    let opsTable =  {
                        path: '/contacts_root/admin/branches',
                        id: 'sucursales',
                        columns: 'Nro,Sucursal,Ciudad,Pa�s'
                    }

    let table = await mjsRenderTable.drawTable(opsSearch, opsTable);

    if (!doc.isNew) {
        options.evDetail.$this.append(table);
    }
}