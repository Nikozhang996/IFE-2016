/*
 const isString = function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

const isNumber = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
}

const isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

const isObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
 */

const isType = function (type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === `[object ${type}]`;
    }
}

const isArray = isType('Array');
const isObject = isType('Object');
const isNumber = isType('Number');

let arr = [],
    obj = {},
    num = 123;


function isTypeHanlder(param = ['Boolean', 'Number', 'String', 'Array', 'Function', 'Object']) {
    let Type = {};
    param.forEach((item, index) => {
        Type[`is${item}`] = function (obj) {
            return {}.toString.call(obj);
        }
    });
    return Type;
}

const Type = isTypeHanlder();

console.log(Type.isArray(arr));