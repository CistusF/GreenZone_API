import { Socket } from "socket.io";
import { roomsInterface, socketMemberType } from "./interfaces";

export type manageEventObject = {
    eventName: string;
    run: (utils: {
        socket: Socket,
        members: socketMemberType[],
        rooms: roomsInterface[]
    },
        args: string) => void;
};