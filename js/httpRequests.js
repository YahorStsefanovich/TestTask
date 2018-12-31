let path = 'http://samples.databoom.space/api1/sandboxdb/collections/';
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
    let result = getObjectFromFields(
        document.getElementById("id").value,
        document.getElementById("fname").value,
        document.getElementById("lname").value,
        document.getElementById("age1").value,
        document.getElementById("likes").value
    );
    if (result === null){
        alert("All fields requered for post request");
    } else {
        o('allobjects').post(
            result).save(
            (data)=>{
                console.log("added");
                alert("Entity added successfully");
                },
            (status)=>{
                console.error(status);
                alert("Error " + status);
            }
        );
    }
}

function putData() {
    let result = getObjectFromFields(
        document.getElementById("idResult").value,
        document.getElementById("firstnameResult").value,
        document.getElementById("lastnameResult").value,
        document.getElementById("ageResult").value,
        document.getElementById("likesResult").value
    );
    if (result === null){
        alert("All fields requered for put request");
    } else {
        o('allobjects').find(('\'' + document.getElementById("idResult").value + '\'')).put(
            result).save(
            (data)=>{
                console.log("added");
                alert("Entity added successfully");
            },
            (status)=>{
                console.error(status);
                alert("Error " + status);
            }
        );
    }
}

function deleteById(id) {
    let url = path + "allobjects(\'" + id + "\')";
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === "200") {
            console.log("Deleted");
        } else {
            console.error("Error");
        }
    };
    xhr.send(null);
}

function deleteData() {

    if (personList.length === 1){
        deleteById(personList[0].id);
    } else {
        let checkBoxes = document.querySelectorAll('input[type="checkbox"]');

        for (let index = 1; index < checkBoxes.length; index++){
            if (checkBoxes[index].checked){
                deleteById(personList[index - 1].id);
            }
        }
    }
    getData();
}

//Create object for post request
function getObjectFromFields(id, firstName, lastName, age, likes) {

    for (let elem in arguments){
        if (arguments[elem] === "")
            return null;
    }

    let result = {};
    result.id = id;
    result.collections = [{id : "persons"}];
    result.firstname = firstName;
    result.lastname = lastName;
    result.age = age;

    result.likes = [];
    for (let index = 0; index < likes.length; index++){
        result.likes.push({id : likes[index].id});
    }

    return result;
}

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
    document.getElementById("container").innerHTML = "";
    if ((personList !== undefined) && (personList !== [])){
        if (personList.length === 1)
            document.getElementById("container").appendChild(toForm(personList[0]));
        else{
            document.getElementById("container").appendChild(toGrid(personList));
            createCheckboxes();
        }

        document.getElementById("container").appendChild(createButton("deleteBtn", "Delete"));
        document.getElementById("deleteBtn").addEventListener("click", deleteData);
    }
}

//list to table view
function toGrid(list) {
    if (list !== undefined) {

        let table = document.createElement('table');

        table.appendChild(createHeadRow(list[0]));

        for (let elem in  list){
            table.appendChild(createRow(list[elem]));
        }

        return table;
    }
}

//elem to form view
function toForm(elem) {
    let form = document.createElement('form');
    form.id = "resultForm";

    for (let key in elem) {
        form.appendChild(createLabel(key));
        if (Array.isArray(elem[key])){
            for (let obj in elem[key]){
                form.appendChild(createInput(key, objToString(elem[key][obj]), false));
            }
        }
        else
            form.appendChild(createInput(key, elem[key], false));
    }

    let putBtn = createButton("putBtn", "Put");
    putBtn.addEventListener("click", putData);
    form.appendChild(putBtn);

    return form;
}

/**
 *
 * @param obj
 * @returns {string}
 */
function objToString(obj) {
    let result = "";
    for (let key in obj){
        if (typeof obj[key] === "object")
            result += `${key} : ${objToString(obj[key])}`;
        else
            result +=  `${key}: ${obj[key]}, `;
    }
    return result.slice(0, -2);
}

function createButton(id, value) {
    let button = document.createElement('input');
    button.setAttribute('type', "button");
    button.value =  value;
    button.id = id;
    return button;
}

function createCheckboxes() {
    let rows = document.getElementsByTagName("table")[0].childNodes;

    //head checkBox for multiple selection
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', "checkbox");
    checkbox.id = "selectAll";
    checkbox.value = "selectAll";
    checkbox.addEventListener( 'change', function() {
        let checkBoxes = document.querySelectorAll('input[type="checkbox"]');
        if(this.checked) {
            for (let index = 1; index < checkBoxes.length; index++){
                checkBoxes[index].checked = true;
            }
        } else {
            for (let index = 1; index < checkBoxes.length; index++){
                checkBoxes[index].checked = false;
            }
        }
    });
    rows[0].appendChild(checkbox);

    for (let index = 1; index < rows.length; index++){
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', "checkbox");
        checkbox.id = personList[index-1].id;
        checkbox.value = personList[index-1].id;
        rows[index].appendChild(checkbox);
    }
}

function createLabel(key) {
    let label = document.createElement('label');
    label.innerText = key;
    return label;
}

function createInput(key, elem, disabled) {
    let input = document.createElement('input');
    input.setAttribute('type', "text");
    input.setAttribute('placeholder', key + "..");
    input.value = elem;
    input.disabled = disabled;
    input.id = key + "Result";
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
        this.author = "unknown";
    }

    try{
        this.publisher = new Publisher(book.publisher[0]);
    }
    catch (e){
        this.publisher = "unknown";
    }
}

//constructor for Publisher
function Publisher(publisher) {
    this.id = publisher.id;
    this.name = publisher.name;
    this.president = publisher.president[0].id;
}

