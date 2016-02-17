# Twitter unfavorite/unlike automation

## Setup
```bash
cp config.js.sample config.js
npm install
```
Fill details in the `config.js` file :
- API token and keys. Get them on [Twitter's dev site](https://apps.twitter.com/).
- The blacklist and whitelist help you choose which favorites/likes you want to remove.

## Run
```bash
while true; do node app.js ; sleep 60s ; done
```
Mind the 15/15min rate limit

## Licence
MIT
