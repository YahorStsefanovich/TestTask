let path = 'http://samples.databoom.space/api1/sampledb/collections/';
//let path = 'https://samples.databoom.space/api1/sampledb/collections/persons?$filter=firstname eq \'Lamar\'';
let arr = [];


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
            arr.push(new Person(data.d.results[i]));
        }

        toGrid(arr);
    });
}

function toGrid(arr) {
    let table = document.createElement('table');

    for (let elem in  arr)
        table.appendChild(createRow(arr[elem]));

    document.body.appendChild(table);
}

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
    this.collections = person.collections;
    this.likes = person.likes;
}

//constructor for book
function Book(book) {
    this.id = book.id;
    this.title = book.title;
    this.collections = book.collections;
    this.author = book.author;
    this.publisher = book.publisher;
}

