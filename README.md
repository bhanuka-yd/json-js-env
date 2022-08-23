# Read configuration values from JSON files to environment variables

## with only values

```js
const jsonJS = require("json-js-env");
const env = require("env-var");

//Example 1
jsonJS({
  //file: "inputFile.json", //Input fiile location
  preserveAttributes: false, //Preverve variable attributes
  replaceExistingENVs: false, //Whether to replace the existing process.env variables.
});
const PORT = env.get("PORT").required().asString();
const ACCESS_KEY_ID = env.get("ACCESS_KEY_ID").required().asString();
const SECRET_ACCESS_KEY = env.get("SECRET_ACCESS_KEY").required().asString();

console.log(PORT); //2000
console.log(ACCESS_KEY_ID); //access_key
console.log(SECRET_ACCESS_KEY); //private!@#$DFSDF#$@#$%$%@#RFRFR#
```

## with attrobutes

```js
//Example 2, with attributes
jsonJS({
  //file: "inputFile.json", //Input fiile location
  preserveAttributes: true, //Preverve variable attributes
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
