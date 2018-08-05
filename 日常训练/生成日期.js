/* 

 */
function createTimeList(start, end, step) {
    // 第一步：抽取开始时间、结束时间和间隔区间的hh:ss
    let flag = ':';
    let [startMin, startSec] = start.split(flag);
    let [endMin, endSec] = end.split(flag);
    let [stepMin, stepSec] = step.split(flag);

    let minTemp = parseInt(startMin, 10),
        secTemp = parseInt(startSec, 10);

    // 第二步：做边界判断
    if (endMin == '00' || '0') {
        endMin = '24';
    }
    if (startMin > endMin) {
        throw new Error('结束时间必须大于开始时间');
    }

    // 核心逻辑，新建一个空数据，符合条件的就添加进数组
    let tempArr = [];
    while (parseInt(minTemp, 10) < parseInt(endMin, 10)) {
        tempArr.push(`${(minTemp + '').padStart(2, '0')}:${(secTemp + '').padStart(2, '0')}`);

        minTemp += parseInt(stepMin, 10);
        secTemp += parseInt(stepSec, 10);
        if (secTemp >= 60) {
            minTemp++;
            secTemp -= 60;
        }
    }

    tempArr.push(`${(endMin + '').padStart(2, '0')}:${(endSec + '').padStart(2, '0')}`);
    return tempArr;
}

// console.log(createTimeList('08:00', '01:00', '01:00'));

function createTimeList_for(start, end, step) {
    // 第一步：抽取开始时间、结束时间和间隔区间的hh:ss
    let flag = ':';
    let [startMin, startSec] = start.split(flag);
    let [endMin, endSec] = end.split(flag);
    let [stepMin, stepSec] = step.split(flag);

    startMin = parseInt(startMin, 10);
    startSec = parseInt(startSec, 10);
    endMin = parseInt(endMin, 10);
    endSec = parseInt(endSec, 10);
    stepMin = parseInt(stepMin, 10);
    stepSec = parseInt(stepSec, 10);

    // 第二步：做边界判断
    if (endMin == '00' || '0') {
        endMin = '24';
    }
    if (startMin > endMin) {
        throw new Error('结束时间必须大于开始时间');
    }

    // 核心逻辑
    let tempArr = [];
    for (let i = startMin, j = startSec; i < endMin; i++) {
        tempArr.push(`${(String(startMin=(startMin + stepMin))).padStart(2, '0')}:${(String(startSec=(startSec + stepSec))).padStart(2, '0')}`);
    }

    return tempArr;
}

console.log(createTimeList_for('08:00', '22:00', '01:00'));