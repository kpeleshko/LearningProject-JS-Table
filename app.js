let data = [
    {id: 1, name: 'some', qty: 1, availability: false, delete: true},
    {id: 2, name: 'some', qty: 2, availability: true, delete: false},
    {id: 3, name: 'some', qty: 3, availability: false, delete: true},
];

const table = document.getElementById('table-body');
const form = document.querySelector('#form-add-rows');
const searchInput = document.querySelector('#search-input');
const addNewRowBtn = document.querySelector('#add-new-row');
const addRowBtn = document.querySelector('#add-row');
const generateDataBtn = document.querySelector('#generate-row');
const deleteRowBtn = document.querySelector('#delete-row');
const clearTableBtn = document.querySelector('#clear-table');
const inputName = document.querySelector("[name=name]");
const inputQty = document.querySelector("[name=qty]");
const inputAvailability = document.querySelector("[name=availability]");

let rowsNumber = 0;
let itemsToDelete = [];

function generateTable(table, data) {
    for (let element of data) {
        generateRow(table, element);
    }
}

function generateRow(table, element) {
    rowsNumber++;
    let row = table.insertRow();
    for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);

        if (key === 'id') {
            text.textContent = rowsNumber;
            row.setAttribute('data-id', element.id);
        }

        if (key === 'availability') {
            if (element[key]) text.textContent = 'Yes'
            else text.textContent = 'No'
        } 

        if (key === 'delete') {
            let deleteCheckbox = document.createElement('label');
            text.textContent = '';
            deleteCheckbox.classList.add('delete-checkbox');
            deleteCheckbox.innerHTML = '<input type="checkbox"><i class="fa-solid fa-trash"></i>';
            cell.appendChild(deleteCheckbox);
        }
        
        cell.appendChild(text);
    }
} 

function addRow(event) {
    event.preventDefault();

    newRowData = {};
    newRowData.id = 1;
    newRowData.name = inputName.value;
    newRowData.qty = inputQty.value;
    newRowData.availability = inputAvailability.checked;
    newRowData.delete = false;

    inputName.value = '';
    inputQty.value = '';
    inputAvailability.checked = false;

    data.push(newRowData);
    generateRow(table, newRowData);
}

function addRandomRow() {
    newRowData = {};
    newRowData.id = 1;
    newRowData.name = Math.random().toString(36).substring(2, 15);
    newRowData.qty = Math.floor(Math.random() * 1001);
    newRowData.availability = Math.random() < 0.5;
    newRowData.delete = false;

    data.push(newRowData);
    generateRow(table, newRowData);
}

function generateData () {
    let randomNumber = Math.floor(Math.random() * 11);
    for(i=0; i<randomNumber; i++) addRandomRow();
};

function tableClickHandler(event) {
    const item = event.target;
    if(item.checked) {
        item.parentElement.parentElement.parentElement.classList.add('tr-checked');
        itemsToDelete.push(item);
    } else {
        item.parentElement.parentElement.parentElement.classList.remove('tr-checked');
    }
}

function deleteRows() {
    itemsToDelete.forEach(item => {
        item.parentElement.parentElement.parentElement.remove()
        data.splice(item, 1);
    })
    itemsToDelete = [];
}

function clearTable() {
    data = [];
    table.innerHTML = '';
}

function showForm() {
    form.classList.toggle('visible')
}

function searchTable(event) {
    let enteredValue = event.target.value;
    console.log(enteredValue);

    for (let i = 0; i < table.children.length; i++) {
       if (!table.children[i].children[1].textContent.includes(enteredValue) && enteredValue) {
            table.children[i].hidden = true
       } else {
            table.children[i].hidden = false
       }
    }
}

generateTable(table, data);

addNewRowBtn.addEventListener('click', showForm);
addRowBtn.addEventListener('click', addRow);
generateDataBtn.addEventListener('click', generateData);
deleteRowBtn.addEventListener('click', deleteRows);
clearTableBtn.addEventListener('click', clearTable);
table.addEventListener('click', tableClickHandler);
searchInput.addEventListener('keyup', searchTable);