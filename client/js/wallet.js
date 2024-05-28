document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:8080/getTypes')
    .then(response => response.json())
    .then(data => loadTransactionTypes(data['data']));

    const transaction_number = document.getElementById("transaction_number");
    transaction_number.value = 'TRN-000' + Math.floor(Math.random() * 1000000);
    const type = document.getElementById("transaction_type");
    

    type.addEventListener('change', function() {
        const type_id = type.value;
        fetch('http://localhost:8080/getCategories?id=' + type_id)
        .then(response => response.json())
        .then(data => loadCategories(data['data']));
    });
});


function loadTransactionTypes(data)
{
    const customerNames = document.getElementById('transaction_type');
    if(data.length === 0)
    {
        document.getElementById('transaction_type').innerHTML = '<option value="" disabled>No transaction type found</option>';
        return;
    }
  for (const name of data) {
    const option = document.createElement('option');
    option.value = name.id; 
    option.textContent = name.name; 
    customerNames.appendChild(option);
  }
}

function loadCategories(data)
{
    const customerNames = document.getElementById('categories');
    customerNames.innerHTML = '';
    if(data.length === 0)
    {
        document.getElementById('categories').innerHTML = '<option value="" disabled>No category found</option>';
        return;
    }
  for (const name of data) {
    const option = document.createElement('option');
    option.value = name.id; 
    option.textContent = name.name; 
    customerNames.appendChild(option);
  }
}

function loadTransactionTable(data)
{
    const table = document.getElementById('transaction_table');
    table.innerHTML = '';
    if(data.length === 0)
    {
        document.getElementById('transaction_table').innerHTML = '<tr><td>No transaction found</td></tr>';
        return;
    }
    for (const row of data) {
        const newRow = table.insertRow();
        for (const key in row) {
            const newCell = newRow.insertCell();
            const newText = document.createTextNode(row[key]);
            newCell.appendChild(newText);
        }
    }
}