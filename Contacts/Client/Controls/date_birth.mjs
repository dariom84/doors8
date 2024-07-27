export  function render(options){
    //control de tipo datepicker, le deshabilito una fecha
    options.evDetail.bsctl.datetimepicker('disabledDates', ['26/7/2024']);
    if (doc.isNew) doc.fields('date_birth', new Date());
}