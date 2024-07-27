export  function render(ctx, evnDetail){
    //control de tipo datepicker, le deshabilito una fecha
    evnDetail.bsctl.datetimepicker('disabledDates', ['26/7/2024']);
    if (doc.isNew) doc.fields('date_birth', new Date());
}