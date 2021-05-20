vcm-react前端微服务基础工程
====

 [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://airbnb.io/javascript/react/)

当前快速使用

* 1. clone 代码

```bash
git clone http://gitlab.quvideo.com/WEB/base-start-vcm-react.git
```

* 2. 重置成你的 git 仓库

```bash
make gitinit REPO=http://your.com/pro.git
```

* 3. make 即可开始

```bash
make
```
* 4. 开发

```bash
make dev
```

* 5. dev/test/prod环境打包

```bash
make build-dev/build-test/build-prod
```


* 6.上传到oss相关文档[f2e-uploader][11]
  
```
make upload-qa/upload-prod
```



# 目录


- [目标](#target)
- [目录结构](#directory)
- [统一规范](#standard)
  - [airbnb-standard](#airbnb-standard)
  - [npm包使用](#npm)
- [IDE配置](#ide-config)
  - [保存自动检查](#application)
- [效能工具](#tools)
  - [ESLint](#eslint)
- [其他](#other)
- [readme模版](#readme)


## <span id="target">目标</span>
该项目为vcm微服务基础模版，目前第一版包含原vcm部分冗余的代码，后期大家再做业务的时候，请清理下这些东西。后期迁移完成后会将该模版中的冗余代码做清理。



## <span id="directory">目录结构</span>

推荐按以下目录结构进行工程，也推荐采用 es6 规范。

```
├── config // 项目配置
├── doc // （可选）项目文档
├── lib // （可选）TS|Coffee 编译后目录 或采用 es6 规范的源文件目录
├── node_modules // 模块依赖
├── dist 项目 build 后上生产环境
└── src // 若使用 TS|Coffee 则该目录是源文件 或者采用 es6,7,8 规范的源文件
    ├── components // 项目公共组件
    ├── config //打包配置
    ├── models //项目models
    └── routes //路由
        └── activity-manage // 一级菜单
            └── activity-video //二级菜单
                ├── components //功能组件
                ├── service //功能服务
                ├── utils //功能函数
                ├── styles //功能styles
                ├── models //功能models
                └── index.js //功能页面
            └── index.js // 路由配置
        ├── index.jsx // layout
        └── router.js // 路由
    ├── styles //项目样式
    ├── services // 项目service
    ├── utils // 公共函数
    ├── entry.js //项目入口文件
    └── router.jsx //项目路由配置
└── test // 单元测试
```

## <span id="standard">JS规范</span>

### <span id="airbnb-standard">airbnb-standard</span>

理由：该规范 [airbnb-standard][3] 为React和JSX最合理的方法

如果有个性化的需求，可以直接使用 [eslint-config-standard][7] 来将个人配置包装在上层 


## <span id="standard">JS规范</span>

### <span id="airbnb-standard">airbnb-standard</span>

理由很简单：该规范 [airbnb-standard][3] 为React和JSX最合理的方法

如果有个性化的需求，可以直接使用 [eslint-config-standard][7] 来将个人配置包装在上层 

### <span id="npm">npm包使用</span>
同功能的包不要重复引用，比如react-intl和react-intl-universal
```json
  "antd": "3.8.4",
  "dva": "^2.4.1",
  "dva-router-config": "^1.1.0",
  "prop-types": "^15.6.2",
  "react": "^16.7.0",
  "react-dom": "^16.7.0"
```
前端可能使用到的包推荐选择：
```
js-cookie/react-cookie 
react-intl
lodash
path-to-regexp
echarts/g2
moment
jest(测试框架)
```
大家如果有比较好的react相关的包也请加到当前文档中来

## <span id="ide-config">IDE配置</span>

### <span id="auto-save-eslint">保存自动检查</span>

编码时建议设置保存文件自动 eslint 检查,此为react版本。以 vscode 为例：

```json
{
    "eslint.autoFixOnSave": true,
    "eslint.enable": true,
    "eslint.run": "onType",
    "files.autoSave": "off",
    "eslint.validate": [
        "javascript",
        "javascriptreact",
    ],
    "eslint.options": {
        "configFile": "./.eslintrc.yml"
    },
    "editor.tabSize": 2,
}
```

### <span id="makefile">ESLint</span>

个性化 eslint 配置为项目根目录下 `.eslintrc.yml`

也可手动执行检查 `make eslint` ；
在提交 `git commit` 之前 与 `build|release` 之前都会自动检查；
如果设置了 IDE 保存自动检查，那么也会触发。


```yml
# ESLint 配置 yml 版 [主要规范 nodejs 服务端]
root: true

env:
  node: true
  mocha: true
  browser: true

extends: 
  - airbnb
  - prettier
  - prettier/react

parser: babel-eslint

parserOptions:
  ecmaVersion: 8
  sourceType: "module"
  ecmaFeatures: 
      jsx: true
      experimentalObjectRestSpread: true


plugins: 
    - react
    - prettier
rules:
  curly: 1
  handle-callback-err: 1
  prefer-arrow-callback: 2
  no-unused-expressions: 1
  indent: ["error", 2, { "SwitchCase": 1 }]
  max-len: ["error", { "code": 300, "tabWidth": 2 }] # 160个字符
  quotes: [2, "single"]
  camelcase: 1 # 驼峰
  no-var: 2 
  no-console: 1
  comma-spacing: 2
  no-unused-vars: 2
  no-cond-assign: 2
  no-return-assign: 2
  no-param-reassign: 1  #不能对参数进行赋值
  no-inline-comments: 0 #不能行内注释
  no-trailing-spaces: 2
  eqeqeq: 2
  brace-style: 2
  key-spacing: 2
  semi-spacing: 2
  semi: [2, 'always']
  keyword-spacing: 2
  space-infix-ops: 2
  jsx-a11y/click-events-have-key-events: 0 # 每个绑定click事件的元素需要绑定键盘事件
  jsx-a11y/no-static-element-interactions: 0 # 不能给div 等非交互元素绑定事件
  no-plusplus: 0 # 不能使用++运算符
  react/no-array-index-key: 0  #key 值不能使用默认index
  react/destructuring-assignment: 0 # 必须使用解构赋值
  no-restricted-syntax: 1 # 不能使用for in
  no-restricted-globals: 1 #禁用特定的全局变量
  no-underscore-dangle: 0 #禁止标识符中有悬空下划线。关闭
  no-continue: 1 #禁止使用continue
  no-bitwise: 0 #禁止使用按位运算符
  no-useless-escape: 1 #禁止使用不必要的转义
  no-restricted-properties: 1 #对象上的某些属性 可能在代码库中被禁止
  class-methods-use-this: 0 #当方法体中没有this的时候将其声明为静态函数
  prefer-destructuring: 0 #必须使用解构赋值
  react/forbid-prop-types: 0 #禁用prototype array object
  no-irregular-whitespace: [2, { "skipComments": true }]
  react/prop-types: 1 #使用proptypes验证
  array-callback-return: 0 #尖头函数必须有返回值
  jsx-a11y/label-has-for: 0 #每个label标签必须要有for属性
  jsx-a11y/label-has-associated-control: 0 #label标签强制关联
  jsx-a11y/anchor-is-valid: 0 #a标签
  consistent-return: 1 #return
  react/jsx-no-target-blank: 0 #target 不能为blank
  jsx-a11y/media-has-caption: 0 #媒体类标签必须有track for 标题
  react/no-access-state-in-setstate: 1 #setstate 使用callback
  no-shadow: 1
  jsx-a11y/no-noninteractive-element-interactions: 1 #不应为非交互式元素分配鼠标或键盘事件侦听器
```


### <span id="other">其他</span>
当前readme仅包含react可能用到的相关内容, 其他内容参考 [xy-f2e-base][10] 

## <span id="readme">readme 模板</span>

```
viva-plus 产品
====

[![build status](http://gitlab.quvideo.com/WEB/vcm-viva-plus-activity/badges/master/build.svg)](git@gitlab.quvideo.com:WEB/vcm-viva-plus-activity.git) [![coverage report](http://gitlab.quvideo.com/WEB/vcm-viva-plus-activity/badges/master/coverage.svg)](http://gitlab.quvideo.com/WEB/vcm-viva-plus-activity/commits/master) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://airbnb.io/javascript/react/)

当前快速使用

* 1. clone 代码

/```bash
git clone git@gitlab.quvideo.com:WEB/vcm-viva-plus-activity.git
/```

* 2. 打包vendors

/```bash
make vendors
/```


* 3. make 即可开始

/```bash
make start
/```


# 目录
- [简介](#introduce)

## <span id="introduce">简介</span>

### 名称
活动管理 功能组件

### 路由

origin: activity_manage/activity_video_list

expect: activity/*

### Api

/```
api/ => http://vcm-qa.api.xiaoying.co/api/*
/```


```

[1]: https://prettier.io/docs/en/options.html "prettier Options"
[2]: https://google.github.io/styleguide/jsguide.html "Google JavaScript Style Guide"
[3]: http://airbnb.io/javascript/react/ "airbnb standard 代码规范的全文"
[4]: https://google.github.io/styleguide/jsguide.html#jsdoc-general-form "代码注释"
[5]: http://usejsdoc.org/ "use JSDoc"
[6]: https://github.com/jsdoc3/jsdoc "An API documentation generator for JavaScript."
[7]: https://github.com/standard/eslint-config-standard "适用于JavaScript标准样式的ESLint 可共享配置"
[8]: http://wiki.ubuntu.org.cn/%E8%B7%9F%E6%88%91%E4%B8%80%E8%B5%B7%E5%86%99Makefile:MakeFile%E4%BB%8B%E7%BB%8D "MakeFile介绍"
[9]: https://docs.gitlab.com/runner/install/ "Install GitLab Runner"
[10]: http://gitlab.quvideo.com/WEB/xy-f2e-base "xy-f2e-base"
[11]: http://gitlab.quvideo.com/WEB/f2e-uploader "f2e-uploader"