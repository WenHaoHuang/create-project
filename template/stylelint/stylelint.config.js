module.exports = {
  root: true,
  defaultSeverity: 'error',
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
  ],
  rules: {
    'declaration-colon-space-before': 'never',
    'declaration-colon-space-after': 'always-single-line',
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['include', 'mixin', 'use', 'deep'] },
    ],
    'rule-empty-line-before': ['never'],
  },
  overrides: [
    // 扫描.vue/html文件中的style内容
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
  ],
};
