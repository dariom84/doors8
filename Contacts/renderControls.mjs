export async function renderControl(ctx, evnDetail){
    var ctrlHtmlRawMessage = await import(gitCdn({ owner: ctx.owner, repo: ctx.repo, path: '/Contacts/Controls/htmlRaw_Message.mjs', fresh: true, url: true }));
    var ctrldateBirth = await import(gitCdn({ owner: ctx.owner, repo: ctx.repo, path: '/Contacts/Controls/date_birth.mjs', fresh: true, url: true }));

    var ctlName = evnDetail.ctl.NAME;

    switch (ctlName) {
        case 'date_birth': 
            ctrldateBirth.render(ctx, evnDetail);
            break;
        case 'htmlRaw_Message':
            await ctrlHtmlRawMessage.render(evnDetail);
            break;
    }
}