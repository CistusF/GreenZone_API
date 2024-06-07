import z from "zod";
import { EventObject } from "./interfaces";

export const RoomInfo = z.object({
    title: z.string(),
    tel: z.string(),
    x: z.number().optional(),
    y: z.number().optional()
});
export type roomInfoType = z.infer<typeof RoomInfo>;

export const joinUserInfo = z.object({
    user_name: z.string(),
    room_number: z.string(),
    user_tel: z.string()
});
export type joinUserInfoType = z.infer<typeof joinUserInfo>;
export type roomEventObject = EventObject<string | roomInfoType | joinUserInfoType>;