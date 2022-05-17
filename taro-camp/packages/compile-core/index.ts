import * as path from 'path'
import * as fse from 'fs-extra'
import babel from '../common/babel'
import { buildSinglePage } from '../common/buildSinglePage'
import { outputDir, inputRoot, config } from './const'


/**
 * 编译前
 * 1. 确保清空输出目录
 * 2. 确保输入目录存在
 */
async function init () {
  fse.removeSync(outputDir)
  fse.ensureDirSync(outputDir)
}

/**
 * 输出项目配置文件（项目信息、项目类型、编译配置）
 */
async function buildProjectConfig() {
  fse.writeFileSync(path.join(outputDir, 'project.config.json'), 
  `
  {
    "miniprogramRoot": "./",
    "projectname": "app",
    "description": "app",
    "appid": "touristappid",
    "setting": {
        "urlCheck": true,
        "es6": false,
        "postcss": false,
        "minified": false
    },
    "compileType": "miniprogram"
  }
  `
  )
}

/**
 * 输出小程序的入口文件app.js与app.json
 */
async function buildEntry() {
  fse.writeFileSync(path.join(outputDir, "./app.js"), `App({})`);
  const config = require(path.resolve(inputRoot, 'app.config.js'))
  fse.writeFileSync(
    path.join(outputDir, "./app.json"),
    JSON.stringify(config, undefined, 2)
);
}

/**
 * npm拷贝到输出目录
 */
async function copyNpmToWx() {
  const npmPath = path.resolve(__dirname, './npm')
  const allFiles = await fse.readdirSync(npmPath)
  allFiles.forEach(async (fileName) => {
    const fileContent = fse.readFileSync(path.join(npmPath, fileName)).toString()
    const outputNpmPath = path.join(outputDir, `./npm/${fileName}`)
    // babel是核心转译方法
    let resCode = await babel(fileContent, outputNpmPath)
    fse.ensureDirSync(path.dirname(outputNpmPath)) //确保目录存在
    fse.writeFileSync(outputNpmPath, resCode.code) // 写入转译后的code
  })

}
/**
*  页面生成4种输出到输出目录
*/
async function buildPages() {
  config.pages.forEach(page => {
    buildSinglePage(page)
  })
}

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