## Project setup
### Set port
.env
```
PORT=8080
```

## Note:
Open `src/services/auth-header.js` and modify `return` statement for appropriate back-end (found in the tutorial).

```js
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
      return {Authorization: "Bearer " + user.token.token};     
  } else {
    return {};
  }
}
```


In the project directory, you can run:

```
npm install
# or
yarn install
```

or

### Compiles and hot-reloads for development

```
npm start
# or
yarn start
```

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.

##

Once done please register a user using register route in backend check  [API Documentation](https://documenter.getpostman.com/view/13932456/TzXzFJ1N)
for reference collect the api and login the user.
