# kwallet

<img src="https://github.com/colinfran/kwallet/raw/main/assets/images/kwallet-icon-logo.png" style="height:200px" />

A Kaspa wallet app for iOS and Android

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

