# Task Management REST API
### SETUP INSTRUCTIONS
Node.js version 12+ and npm must be installed on your machine.  In terminal type the following commands:
```
git clone git@github.com:caeser1996/tcdx-assesment.git
cd tcdx-assesment
sudo npm install
mkdir config
cd config
touch dev.env
vim dev.env
```

Insert the following lines in `dev.env`, replacing all `<content>` with your own information:

```
PORT=<port number>
MONGODB_URL=<mongodb connection string>
JWT_SECRET=<unique key of your choice to generate JSON web tokens>
```

To run the web server return to the root of the repository and type:
```
npm run dev
```
Alternatively you may name `config/prod.env` or `config/staging.env` and appropriately run the web server with `npm run prod` or `npm run staging`.

Once done please register a user using register route in backend check  [API Documentation](https://documenter.getpostman.com/view/13932456/TzXzFJ1N)
for reference collect the api and login the user in Frontend.
