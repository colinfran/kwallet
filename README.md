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

Once all packages have been installed, you will need to add an API key to both the server and the expo app. You will need to reach out to @colinfran for an API key. Once you receive the API key, you will also receive directions on how to add them to your local environment.


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
