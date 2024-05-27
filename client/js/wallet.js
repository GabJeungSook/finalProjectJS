document.addEventListener('DOMContentLoaded', function () {
    const transaction_number = document.getElementById("transaction_number");
    transaction_number.value = 'TRN-000' + Math.floor(Math.random() * 1000000);
});