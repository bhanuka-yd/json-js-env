# Read configuration values from JSON and JS files to environment variables

## Installation

```
npm i json-js-env
```

_As early as possible in your application, import and use JsonJSEnv_

### Default file names (in project root)

- .env.json
- .env.js

### Example input file

```json
{
  "PORT": 2000,
  "ACCESS_KEY_ID": "access_key",
  "SECRET_ACCESS_KEY": {
    "value": "private!@#$DFSDF#$@#$%$%@#RFRFR#",
    "sensitive": true
  }
}
```

## with only values

```js
const jsonJS = require("json-js-env");
const env = require("env-var");

//Example 1
jsonJS({
  //file: "inputFile.json", //Input fiile location
  preserveAttributes: false, //Preserve variable attributes
  replaceExistingENVs: false, //Whether to replace the existing process.env variables.
});
const PORT = env.get("PORT").required().asString();
const ACCESS_KEY_ID = env.get("ACCESS_KEY_ID").required().asString();
const SECRET_ACCESS_KEY = env.get("SECRET_ACCESS_KEY").required().asString();

console.log(PORT); //2000
console.log(ACCESS_KEY_ID); //access_key
console.log(SECRET_ACCESS_KEY); //private!@#$DFSDF#$@#$%$%@#RFRFR#
```

## with attributes

```js
//Example 2, with attributes
const jsonJS = require("json-js-env");
const env = require("env-var");

jsonJS({
  //file: "inputFile.json", //Input fiile location
  preserveAttributes: true, //Preserve variable attributes
  replaceExistingENVs: true, //Whether to replace the existing process.env variables.
});

const PORT2 = env.get("PORT").required().asJsonObject();
const ACCESS_KEY_ID2 = env.get("ACCESS_KEY_ID").required().asJsonObject();
const SECRET_ACCESS_KEY2 = env
  .get("SECRET_ACCESS_KEY")
  .required()
  .asJsonObject();

console.log(PORT2); // { value: 2000 }
console.log(ACCESS_KEY_ID2); // { value: 'access_key' }
console.log(SECRET_ACCESS_KEY2); // { value: 'private!@#$DFSDF#$@#$%$%@#RFRFR#', sensitive: true }
```

## with JS file input

### config.js

```js
module.exports = function () {
  return {
    PORT: 2000,
    ACCESS_KEY_ID: "access_key",
    SECRET_ACCESS_KEY: {
      value: "private!@#$DFSDF#$@#$%$%@#RFRFR#",
      sensitive: true,
    },
  };
};
```

```js
//Example 3, with JS file
const jsonJS = require("json-js-env");
const env = require("env-var");

jsonJS({
  file: "config.js", //Input fiile location
  preserveAttributes: false, //Preserve variable attributes
  replaceExistingENVs: false, //Whether to replace the existing process.env variables.
});

const PORT3 = env.get("PORT").required().asString();
const ACCESS_KEY_ID3 = env.get("ACCESS_KEY_ID").required().asString();
const SECRET_ACCESS_KEY3 = env.get("SECRET_ACCESS_KEY").required().asString();

console.log(PORT3); //2000
console.log(ACCESS_KEY_ID3); //access_key
console.log(SECRET_ACCESS_KEY3); //private!@#$DFSDF#$@#$%$%@#RFRFR#
```
