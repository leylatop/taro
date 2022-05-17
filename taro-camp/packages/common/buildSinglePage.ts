// build 单独页面
import * as path from 'path'
import * as fse from 'fs-extra'

import { inputRoot, outputDir } from '../compile-core/const'
import babel from './babel'
import { transform }from '../compile-core/transform'
import { getRelativeAppPath, getRelativeComponentPath, slash } from './utils'

export async function buildSinglePage(page) {
  const pagePath = path.join(inputRoot, `${page}`)
  const pageJs = `${pagePath}.jsx`
  const outPageDirPath = slash(path.join(outputDir, page))
	console.log(`开始处理：${inputRoot}/${page} ...`)
  // 将一个jsx文件转化成4种文件
	const code = fse.readFileSync(pageJs).toString()
	const outputPageJSPath = `${outPageDirPath}.js`
	const outputPageJSONPath = `${outPageDirPath}.json`
	const outputPageWXMLPath = `${outPageDirPath}.wxml`
	const outputPageWXSSPath = `${outPageDirPath}.wxss`
  // 文件原路径
  const sourceDirPath = path.dirname(pagePath)
  // 编译后的文件的相对路径
  const relativeAppPath = slash(getRelativeAppPath(path.dirname(outPageDirPath)))
  const relativeComponentsPath = slash(getRelativeComponentPath(path.dirname(outPageDirPath)))

  // TODO
  const result = transform({
    code,
    sourceDirPath,
    relativeAppPath,
    relativeComponentsPath,
  })

  // 检查路径
  fse.ensureDirSync(path.dirname(outputPageJSPath))


  let resCode = await babel(result.code, outputPageJSPath)

  result.code = `
${resCode.code}    
Page(require('${relativeAppPath}').createPage(${result.className}))
    `
  // 写入四种文件
    fse.writeFileSync(outputPageJSONPath, result.json)
    console.log(`输出文件：${outputDir}/${page}.json`)
    fse.writeFileSync(outputPageJSPath, result.code)
    console.log(`输出文件：${outputDir}/${page}.js`)
    fse.writeFileSync(outputPageWXMLPath, result.wxml)
    console.log(`输出文件：${outputDir}/${page}.wxml`)
    fse.writeFileSync(outputPageWXSSPath, result.style)
    console.log(`输出文件：${outputDir}/${page}.wxss`)
}