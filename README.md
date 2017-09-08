# platform

>  platform

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## scss 支持

yarn 安装 node-sass

```bash
# 设置node-sass二进制源
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g

# 安装依赖
yarn add node-sass -D

yarn add sass -D

yarn add sass-loader -D

yarn add scss-loader -D

yarn add scss-loader -D

```

## webpack

构建优化应用了 `uglifyjs-webpack-plugin`

## element 主题自定义

```bash
npm i element-theme -g
npm i element-theme-default -D

# 自定义变量文件
et -i

# 编译主题
et
```

## element 按需引入

> 借助 [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component)
> [babelrc](http://www.ruanyifeng.com/blog/2016/01/babel.html)
```bash
npm install babel-plugin-component -D
```

然后，将 .babelrc 修改为：

```json
{
  "presets": [
    ["es2015", { "modules": false }]
  ],
  "plugins": [["component", [
    {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-default"
    }
  ]]]
}
```

## lodash ES6开发环境

```bash
 yarn add lodash
 yarn add babel-plugin-lodash -D
```