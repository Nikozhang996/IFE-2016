function createTimeList(start, end, step) {
    let flag = ':';
    let startMin = start.split(flag)[0],
        startSec = start.split(flag)[1],
        endMin = end.split(flag)[0],
        endSec = end.split(flag)[1],
        stepMin = step.split(flag)[0],
        stepSec = step.split(flag)[1];

    let minTemp = parseInt(startMin, 10),
        secTemp = parseInt(startSec, 10);

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