import React, { Component } from 'react';


class Balance extends Component {
  render() {
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
          <tr>
            <td>BTC</td>
            <td>{this.props.balance.btc.avail}</td>
            <td>{this.props.balance.btc.balance}</td>
          </tr>
          <tr>
            <td>KRW</td>
            <td>{this.props.balance.krw.avail}</td>
            <td>{this.props.balance.krw.balance}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}


export default Balance;