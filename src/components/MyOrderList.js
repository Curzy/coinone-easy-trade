import React, { Component } from 'react';
import moment from 'moment';
import 'styles/MyOrderList.scss';
import CancelOrderButton from 'Components/CancelOrderButton';


class MyOrderList extends Component {
  
  render() {
    const limitOrders = this.props.limitOrders;
    const completeOrders = this.props.completeOrders;
    const currency = this.props.currency;

    const myOrders = limitOrders[currency] === undefined || completeOrders[currency] === undefined ? 
        [] : limitOrders[currency]
          .concat(completeOrders[currency]).sort(order => {
            return order.timestamp
          })


    return (
      <table>
        <caption>주문 내역</caption>
        <thead>
          <tr>
            <th>시간</th>
            <th>주문</th>
            <th>체결량/변동량</th>
          </tr>
          <tr>
            <th>체결가/현재가</th>
            <th>KRW변동</th>
            <th>수수료</th>
          </tr>
        </thead>
        <tbody>
          {myOrders.map(order => {
            return (
              <React.Fragment key={order.orderId}>
              <tr key={order.orderId + '_1'}>
                <td>{moment(Number(order.timestamp)).from(moment())}</td>
                <td>{order.type === 'bid' ? '매수' : '매도'}</td>
                <td>{order.type === 'bid' ? '+' : '-'}{order.qty}</td>
              </tr>
              <tr key={order.orderId + '_2'}>
                <td>{this.props.formatMoney(order.price)}</td>
                <td>{order.type === 'bid' ? '+' : '-'}{this.props.formatMoney(parseInt(order.qty * order.price, 10))}</td>
                <td>{order.fee !== undefined ? this.props.formatMoney(order.fee) + (order.type === 'bid' ? currency.toUpperCase() : 'KRW') : '-'}</td>
              </tr>
              <tr key={order.orderId + '_3'}>
                <td colSpan='3'>
                  <CancelOrderButton 
                    order={order}
                    coinone={this.props.coinone}
                    currency={currency}
                  />
                </td>
              </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    )
  }
}


export default MyOrderList;
