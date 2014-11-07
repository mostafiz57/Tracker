# Umaps tracker front-end
Web client for umaps tracker

## Stack
This app is based on (M)EAN stack. The bracket wrapped arround M mean that mongodb is not required, may be it would be included sometime in the future.

## Dev tools
- nodejs and npm (of course)
- bower
- grunt
*Note*: You must install nodemon to run server in autoreload mode.

## Installation
### Step 0: install tools
- nodejs:
```bash
sudo add-apt-repository ppa:chris-lea/node.js 
sudo apt-get update
sudo apt-get install
```
- bower
```bash
sudo npm i -g bower
```
- grunt
```bash
sudo npm i -g grunt-cli
```

### Step 1: clone this repo and install dependencies
```bash
cd server
npm install
cd ../client
npm install
bower install
```
If you've got error at any step, retry with sudo.

### Step 2: Build the app then run server
```bash
cd client
grunt build
cd ../server
npm start
```

Open your browser and navigate to http://localhost:8080 to see it.
I will explain app structure later.