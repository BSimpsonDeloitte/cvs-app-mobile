module.exports = {
  "env": {
    "node": true,
    "jest": true
  },
  "extends": [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:security/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2016,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "security"
  ],
  "rules": {
    "max-len": "off", // Disable default max line length of 100
    "no-console": "off", // Allow console logging for dev/test purposes
    "no-plusplus": "off", // Allow use of ++/-- operators given issues are extremely edge case
    "import/prefer-default-export": "off", // Allow named exports where there is only one module export
    "@typescript-eslint/no-use-before-define": "off", // Allow defining functions (incl. arrow expressions) after use as per 'Stepdown Rule' best practice
    "no-param-reassign": ['error', { 'props': false }] // Allow reassigning parameter properties but not whole parameters
  }
};
