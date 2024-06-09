const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moneyTrackerDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    text: String,
    amount: Number
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.get('/transactions', (req, res) => {
    Transaction.find({}, (err, transactions) => {
        if (!err) {
            res.json({ transactions });
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

app.post('/transactions', (req, res) => {
    const newTransaction = new Transaction({
        text: req.body.text,
        amount: req.body.amount
    });

    newTransaction.save()
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false, error: err.message }));
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
