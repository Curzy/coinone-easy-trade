import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from 'styles/CancelOrderButton.scss';
const cx = classNames.bind(styles);


class CancelOrderButton extends Component {
  
  render() {
    return (
      <button className={cx('cancel-order-button')}>주문 취소</button>
    )
  }
}


export default CancelOrderButton;
