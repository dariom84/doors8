export async function renderControl(ctx, evnDetail){
    var ctrlHtmlRawMessage = await import(gitCdn({ owner: ctx.owner, repo: ctx.repo, path: '/Contacts/Controls/htmlRaw_Message.mjs', fresh: true, url: true }));

    var ctlName = evnDetail.ctl.NAME;

    switch (ctlName) {
        case 'date_birth': //control de tipo datepicker, le deshabilito una fecha
            debugger;
            evnDetail.bsctl.datetimepicker('disabledDates', ['26/7/2024']);
            if (doc.isNew) doc.fields('date_birth', new Date());
            break;
        case 'htmlRaw_Message':
            debugger;
            await ctrlHtmlRawMessage.renderControl(evnDetail);
            break;
    }
}