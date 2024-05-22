const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

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
