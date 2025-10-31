/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  //helper for balance
  computeBalance = (credits, debits) => {
    const toCents = value => Math.round(Number(value || 0) * 100);
    const sumCreditsCents = (credits || []).reduce((acc, c) => acc + toCents(c.amount), 0);
    const sumDebitsCents = (debits || []).reduce((acc, d) => acc + toCents(d.amount), 0);
    return (sumCreditsCents - sumDebitsCents) / 100;
  }

  componentDidMount() {
    const creditsURL = 'https://johnnylaicode.github.io/api/credits.json';
    const debitsURL = 'https://johnnylaicode.github.io/api/debits.json';

    Promise.all([
      fetch(creditsURL).then(res => res.json()),
      fetch(debitsURL).then(res => res.json())
    ])
    .then(([creditsData, debitsData]) => {
      const credits = Array.isArray(creditsData) ? creditsData : (creditsData.entries || []);
      const debits = Array.isArray(debitsData) ? debitsData : (debitsData.entries || []);
      const accountBalance = this.computeBalance(credits, debits);
      this.setState({ creditList: credits, debitList: debits, accountBalance });
      console.log('Loaded credits and debits, accountBalance=', accountBalance);
    })
    .catch(err => {
      console.error('Failed to load credits/debits:', err);
      this.setState({ creditList: [], debitList: [], accountBalance: 0 });
    });
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} />) 
    const DebitsComponent = () => (
      <Debits
        debits={this.state.debitList}
        addDebit={this.addDebit}
        accountBalance={this.state.accountBalance}
      />
    ) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react-starter-code">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }

  //debit
  addDebit = (newDebit) => {

    const amount = Number(newDebit.amount);

    //check for valid debit entry
    if (!newDebit.description || isNaN(amount) || amount <= 0) {
      console.warn('Invalid debit entry', newDebit);
      return;
    }

    //normalize
    const entry = {
      id: Date.now(), // simple id
      description: newDebit.description,
      amount: amount,
      date: newDebit.date ? newDebit.date : new Date().toISOString()
    };

    this.setState(prev => {
      const debitList = [...prev.debitList, entry];
      const accountBalance = this.computeBalance(prev.creditList, debitList);
      return { debitList, accountBalance };
    });
  } 
//credit
addCredit = (newCredit) => {

  const amount = Number(newCredit.amount);

  // Validate credit entry
  if (!newCredit.description || isNaN(amount) || amount <= 0) {
    console.warn("Invalid credit entry", newCredit);
    return;
  }

  // Normalize entry
  const entry = {
    id: Date.now(),
    description: newCredit.description,
    amount: amount,
    date: newCredit.date ? newCredit.date : new Date().toISOString()
  };

  this.setState(prev => {
    const creditList = [...prev.creditList, entry];
    const accountBalance = this.computeBalance(creditList, prev.debitList);
    return { creditList, accountBalance };
  });
}

}

export default App;
