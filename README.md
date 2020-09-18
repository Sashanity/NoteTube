### External Requirements
- Node.js
- Firebase, firetools (?)

### Run NoteTube

1. **Clone this repo**
```sh
$ git clone https://github.com/Sashanity/NoteTube.git
```

2. **Install dependencies**
```sh
# install dependencies for client side
$ cd NoteTube/src
$ npm install

# install dependencies for server side
$ cd NoteTube/server
$ npm install
```
3. **Add API keys file**
- Obtain `firebaseConfig.js` from Slack channel
- Add `firebaseConfig.js` file to `NoteTube/server/function/util` directory

4. **Configure Google credentials**
- Obtain `ServiceAccountKey.json` (private key file) and <ins>save it somewhere outside the NoteTube folder</ins>
    - you can download file from Slack
    - or you can generate new private key
        - Head to Firebase Console -> NoteTube -> Project Settings -> Service Accounts

- Add GOOGLE_APPLICATION_CREDENTIALS environmental variable and add path to the `ServiceAccountKey.json`

Setup with environmental variable is safer because project would just fish out private key out of your environment.  
It is safer and also would work better in collaboration settings since hardcoded absolute path to the `ServiceAccountKey.json` would not work for each team member.

5. **Start your local servers**
```sh
# Start client 
$ cd NoteTube/src
$ npm run start

# Start backend server
$ cd NoteTube/server
$ firebase serve
```

