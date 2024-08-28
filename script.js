document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error('Error loading data:', error));
}

function populateTable(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.issuer}</td>
            <td>${item.cardName}</td>
            <td>${item.category}</td>
            <td>${item.minimumSpendAmount}</td>
            <td>${item.rewardPointsEarned}</td>
            <td>${item.cashbackReceived}</td>
        `;
        tableBody.appendChild(row);
    });
}

function sortTable(order) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (order === 'asc') {
                data.sort((a, b) => a.cashbackReceived - b.cashbackReceived);
            } else if (order === 'desc') {
                data.sort((a, b) => b.cashbackReceived - a.cashbackReceived);
            }
            populateTable(data);
        })
        .catch(error => console.error('Error sorting data:', error));
}
