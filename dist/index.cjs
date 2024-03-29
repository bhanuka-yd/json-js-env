'use strict';

const fs = require('fs');
const path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const JSON_FILE_NAME = ".env.json";
const DEFAULT_PATH_JSON = path__default.join(process.cwd(), JSON_FILE_NAME);
const DEFAULT_PATH_JS = path__default.join(process.cwd(), ".env.js");
function checkAllowedTypes(v) {
  return typeof v === "number" || typeof v === "string" || typeof v === "boolean" || typeof v === "bigint";
}
function validateValue(k, v) {
  if (checkAllowedTypes(v)) {
    return v;
  } else {
    throw new Error(`Unknown type for value (${k})`);
  }
}
function validateTopLevelValue(k, v, preserveAttributes = false) {
  if (typeof v === "object") {
    if (preserveAttributes) {
      return JSON.stringify(v);
    } else {
      return validateValue(k, v.value);
    }
  } else if (checkAllowedTypes(v)) {
    if (preserveAttributes) {
      return JSON.stringify({ value: v });
    } else {
      return v;
    }
  } else {
    throw new Error(`Unknown type for top level value(${typeof v})`);
  }
}
function processJSON(json, preserveAttributes) {
  const output = {};
  Object.entries(json).forEach(([k, v]) => {
    output[k] = validateTopLevelValue(k, v, preserveAttributes);
  });
  return output;
}
function index({ file, preserveAttributes = false, replaceExistingENVs = false } = {}) {
  var isJS = false;
  var file_internal;
  if (file) {
    file_internal = file;
    if (path__default.extname(file_internal) === ".js") {
      isJS = true;
    }
  } else {
    const jsonExists = fs__default.existsSync(DEFAULT_PATH_JSON);
    const jsExists = fs__default.existsSync(DEFAULT_PATH_JS);
    if (jsonExists) {
      file_internal = DEFAULT_PATH_JSON;
    } else if (jsExists) {
      file_internal = DEFAULT_PATH_JS;
      isJS = true;
    } else {
      throw new Error(`Cannot find input file(${JSON_FILE_NAME}). please set input file manually or create one in project root.`);
    }
  }
  var fileContent;
  if (!isJS) {
    fileContent = fs__default.readFileSync(file_internal);
  } else {
    const jsFunction = require(path__default.join(require.main.path, file_internal));
    if (typeof jsFunction !== "function") {
      throw new Error("Config JS file does not export a default function");
    }
    try {
      fileContent = jsFunction();
    } catch (e) {
      throw new Error(`Error while running the config JS file ${e}`);
    }
  }
  var jsonContent;
  if (!isJS) {
    jsonContent = JSON.parse(fileContent);
  } else {
    jsonContent = fileContent;
  }
  const output = processJSON(jsonContent, preserveAttributes);
  Object.entries(output).forEach(([k, v]) => {
    const exists = process.env[k];
    if (exists) {
      if (replaceExistingENVs) {
        process.env[k] = v;
      }
    } else {
      process.env[k] = v;
    }
  });
  return output;
}

module.exports = index;
