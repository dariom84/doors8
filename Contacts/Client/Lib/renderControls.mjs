export async function renderControl(options){
    var ctrlHtmlRawMessage = await import(gitCdn({ owner: options.ctx.owner, repo: options.ctx.repo, path: '/Contacts/Client/Controls/htmlRaw_Message.mjs', fresh: options.ctx.fresh, url: true }));
    var ctrldateBirth = await import(gitCdn({ owner: options.ctx.owner, repo: options.ctx.repo, path: '/Contacts/Client/Controls/date_birth.mjs', fresh: options.ctx.fresh, url: true }));
    var ctrlhtmlRawAreas = await import(gitCdn({ owner: options.ctx.owner, repo: options.ctx.repo, path: '/Contacts/Client/Controls/htmlRaw_Areas.mjs', fresh: options.ctx.fresh, url: true }));

    var ctlName = options.evDetail.ctl.NAME

    switch (ctlName) {
        case 'date_birth': 
            ctrldateBirth.render(options);
            break;
        case 'htmlRaw_Message':
            await ctrlHtmlRawMessage.render(options);
            break;
        case 'htmlRaw_Areas':
            await ctrlhtmlRawAreas.render(options);
            break;
    }
}