# coinone-easy-trade
Easy, Simple trading web for coinone

- Using [Coineone API](http://doc.coinone.co.kr/)
- Minimal features for trading

## [Demo](https://Curzy.github.io/coinone-easy-trade)
## Purpose


## Introduction
 ### Installing
 ```
 $ git clone git@github.com:Curzy/coinone-easy-trade.git
 ```
 ### Setting
 1. [Coinone](https://coinone.co.kr/developer/app/)에서 API V2, 거래소 조회, 사용자 조회, 거래소 주문의 설정으로 API Key를 발급받는다.
 2. 발급받은 키를 `.env`파일을 생성해 저장한다
 
 ```
 $ vim .env
 REACT_APP_ACCESS_TOKEN='ACCESS_TOKEN'
 REACT_APP_SECRET_KEY='SECRET_KEY'
 ```
 3. 의존성을 설치한다.
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
