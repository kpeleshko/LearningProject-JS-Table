let data = [
    {id: 1, name: 'some', qty: 1, availability: false, delete: true},
    {id: 2, name: 'some', qty: 2, availability: true, delete: false},
    {id: 3, name: 'some', qty: 3, availability: false, delete: true},
    {id: 4, name: 'some', qty: 1, availability: false, delete: true},
    {id: 5, name: 'some', qty: 2, availability: true, delete: false},
    {id: 6, name: 'some', qty: 3, availability: false, delete: true},
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
const columnHeaders = document.querySelectorAll("[data-sort-type]");

columnHeaders.forEach(columnHeader => {
    columnHeader.addEventListener('click', () => {
        let dataType = columnHeader.getAttribute('data-sort-type');
        let dataDirection = columnHeader.getAttribute('data-sort-direction');

        columnHeaders.forEach(columnHeader => {
            columnHeader.lastChild.classList.remove('fa-angle-up');
            columnHeader.lastChild.classList.add('fa-angle-down');
        })

        if(dataDirection ===  "up") {
            data.sort((a, b) => a[dataType] - b[dataType]);
            columnHeader.setAttribute("data-sort-direction", "down");
            columnHeader.lastChild.classList.remove('fa-angle-down');
            columnHeader.lastChild.classList.add('fa-angle-up');

            table.innerHTML = '';
            generateTable(table)

        } else if(dataDirection ===  "down") {
            data.sort((a, b) => b[dataType] - a[dataType]);
            columnHeader.setAttribute("data-sort-direction", "up");
            columnHeader.lastChild.classList.remove('fa-angle-up');
            columnHeader.lastChild.classList.add('fa-angle-down');

            table.innerHTML = '';
            generateTable(table)
        }
    })
})

let rowsNumber = 0;
let itemsToDelete = [];

let state = {
    'page': 1,
    'rows': 5,
    'window': 5,
}

function pagination(data, page, rows) {
    let trimStart = (page - 1) * rows;
    let trimEnd = trimStart + rows;
    let trimmedData = data.slice(trimStart, trimEnd);
    let pages = Math.ceil(data.length / rows);
    return {
        'data': trimmedData,
        'pages': pages,
    }
}

function pageButtons(pages) {
    let wrapper = document.getElementById('pagination-wrapper');

    wrapper.innerHTML = '';

    let maxLeft = (state.page - Math.floor(state.window / 2));
    let maxRight = (state.page + Math.floor(state.window / 2));

    if (maxLeft < 1) {
        maxLeft = 1;
        maxRight = state.window;
    }

    if (maxRight > pages) {
        maxLeft = pages - (state.window - 1);
        
        if (maxLeft < 1){
        	maxLeft = 1;
        }
        maxRight = pages;
    }
    

    for (let page = maxLeft; page <= maxRight; page++) {
    	wrapper.innerHTML += `<button value=${page} class="btn">${page}</button>`
    }

    if (state.page != 1) {
        wrapper.innerHTML = `<button value=${1} class="btn">&#171; First</button>` + wrapper.innerHTML
    }

    if (state.page != pages) {
        wrapper.innerHTML += `<button value=${pages} class="btn">Last &#187;</button>`
    }

    let paginationBtns = document.querySelectorAll('.btn');

    paginationBtns.forEach(button => {
        button.addEventListener('click', function() {
            table.innerHTML ='';
            state.page = Number(button.value);
            generateTable(table);
        })
    })
}

function generateTable(table) {
    let data1 = pagination(data, state.page, state.rows);

    for (let element of data1.data) {
        generateRow(table, element);
    }

    pageButtons(data1.pages);
}

generateTable(table);

function generateRow(table, element) {
    rowsNumber++;
    let row = table.insertRow();
    for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);

        if (key === 'id') {
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
    newRowData.id = data.length + 1;
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
    newRowData.id = data.length + 1;
    newRowData.name = Math.random().toString(36).substring(2, 15);
    newRowData.qty = Math.floor(Math.random() * 1001);
    newRowData.availability = Math.random() < 0.5;
    newRowData.delete = false;

    data.push(newRowData);
}

function generateData () {
    let randomNumber = Math.floor(Math.random() * 11);
    for(i=0; i<randomNumber; i++) addRandomRow();
    table.innerHTML = '';
    generateTable(table)
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
    const idsToDelete = [];
    itemsToDelete.forEach(item => {
        idsToDelete.push(item.parentElement.parentElement.parentElement.getAttribute('data-id'))
    })

    data = data.filter(item => !idsToDelete.includes(String(item.id)))
    itemsToDelete = [];
    
    table.innerHTML = '';
    generateTable(table)
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

addNewRowBtn.addEventListener('click', showForm);
addRowBtn.addEventListener('click', addRow);
generateDataBtn.addEventListener('click', generateData);
deleteRowBtn.addEventListener('click', deleteRows);
clearTableBtn.addEventListener('click', clearTable);
table.addEventListener('click', tableClickHandler);
searchInput.addEventListener('keyup', searchTable);