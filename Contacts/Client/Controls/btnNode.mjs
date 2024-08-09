export async function render(options){
    debugger;

    let $btn = $('<button/>', {
        class: 'btn btn-primary',
    }).append('Node').appendTo(options.ctx.$this);

    $btn.click(() => {
        debuggerM
    });
}