import { Socket, Server } from "socket.io";
import z from "zod";

export enum logType {
    error = -1,
    warn,
    success,
};

export const boundaryInfo = z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    safety: z.number().optional(),
    limit: z.number().optional(),
});
export type boundaryType = z.infer<typeof boundaryInfo>;

export interface roomsInterface {
    ownerId: string,
    room_number: string;
    title: string;
    boundary: boundaryType;
};

// Park Seonu<harusame3144@users.noreply.github.com> help class to zod
export const socketMember = z.object({
    id: z.string(),
    user_name: z.string(),
    user_tel: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
    room_number: z.string()
});
export type socketMemberType = z.infer<typeof socketMember>;

export type EventObject<T> = {
    run: (utils: {
        io: Server
        socket: Socket,
        members: socketMemberType[],
        rooms: roomsInterface[]
    },
        args: T) => void;
};