import { Socket } from "socket.io";
import z from "zod";

export enum logType {
    error,
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
// export class socketMemberTypes {
//     public id!: string;
//     public user_name!: string;
//     public user_number!: string;
//     public x?: number;
//     public y?: number;
//     public room_number!: string;
//     public owner!: boolean;
// };

export const RoomInfo = z.object({
    title: z.string(),
    tel: z.string()
});
export type roomInfoType = z.infer<typeof RoomInfo>;
// export class roomInfoTypes {
//     public title!: string;
//     public tel!: string;
// };

export const joinUserInfo = z.object({
    user_name: z.string(),
    room_number: z.string(),
    user_tel: z.string()
});
export type joinUserInfoType = z.infer<typeof joinUserInfo>;
// export class joinUserInfoTypes {
//     public user_name!: string;
//     public room_number!: string;
//     public user_tel!: string;
// };

export const coordsInfo = z.object({
    x: z.number(),
    y: z.number()
});
export type coordsType = z.infer<typeof coordsInfo>;
// export class coordsTypes {
//     public x!: number;
//     public y!: number;
// };

export type roomEventObject = {
    eventName: string;
    run: (utils: {
        socket: Socket,
        members: socketMemberType[],
        rooms: roomsInterface[]
    },
        args: string | roomInfoType | joinUserInfoType) => void;
};

export type coordEventObject = {
    eventName: string;
    run: (utils: {
        socket: Socket,
        members: socketMemberType[],
        rooms: roomsInterface[]
    },
        args: coordsType) => void;
}

function checkAge(num: number) {
    if (num == 1) console.log("당신은 1살입니다");
    if (num == 2) console.log("당신은 2살입니다");
    if (num == 3) console.log("당신은 3살입니다");
    if (num == 4) console.log("당신은 4살입니다");
    if (num == 5) console.log("당신은 5살입니다");
    if (num == 6) console.log("당신은 6살입니다");
    if (num == 7) console.log("당신은 7살입니다");
    if (num == 8) console.log("당신은 8살입니다");
    if (num == 9) console.log("당신은 9살입니다");
    if (num == 10) console.log("당신은 10살입니다");
    if (num == 11) console.log("당신은 11살입니다");
    if (num == 12) console.log("당신은 12살입니다");
    if (num == 13) console.log("당신은 13살입니다");
    if (num == 14) console.log("당신은 14살입니다");
    if (num == 15) console.log("당신은 15살입니다");
    if (num == 16) console.log("당신은 16살입니다");
    if (num == 17) console.log("당신은 17살입니다");
    if (num == 18) console.log("당신은 18살입니다");
    if (num == 19) console.log("당신은 19살입니다");
    if (num == 20) console.log("당신은 20살입니다");
    if (num == 21) console.log("당신은 21살입니다");
    if (num == 22) console.log("당신은 22살입니다");
    if (num == 23) console.log("당신은 23살입니다");
    if (num == 24) console.log("당신은 24살입니다");
    if (num == 25) console.log("당신은 25살입니다");
    if (num == 26) console.log("당신은 26살입니다");
    if (num == 27) console.log("당신은 27살입니다");
    if (num == 28) console.log("당신은 28살입니다");
    if (num == 29) console.log("당신은 29살입니다");
    if (num == 30) console.log("당신은 30살입니다");
    if (num == 31) console.log("당신은 31살입니다");
    if (num == 32) console.log("당신은 32살입니다");
    if (num == 33) console.log("당신은 33살입니다");
    if (num == 34) console.log("당신은 34살입니다");
    if (num == 35) console.log("당신은 35살입니다");
    if (num == 36) console.log("당신은 36살입니다");
    if (num == 37) console.log("당신은 37살입니다");
    if (num == 38) console.log("당신은 38살입니다");
    if (num == 39) console.log("당신은 39살입니다");
    if (num == 40) console.log("당신은 40살입니다");
    if (num == 41) console.log("당신은 41살입니다");
    if (num == 42) console.log("당신은 42살입니다");
    if (num == 43) console.log("당신은 43살입니다");
    if (num == 44) console.log("당신은 44살입니다");
    if (num == 45) console.log("당신은 45살입니다");
    if (num == 46) console.log("당신은 46살입니다");
    if (num == 47) console.log("당신은 47살입니다");
    if (num == 48) console.log("당신은 48살입니다");
    if (num == 49) console.log("당신은 49살입니다");
    if (num == 50) console.log("당신은 50살입니다");
    if (num == 51) console.log("당신은 51살입니다");
    if (num == 52) console.log("당신은 52살입니다");
    if (num == 53) console.log("당신은 53살입니다");
    if (num == 54) console.log("당신은 54살입니다");
    if (num == 55) console.log("당신은 55살입니다");
    if (num == 56) console.log("당신은 56살입니다");


}