module.exports = {
  // 文档说明： https://github.com/marionebl/commitlint/blob/d636811b4537904231c483a05e91aaf96deb7f6e/%40commitlint/config-angular/README.md
  // 配置参考：https://github.com/marionebl/commitlint/blob/542f50ec2fd7bc66a3ec84d1b959549484016e9c/docs/reference-rules.md
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs',
      'style', 'refactor', 'test',
      'chore', 'perf', 'wip',
    ]],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [1, 'always', 120],
  },
};
