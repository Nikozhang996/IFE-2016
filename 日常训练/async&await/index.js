const fs = require("fs");

// 对 fs 模块进行 Promise 封装
const readFile = function (src) {
    return new Promise((res, rej) => {
        fs.readFile(src, (err, data) => {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        })
    })
}
// 传统写法
/* 
fs.readFile('./a.txt', function (err, data) {
    console.log(data.toString());
})
fs.readFile('./b.txt', function (err, data) {
    console.log(data.toString());
})
fs.readFile('./c.txt', function (err, data) {
    console.log(data.toString());
})

fs.readFile('./a.txt', function (err, data) {
    console.log(data.toString());
    fs.readFile('./b.txt', function (err, data) {
        console.log(data.toString());
        fs.readFile('./c.txt', function (err, data) {
            console.log(data.toString());
            fs.readFile('./d.txt', function (err, data) {
                if (err) {
                    console.log(err.toString());
                } else {
                    console.log(data.toString());
                }
            })
        })
    })
})
 */


// Primise写法,在then中返回一个Promise，下一个then中则使用该Promise
/* readFile('./a.txt')
    .then(data => {
        console.log(data.toString());
        return readFile('./b.txt');
    })
    .then(data => {
        console.log(data.toString());
        return readFile('./c.txt');
    })
    .then(data => {
        console.log(data.toString());
        throw new Error('自定义错误')
        return 4 ** 4;
    })
    .then(data => {
        console.log(data);
    }, err => {
        console.log(err);
    }) */


// 迭代
/*
 function* ascReadFile() {
    yield readFile('./a.txt');
    yield readFile('./b.txt');
    yield readFile('./c.txt');
}

let g = ascReadFile();

for (const file of g) {
    file.then(data => {
        console.log(data.toString());
    })
}

g.next().value.then(data => {
    console.log(data.toString());
    return g.next().value;
}).then(data => {
    console.log(data.toString());
    return g.next().value;
}).then(data => {
    console.log(data.toString());
})
 */

// async函数写法
/* async function asyncReadFile() {
    const a = await readFile('./a.txt');
    const b = await readFile('./b.txt');
    const c = await readFile('./c.txt');

    console.log(a.toString());
    console.log(b.toString());
    console.log(c.toString());
    return '这个函数是：asyncReadFile'
}

asyncReadFile().then(data => {
    console.log(data);
}) */

let count = 0;
const settimeout = function (duration) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res()
        }, duration);
    })
}

// 使用迭代器
function* fn() {
    yield settimeout(1000);
    yield settimeout(1000);
    yield settimeout(1000);
}

let timer = fn();
for (const item of timer) {
    item.then(() => console.log(++count));
}


// 使用async优化
/* async function asyncTimer() {
    await settimeout(1000);
    console.log(++count);

    await settimeout(1000);
    console.log(++count);

    await settimeout(1000);
    console.log(++count);

    return "这是一个由async改写的方案"
}
asyncTimer().then(data => console.log(data)); */


// 使用Promise优化
/* settimeout(1000)
    .then(() => {
        console.log(++count);
        return settimeout(1000);
    })
    .then(() => {
        console.log(++count);
        return settimeout(1000);
    })
    .then(() => {
        console.log(++count);
    }) */



// 解决地狱回调问题
/* 
setTimeout(() => {
    console.log(++count);
}, 1000);

setTimeout(() => {
    console.log(++count);
}, 2000);

setTimeout(() => {
    console.log(++count);
}, 3000);

setTimeout(() => {
    console.log(++count);
}, 4000);

setTimeout(() => {
    console.log(++count);
}, 5000); 

setTimeout(() => {
    console.log(++count);
    setTimeout(() => {
        console.log(++count);
        setTimeout(() => {
            console.log(++count);
        }, 1000);
    }, 1000);
}, 1000);
*/