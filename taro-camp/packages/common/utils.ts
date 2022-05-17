import * as path from 'path'
import { outputDir } from '../compile-core/const'
import * as t from '@babel/types'

// 获取/npm/app.js的相对地址
export function getRelativeAppPath(dir){
  return path.relative(dir, path.join(outputDir, '/npm/app.js'))
}

// 获取 /npm/components.js 相对地址
export function getRelativeComponentPath(dir) {
  return path.relative(dir, path.join(outputDir, '/npm/components.js'))
}

// 找到方法名，并解析
export function findMethodName(expression) {
	let methodName;
	if (
		t.isMemberExpression(expression) &&
		t.isIdentifier(expression.property)
	) {
		methodName = expression.property.name;
	} else {
		console.log("事件方法暂不支持该解析");
	}
	return methodName;
}

// 创建block元素
export function buildBlockElement(attrs) {
	let blockName = "block";
	return t.jSXElement(
		t.jSXOpeningElement(t.jSXIdentifier(blockName), attrs),
		t.jSXClosingElement(t.jSXIdentifier(blockName)),
		[]
	);
}

export function slash(path) {
	const isExtendedLengthPath = /^\\\\\?\\/.test(path);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(path);
	if (isExtendedLengthPath || hasNonAscii) {
		return path;
	}
	return path.replace(/\\/g, "/");
}