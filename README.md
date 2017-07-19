# Webpack2 multiple entry

基于 webpack2 实现的多入口项目脚手架。

主要使用 `extract-text-webpack-plugin` 实现 `js` 、`css` 公共代码提取，`html-webpack-plugin` 实现 `html` 多入口，`less-loader` 实现 `less` 编译，`postcss-loader` 配置 `autoprefixer` 实现自动添加浏览器兼容前缀，`html-withimg-loader` 实现 `html` 内引入图片版本号添加和模板功能，`babel-loader` 实现 `ES6` 转码功能， `happypack` 多线程加速构建速度。

## 使用

### 安装

```
npm install
```

### 开发

```
npm start
```
> http://localhost:8080/view


### 构建

| 命令              | 说明           |
| --------------- | ------------ |
| `npm run dev`   | 开发环境构建，不压缩代码 |
| `npm run build` | 生产环境构建，压缩代码  |




## 目录

```
├── dist                     # 构建后的目录
├── config                   # 项目配置文件
│   ├── webpack.config.js    # webpack 配置文件
│   └── postcss.config.js    # postcss 配置文件
├── src                      # 程序源文件
│   └── js                   # 入口
│   ├   └── index.js         # 匹配 view/index.html
│   ├   └── user         
│   ├   ├    ├── index.js    # 匹配 view/user/index.html
│   ├   ├    ├── list.js     # 匹配 view/user/list.html
│   ├   └── lib              # JS 库等，不参与路由匹配
│   ├       ├── jquery.js 
│   └── view                 
│   ├    └── index.html       # 对应 js/index.js
│   ├    └── user         
│   ├        ├── index.html   # 对应 js/user/index.js
│   ├        ├── list.html    # 对应 js/user/list.js
│   └── css                   # css 文件目录
│   ├    └── base.css          
│   ├    └── iconfont.css     
│   └── font                  # iconfont 文件目录
│   ├    └── iconfont.ttf         
│   ├    └── iconfont.css
│   └── img                   # 图片文件目录
│   ├    └── pic1.jpg         
│   ├    └── pic2.png     
│   └── template              # html 模板目录
│       └── head.html         
│       └── foot.html            
```

## License

[ISC](./LICENSE) © 2017 [givebest](https://github.com/givebest)



