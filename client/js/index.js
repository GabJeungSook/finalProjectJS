document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:8080/getChart')
  .then(response => response.json())
  .then(data => {
    const chartData = [];
const chartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

for (let i = 0; i < chartLabels.length; i++) {
    const monthLabel = chartLabels[i];
    const dataPoint = data['data'].find(item => item.month === monthLabel);

    if (dataPoint) {
        chartData.push(dataPoint.total_amount);
    } else {
        chartData.push(0); // Handle missing data gracefully
    }
}

    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: '# of Votes',
          data: chartData,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
 
})