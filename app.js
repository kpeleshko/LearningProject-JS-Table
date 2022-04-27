let data = [
    {id: 1, name: 'some', qty: 1, availability: false, delete: true},
    {id: 2, name: 'some', qty: 2, availability: true, delete: false},
    {id: 3, name: 'some', qty: 3, availability: false, delete: true},
];

const table = document.querySelector('#table-body');
const addRowBtn = document.querySelector('#add-row');
const generateDataBtn = document.querySelector('#generate-row');
const inputName = document.querySelector("[name=name]");
const inputQty = document.querySelector("[name=qty]");
const inputAvailability = document.querySelector("[name=availability]");
let rowsNumber = 0;

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
        }

        if (key === 'availability') {
            if (element[key]) text.textContent = 'Yes'
            else text.textContent = 'No'
        } 

        if (key === 'delete') {
            let deleteCheckbox = document.createElement('input');
            text.textContent = ''
            deleteCheckbox.setAttribute('type', 'checkbox');
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

    data.push(newRowData);
    generateRow(table, newRowData);
}

function generateData () {
    let randomNumber = Math.floor(Math.random() * 11);
    for(i=0; i<randomNumber; i++) addRandomRow();
};

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


generateTable(table, data);


addRowBtn.addEventListener('click', addRow);
generateDataBtn.addEventListener('click', generateData);