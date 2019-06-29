# ark js

## goals
1. a jquery plugin that allows templates, rendering, state management
2. syntax that makes it easy to use, not harder
3. doens't feel like something "new" to learn
4. a plugin that can be used to bring some of the features react/angular/vue developers are used to using to jquery projects
5. be something ridiculous, fun, and useful, not boring and serious

## notes from the developer
I wanted to make something that used a virtual DOM. I wanted to write that virtual DOM just as a side project.
That ended up not being my approach at this time, so I'm going to make something that I can use daily for some projects.
This will use jQuery to make it easy to add into existing projects that are jQuery-based.

# API

/* Ark Object, unlinked */
let myArk = $.ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
        <div class="version">{{version}}</div>
    `,
});

/* Ark Object linked to jQuery Element */
$('.target').ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
        <div class="version">{{version}}</div>
    `,
});

/* Modify Data (short version) */
myArk.data({
    name: 'an ark object',
    type: 'unlinked',
    version: 'shorter syntax',
});

$('.target').data({
    name: 'an ark object',
    type: 'linked to element',
    version: 'shorter syntax',
});

/* Modify Data (longer version) */
myArk.ark({
    data:{
        name: 'an ark object',
        type: 'linked to element',
        version: 'normal syntax',
    }
});
$('.target').ark({
    data:{
        name: 'an ark object',
        type: 'linked to element',
        version: 'normal syntax',
    }
});

/* Events: Add an event listener and handler to each name element, with access to that element's data */
let myEventArk = $.ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
        <div class="version">{{version}}</div>
    `,
    onClick: {
        ".name": (event) => console.log(event.data.name), // if name is 'an ark object', it will return 'an ark object'
    },
});
/* What is special about this? Why not use $('.name').on('click', function(){}) ?
The reason is we can access the data. */
$('.name').trigger('click'); // expected output: 'an ark object'
                            // with jQuery alone, to get expected output of 'an ark object', we would need to use 
                            // data-attributes and an event handler to read from it, or rely on reading the text, etc
                            // ie: <div class="name" data-name="an ark object">an ark object<div>
$('.target').data({name: 'a modified ark object'});
$('.name').trigger('click'); // expected output: 'a modified ark object'

/* Multiple Objects */
let myArk = $.ark({
    html: `
        <div class="name">{{name}}</div>
        <div class="type">{{type}}</div>
        <div class="version">{{version}}</div>
    `,
    data: [
        {
            name: 'an ark object',
            type: 'linked to element',
            version: 'normal syntax',
        },
        {
            name: 'another ark object',
            type: 'linked to element',
            version: 'normal syntax',
        },
        {
            name: 'a third ark object',
            type: 'linked to element',
            version: 'normal syntax',
        },
    ]
});

/* Let's say you have initial data, then modify it, then want to rerender the list */

// application has created some data
let data = [
    {
        name: 'an ark object',
        type: 'linked to element',
        version: 'normal syntax',
    },
    {
        name: 'another ark object',
        type: 'linked to element',
        version: 'normal syntax',
    },
    {
        name: 'a third ark object',
        type: 'linked to element',
        version: 'normal syntax',
    },
];
let html = `
    <div class="name">{{name}}</div>
    <div class="type">{{type}}</div>
    <div class="version">{{version}}</div>
`;
// create the ark
$('.list').ark({html, data});

// the application modified the data!
data.push({
    name: 'newcomer',
    type: 'ark element',
    version: 'a version',
});

// just update the data
$('.list').data(data);

// the application keeps modifying things!
data[2].name = "a new name given";

// just keep updating it
$('.list').data(data);

// what if we don't like the 2 step process?
$('.list').data().push({
    name: 'directly added',
    type: 'some type we needed',
    version: 'do we really need a version at this point?',
});

$('.list').data()[3].name = 'lazy, unsafe name change';

// the challenge: I like this, but what about nested arks?
$('.list-section').ark({
    html: `
        <div class="list-header">{{header}}</div>
        <div class="list-container">
            {{data.list}}
        </div>
    `,
    data: {
        header: 'A list will be below this line',
        list: $.ark({
            html: `
                <div class="list-item">
                    {{name}}
                </div>
            `,
            data: [
                {
                    name: 'first item',
                },
                {
                    name: 'second item',
                },
                {
                    name: 'third item',
                },
            ]
        })
    },
});

// and modifying its data:
let list = $('.list-section').data().list;
list.data().push({
    name: 'fourth item'
});

// or with a different syntax which supports modifying parent data as well
$('.list-section').data({
    header: 'A new item will be added to the list below',
    list: $.data().push({
        name: 'fourth item'
    })
});

// what if my data model doesn't want to use ark objects in them?
let data = {
    header: 'A list with items',
    list: [
        {
            name: 'first item',
        },
        {
            name: 'second item',
        },
        {
            name: 'third item',
        },
    ]
};
// so i want to do this:
$('.list-section').ark({
    html: `
        <div class="list-header">{{header}}</div>
        <div class="list-container">
            {{arks.list}}
        </div>
    `,
    data: {
        header: 'A list will be below this line',
        list,
    },
    arks: {
        list: $.ark({
            html: `
                <div class="list-item">
                    {{name}}
                </div>
            `,
            data: data.list,
        }),
    }
});

// now you can modify the list data without worrying about changing your data model to know about arks:
let newList = [
    {
        name: 'replacement #1'
    },
    {
        name: 'replacement #2'
    },
    {
        name: 'replacement #3'
    },
];
$('.list-section').data({
    header: `A list that doesn't know about arks`,
    list: newList
});

// let's put it all together:

let app = $.ark({
    html: `
        <div class="my-app">
            <div class="title">An ark app</div>
            {{arks.list}}
        </div>
    `,
    data: {
        list: [
            {name: 'red', color: '#f00'},
            {name: 'green', color: '#0f0'},
            {name: 'blue', color: '#00f'},
        ],
    },
    arks: {
        list: $.ark({
            html: `
                <div class="list-item">
                    <div class="name">
                        {{name}}
                    </div>
                    <button class="change-bg">Make background {{red}}</button>
                    <button class="tell-me-more">Tell me more about {{red}}</button>
                    <button class="show-modal">Show modal</button>
                    {{arks.modal}}
                </div>
            `,
            data: data.list,
            onClick: {
                ".change-bg": (event)=>$('body').css('background', event.data.color),
                ".tell-me-more": (event)=>alert(`Did you know ${event.data.name} has a hexcode of ${event.data.color}?`),
            },
            arks: {
                modal: $.ark({
                    html: `<div>
                        {{greeting}} I'm a modal for {{name}}. I can have my own data too!
                    </div>`,
                    data: {
                        greeting: "Hi!",
                    },
                    inherits: ['name'], // functionally, data at render will be: {greeting: 'Hi!', name: 'red'}
                    inheritsAll: false, //optional, equiv. to: inherits: ['name', 'color']
                })
            }
        }),
    }
});
app.data({
    list: [{}]
});
