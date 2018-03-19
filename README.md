# coinone-easy-trade
**Easy, Simple trading web for coinone**

![screenshot](https://i.imgur.com/e2fvcTHl.png)

- Using [Coineone API](http://doc.coinone.co.kr/)
- Minimal features for trading

## [Demo](https://Curzy.github.io/coinone-easy-trade)(거래 주문이 불가능 합니다)
## Description
  - 데스크톱 환경에서 사용자는 [차트](https://coinone.co.kr/chart/?site=Coinone&unit_time=15m)와 [거래소](https://coinone.co.kr/exchange/trade/btc/)를 한눈에 들어오게 배치하여 암호화폐를 거래할 수 있습니다
  - 그러나 모바일 환경에서는 화면 분할, 동시 배치가 어렵고, 많은 정보가 있더라도 작은 화면에 의해 정보를 효율적으로 받아들이기 어려울 수 있습니다
  - 최대한 Simple하게 사용자가 `사느냐/파느냐` 하는 결정을 내리고 실행할 수 있도록 `coinone-easy-trade`를 개발하였습니다
  - 구조는 백엔드 API 서버 없이, JS로 작성한 [API Wrapper Class](https://github.com/Curzy/coinone-easy-trade/blob/master/src/lib/coinone.js)를 이용해 React앱에서 `Coinone API`서버와 통신합니다
  - 백엔드 서버가 아닌 브라우저에서 구동되는 클라이언트에서 통신하여 `Preflight Request`에서 발생하는 CORS문제를 해결하기 위해 요청 앞에 프록시를 통하게 하였습니다
  - BTC에 대한 시장가 매도/매수, 주문 확인, 주문 취소 기능 등을 지원하고 있습니다


## Introduction
  ### Installing
  ```
  $ git clone git@github.com:Curzy/coinone-easy-trade.git
  ```
  ### Setting
  1. [Coinone](https://coinone.co.kr/developer/app/)에서 API V2, 거래소 조회, 사용자 조회, 거래소 주문의 설정으로 API Key를 발급받습니다
  2. 발급받은 키를 `.env`파일을 생성해 저장합니다
  
  ```
  $ vim .env
  REACT_APP_ACCESS_TOKEN='ACCESS_TOKEN'
  REACT_APP_SECRET_KEY='SECRET_KEY'
  ```
  3. 의존성을 설치합니다
  ```
  $ yarn 
  ```
  ### Run App
  ```
  $ yarn start
  ```
  ### Production Build
  ```
  $ yarn build
  ```
