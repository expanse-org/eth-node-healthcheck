#!/usr/bin/env node
require('dotenv').config()

const ethers = require('ethers');
const http = require('http');

const host = process.env.RPC_HOST || 'localhost';
//const provider = ethers.getDefaultProvider(process.env.NETWORK);
const localProvider = new ethers.providers.JsonRpcProvider(`http://${host}:9656`);
const MIN_BLOCK = 4100000;

const onHealthcheckRequest = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  let localBlockNum;
  //let networkBlockNum;

  try {
    localBlockNum = await localProvider.getBlockNumber();
    //networkBlockNum = await provider.getBlockNumber();
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(e);
  }

  let responseStatus = localBlockNum > MIN_BLOCK ? 500 : 200;

  res.writeHead(responseStatus, { 'Content-Type': 'text/plain' });
  res.end((localBlockNum - networkBlockNum).toString());
};

http.createServer(onHealthcheckRequest).listen(process.env.PORT);
