/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { 'node': true },
  extends: ['plugin:vue/vue3-strongly-recommended', '@vue/typescript/recommended'],
  parserOptions: { 'ecmaVersion': 2020 },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'object-curly-spacing': [2, 'always'],
    'object-curly-newline': [2, {
      "minProperties": 4,
      'multiline': true,
    }],
    'indent': [2, 2],
    // 'object-property-newline': [2, { 'allowAllPropertiesOnSameLine': false }],
    'semi': [2, 'always'],
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    'comma-dangle': [2, 'always-multiline'],
    'complexity': [0, 11], // 循环复杂度
    // "no-unused-vars": "error",
    // "@typescript-eslint/no-unused-vars": 0,
    // "unused-imports/no-unused-imports": "error",
    // "unused-imports/no-unused-vars": [
    //   "warn",
    //   {
    //     "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_",
    //   },
    // ],
    // "@typescript-eslint/no-unused-vars": 2,
    // "@typescript-eslint/no-unused-vars": "on",
    // "unused-imports/no-unused-imports-ts": "on",
  },
};
