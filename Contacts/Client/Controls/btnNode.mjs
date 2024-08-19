//Cacheado: https://cdn.jsdelivr.net/gh/dariom84/doors8/Contacts/Client/Controls/btnNode.mjs
//Refresh: https://cdn.cloudycrm.net/gh/dariom84/doors8/Contacts/Client/Controls/btnNode.mjs?_fresh=1

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
                    path: 'Contacts/Server/test.js',
                    fresh: false
                },
            payload: { numero: '5'}
        }));

    });
}