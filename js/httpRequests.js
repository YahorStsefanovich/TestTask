let path = 'http://samples.databoom.space/api1/sandboxdb/collections/';
//let path = 'https://samples.databoom.space/api1/sampledb/collections/persons?$filter=firstname eq \'Lamar\'';
//let path = 'http://mysupermegasite/ALL/';
let personList = [];

window.onload = function () {
    init();
};

function setConfig(path) {
    o().config({
        endpoint: path,
        format: JSON,
        withCredentials: true
    });
}

function init(){
    setConfig(path);
    document.getElementById("getBtn").addEventListener("click", getData);
    document.getElementById("postBtn").addEventListener("click", setData);
    // document.getElementById("deleteBtn").addEventListener("click", setFilter("delete"));
     //document.getElementById("patchBtn").addEventListener("click", setActiveFields(false));
   // getData();
    //setData();
   // deleteData();
}

function setActiveFields(isActive) {
    let inputs = document.forms["resultForm"].getElementsByTagName("input");
    for (let i = 1; i < inputs.length; i++){
        inputs[i].disabled = isActive;
    }

}

function setFilter() {
    let id = document.getElementById("id").value;
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let age1 = document.getElementById("age1").value;
    let age2 = document.getElementById("age2").value;

    let filter = "";
    if (id !== ""){
        filter += `id eq \'${id}\'`;
    }
    if (fname !== ""){
        if (filter !== "")
            filter += " and ";
        filter += `firstname eq \'${fname}\'`
    }
    if (lname !== ""){
        if (filter !== "")
            filter += " and ";
        filter += `lastname eq '${lname}'`
    }
    if ((age1 !== "") && (age2 !== "")){
        if (filter !== "")
            filter += " and ";
        filter += `age ge ${age1} or age le ${age2}`;
    } else if (age1 !== ""){
        if (filter !== "")
            filter += " and ";
        filter += `age eq ${age1}`;
    }

    return filter;
}

function setData() {
    let result = getObjectFromFields();
    if (result === null){
        alert("All fields requered for post request");
    } else {
        o('allobjects').post(
            result).save(
            (data)=>{console.log("added");},
            (status)=>{console.error(status);}
        );
    }
}

//Create object for post request
function getObjectFromFields() {
    let id = document.getElementById("id").value;
    let firstname = document.getElementById("fname").value;
    let lastname = document.getElementById("lname").value;
    let age = document.getElementById("age1").value;
    let likes = document.getElementById("likes").value;

    if ((id === "") || (firstname === "") || (lastname === "") || (age === "") || (likes === ""))
        return null;
    else {
        let result = {};
        result.id = id;
        result.collections = [{id : "persons"}];
        result.firstname = firstname;
        result.lastname = lastname;
        result.age = age;
        result.likes = [{id : likes}];
        return result;
    }
}
//
// function deleteData() {
//     o('allobjects/Allobjects(1)').remove({Name:'Example 2',Description:'b'}).save(
//         (data)=>{console.log("Deleted");},
//         (status)=>{console.error(status);}
//     );
// }



function getData() {
    let filter = setFilter();
    if (filter !== ""){
        personList = [];
        o('allobjects').filter(filter).expand('likes').expand('likes/publisher').get(function(data) {
            for (let i = 0; i < data.d.results.length; i++){
                personList.push(new Person(data.d.results[i]));
            }

            displayData();
        }, function (code) {
            if (code === 404)
                alert("Error! Page not found(404)");
            if (code === 500)
                alert("Error! Internal server error(500)");
        });
    }else {
        personList = [];
        o('allobjects').expand('likes').expand('likes/publisher').get(function(data) {
            for (let i = 0; i < data.d.results.length; i++){
                personList.push(new Person(data.d.results[i]));
            }

            displayData();
        }, function (code) {
            if (code === 404)
                alert("Error! Page not found(404)");
            if (code === 500)
                alert("Error! Internal server error(500)");
        });
    }
}

function displayData() {
    if (personList !== undefined){
        document.getElementById("container").innerHTML = "";
        if (personList.length === 1)
            document.getElementById("container").appendChild(toForm(personList[0]));
        else
            document.getElementById("container").appendChild(toGrid(personList));
    }
}

//list to table view
function toGrid(list) {
    let table = document.createElement('table');

    if (list !== undefined) {
        table.appendChild(createHeadRow(list[0]));

        for (let elem in  list)
            table.appendChild(createRow(list[elem]));
    }

    return table;
}

//elem to form view
function toForm(elem) {
    let form = document.createElement('form');
    form.id = "resultForm";

    for (let key in elem) {
        form.appendChild(createLabel(key));
        if (Array.isArray(elem[key])){
            for (let obj in elem[key]){
                form.appendChild(createInput(objToString(elem[key][obj]), false));
            }
        }
        else
            form.appendChild(createInput(elem[key], false));
    }

    form.appendChild(createButton("putBtn", "Put"));

    return form;
}

function objToString(obj) {
    let result = "";
    for (let key in obj){
        if (typeof obj[key] === "object")
            result += `${key}(${objToString(obj[key])}`;
        else
            result +=  `${key}: ${obj[key]}, `;
    }
    return result.slice(0, -2) + ")";
}

function createButton(id, value) {
    let input = document.createElement('input');
    input.setAttribute('type', "button");
    input.value =  value;
    input.id = id;
    return input;
}

function createLabel(key) {
    let label = document.createElement('label');
    label.innerText = key;
    return label;
}

function createInput(elem, disabled) {
    let input = document.createElement('input');
    input.setAttribute('type', "text");
    input.setAttribute('placeholder', elem + "..");
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

        if (Array.isArray(elem[key]))
            cell.appendChild(toGrid(elem[key]));
        else if (typeof elem[key] === "object")
            cell.appendChild(toGrid([elem[key]]));
        else
            cell.innerHTML = elem[key];

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

    try{
        this.author = book.author[0].id;
    }
    catch (e){
        this.author = "";
    }

    try{
        this.publisher = new Publisher(book.publisher[0]);
    }
    catch (e){
        this.publisher = "";
    }
}

//constructor for Publisher
function Publisher(publisher) {
    this.id = publisher.id;
    this.name = publisher.name;
    this.president = publisher.president[0].id;
}

