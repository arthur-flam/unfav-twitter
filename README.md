# Twitter unfavorite automation

## Setup
Fill details in the `config.js` file :
- API token and keys...
- etc.

## Run
```bash
while true; do node app.js ; sleep $[ ( $RANDOM % 100 )  + 1 ]s ; done
```
