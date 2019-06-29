
$('#app').ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
    `,
    data: {
        name: 'An Ark Object',
        type: 'Linked',
    },
    onClick: {
        ".name": (event, data)=>console.log(data.name)
    }
});

$('.app-component').ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
    `,
    data: {
        name: 'A component',
        type: 'Linked',
    },
    onClick: {
        ".name": (event, data)=>console.log(data.name)
    }
});

$('#nest').ark({
    html: `
        <div class="app-component-nested">{{name}}</div>
    `,
    data: [
        {
            name: 'Nested item 1',
            type: 'Linked',
        },
        {
            name: 'Nested item 2',
            type: 'Linked',
        },
        {
            name: 'Nested item 3',
            type: 'Linked',
        },
    ],
    onClick: {
        ".app-component-nested": (event, data)=>console.log(data)
    }
});

const Tests = {
    updateNest() {
        $('#nest').mod([
            {
                name: 'Nested item 1 modified',
                type: 'Linked',
            },
            {
                name: 'Nested item 2 modified',
                type: 'Linked',
            },
            {
                name: 'Nested item 3 modified',
                type: 'Linked',
            },
        ]);
    }
}


/* Can API be one call, as below? Instead of ark() and mod() ?
$(el).ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
    `,
    data: {
        name: 'An Ark Object',
        type: 'Linked',
    }
});

$(el).ark({
    name: 'new name',
    type: 'new type',
});

$(el).ark(`
    <div class="name" data-name="{{name}}">{{name}}</div>
    <div class="type">{{type}}</div>
    <div class="new-class">Changing things up</div>
`);
*/