export function renderControl(ctx){
    var ctlName = ctx.ctl.NAME;

    switch (ctlName) {
        case 'date_birth': //control de tipo datepicker, le deshabilito una fecha
            debugger;
            ctx.bsctl.datetimepicker('disabledDates', ['26/7/2024']);
            if (doc.isNew) doc.fields('date_birth', new Date());
            break;
        case 'htmlRaw_Message':
            debugger;
            if (!doc.isNew) ctx.$this.append(`<h3>${doc.fields('surname').value}, ${doc.fields('NAME').value}</h3>`);
            break;
    }
}