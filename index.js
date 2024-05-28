const express = require('express');
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({ path: './.env' });

const app = express();
const port = 3010;

let url = `${process.env.STOCK_API}`;
let key = `apikey=${process.env.STOCK_TOKEN}`;
let symbol = (tix) => `symbol=${tix}`;
let company_fx = 'function=OVERVIEW';
let stock_data_fx = 'function=TIME_SERIES_MONTHLY_ADJUSTED';
let bob = {};
let current_year_monthly_dividends = [];

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/amount', (req, res) => {
  if (!req.query.stock || !req.query.amount) {
    console.log('error....');
    res.send({
      message: 'please include both stock and amount inputs.'
    });
  } else {

    let stock = req.query.stock;
    //let blob = url + `?${key}&${company_fx}&${symbol(stock)}`;
    //console.log(blob);

    // fetch(blob).then(async (res) => {
    //   let returns = res.body.pipeThrough(new TextDecoderStream()).getReader();
    //   let arr = [];

    //   while (true) {
    //     const { value, done } = await returns.read();
    //     if (done) break;
    //     bob = JSON.parse(value);
    //   }

    //   // bob = (x) => {
    //   //   return {
    //   //     symbol: x.Symbol,
    //   //     dividend: x.DividendPerShare,
    //   //     yield: x.DividendYield,
    //   //     date:  x.DividendDate,
    //   //     exDate: x.ExDividendDate
    //   //   }
    //   // };
    // });

    let blob2 = url + `?${key}&${stock_data_fx}&${symbol(stock)}`;
    console.log(blob2);

    fetch(blob2).then(async (res1) => {
      let returns = res1.body.pipeThrough(new TextDecoderStream()).getReader();
      let company_adjusted_returns;

      while (true) {
        const { value, done } = await returns.read();
        if (done) break;
        company_adjusted_returns = JSON.parse(value);
      }

      //get dates and related data for the current year
      for (const key in company_adjusted_returns['Monthly Adjusted Time Series']) {
        let date = new Date(key);

        if (date > new Date(`01/01/${new Date().getFullYear()}`)) {
          if (company_adjusted_returns['Monthly Adjusted Time Series'][key]['7. dividend amount'] > 0.00) {
            current_year_monthly_dividends.push({ date: key, ...company_adjusted_returns['Monthly Adjusted Time Series'][key] });
          }
        }
        else {
          break;
        }
      }

      //calculate payout term
      let dividend_lapse = (dividend_list) => {
        let div_span = 0;
        let b = 1;
        for (let index = 0; index < array.length - 2; index++) {
          let prev_div = new Date(array[index]['date']).getMonth() + 1;
          let post_div = new Date(array[b]['date']).getMonth() + 1;
          let span = prev_div - post_div;

          if (span == 0) continue;
          else {
            if (span > div_span) {
              div_span = span;
            }
          }
        }
        return div_span;
      }

      let getPayoutTerm = (lapse_amount) => {
        switch (gap) {
          case 1:
            return 12;
          case 3:
            return 4;
          case 6:
            return 2;
          default:
            break;
        }
      }

      let payout = getPayoutTerm(dividend_lapse(current_year_monthly_dividends));

      console.log(company_adjusted_returns);
      console.log(current_year_monthly_dividends);

      res.send(current_year_monthly_dividends);
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
