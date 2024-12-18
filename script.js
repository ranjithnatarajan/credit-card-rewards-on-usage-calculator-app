let creditCards = []; // Initialize an empty array for credit cards

// Fetch card details from JSON file
fetch('data.json') // Ensure this matches your actual filename
    .then(response => response.json())
    .then(data => {
        creditCards = data.cards; // Assign fetched cards to creditCards variable
    })
    .catch(error => console.error('Error fetching card data:', error));

function calculateCashback() {
    const amount = parseFloat(document.getElementById('inputAmount').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const tbody = document.querySelector('#cashbackTable tbody');
    tbody.innerHTML = ''; // Clear previous results

    creditCards.forEach(card => {
        const rates = card.cashbackRates;
        const basePurchaseValue = card.basePurchaseValue;

        // Round down the entered amount to the nearest multiple of basePurchaseValue
        const roundedAmount = Math.floor(amount / basePurchaseValue) * basePurchaseValue;

        // Calculate divided value
        const dividedValue = (roundedAmount / basePurchaseValue).toFixed(2);

        // Get highest reward rate and corresponding rewards name
        let highestRewardRate = 0;
        let rewardsName = '';
        
        if (card.rewardsCalculator && Object.keys(card.rewardsCalculator).length > 0) {
            highestRewardRate = Math.max(...Object.values(card.rewardsCalculator));
            rewardsName = Object.keys(card.rewardsCalculator).find(key => card.rewardsCalculator[key] === highestRewardRate);
        }

        Object.entries(rates).forEach(([category, rate]) => {
            const cbr = (dividedValue * rate).toFixed(2); // CBR calculation
            
            // Calculate cashback as the product of CBR and highest reward rate
            const cashback = (cbr * highestRewardRate).toFixed(3); 

            const row = `<tr>
                <td>${card.name}</td>
                <td>${category}</td>
                <td>₹${roundedAmount}</td>
                <td>${dividedValue}</td>
                <td>₹${cbr}</td>
                <td>${rewardsName || '-'}</td>
                <td>₹${highestRewardRate.toFixed(2) || '0'}</td>
                <td>₹${cashback}</td>
            </tr>`;
            tbody.innerHTML += row; // Append each row to the table body
        });
    });

    // Explicitly sort cashback column in descending order
    sortCashbackDescending();
}

function sortCashbackDescending() {
    const table = document.getElementById('cashbackTable');
    const rows = Array.from(table.rows).slice(1); // Exclude header

    // Sort rows by the cashback column (index 7) in descending order
    rows.sort((a, b) => {
        const cashbackA = parseFloat(a.cells[7].textContent.replace('₹', '').trim());
        const cashbackB = parseFloat(b.cells[7].textContent.replace('₹', '').trim());
        return cashbackB - cashbackA; // Descending order
    });

    // Reattach sorted rows to the table
    rows.forEach(row => table.tBodies[0].appendChild(row));
}

function openPopup() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closePopup() {
    document.getElementById('settingsModal').style.display = 'none';
}

function applySettings() {
    // Get values from input fields
    const bgColor = document.getElementById('bgColor').value;
    const textColor = document.getElementById('textColor').value;
    const headerBgColor = document.getElementById('headerBgColor').value;
    const headerTextColor = document.getElementById('headerTextColor').value;
    const buttonBgColor = document.getElementById('buttonBgColor').value;
    const buttonTextColor = document.getElementById('buttonTextColor').value;

    // Apply styles to body and elements
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;

    const tableHeader = document.querySelectorAll('#cashbackTable th');
    
    tableHeader.forEach(th => {
        th.style.backgroundColor = headerBgColor;
        th.style.color = headerTextColor;
    });

    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(btn => {
        btn.style.backgroundColor = buttonBgColor;
        btn.style.color = buttonTextColor;
        btn.style.borderRadius = '5px'; // Optional to keep rounded corners
        btn.style.transition = 'background-color 0.3s ease'; // Smooth transition for hover effect
    });
   
   closePopup(); // Close the modal after applying settings
}

// Add event listener for Escape key to close modal
window.addEventListener('keydown', function (event) {
   if (event.key === 'Escape') closePopup();
});

// Add event listener for Enter key to calculate cashback
document.getElementById('inputAmount').addEventListener('keypress', function(event) {
   if (event.key === 'Enter') calculateCashback();
});

// Sorting function for table columns
function sortTable(columnIndex) {
   const table = document.getElementById("cashbackTable");
   const rows = Array.from(table.rows).slice(1); // Exclude header
   const isAscending = table.rows[0].cells[columnIndex].classList.toggle("asc");

   rows.sort((a, b) => {
       const aText = a.cells[columnIndex].textContent.replace('₹', '').trim();
       const bText = b.cells[columnIndex].textContent.replace('₹', '').trim();

       return columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 6 || columnIndex === 7 
           ? (isAscending ? parseFloat(aText) - parseFloat(bText) : parseFloat(bText) - parseFloat(aText))
           : (isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText));
   });

   rows.forEach(row => table.appendChild(row)); // Reattach sorted rows
}
