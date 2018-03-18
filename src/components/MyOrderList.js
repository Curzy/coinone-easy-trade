import React, { Component } from 'react';
import moment from 'moment';
import 'styles/MyOrderList.scss';


class MyOrderList extends Component {
  
  render() {
    const myOrders = this.props.limitOrders[this.props.currency]
      .concat(this.props.completeOrders[this.props.currency]).sort(order => {
        return order.timestamp
      })
    return (
      <table>
        <thead>
          <tr>
            <th>시간</th>
            <th>주문</th>
            <th>체결량/변동량</th>
            <th>체결가/현재가</th>
            <th>KRW변동</th>
            <th>수수료</th>
          </tr>
        </thead>
        <tbody>
          {myOrders.map(order => {
            return (
              <tr>
                <td>{moment(order.timestamp).format('lll')}</td> 주문 시간:  주문가: {order.price} 주문량: {order.qty}
                <td>{order.type === 'bid' ? '매수' : '매도' }</td>
                <td>{order.qty}</td>
                <td>{this.props.formatMoney(order.price)}</td>
                <td>{this.props.formatMoney(parseInt(order.qty * order.price, 10))}</td>
                <td>{order.fee !== undefined ? this.props.formatMoney(order.fee) + (order.type === 'bid' ? this.props.currency.toUpperCase() : 'KRW') : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}


export default MyOrderList;
