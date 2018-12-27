let path = 'http://samples.databoom.space/api1/sampledb/collections/';
//let path = 'https://samples.databoom.space/api1/sampledb/collections/persons?$filter=firstname eq \'Lamar\'';
let personList = [];
let bookList = [];


window.onload = function () {
    init();
};

function init(){
    setConfig(path);
    let data = getData('persons', 'age == 63');
    toGrid(data);
}

function setConfig(path) {
    o().config({
        endpoint: path
    });
}

function getData(page, filter) {
    o(page).where(filter).get(function(data) {
        for (let i = 0; i < data.d.results.length; i++){
            personList.push(new Person(data.d.results[i]));
        }
        console.log(bookList);

        if (personList !== undefined){
           // if (personList.length === 1)
                toForm(personList[0]);
           // else
                toGrid(personList);
        }
    });
}

//list to table view
function toGrid(list) {
    let table = document.createElement('table');

    if (list !== undefined)
        table.appendChild(createHeadRow(list[0]));

    for (let elem in  list)
        table.appendChild(createRow(list[elem]));

    document.body.appendChild(table);
}

//elem to form view
function toForm(elem) {
    let form = document.createElement('form');

    for (let key in elem) {
        form.appendChild(createLabel(key));
        form.appendChild(createInput(elem[key], true));
    }

    document.body.appendChild(form);
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
   // this.collections = person.collections;
    this.likes = person.likes;
    for (let bookId in person.likes){
        if (bookList.indexOf(person.likes[bookId]) === -1){
            bookList.push(person.likes[bookId]);
        }
    }
}

//constructor for book
function Book(book) {
    this.id = book.id;
    this.title = book.title;
    //this.collections = book.collections;
    this.author = book.author;
    this.publisher = book.publisher;
}

