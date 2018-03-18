import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CoinoneAPI from './coinone';
import MyOrderLists from './MyOrderList';


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
      orderType: 'buy',
      orderParams: {
        buy: {
          quantity: 0.0,
          price: 0,
        },
        sell: {
          quantity: 0.0,
          price: 0,
        },
      },
      limitOrders: {
        btc: [],
      },
      completeOrders: {
        btc: [],
      },
      currency: 'btc',
      intervalId: undefined,
    }

    this.coinone = new CoinoneAPI(process.env.REACT_APP_ACCESS_TOKEN, process.env.REACT_APP_SECRET_KEY);
    this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this)
    this.handleOrderParamChange = this.handleOrderParamChange.bind(this);
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this)
  }

  getBaseInformations(coinone) {
    const ticker = coinone.ticker('btc');
    const userInfo = coinone.userInfo();
    const balance = coinone.accountBalance();
    const limitOrders = coinone.limitOrders();
    const completeOrders = coinone.completeOrders();
    Promise.all([ticker, userInfo, balance, limitOrders, completeOrders])
      .then(result => {
        this.setState({
          ticker: {
            btc: result[0]
          },
          userInfo: result[1].userInfo,
          balance: result[2],
          limitOrders: {
            btc: result[3].limitOrders
          },
          completeOrders: {
            btc: result[4].completeOrders
          }
        })
      })
  }

  refreshInformation(coinone) {
    const ticker = coinone.ticker('btc');
    const balance = coinone.balance();
    const limitOrders = coinone.limitOrders();
    const completeOrders = coinone.completeOrders();

    Promise.all([ticker, balance, limitOrders, completeOrders])
      .then(result => {
        this.setState({
          ticker: {
            btc: result[0]
          },
          balance: result[1],
          limitOrders: {
            btc: result[2].limitOrders
          },
          completeOrders: {
            btc: result[3].completeOrders
          }
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
  
  handleOrderTypeChange(e) {
    this.setState({
      orderType: e.target.value
    })
  }

  handleOrderParamChange(e) {
    const orderParams = Object.assign({}, this.state.orderParams)
    let value = e.target.value;
    if (!isNaN(value) && value.includes('.')) {
      if (value.slice(-1) === '0' || value.slice(-1) === '.') {}
      else {
        value = Number(value)
      }
    }
    orderParams[this.state.orderType][e.target.name] = value;
    this.setState(orderParams);
  }

  handleOrderSubmit(e) {
    e.preventDefault();
    const orderType = this.state.orderType;
    const price = this.state.orderParams[orderType].price;
    const qty = this.state.orderParams[orderType].quantity;
    
    const limitOrder = orderType === 'buy' ? 
      this.coinone.limitBuy(price, qty, 'btc') : this.coinone.limitSell(price, qty, 'btc')

    limitOrder
      .then(result => {
        this.coinone.limitOrders('btc')
          .then(result => {
            this.setState({
              limitOrders: {
                btc: result.limitOrders
              }
            })
          }
        );
    })
  }

  componentDidMount() {
    this.getBaseInformations(this.coinone)
    this.intervalId = setInterval(this.refreshInfo, 3000, this.coinone);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {

    const welcome = !this.isEmptyObject(this.state.userInfo) ? (
      <p className='App-intro'>{this.state.userInfo.mobileInfo.userName}님 환영합니다!</p> 
    ) : (
      <p className='App-intro need-cert'>코인원에서 인증을 마쳐야 합니다</p> 
    )

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

    const btcTicker = !this.isEmptyObject(this.state.ticker.btc) ? this.formatMoney(this.state.ticker.btc.last) : 'BTC 가격을 불러올 수 없습니다'

    const buyForm = (
      <form onSubmit={this.handleOrderSubmit}>
        <input name='order-type' value='buy' type='hidden'/>
        <input name='currency' value={this.state.currency} type='hidden'/>
        <label>매수 수량:
          <input
            name='quantity'
            type='text'
            value={this.state.orderParams.buy.quantity}
            onChange={this.handleOrderParamChange}
          />
          {this.state.currency.toUpperCase()}
        </label>
        <label>매수 단가:
          <input
            name='price'
            type='text'
            value={this.state.orderParams.buy.price}
            onChange={this.handleOrderParamChange}
          />
          원
        </label>
        <input type='submit' value='매수 주문' />
      </form>
    )

    const sellForm = (
      <form onSubmit={this.handleOrderSubmit}>
        <input name='order-type' value='sell' type='hidden'/>
        <input name='currency' value={this.state.currency} type='hidden'/>
        <label>매도 수량:
          <input
            name='quantity'
            type='text'
            value={this.state.orderParams.sell.quantity}
            onChange={this.handleOrderParamChange}
          />
          {this.state.currency.toUpperCase()}
        </label>
        <label>매도 단가:
          <input
            name='price'
            type='text'
            value={this.state.orderParams.sell.price}
            onChange={this.handleOrderParamChange}
          />
          원
        </label>
        <input type='submit' value='매도 주문' />
      </form>
    )

    const orderForm = this.state.orderType === 'buy' ? buyForm : sellForm

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Coinone Easy Trade</h1>
        </header>
        <div>
          {welcome}
          {balance}
        </div>
        <div className='btc-ticker'>
          <p>BTC/KRW {btcTicker}원</p>
        </div>
        <div className='order-section'>
          <div className='buy-sell-flag'>
            <button value='buy' onClick={this.handleOrderTypeChange}>BUY</button>
            <button value='sell' onClick={this.handleOrderTypeChange}>SELL</button>
          </div>
          <div>
            {orderForm}
          </div>
          <div>
            거래 내역
            <MyOrderLists
              limitOrders={this.state.limitOrders}
              completeOrders={this.state.completeOrders}
              currency={this.state.currency}
              formatMoney={this.formatMoney}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default App;
