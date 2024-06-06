import { Socket } from "socket.io";
import z from "zod";

export enum logType {
    error = -1,
    warn,
    success,
};

export interface roomsInterface {
    room_number: string;
    title: string;
};

// Park Seonu<harusame3144@users.noreply.github.com> help class to zod
export const socketMember = z.object({
    id: z.string(),
    user_name: z.string(),
    user_number: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
    room_number: z.string(),
    owner: z.boolean(),
});
export type socketMemberType = z.infer<typeof socketMember>;

export type EventObject<T> = {
    eventName: string;
    run: (utils: {
        socket: Socket,
        members: socketMemberType[],
        rooms: roomsInterface[]
    },
        args: T) => void;
};