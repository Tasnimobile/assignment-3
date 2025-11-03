/*==================================================
src/components/Debits.js

The Debits component contains information for Debits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import { Link } from 'react-router-dom';
import React, { Component } from 'react';

class Debits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      amount: '',
      error: ''
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (entry) => {

    entry.preventDefault();

    const amt = parseFloat(this.state.amount);

    
    // check for valid debit entry
    if (!this.state.description || isNaN(amt) || amt <= 0) {
      console.warn('Invalid debit entry', entry);
      return;
    }

    //call addDebit from App.js
    this.props.addDebit({ description: this.state.description, amount: amt });

    //return to empty state
    this.setState({ description: '', amount: '', error: '' });
  }

  render() {
    const { description, amount} = this.state;
    const { accountBalance } = this.props;
    const debits = (this.props.debits || []).slice().sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return (
      <div>
        <h1>Debits</h1>
        <h3>Account Balance: ${accountBalance ? Number(accountBalance).toFixed(2) : '0.00'}</h3>

        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {/* display debits */}
          {debits.map((debit, idx) => {
            const dateStr = debit.date ? new Date(debit.date).toLocaleDateString() : '';
            const amountStr = Number(debit.amount || 0).toFixed(2);
            const key = debit.id || `${dateStr}-${idx}`;
            return <li key={key}>{amountStr} {debit.description} {dateStr}</li>;
          })}
        </ul>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={this.handleChange}
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={this.handleChange}
          />
          <button type="submit">Add Debit</button>
        </form>


        <br/>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }
}

export default Debits;