/* 

 */
function createTimeList(start, end, step) {
    let flag = ':';
    let [startMin, startSec] = start.split(flag);
    let [endMin, endSec] = end.split(flag);

    let [stepMin, stepSec] = step.split(flag);

    let minTemp = parseInt(startMin, 10),
        secTemp = parseInt(startSec, 10);

    if (endMin == '00' || '0') {
        endMin = '24';
    }
    if (startMin > endMin) {
        throw new Error('结束时间必须大于开始时间');
        return     
    }

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

console.log(createTimeList('08:00', '01:00', '01:00'));