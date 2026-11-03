# Webpack multiple entry

基于 webpack 实现的多入口项目脚手架。

使用 Webpack 5、Babel、MiniCssExtractPlugin、html-webpack-plugin 和 art-template 实现多入口构建。Less / PostCSS 处理样式，Sharp 优化生产图片。

## 使用

需要 Node.js 22.15 或更新版本。

### 安装

```
npm ci
```

### 开发

```
npm start
```
> http://127.0.0.1:9000/view/index.html


### 构建

| 命令              | 说明           |
| --------------- | ------------ |
| `npm run dev`   | 开发环境构建，不压缩代码 |
| `npm run build` | 生产环境构建，压缩代码  |


### art-template

> 项目同时用了 `art-template-loader` 和 `art-template-web.js`，默认情况下模板解析规则界定符会冲突，通过修改 `art-template-web.js` 解析界定符避免冲突。

```javascript
// 修改 <% %> 为 <? ?>
// @see http://aui.github.io/art-template/zh-cn/docs/rules.html
var rule = template.defaults.rules[0];
rule.test = new RegExp(rule.test.source.replace('<%', '<\\\?').replace('%>', '\\\?>'));
```

#### 使用

> 与[原始语法](http://aui.github.io/art-template/zh-cn/docs/syntax.html)保持一致，仅需替换 `<%` 为 `<?` 、`%>` 为 `?>`

##### JavaScript
```javascript
import template from '../commons/template';

var data = {
  title: '用户列表',
  list: [
    '001',
    '002',
    '003',
    '004',
    '005'
  ]
};

var html = template('user-list', data);
document.getElementById('wrapper').innerHTML = html;
```

##### HTML
```html
<div id="wrapper"></div>

<script id="user-list" type="text/html">
<h1><?= title ?></h1>

<ul>
<? for (var i =0; i < list.length; i++) { ?>
<li><?= list[i] ?></li>
<? } ?>
</ul>
</script>
```

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
│   ├   └── commons          # JS 公共模块等，不参与路由匹配
│   ├       ├── app-callphone.js 
│   └── view                 
│   ├    └── index.html       # 对应 js/index.js
│   ├    └── user         
│   ├        ├── index.html   # 对应 js/user/index.js
│   ├        ├── list.html    # 对应 js/user/list.js
│   └── component             # 组件
│   ├    └── dialog           # Dialog 弹出层组件         
│   ├    └── other     
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
│       └── layout.art        # layout 母模板     
│       └── head.art     
│       └── foot.art            
```

## 验证

```sh
npm run build
npm test
npm run dev
npm audit
```

开发服务器默认仅监听本机地址，并保留 Host / Origin 校验。

## License

[ISC](./LICENSE) © 2017 [givebest](https://github.com/givebest)



