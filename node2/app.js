// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// ------------------------------------------------------------

const express = require('express');
const bodyParser = require('body-parser');
require('isomorphic-fetch');

const app = express();
app.use(bodyParser.json());

// These ports are injected automatically into the container.
const daprPort = process.env.DAPR_HTTP_PORT; 
const daprGRPCPort = process.env.DAPR_GRPC_PORT;

const stateStoreName = `statestore`;
const stateUrl = `http://localhost:${daprPort}/v1.0/invoke/nodeapp1/method/neworder`;

const port = process.env.APP_PORT | 3000;

app.get('/status', (_req, res) => {
    const result = {
        status: 'ok'
    }
    res.send(result);
});

app.post('/neworder', (req, res) => {
    const data = req.body;
    const orderId = data.orderId;
    console.log("Got a new order! Order ID: " + orderId);
    console.log("url: "+ stateUrl);
    console.log("state: "+ JSON.stringify(data));

    fetch(stateUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            throw "Failed to new order.";
        }

        console.log("Successfully new order.");
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(500).send({message: error});
    });
});

app.get('/ports', (_req, res) => {
    console.log("DAPR_HTTP_PORT: " + daprPort);
    console.log("DAPR_GRPC_PORT: " + daprGRPCPort);
    res.status(200).send({DAPR_HTTP_PORT: daprPort, DAPR_GRPC_PORT: daprGRPCPort })
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));