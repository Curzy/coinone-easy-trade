import React, { Component } from 'react';
import styles from 'styles/OrderForm.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


class OrderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderParams: {
        buy: {
          quantity: 0.00,
          price: 0,
        },
        sell: {
          quantity: 0.00,
          price: 0,
        },
      },
    }

    this.handleOrderParamChange = this.handleOrderParamChange.bind(this);
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this)
  }

  handleOrderParamChange(e) {
    const orderParams = Object.assign({}, this.state.orderParams)
    let value = e.target.value;
    orderParams[this.props.orderType][e.target.name] = value;
    this.setState({orderParams: orderParams});
  }

  handleOrderSubmit(e) {
    e.preventDefault();
    const orderType = this.props.orderType;
    const price = this.state.orderParams[orderType].price;
    const qty = this.state.orderParams[orderType].quantity;
    
    const limitOrder = orderType === 'buy' ? 
      this.props.coinone.limitBuy(price, qty, 'btc') : this.props.coinone.limitSell(price, qty, 'btc')

    limitOrder
      .then(result => {
        if (result.errorCode === '101') {
          alert('잘못된 포맷');
        }
        if (result.errorCode === '103') {
          alert('잔고 부족')
        }
      })
  }
  
  render() {
    const buyForm = (
      <form onSubmit={this.handleOrderSubmit}>
        <div className={cx('section')}>
          <div className={cx('section-header')}>매수 수량</div>
          <div className={cx('input-box')}>
            <input
              className={cx('quantity')}
              name='quantity'
              type='number'
              placeholder='0.00'
              value={this.state.orderParams.buy.quantity ? this.state.orderParams.buy.quantity : ''}
              onChange={this.handleOrderParamChange}
            />
            <span>{this.props.currency.toUpperCase()}</span>
          </div>
        </div>
        <div className={cx('section')}>
          <div className={cx('section-header')}>매수 단가</div>
          <div className={cx('input-box')}>
            <input
              className={cx('price')}
              name='price'
              type='number'
              placeholder='0'
              value={this.state.orderParams.buy.price ? this.state.orderParams.buy.price : ''}
              onChange={this.handleOrderParamChange}
            />
            <span>원</span>
          </div>
        </div>
        <div className={cx('submit-section')}>
          <p>총 {this.props.formatMoney(this.state.orderParams.buy.quantity * this.state.orderParams.buy.price)}원</p>
          <input className={cx('submit')} type='submit' value='매수 주문하기' />
        </div>
      </form>
    )

    const sellForm = (
      <form onSubmit={this.handleOrderSubmit}>
        <div className={cx('section')}>
          <div className={cx('section-header')}>매도 수량</div>
          <div className={cx('input-box')}>
            <input
              className={cx('quantity')}
              name='quantity'
              type='number'
              placeholder='0.00'
              value={this.state.orderParams.sell.quantity ? this.state.orderParams.sell.quantity : ''}
              onChange={this.handleOrderParamChange}
            />
            <span>{this.props.currency.toUpperCase()}</span>
          </div>
        </div>
        <div className={cx('section')}>
          <div className={cx('section-header')}>매도 단가</div>
          <div className={cx('input-box')}>
            <input
              className={cx('price')}
              name='price'
              type='number'
              placeholder='0'
              value={this.state.orderParams.sell.price ? this.state.orderParams.sell.price : ''}
              onChange={this.handleOrderParamChange}
            />
            <span>원</span>
          </div>
        </div>
        <div className={cx('submit-section')}>
          <p>총 {this.props.formatMoney(this.state.orderParams.sell.quantity * this.state.orderParams.sell.price)}원</p>
          <input className={cx('submit')} type='submit' value='매도 주문하기' />
        </div>
      </form>
    )

    const orderForm = this.props.orderType === 'buy' ? buyForm : sellForm

    return orderForm;

  }
}


export default OrderForm;
