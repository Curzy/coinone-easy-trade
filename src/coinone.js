import crypto from 'crypto';
import axios from 'axios';


class CoinoneAPI {
  constructor(accessToken, secretKey, version = 'v2') {
    this.accessToken = accessToken;
    this.secretKey = secretKey;
    this.version = version;
    this.proxy = 'https://thingproxy.freeboard.io/fetch/';
    this.url = this.proxy + 'https://api.coinone.co.kr/' + this.version;
    this.payload = {
      'access_token': accessToken,
      'nonce': Date.now()
    };

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

  async v2Post(endpoint, params) {
    const payload = Object.assign({}, this.payload, params)
    const encodedPayload = this.getEncodedPayload(payload);
    const signature = this.getSignature(encodedPayload, this.secretKey);

    const headers = {
      'X-COINONE-PAYLOAD': encodedPayload,
      'X-COINONE-SIGNATURE': signature,
      'content-type': 'application/json',
      'accept': 'application/json',
    };

    const options = {
      headers: headers,
      timeout: 5000,
    };

    const result = await axios.post(endpoint, encodedPayload, options)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });

    return result
  }

  async v1Get(endpoint, params) {
    const result = await axios.get(endpoint, { params: params })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });

    return result
  }

  accountBalance() {
    const url = this.url + '/account/balance/';

    return this.v2Post(url, {});
  }

  userInfo() {
    const url = this.url + '/account/user_info/';

    return this.v2Post(url, {});
  }

  limitBuy(price, qty, currency) {
    const url = this.url + '/order/limit_buy/';
    const params = {
      'price': price,
      'qty': qty,
      'currency': currency,
    }

    return this.v2Post(url, params);
  }

  limitSell(price, qty, currency) {
    const url = this.url + '/order/limit_sell/';
    const params = {
      'price': price,
      'qty': qty,
      'currency': currency,
    }

    return this.v2Post(url, params);
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

    return this.v2Post(url, params);
  }

  completeOrders(currency) {
    const url = this.url + '/order/complete_orders/'
    const params = {
      'currency': currency,
    }

    return this.v2Post(url, { params: params });
  }

  limitOrders(currency) {
    const url = this.url + '/order/limit_orders/'
    const params = {
      'currency': currency,
    }

    return this.v2Post(url, params);
  }

  orderInfo(orderId, currency) {
    const url = this.url + '/order/order_info/';
    const params = {
      'order_id': orderId,
      'currency': currency,
    }

    return this.v2Post(url, params);
  }

  ticker(currency) {
    const url = this.url.slice(0, -3) + '/ticker/';
    const params = {
      'currency': currency
    }

    return this.v1Get(url, params);
  }

};

export default CoinoneAPI;
