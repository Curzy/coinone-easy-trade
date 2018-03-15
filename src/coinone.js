import crypto from 'crypto';
import axios from 'axios';


class CoinoneAPIv2 {
  constructor(accessToken, secretKey) {
    this.accessToken = accessToken;
    this.secretKey = secretKey;
    this.proxy = 'https://thingproxy.freeboard.io/fetch/';
    this.url = this.proxy + 'https://api.coinone.co.kr/v2';
    this.payload = {
      'access_token': accessToken,
      'nonce': Date.now()
    }
  }

  getEncodedPayload(payload) {
    return new Buffer(JSON.stringify(payload)).toString('base64');
  }

  getSignature(encodedPayload, secretKey) {
    return crypto
      .createHmac('sha512', secretKey.toUpperCase())
      .update(encodedPayload)
      .digest('hex');
  }

  getResponse(url, params) {
    const payload = Object.assign({}, this.payload, params)
    const encodedPayload = this.getEncodedPayload(payload);
    const signature = this.getSignature(encodedPayload, this.secretKey);

    const headers = {
      'content-type': 'application/json',
      'X-COINONE-PAYLOAD': encodedPayload,
      'X-COINONE-SIGNATURE': signature,
    };

    const options = {
      headers: headers
    };

    axios.post(url, encodedPayload, options)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getAccountBalance() {
    const url = this.url + '/account/balance/';

    this.getResponse(url, {});
  }

  limitBuy(price, qty, currency) {
    const url = this.url + '/order/limit_buy/';
    const params = {
      'price': price,
      'qty': qty,
      'currency': currency,
    }

    this.getResponse(url, params);
  }

  limitSell(price, qty, currency) {
    const url = this.url + '/order/limit_sell/';
    const params = {
      'price': price,
      'qty': qty,
      'currency': currency,
    }

    this.getResponse(url, params);
  }
  
  cancelOrder(orderId, price, qty, sellFlag, currency) {
    const url = this.url + '/order/cancel/';
    const params = {
      'order_id': orderId,
      'price': price,
      'qty': qty,
      'is_ask': sellFlag, // 1 is sell
      'currency': currency
    }

    this.getResponse(url, params);
  }

  orderInfo(orderId, currency) {
    const url = this.url + '/order/order_info/';
    const params = {
      'order_id': orderId,
      'currency': currency
    }

    this.getResponse(url, params);
  }
};

export default CoinoneAPIv2;
