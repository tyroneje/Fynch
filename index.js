const express = require('express');
const dotenv = require('dotenv');
const { resolve } = require('path');
const collection_lodash = require('lodash/collection');

dotenv.config({ path: './.env' });

const app = express();
const port = 3010;

let url = `${process.env.STOCK_API}`;
let key = `apikey=${process.env.STOCK_TOKEN}`;
let symbol = (tix) => `symbol=${tix}`;
let company_fx = 'function=OVERVIEW';
let stock_data_fx = 'function=TIME_SERIES_MONTHLY_ADJUSTED';
let bob = {};
let bob2 = {}

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/amount', (req, res) => {
  //console.log(req.query);
  if (!req.query.stock || !req.query.amount) {
    console.log('error....');
    res.send({
      message: 'please include both stock and amount inputs.'
    });
  } else {

    let stock = req.query.stock;
    let blob = url + `?${key}&${company_fx}&${symbol(stock)}`;
    console.log(blob);

    fetch(blob).then(async (res) => {
      let returns = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let arr = [];

      while (true) {
        const { value, done } = await returns.read();
        if (done) break;
        bob = JSON.parse(value);
      }

      // bob = (x) => {
      //   return {
      //     symbol: x.Symbol,
      //     dividend: x.DividendPerShare,
      //     yield: x.DividendYield,
      //     date:  x.DividendDate,
      //     exDate: x.ExDividendDate
      //   }
      // };
    });

    let blob2 = url + `?${key}&${stock_data_fx}&${symbol(stock)}`;
    console.log(blob2);

    fetch(blob2).then(async (res1) => {
      let returns = res1.body.pipeThrough(new TextDecoderStream()).getReader();
      let arr = [];

      while (true) {
        const { value, done } = await returns.read();
        if (done) break;
        arr = JSON.parse(value);
      }

      bob2 = arr;
      console.log(bob2);
      let current_year_dividend_months = Object.keys(bob2['Monthly Adjusted Time Series'])
        .map(date => new Date(date))
        .filter(date => {
          let of_this_year = date > new Date(`01/01/${new Date().getFullYear()}`);


        }).map(date => date.getMonth() + 1);

        collection_lodash.filter(bob2['Monthly Adjusted Time Series'], (obj)=>{
        })
      res.send(current_year_dividend_months);

      //console.log(bob, current_year_dividend_months);
      // let bobby = arr.keys().filter((month) => {

      //   console.log(month);
      //   return new Date(month) > new Date("01/01/2024")
      // })
      //console.log(arr);
      // arr = arr.map((x) => {
      //   return {
      //     date: x.priceDate,
      //     symbol: x.symbol,
      //     price: x.close,
      //     returns: (x.close - x.open).toFixed(2)
      //   }
      // });
    });


    //pull or format stock given in query
    //format url and fetch data
    // calculate what the payout term is (monthly (12), quarterly (4), biannually (2), annually(1)):
    // - if ex/dividend date is next month and the previous was this month: monthly
    // - if ex/dividend date is this month and the previous was last month: monthly
    // - if ex/dividend date is this month and the previous was two (2) months before: quarterly
    // - if ex/dividend date is next month and the previous was two (2) months before: quarterly
    // - if ex/dividend date is this month and the previous was two (2) months before: quarterly
    // - if ex/dividend date is this month/year and the previous is not in this year: annually
    // - if ex/dividend date is this year and the previous is not in this year: annually
    // - if ex/dividend date is this year and the previous is in this year: bi-annually
    //calculate  number of stocks to purchase
    //return JSON
    // - symbol
    // - company name
    // - stock price
    // - number of stocks
    // - total dividend amount
    // - amount of dividend per payout term
    // - amount of dividend dispersed monthly (VERSION 2) 

    //v1 - calculate 1 stock to amount  1:1
    //v2 - calculate 5:1

  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
