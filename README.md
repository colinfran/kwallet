# kwallet
<a href="https://kwallet.app/?utm_source=github&utm_medium=github-readme" target="_blank">
  <img src="https://github.com/colinfran/kwallet/raw/main/assets/images/kwallet-icon-logo.png" style="height:150px" />
</a>

A non-custodial Kaspa wallet app for iOS and Android


**currently in progress**
<br/><br/>
[Link To Official Website](https://kwallet.app/?utm_source=github&utm_medium=github-readme)
<br/><br/>
Donations accepted!


<a href="https://kwallet.app/?utm_source=github&utm_medium=github-readme&donate=1" target="_blank">
  <img width="75px;" src="https://i.imgur.com/PoILazo.png">
</a><br/>
<br/>

---
Frameworks

[![Kaspa](https://img.shields.io/badge/KASPA-0AC18E?style=for-the-badge&logo=kaspa%20Cash&logoColor=white)](https://github.com/kaspanet/rusty-kaspa)
[![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)](https://expo.dev/)
[![React Badge](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactnative.dev/)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Digital Ocean Badge](https://img.shields.io/badge/Digital_Ocean-0080FF?style=for-the-badge&logo=DigitalOcean&logoColor=white)](https://www.digitalocean.com/?refcode=999b77d579b6&utm_campaign=Referral_Invite)

Sever Statuses

[![Better Uptime Badge website](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fuptime-badge-two.vercel.app%2F1147570%3Flabel%3Dwebsite%26down_message%3Doffline%26up_message%3Donline)](https://status.kwallet.app)
[![Better Uptime Badge api](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fuptime-badge-two.vercel.app%2F1147795%3Flabel%3Dapi%26down_message%3Doffline%26up_message%3Donline)](https://status.kwallet.app)
[![Better Uptime Badge graph data](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fuptime-badge-two.vercel.app%2F1147796%3Flabel%3Dgraphdata%26down_message%3Doffline%26up_message%3Donline)](https://status.kwallet.app)

---

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

---

### run app with local server
To run the Expo app with local server, you will need to have two terminal instances open. 

In the first terminal instance, run the server:
```
yarn run server
```
In the second instance, run the expo app:
```
yarn run dev
```

### run app with production server
To run the Expo app with production server, in a single terminal run:
```
yarn run prod
```
***NOTE THAT IF YOU WANT TO RUN APP WITH PRODUCTION SERVER, YOU WILL NEED TO REACH OUT TO @colinfran FOR A PRODUCTION SERVER API KEY.***

---

Listed below are the 3rd party services used to help keep the app running smoothly.

|               Service            |                   Product                 |
|----------------------------------|-------------------------------------------|
| Bug Tracking and Error Reporting | [Sentry.io](https://sentry.io/)           |
|         Uptime Monitoring        | [BetterUptime](https://betteruptime.com/) |


