export async function renderControls(ctx){
    var ctrlHtmlRawMessage = await import(gitCdn({ owner: ctx.owner, repo: ctx.repo, path: '/Contacts/Controls/htmlRaw_Message.mjs', fresh: true, url: true }));

    var ctlName = ctx.ctl.NAME;

    switch (ctlName) {
        case 'date_birth': //control de tipo datepicker, le deshabilito una fecha
            debugger;
            ctx.bsctl.datetimepicker('disabledDates', ['26/7/2024']);
            if (doc.isNew) doc.fields('date_birth', new Date());
            break;
        case 'htmlRaw_Message':
            debugger;
            //if (!doc.isNew) ctx.$this.append(`<h3>${doc.fields('surname').value}, ${doc.fields('NAME').value}</h3>`);
            ctrlHtmlRawMessage.renderControl(ctx);
            break;
    }
}