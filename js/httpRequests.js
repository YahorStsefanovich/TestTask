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

        if (personList !== undefined)
            toGrid(personList);
    });
}

function toGrid(personList) {
    let table = document.createElement('table');

   table.appendChild(createHeadRow(personList[0]));

    for (let elem in  personList)
        table.appendChild(createRow(personList[elem]));

    document.body.appendChild(table);
}

function createHeadRow(elem) {
    let row = document.createElement('tr');

    for (let key in elem) {
        let cell = document.createElement('th');
        cell.innerText = key;
        row.appendChild(cell);
    }

    return row;
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

