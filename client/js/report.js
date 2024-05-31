document.addEventListener('DOMContentLoaded', function () {
    const filter = document.getElementById("date_filter");
   
    filter.value = 'year';
    fetch('http://localhost:8080/getTransactions?filter='+ filter.value)
    .then(response => response.json())
    .then(data => loadTransactionTable(data['data']));



    const generatePDF = document.getElementById('generate_pdf');


    generatePDF.addEventListener('click', function () {
        generate();
    });

    filter.addEventListener('click', function () {
        fetch('http://localhost:8080/getTransactions?filter='+ filter.value)
        .then(response => response.json())
        .then(data => loadTransactionTable(data['data']));


    });
})


function generate() {
    const { jsPDF } = window.jspdf;

    html2canvas(document.querySelector("#printable")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("download.pdf");
    });
}

function getFormattedDate(date_to_convert) {
    const date = new Date(date_to_convert);
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = date.toLocaleString('en-US', options);
  
    return formattedDate;
}

function loadTransactionTable(data) {
     //load data into table
     const table = document.querySelector('table tbody');
     //add data to table
     if(data.length === 0)
     {
         table.innerHTML = "<tr><td class='whitespace-nowrap p-4 text-sm text-gray-500 text-center italic text-lg' colspan='7'>No Data</td></tr>";
         return;
     }
     let tableHtml = "";
     data.forEach(function ({date, transaction_number, type_name, name, description, amount}) {
         tableHtml += `<tr class="divide-x divide-gray-200">`;
         tableHtml += `<td class="whitespace-nowrap p-4 text-sm text-gray-500">${getFormattedDate(date)}</td>`;
         tableHtml += `<td class="whitespace-nowrap p-4 text-sm text-gray-500">${transaction_number}</td>`;
         tableHtml += `<td class="whitespace-nowrap p-4 text-sm text-gray-500">${type_name}</td>`;
         tableHtml += `<td class="whitespace-nowrap p-4 text-sm text-gray-500">${name}</td>`;
         tableHtml += `<td class="whitespace-nowrap p-4 text-sm text-gray-500">${description}</td>`;
         tableHtml += `<td class="whitespace-nowrap p-4 text-sm text-gray-500">${amount}</td>`;
         tableHtml += "</tr>";
     });
     table.innerHTML = tableHtml;
}