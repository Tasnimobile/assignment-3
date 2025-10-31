// src/components/Credits.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Credits = (props) => {
  const { credits, addCredit, accountBalance } = props;

  // Local state for form inputs
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Make sure valid input
    if (!description || !amount || Number(amount) <= 0) {
      alert("Please enter a valid description and positive amount.");
      return;
    }

    const newCredit = {
      description: description,
      amount: Number(amount),
      date: new Date().toISOString()
    };

    addCredit(newCredit);

    // Clear form
    setDescription("");
    setAmount("");
  };

  // Convert ISO date to readable date
  const formatDate = (isoString) => new Date(isoString).toLocaleDateString();

  // Display credit list entries
  const creditsDisplay = credits.map((credit) => (
    <div key={credit.id}>
      <p>Description: {credit.description}</p>
      <p>Amount: ${Number(credit.amount).toFixed(2)}</p>
      <p>Date: {formatDate(credit.date)}</p>
      <hr />
    </div>
  ));

  return (
    <div>
      <h1>Credits</h1>

      <h3>Account Balance: ${accountBalance.toFixed(2)}</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            placeholder="Credit description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Amount: </label>
          <input
            type="number"
            value={amount}
            placeholder="0.00"
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit">Add Credit</button>
      </form>

      <br />

      <h3>Credit History</h3>
      {creditsDisplay}

      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default Credits;
