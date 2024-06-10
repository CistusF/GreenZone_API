import z from "zod";
import { EventObject } from "./interfaces";

export enum logType {
    warning,
    notice,
    chat,
    schedule,
    leave,
    kick
};

export enum scheduleStatus {
    stop,
    preFive,
    preTen
};

export const chatInfo = z.object({
    to: z.string().optional(),
    message: z.string()
});
export type chatType = z.infer<typeof chatInfo>;


export const scheduleInfo = z.object({
    title: z.string(),
    schedules: z.array(
        z.object({
            hour: z.number(),
            minute: z.number(),
        })
    ),
    schedule_type: z.nativeEnum(scheduleStatus)
});
export type scheduleType = z.infer<typeof scheduleInfo>;

export type commonEventObject = EventObject<chatType | scheduleType | null>;