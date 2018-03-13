import React, { Component } from 'react';
import crypto from 'crypto';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.getEncodedPayload = this.getEncodedPayload.bind(this);
    this.getSignature = this.getSignature.bind(this)
    this.getResponse = this.getResponse.bind(this)
    this.getAccountBalance = this.getAccountBalance.bind(this);
  }

  getEncodedPayload(payload) {
    return new Buffer(JSON.stringify(payload)).toString('base64');
  }

  getSignature(encodedPayload, secretKey) {
    return crypto
      .createHmac('sha512', secretKey.toUpperCase())
      .update(encodedPayload)
      .digest('hex');
  }

  getResponse(url, payload) {
    const encodedPayload = this.getEncodedPayload(payload);
    const signature = this.getSignature(encodedPayload, process.env.REACT_APP_SECRET_KEY);

    const headers = {
      'content-type': 'application/json',
      'X-COINONE-PAYLOAD': encodedPayload,
      'X-COINONE-SIGNATURE': signature,
    };

    const options = {
      headers: headers
    };

    axios.post(url, encodedPayload, options)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getAccountBalance() {
    const url = 'https://api.coinone.co.kr/v2/account/balance/';
    const payload = {
      'access_token': process.env.REACT_APP_ACCESS_TOKEN,
      'nonce': Date.now()
    };

    this.getResponse(url, payload);
  }

  componentDidMount() {
    this.getAccountBalance();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Coinone Easy Trade</h1>
        </header>
        <p className="App-intro">
          To get started, edit Login with oAuth to Coinone.
        </p>
      </div>
    );
  }
}

export default App;
