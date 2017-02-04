module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "node": true,
    "es6": true,
    "mocha": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "array-bracket-spacing": [
      "error",
      "never"
    ],
    "arrow-body-style": [
      "error",
      "as-needed", {
        "requireReturnForObjectLiteral": true
      }
    ],
    "arrow-parens": [
      "error",
      "always"
    ],
    "arrow-spacing": [
      "error", {
        "before": true,
        "after": true
      }
    ],
    "block-spacing": [
      "error",
      "never"
    ],
    "brace-style": [
      "error",
      "1tbs", {
        "allowSingleLine": true
      }
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "comma-spacing": [
      "error", {
        "before": false,
        "after": true
      }
    ],
    "comma-style": [
      "error",
      "last"
    ],
    "curly": [
      "error",
      "all"
    ],
    "eol-last": "error",
    "global-require": "error",
    "indent": [
      "error",
      2, {
        "SwitchCase": 1
      }
    ],
    "key-spacing": [
      "error", {
        "beforeColon": false,
        "afterColon": true,
        "mode": "strict"
      }
    ],
    "keyword-spacing": [
      "error", {
        "before": true,
        "after": true
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "new-parens": "error",
    "no-console": "off",
    "no-const-assign": "warn",
    "no-lonely-if": "warn",
    "no-mixed-spaces-and-tabs": "error",
    "no-nested-ternary": "error",
    "no-trailing-spaces": "warn",
    "no-unneeded-ternary": "warn",
    "no-unused-vars": [
      "warn", {
        "vars": "all",
        "args": "none"
      }
    ],
    "no-whitespace-before-property": "error",
    "object-property-newline": [
      "error", {
        "allowMultiplePropertiesPerLine": true
      }
    ],
    "prefer-const": "warn",
    "quotes": [
      "error",
      "single", {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "semi": [
      "error",
      "always"
    ],
    "space-before-blocks": [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error",
      "never"
    ],
    "space-in-parens": [
      "error",
      "never"
    ],
    "space-infix-ops": "error",
    "space-unary-ops": [
      "error", {
        "words": true,
        "nonwords": false
      }
    ],
    "spaced-comment": [
      "error",
      "always"
    ],
    'valid-jsdoc': [
      "error", {
        "requireReturn": false,
        "prefer": {
          "returns": "return"
        }
      }
    ],
    "yoda": [
      "error",
      "never"
    ]
  }
};
