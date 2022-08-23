const fs = require("fs");
const path = require("path");
const appRoot = require('app-root-path');

const JSON_FILE_NAME = ".env.json";
const DEFAULT_PATH_JSON = path.join(require.main.path, JSON_FILE_NAME);
const DEFAULT_PATH_JS = path.join(require.main.path, ".env.js");

function checkAllowedTypes(v) {
    return typeof v === 'number' || typeof v === "string" || typeof v === "bigint";
}

function validateValue(k, v) {
    if (checkAllowedTypes(v)) {
        return v;
    } else {
        throw new Error(`Unknown type for value (${k})`);
    }
}

function validateTopLevelValue(k, v) {
    if (typeof v === "object") {
        return validateValue(k, v.value);
    } else if (checkAllowedTypes(v)) {
        return v;
    } else {
        throw new Error(`Unknown type for top level value(${typeof v})`);
    }
}

function processJSONWithoutAttr(json) {
    const output = {};
    Object.entries(json).forEach(([k, v]) => {
        output[k] = validateTopLevelValue(k, v);
    })
    return output;
}

module.exports = function (file, preserveAttributes = false, replaceExistingENVs = false) {
    var isJS = false;
    var file_internal;
    if (file) {
        file_internal = file;
    } else {
        const jsonExists = fs.existsSync(DEFAULT_PATH_JSON);
        const jsExists = fs.existsSync(DEFAULT_PATH_JS);

        if (jsonExists) {
            file_internal = DEFAULT_PATH_JSON;
        } else if (jsExists) {
            file_internal = DEFAULT_PATH_JS;
            isJS = true;
        } else {
            throw new Error(`Cannot find input file(${JSON_FILE_NAME}). please set input file manually or create one in project root.`);
        }
    }

    const fileContent = fs.readFileSync(file_internal);
    const jsonContent = JSON.parse(fileContent);
    if (!preserveAttributes) {
        const output = processJSONWithoutAttr(jsonContent);
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
    } else {
        return {}
    }
}
