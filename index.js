const express = require('express');
const dotenv = require('dotenv');
const { resolve } = require('path');

dotenv.config({ path: './.env' });

const app = express();
const port = 3010;
let url = `${process.env.STOCK_API}&?apikey=${process.env.STOCK_TOKEN}&symbol=${process.env.STOCK_TOKEN}`
//${stockDateQueryParams}`;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/amount', (req, res) => {
  if (!req.query?.stock || !res.query?.amount) {
    console.log('error....');
    res.send({
      message: 'please include both stock and amount inputs.'
    });
  } else {
    let stock = req.query.stock;

    fetch(url).then(async (res) => {
      let returns = res.body.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const { value, done } = await returns.read();
        if (done) break;
        arr = JSON.parse(value);
      }

      arr = arr.map((x) => {
        return {
          date: x.priceDate,
          symbol: x.symbol,
          price: x.close,
          returns: (x.close - x.open).toFixed(2)
        }
      });
    });

    //.split(',')


    //pull or format stock given in query
    //format url and fetch data
    //calculate 
    //return JSON

    //v1 - calculate 1 stock to amount  1:1
    //v2 - calculate 5:1
    res.send('the body');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
