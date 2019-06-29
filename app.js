
$('#app').ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
    `,
    data: {
        name: 'An Ark Object',
        type: 'Linked',
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
    }
});