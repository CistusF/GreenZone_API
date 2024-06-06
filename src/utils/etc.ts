import moment from "moment-timezone";
import { logType } from "../interfaces/interfaces";
import chalk from 'chalk';

export const logger = (log: string | string[], title?: string, typeCode?: logType): void => {
    if (typeof log !== 'string') {
        log.forEach(i => {
            logger(i, title, typeCode);
        })
    } else {
        var logColor = "white";
        const ctx = new chalk.Instance({ level: 3 });
        var time = moment().tz("Asia/Seoul").format("HH:mm:ss");

        switch (typeCode) {
            case -1: // error
                logColor = "red";
                break;
            case 0: // warning
                logColor = "yellow";
                break;
            case 1: // success
                logColor = "green";
                break;
        };
        console.log(ctx`{bold.${logColor} ✪} [%s / %s] : %s`, "TEST" ?? "GreenZone", time, "test message");
    }
};