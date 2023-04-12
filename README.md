# kwallet

![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![React Badge](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Digital Ocean Badge](https://img.shields.io/badge/Digital_Ocean-0080FF?style=for-the-badge&logo=DigitalOcean&logoColor=white)

![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/oln7.svg)


<img src="https://github.com/colinfran/kwallet/raw/main/assets/images/kwallet-icon-logo.png" style="height:200px" />

A non-custodial Kaspa wallet app for iOS and Android

**currently in progress**
<br/><br/>
[Link To Official Website](https://kwallet.app/)
<br/><br/>
Donations accepted!


<a href="https://kwallet.app/?donate=1" target="_blank">
  <img width="75px;" src="https://i.imgur.com/PoILazo.png">
</a><br/>
<br/>

## local development
set up:
```
git clone https://github.com/colinfran/kwallet.git
cd kwallet
yarn install

cd server
yarn install
cd ..
```

Once all packages have been installed, run the following commands
```
cp .env-example .env
cp ./server/.env-example ./server/.env
```

After running these commands, go into the root .env file and add your computer's network IP. This is needed for when running `yarn run dev`. When you run this command, it will run with your local server. When testing with local server and an external device, the device needs to be able to send requests to the local server.


### run app with local server
To run the Expo app with local server, you will need to have two terminal instances open. 
```
In the first terminal instance, run the server:

cd server
yarn run dev

In the second instance, run the expo app:
yarn run dev
```

### run app with production server
To run the Expo app with production server, in a single terminal run:
```
yarn run prod
```
***NOTE THAT IF YOU WANT TO RUN APP WITH PRODUCTION SERVER, YOU WILL NEED TO REACH OUT TO @colinfran FOR A PRODUCTION SERVER API KEY.***
