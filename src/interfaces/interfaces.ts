import { Socket, Server } from "socket.io";
import z from "zod";
import { coordStatus } from "./coordEvent.interface";

export enum logType {
    error = -1,
    warn,
    success,
};

export enum errorCode {
    /* Room */
    // destroy 
    room_destroy_not_connected = 500,
    //find
    room_find_room_not_found = 510,
    // join
    room_join_failed_to_join = 520,
    room_join_tel_number_existed,
    // leave
    room_leave_not_connected = 530,

    /* Manage */
    // boundary_update
    manage_boundary_update_worng_data = 540,
    manage_boundary_update_permission_missing,

    // kick
    manage_kick_permission_missing = 550,
    manage_kick_member_not_found,

    // rename
    manage_rename_permission_missing = 560,

    /* Coords */
    // update
    coords_update_member_not_found = 570,
    coords_update_member_room_not_found,

    /* Common */
    // chat
    common_chat_permission_missing = 580,
    common_chat_member_not_found,

    // log
    common_log_member_room_not_found = 590,

    // schedule
    common_schedule_member_room_not_found = 600,
    common_schedule_wrong_data
};

export const boundaryInfo = z.object({
    x: z.number().nullable(),
    y: z.number().nullable(),
    safety: z.number().nullable(),
    limit: z.number().nullable(),
});
export type boundaryType = z.infer<typeof boundaryInfo>;

export const logDataInfo = z.object({
    type: z.number(),
    from: z.string(),
    to: z.string(),
    title: z.string().optional(),
    message: z.union([z.string(), z.number()]),
    created_at: z.string().optional()
});
export type logDataType = z.infer<typeof logDataInfo>;
export interface roomInterface {
    ownerId: string,
    room_number: string;
    title: string;
    boundary: boundaryType;
    logs: logDataType[];
};

// Park Seonu<harusame3144@users.noreply.github.com> help class to zod
export const socketMember = z.object({
    id: z.string(),
    user_name: z.string(),
    user_tel: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
    room_number: z.string(),
    status: z.nativeEnum(coordStatus)
});
export type socketMemberType = z.infer<typeof socketMember>;

export type EventObject<T> = {
    run: (utils: {
        io: Server
        socket: Socket,
        members: socketMemberType[],
        rooms: roomInterface[]
    },
        args: T) => void;
};