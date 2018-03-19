import React, { Component } from 'react';


class Balance extends Component {
  render() {
    const btcBalance = this.props.isEmptyObject(this.props.balance.btc) ?
      (
        <tr>
          <td>BTC</td>
          <td colSpan='2' rowSpan='2'>가져오는 중</td>
        </tr>
      ) :
      (
        <tr>
          <td>BTC</td>
          <td>{this.props.balance.btc.avail}</td>
          <td>{this.props.balance.btc.balance}</td>
        </tr>
      )

    const krwBalance = this.props.isEmptyObject(this.props.balance.krw) ?
      (
        <tr>
          <td>KRW</td>
        </tr>
      ) :
      (
        <tr>
          <td>KRW</td>
          <td>{this.props.balance.krw.avail}</td>
          <td>{this.props.balance.krw.balance}</td>
        </tr>
      )

    return (
      <table>
        <thead>
          <tr>
            <th>화폐</th>
            <th>거래가능</th>
            <th>자산</th>
          </tr>
        </thead>
        <tbody>
          {btcBalance}
          {krwBalance}
        </tbody>
      </table>
    )
  }
}


export default Balance;