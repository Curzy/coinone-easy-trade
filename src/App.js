import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CoinoneAPI from './coinone';


class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      amount: 0.00,
      limitPrice: 0.00,
      totalPrice: 0.00,
      ticker: {
        btc: {}
      },
      userInfo: {},
      balance: {},
      rendered: false,
    }

    this.coinone = new CoinoneAPI(process.env.REACT_APP_ACCESS_TOKEN, process.env.REACT_APP_SECRET_KEY);
  }

  componentDidMount() {
    this.getBaseInformations(this.coinone)
    this.setState({rendered: true})
  }

  render() {
    const balance = !this.isEmptyObject(this.state.balance) ? (
      <div className='balance'>
        <p className='balance-btc'>BTC / 거래 가능: {this.state.balance.btc.avail} 자산: {this.state.balance.btc.balance}</p>
        <p className='balance-krw'>KRW / 거래 가능: {this.state.balance.krw.avail} 자산: {this.state.balance.krw.balance}</p>
      </div>
    ) : (
      <div className='balance no-balance'>
        지갑 정보를 불러올 수 없습니다
      </div>
    );

    const btcTicker = !this.isEmptyObject(this.state.ticker.btc) ? this.formatMoney(this.state.ticker.btc.last) : 'X'

    const welcome = !this.isEmptyObject(this.state.userInfo) ? (
      <p className='App-intro'>환영합니다! {this.state.userInfo.mobileInfo.userName}님</p> 
    ) : (
      <p className='App-intro need-cert'>코인원에서 인증을 마쳐야 합니다</p> 
    )
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Coinone Easy Trade</h1>
        </header>
        {welcome}
        {balance}
        <div className='btc-ticker'>
          <p>비트코인/KRW {btcTicker}원</p>
        </div>
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

  getBaseInformations(coinone) {
    const ticker = coinone.ticker('btc');
    const userInfo = coinone.userInfo();
    const balance = coinone.accountBalance();
    Promise.all([ticker, userInfo, balance])
      .then(result => {
        this.setState({
          ticker: {
            btc: result[0]
          },
          userInfo: result[1].userInfo,
          balance: result[2]
        })
      })
  }

  formatMoney(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  isEmptyObject(obj) {
    for(const key in obj) {
      if(obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}

export default App;
