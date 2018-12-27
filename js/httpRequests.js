let path = 'http://samples.databoom.space/api1/sampledb/collections/';
//let path = 'https://samples.databoom.space/api1/sampledb/collections/persons?$filter=firstname eq \'Lamar\'';
let personList = [];

window.onload = function () {
    init();
};

function init(){
    setConfig(path);
    getData();
}

function setConfig(path) {
    o().config({
        endpoint: path,
    });
}

function getData() {
    o('allobjects').where('age == 63').expand('likes').expand('likes/publisher').get(function(data) {
        for (let i = 0; i < data.d.results.length; i++){
            personList.push(new Person(data.d.results[i]));
        }

        displayData();
    });
}

function displayData() {
    if (personList !== undefined){
        if (personList.length === 1)
            document.body.appendChild(toForm(personList[0]));
        else
            document.body.appendChild(toGrid(personList));
    }
}

//list to table view
function toGrid(list) {
    let table = document.createElement('table');

    if (list !== undefined)
        table.appendChild(createHeadRow(list[0]));

    for (let elem in  list)
        table.appendChild(createRow(list[elem]));

    return table;
}

//elem to form view
function toForm(elem) {
    let form = document.createElement('form');

    for (let key in elem) {
        form.appendChild(createLabel(key));
        form.appendChild(createInput(elem[key], true));
    }

    return form;
}

function createLabel(key) {
    let label = document.createElement('label');
    label.innerText = key;
    return label;
}

function createInput(elem, disabled) {
    let input = document.createElement('input');
    input.setAttribute('type', "text");
    input.setAttribute('placeholder', key + "..");
    input.value = elem;
    input.disabled = disabled;
    return input;
}

/**
 * Create row for table according to elem's fields
 * @param elem Object with data
 * @returns {Element} html-element tr with several cells
 */
function createHeadRow(elem) {
    let row = document.createElement('tr');

    for (let key in elem) {
        let cell = document.createElement('th');
        cell.innerText = key;
        row.appendChild(cell);
    }

    return row;
}

//create data row for table
function createRow(elem) {
    let row = document.createElement('tr');

    for (let key in elem) {
        let cell = document.createElement('td');
        cell.innerText = elem[key];
        row.appendChild(cell);
    }

    return row;
}

//constructor for person
function Person(person) {
    this.id = person.id;
    this.firstname = person.firstname;
    this.lastname = person.lastname;
    this.age = person.age;
    this.likes = [];
    for (let book in person.likes){
        this.likes.push(new Book(person.likes[book]));
    }
}

//constructor for book
function Book(book) {
    this.id = book.id;
    this.title = book.title;
    this.author = book.author[0].id;
    this.publisher = new Publisher(book.publisher[0]);
}

function Publisher(publisher) {
    this.id = publisher.id;
    this.name = publisher.name;
    this.president = publisher.president[0].id;
}

