# kwallet

<img src="https://github.com/colinfran/kwallet/raw/main/assets/images/kwallet-icon-logo.png" style="height:200px" />

A Kaspa wallet app for iOS and Android

**currently in progress**
<br/><br/><br/>
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

***NOTE THAT IF YOU WANT TO RUN APP WITH PRODUCTION SERVER, YOU WILL NEED TO REACH OUT TO @colinfran FOR A PRODUCTION SERVER API KEY.***


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
