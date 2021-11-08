const express = require('express');
const path = require('path');
const request = require('request');

const app = express();

const port = process.env.APP_PORT || 8080;
const daprPort = process.env.DAPR_HTTP_PORT || 3500;

const daprUrl = `http://localhost:${daprPort}/v1.0/invoke`;
// const apiUrl = "http://localhost";
// const orderUrl = apiUrl + ":3001";
// const neworderUrl = apiUrl + ":3002";

const orderUrl = daprUrl + "/nodeapp1/method";
const neworderUrl = daprUrl + "/nodeapp2/method";
//const neworderUrl = daprUrl + "/nodeapp2";

// Node1 /order
app.get('/order', async (req, res) => {
    // const url = `${daprUrl}/nodeapp1/method/order`;
    const url = `${orderUrl}/order`;
    req.pipe(request(url)).pipe(res);
});

// Node2 /neworder
app.post('/neworder', async (req, res) => {
//   const url = `${daprUrl}/nodeapp2/method/newroder`;
    const url = `${neworderUrl}/neworder`;
  req.pipe(request(url)).pipe(res);
});


// Gateway status and port informations
app.get('/gateway/status', async(req, res) => {
  const result = {
    status: 'ok'
  }
  res.send(result);
});


// Order status and port informations
app.get('/order/status', async (req, res) => {
  const url = `${orderUrl}/status`;
  req.pipe(request(url)).pipe(res);
});

app.get('/order/ports', async (req, res) => {
  const url = `${orderUrl}/ports`;
  req.pipe(request(url)).pipe(res);
});

// Neworder status and port information
app.get('/neworder/status', async (req, res) => {
  const url = `${neworderUrl}/status`;
  req.pipe(request(url)).pipe(res);
});

app.get('/neworder/ports', async (req, res) => {
  const url = `${neworderUrl}/ports`;
  req.pipe(request(url)).pipe(res);
});

app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}!`));
