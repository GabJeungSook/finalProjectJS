document.addEventListener('DOMContentLoaded', function () {

    const filter = document.getElementById("date_filter");
    filter.value = 'day';
    fetch('http://localhost:8080/getExpenses?filter='+ filter.value)
    .then(response => response.json())
    .then(data => loadExpenseTable(data['data']));


    filter.addEventListener('change', function() {
        fetch('http://localhost:8080/getExpenses?filter='+ filter.value)
        .then(response => response.json())
        .then(data => loadExpenseTable(data['data']));
    });

});

function loadExpenseTable(data)
{
     const table = document.getElementById('expense_table');
     let total = 0;
     table.innerHTML = '';
     if(data.length === 0)
     {
        document.getElementById('expense_table').innerHTML = `
        <tr>
        <th scope="col" class="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"></th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Transaction No.</th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Category</th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Description</th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Amount</th>
        <th scope="col" class="relative py-3 pl-3 pr-4 sm:pr-0">
          <span class="sr-only">Edit</span>
        </th>
        </tr>
      <tbody class="bg-white">
      <tr class="border-t border-gray-200">
      <th colspan="6" scope="colgroup" class="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 text-center italic">No Record Found</th>
      </tr>
      </tbody>`;
      
        return;
     }

     table.innerHTML = '';
     const thead = document.createElement('thead');
     thead.classList.add('bg-white');
     thead.innerHTML = `
     <tr>
        <th scope="col" class="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0">Date</th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Transaction No.</th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Category</th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Description</th>
        <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Amount</th>
        <th scope="col" class="relative py-3 pl-3 pr-4 sm:pr-0">
          <span class="sr-only">Edit</span>
        </th>
    </tr>
     `;
     table.appendChild(thead);
     // Create the table body
    const tbody = document.createElement('tbody');
    tbody.classList.add('bg-white');
    // tbody.appendChild(firstRow);
    for (const transaction of data) {
      
        const row = document.createElement('tr');
        row.classList.add('border-t', 'border-gray-300');
        const amount = parseFloat(transaction.amount);
        total += amount;
        const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
       
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      
        row.innerHTML = `
        <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">${formattedDate}</td>
        <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500">${transaction.transaction_number}</td>
        <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500">${transaction.name}</td>
        <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500">${transaction.description}</td>
        <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500">₱ ${formattedAmount}</td>
    `;
   
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('rounded-md', 'my-2', 'mx-2', 'bg-green-800', 'px-3', 'py-2', 'text-sm', 'font-semibold', 'text-white','shadow-sm'); // Add your desired button styles
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('rounded-md', 'my-2', 'mx-2', 'bg-red-800', 'px-3', 'py-2', 'text-sm', 'font-semibold', 'text-white','shadow-sm'); // Add your desired button styles
          
    row.appendChild(editButton);
    row.appendChild(deleteButton);

    editButton.addEventListener('click', function() {
      alert(transaction.transaction_number);
    });

    deleteButton.addEventListener('click', function() {
      confirm('Are you sure you want to delete this transaction?')
      {
        fetch('http://localhost:8080/deleteTransaction/' + transaction.transaction_number, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
          alert('Transaction successfully deleted!');
          const filter = document.getElementById("date_filter");
          filter.value = 'day';
          fetch('http://localhost:8080/getIncomes?filter='+ filter.value)
          .then(response => response.json())
          .then(data => loadExpenseTable(data['data']));
        })
      }
    });

    tbody.appendChild(row);
    }
    const formattedTotal = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const totalRow = document.createElement('tr');
    totalRow.classList.add('border-t', 'border-gray-300');
    totalRow.innerHTML = `
    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500"></td>
    <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"></td>
    <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900"></td>
    <td class="whitespace-nowrap px-2 py-2 text-lg text-gray-900 font-semibold">Total</td>
    <td class="whitespace-nowrap px-2 py-2 text-lg text-gray-900 font-semibold">₱ ${formattedTotal}</td>
    `;  
    
    tbody.appendChild(totalRow);
    table.appendChild(tbody);
}