import * as path from 'path'

/**
 * 编译时，所用的输入输出目录
 */
export const outputDir = path.resolve(__dirname, '../../dist')
export const inputRoot = path.join(path.resolve('.'), 'src')
export const config = require(path.resolve(inputRoot, "app.config.js"));