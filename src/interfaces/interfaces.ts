import { Socket } from "socket.io";
import z from "zod";

export enum logType {
    error = -1,
    warn,
    success,
};

export interface roomsInterface {
    ownerId: string,
    room_number: string;
    title: string;
    boundary: {
        x: number | null;
        y: number | null;
        safety: number;
        limit: number;
    };
};

// Park Seonu<harusame3144@users.noreply.github.com> help class to zod
export const socketMember = z.object({
    id: z.string(),
    user_name: z.string(),
    user_number: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
    room_number: z.string()
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