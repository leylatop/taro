# Taro 学习笔记
## 概念
1. 遵循 React 语法规范，实现多端开发方案(小程序、h5、移动端)

## 原理
- dom转换：babel转ast转节点再转ast再生成代码
- es转换：核心是通用转换函数
- 不同端各自特点
  - react：钩子函数/生命周期/事件绑定; 使用setState更新数据
  - 小程序：使用配置项生成页面；使用setData更新数据
- 转化原理：
  - react->小程序：将react的函数，转化为小程序的配置项，使用高阶函数将原始函数包装后，return option；使用update函数转换 setState方法为setData方法

## 编译过程
这个编译过程主要由以下几步：
一、将模板经babel编译后拷贝到输出目录。
二、将每个文件编译成4种输出（json,js,wxml,wxss）到对应目录。
三、输出入口文件app.js与app.json
四、输出project.config.json

```js
/**
 * npm拷贝到输出目录
 */
async function copyNpmToWx() {}
/**
 *  页面生成4种输出到输出目录
 */
async function buildPages() {}
/**
 *  输出入口文件app.js与app.json
 */
async function buildEntry() {}
/**
 *  输出project.config.json
 */
async function buildProjectConfig() {}
/**
 *  检查目录等准备工作
 */
async function init() {}

async function main() {
    // 检查目录等准备工作
    await init()
    // npm拷贝到输出目录
    await copyNpmToWx();
    // 页面生成4种输出到输出目录
    await buildPages();
    // 输出入口文件app.js与app.json
    await buildEntry();
    // 输出project.config.json
    await buildProjectConfig();
}
main();
```