import chalk from 'chalk';
import moment from 'moment-timezone';

const ctx = new chalk.Instance( { level: 3 } );
var logColor = "white";
var typeCode:number = -1;
var time = moment().tz("Asia/Seoul").format("HH:mm:ss");

switch (typeCode) {
    case 0: // error
        logColor = "red";
    break;
    case 1: // warning
        logColor = "yellow";
    break;
    case 2: // success
        logColor = "green";
    break;
};

console.log(ctx`{bold.${logColor} ✪} [%s / %s] : %s`, "TEST" ?? "GreenZone", time, "test message");

// console.log(chalk`Hello, {green.bold %s}`, "CistusF");