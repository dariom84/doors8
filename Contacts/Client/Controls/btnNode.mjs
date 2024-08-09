export async function render(options){
    debugger;

    let $btn = $('<button/>', {
        class: 'btn btn-primary',
    }).append('Node').appendTo(options.evDetail.$this);

    $btn.click(() => {
        debugger;

        /*dSession.node.exec({
            code: {
                    owner: 'dariom84',
                    repo: 'doors8',
                    path: '/Contacts/Server/test.js'
                },
            payload: { saludo: 'hola'}
        })*/

    });
}