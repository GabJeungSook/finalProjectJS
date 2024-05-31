document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:8080/getTypes')
    .then(response => response.json())
    .then(data => loadTransactionTypes(data['data']));
    const filter = document.getElementById("date_filter");
    
    filter.value = 'day';
    fetch('http://localhost:8080/getTransactions?filter='+ filter.value)
    .then(response => response.json())
    .then(data => loadTransactionTable(data['data']));
    fetch('http://localhost:8080/getTotals?filter='+ filter.value)
    .then(response => response.json())
    .then(data => loadTotalAmounts(data['data']));

    const transaction_number = document.getElementById("transaction_number");
    transaction_number.value = 'TRN-000' + Math.floor(Math.random() * 1000000);

    const type = document.getElementById("transaction_type");

    const submitButton = document.getElementById("submitTransaction");
    


    type.addEventListener('change', function() {
        const type_id = type.value;
        fetch('http://localhost:8080/getCategories?id=' + type_id)
        .then(response => response.json())
        .then(data => loadCategories(data['data']));
    });

    filter.addEventListener('change', function() {
        fetch('http://localhost:8080/getTransactions?filter='+ filter.value)
        .then(response => response.json())
        .then(data => loadTransactionTable(data['data']));
        fetch('http://localhost:8080/getTotals?filter='+ filter.value)
        .then(response => response.json())
        .then(data => loadTotalAmounts(data['data']));
    });

    submitButton.addEventListener('click', function() {
        const user = '1';
        const transaction_number = document.getElementById("transaction_number").value;
        const type = document.getElementById("transaction_type").value;
        const category = document.getElementById("categories").value;
        const description = document.getElementById("description").value;
        const amount = document.getElementById("amount").value;
        const date = getFormattedDateTime();
        
        if (confirm('Are you sure you want to submit this transaction?')) {
            fetch('http://localhost:8080/insertTransaction/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({user, transaction_number, type, category, description, amount, date}),
            })
            .then((response) => response.json())
            .then((data1) => {
                alert('Transaction saved successfully');
                fetch('http://localhost:8080/getTransactions?filter='+ filter.value)
                .then(response => response.json())
                .then(data => loadTransactionTable(data['data']));
                fetch('http://localhost:8080/getTotals?filter='+ filter.value)
                .then(response => response.json())
                .then(data => loadTotalAmounts(data['data']));

                transaction_number.value = 'TRN-000' + Math.floor(Math.random() * 1000000);
                document.getElementById("transaction_type").value = 0;
                document.getElementById("categories").value = 0;
                document.getElementById("description").value = '';
                document.getElementById("amount").value = '';
            })
        }

     
    });
});

function getFormattedDateTime() {
    // Create a new Date object
    const now = new Date();

    // Get the individual components of the date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format the components into the MySQL DATETIME format
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}

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
        document.getElementById('transaction_table').innerHTML = `
        <tr>
          <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Transaction No.</th>
          <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Transaction Type</th>
          <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
          <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
          <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
          <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
        </tr>
      <tbody class="divide-y divide-gray-200 bg-white">
      <tr>
      <td colspan="6" class="whitespace-nowrap px-2 py-10 text-xl text-gray-900 font-medium italic text-center">No transaction found</td>
      </tr>
      </tbody>`;
      
        return;
    }
    table.innerHTML = '';
    const thead = document.createElement('thead');
    thead.innerHTML = `
    <tr>
    <th scope="col" class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Transaction No.</th>
    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Transaction Type</th>
    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
    <th scope="col" class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
    </tr>
    `;
    table.appendChild(thead);
    // Create the table body
    const tbody = document.createElement('tbody');
    tbody.classList.add('bg-white', 'divide-y', 'divide-gray-200');


    for (const transaction of data) {
        const row = document.createElement('tr');
        const amount = parseFloat(transaction.amount);
        const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        if(transaction.type_id === 1)
        {
            row.innerHTML = `
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">${transaction.transaction_number}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
            <span class="inline-flex items-center rounded-md bg-green-50 
            px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 uppercase">
            INCOME
            </span>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">${transaction.name}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">${transaction.description}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-green-500">+ ₱ ${formattedAmount}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">${formattedDate}</td>
        `;
        }else{
            row.innerHTML = `
            <td class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">${transaction.transaction_number}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
            <span class="inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-xs 
            font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            EXPENSE
            </span>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">${transaction.name}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-900">${transaction.description}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-red-500">- ₱ ${formattedAmount}</td>
            <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">${formattedDate}</td>
        `;
        }
            tbody.appendChild(row);
    }
    table.appendChild(tbody);
}

function loadTotalAmounts(data)
{
    const wallet_money = document.getElementById("total_money");
    const total_income = document.getElementById("total_income");
    const total_expense = document.getElementById("total_expense");

    wallet_money.innerHTML = '';
    total_income.innerHTML = '';
    total_expense.innerHTML = '';

    if(data[0].TOTAL === null || data[0].INCOME === null || data[0].EXPENSE === null)
    {
        document.getElementById('total_money').innerHTML = '₱ 0.00';
        document.getElementById('total_income').innerHTML = '₱ 0.00';
        document.getElementById('total_expense').innerHTML = '₱ 0.00';
        return;
    }

    const total = data[0].TOTAL;
    const income = data[0].INCOME;
    const expense = data[0].EXPENSE;

    const formattedTotal = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedIncome = income.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedExpense = expense.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    wallet_money.innerHTML = `₱ ${formattedTotal}`;
    total_income.innerHTML = `+ ₱ ${formattedIncome}`;
    total_expense.innerHTML = `- ₱ ${formattedExpense}`;
}