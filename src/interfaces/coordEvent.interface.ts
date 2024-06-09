import z from "zod";
import { EventObject } from "./interfaces";

export const coordsInfo = z.object({
    x: z.number(),
    y: z.number()
});

export enum coordStatus {
    safe,
    caution,
    danger
};

export type coordsType = z.infer<typeof coordsInfo>;
export type coordEventObject = EventObject<coordsType>;