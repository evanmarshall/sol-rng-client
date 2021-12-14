# sol-rng-client
This is an example client to use the solana random number beacon. 

It creates a deployable and self contained html file that can be directly uploaded to Arweave as a permaweb app.
This repo was used to create this permaweb app: arweave.net/tC7JOmtzqjl0Dx3IEXPvjMLsp3HQmfoBila5sJ-49xE

## Installation
1. Install `Node >=v16`
2. `npm install`

## Running
1. `npm run build`
2. `node src/server.js`
3. Open `localhost:8000` and see the dashboard.

## Deployment
1. Install `arkb`: https://github.com/textury/arkb
2. `arkb deploy .deploy/index.html -w <path-to-your-arweave-key>`
