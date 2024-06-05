import { logType } from "../interfaces";
import {} from 'chalk';

export const logger = (log: string | string[], title?: string, type?: logType): void => {
    if (typeof log !== 'string') {
        log.forEach(i => {
            logger(i, title, type);
        })
    } else {
        console.log("[%s] : %s", title ?? "GreenZone", log);
    }
};