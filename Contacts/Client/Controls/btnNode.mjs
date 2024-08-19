export async function render(options){
    debugger;

    let $btn = $('<button/>', {
        class: 'btn btn-primary',
    }).append('Node').appendTo(options.evDetail.$this);

    $btn.click(async () => {
        debugger;

        toast('Antes de llamar al codigo de servidor');

        toast('Return: ' + await dSession.node.exec({
            code: {
                    owner: 'dariom84',
                    repo: 'doors8',
                    path: 'Contacts/Server/test.js'
                },
            payload: { numero: '5'}
        }));

        toast('Despues de llamar al codigo de servidor');

    });
}