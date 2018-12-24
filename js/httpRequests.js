let path = 'http://samples.databoom.space/api1/sampledb/collections/';
//let path = 'https://samples.databoom.space/api1/sampledb/collections/persons?$filter=firstname eq \'Lamar\'';

window.onload = ()=>{
    init();
};

function init(){
    setConfig(path);
    getData('persons');
}

function setConfig(path) {
    o().config({
        endpoint: path
    });
}

function getData(page) {
    let arr = [];
    o(page).where('age == 63').get(function(data) {
            for (let i = 0; i < data.d.results.length; i++){
                let elem = data.d.results[i];
                arr.push(new Person(elem.id, elem.firstname, elem.lastname, elem.age, elem.collections, elem.likes));
            }
            console.log(arr);
    });
}

function Person(id, firstname, lastname, age, collection, likes) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.age = age;
    this.collections = collection;
    this.likes = likes;
}

function Book(id, author, title, publisher, collection) {
    this.id = id;
    this.title = title;
    this.collections = collection;
    this.author = author;
    this.publisher = publisher;
}

// function init (){
//     o(path).get(function(data) {
//         console.log(data);
//     });
// }
