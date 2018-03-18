import React, { Component } from 'react';
import logo from 'media/logo.svg';
import classNames from 'classnames/bind';
import CoinoneAPI from 'lib/coinone';
import Balance from 'Components/Balance';
import MyOrderList from 'Components/MyOrderList';
import styles from 'styles/App.scss';
import OrderForm from './OrderForm';
const cx = classNames.bind(styles);


class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ready: false,
      amount: 0.00,
      limitPrice: 0.00,
      totalPrice: 0.00,
      ticker: {
        btc: {}
      },
      userInfo: {},
      balance: {},
      orderType: 'buy',
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
          ready: true,
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
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  componentDidMount() {
    this.getBaseInformations(this.coinone);
    this.intervalId = setInterval(this.refreshInfo, 3000, this.coinone);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const btcTicker = !this.isEmptyObject(this.state.ticker.btc) ? this.formatMoney(this.state.ticker.btc.last) : 'BTC 가격 가져오는 중'

    return (
      <div className={cx('App')}>
        <header className={cx('App-header')}>
          <img src={logo} className={cx('App-logo')} alt='logo' />
          <h1 className={cx('App-title')}>Coinone Easy Trade</h1>
        </header>
        { !this.state.ready ?
          <p className={cx('now-loading')}>로딩중..</p> :
          <div className={cx('content-wrapper')}>
            <div className={cx('btc-ticker-section')}>
              <p className={cx('btc-ticker-price')}>{btcTicker}</p>
              <p className={cx('btc-ticker-currency')}>KRW/BTC</p>
            </div>
            <div className={cx('balance-wrapper')}>
              <Balance
                balance={this.state.balance}
              />
            </div>
            <div className={cx('order-wrapper')}>
              <div className={cx('buy-sell-flag')}>
                <button className={cx({'current-type': this.state.orderType === 'buy'})} value='buy' onClick={this.handleOrderTypeChange}>매수</button>
                <button className={cx({'current-type': this.state.orderType === 'sell'})} value='sell' onClick={this.handleOrderTypeChange}>매도</button>
              </div>
              <OrderForm
                currency={this.state.currency}
                coinone={this.coinone}
                orderType={this.state.orderType}
                formatMoney={this.formatMoney}
              />
            </div>
            <div className={cx('order-list-wrapper')}>
              <MyOrderList
                limitOrders={this.state.limitOrders}
                completeOrders={this.state.completeOrders}
                currency={this.state.currency}
                formatMoney={this.formatMoney}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}


export default App;
