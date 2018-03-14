import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CoinoneAPIv2 from './coinone'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0.00,
      limitPrice: 0.00,
      totalPrice: 0.00,
    }

    this.coinone = new CoinoneAPIv2(process.env.REACT_APP_ACCESS_TOKEN, process.env.REACT_APP_SECRET_KEY);
    
    this.limitBuy = this.coinone.limitBuy.bind(this);
    this.limitBuy = this.coinone.limitSell.bind(this);
  }

  componentDidMount() {
    this.coinone.getAccountBalance();
    this.coinone.limitBuy(10000, 0.1, 'btc');
    this.coinone.limitSell(10000000, 0.1, 'btc');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Coinone Easy Trade</h1>
        </header>
        <p className="App-intro">
          To get started, Get your personal API Key from <a href="https://coinone.co.kr/developer/app/" target="_blank" rel="noopener noreferrer">Coinone</a> and set your <strong>ACCESS_TOKEN</strong> and <strong>SECRET_KEY</strong> to <code>.env</code>
        </p>
        <div className='order-section'>
          <div className='buy-sell-flag'>
            <button>BUY</button>
            <button>SELL</button>
          </div>
          <div className='order-input'>
            BTC: <input default={this.state.amount}></input>
            KRW: <input default={this.state.limitPrice}></input>
          </div>
          <div>
            <p>총 <span className='total-price'>{this.state.totalPrice}</span>원</p>
            <button>주문 확인</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
