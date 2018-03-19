import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from 'styles/CancelOrderButton.scss';
const cx = classNames.bind(styles);


class CancelOrderButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'filled',
      info: {}
    }

    this.getOrderInfo = this.getOrderInfo.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }
  
  getOrderInfo(orderId, currency, coinone) {
    const orderInfo = coinone.orderInfo(orderId, this.props.currency);
    orderInfo.then(result => {
      this.setState(
        {
          status: result.status,
          info: result.info,
        }
      );
    })
  }

  cancelOrder(order, coinone) {
    const cancelOrder = coinone.cancelOrder(
      order.orderId,
      order.price,
      order.remainQty,
      order.type === 'ask' ? 
        1 : order.type === 'bid' ? 
          0 : undefined,
      this.props.currency
    )

    cancelOrder.then(result => {
      if (result.errorCode === '101') {
        alert('잘못된 포맷');
      }
      if (['104', '111'].indexOf(result.errorCode) !== -1) {
        alert('주문 id가 존재하지 않습니다');
      }
      if (result.errorCode === '112') {
        alert('주문 취소에 실패했습니다')
      }
    })
  }

  render() {
    return (
      <button
        className={cx('cancel-order-button', {'filled': this.state.status === 'filled'})}
        onClick={this.cancelOrder}
        disabled={this.state.status === 'filled'}
      >{this.state.status === 'filled' ? '완료된 주문' : '주문 취소'}</button>
    )
  }
}


export default CancelOrderButton;
