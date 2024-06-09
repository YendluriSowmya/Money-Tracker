document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const text = document.getElementById('text').value;
    const amount = document.getElementById('amount').value;

    fetch('/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, amount }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadTransactions();
        } else {
            alert('Error adding transaction');
        }
    });
});

function loadTransactions() {
    fetch('/transactions')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('list');
            list.innerHTML = '';
            let balance = 0;
            let income = 0;
            let expense = 0;

            data.transactions.forEach(transaction => {
                const sign = transaction.amount < 0 ? '-' : '+';
                const item = document.createElement('li');
                item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
                item.innerHTML = `
                    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
                `;
                list.appendChild(item);

                if (transaction.amount < 0) {
                    expense += transaction.amount;
                } else {
                    income += transaction.amount;
                }
                balance += transaction.amount;
            });

            document.querySelector('#balance h3').innerText = `$${balance.toFixed(2)}`;
            document.querySelector('#money-plus').innerText = `+$${income.toFixed(2)}`;
            document.querySelector('#money-minus').innerText = `-$${Math.abs(expense).toFixed(2)}`;
        });
}

loadTransactions();
