import { Socket, Server as ScoketServ } from 'socket.io';
import { Server } from 'http';
import { coordEventObject, roomEventObject, roomsInterface, socketMemberType } from './interfaces';
import { logger } from './utils/etc';
import { readdirSync } from 'fs';
// import { createRoom, findRoom, joinRoom, roomInfo } from './utils/rooms';
// import { coordUpdate } from './utils/coords';

const rooms: roomsInterface[] = [];
var members: socketMemberType[] = [];

export class SocketServer {
    private io: ScoketServ;

    public constructor(server: Server) {
        this.io = new ScoketServ(server, {
            pingInterval: 5000,
            pingTimeout: 120000
        });
        this.listen();
        return this;
    }

    private async loadEvents(utils: {
        socket: Socket,
        members: socketMemberType[],
        rooms: roomsInterface[]
    }): Promise<void> {
        const events = readdirSync('./dist/Events', { encoding: 'utf8', withFileTypes: true }).filter(i => i.isDirectory());
        events.forEach(e => {
            const eventFile = readdirSync('./dist/Events/' + e.name, { encoding: 'utf8', withFileTypes: true }).filter(i => i.name.endsWith(".js"));
            eventFile.forEach(f => {
                const event = require("./Events/" + e.name + "/" + f.name) as { default: roomEventObject | coordEventObject };
                const eventName = e.name.toLowerCase() + "_" + event.default.eventName.replace('.js', '');
                utils.socket.on(eventName, (data) => {
                    event.default.run(utils, data);
                });
                logger(eventName + " is Loaded", "Event Loaded");
            });
        });
    }

    private listen(): void {
        logger("Socket is listening");

        this.io.on('connection', (socket: Socket) => {
            logger("New connection / " + socket.id);
            const utils = {
                socket,
                members,
                rooms
            };
            this.loadEvents(utils);

            // socket.on("room_info", (room_number: string) => {
            //     roomInfo(socket, members, room_number);
            // });

            // socket.on('room_create', (room_info: roomInfoTypes) => {
            //     createRoom(socket, members, room_info, room_numbers);
            // });

            // socket.on('room_find', (room_number: string) => {
            //     findRoom(socket, members, room_number);
            // });

            // socket.on('room_join', (join_user_info: joinUserInfoTypes) => {
            //     joinRoom(socket, members, join_user_info)
            // });  

            socket.on("disconnect", (reason) => {
                this.onDisconnect(socket, reason);
            });
        });
    }

    private onDisconnect(socket: Socket, reason: string) {
        const member = members.find(i => i.id === socket.id);
        if (!member?.owner) return;
        logger(member.room_number + " is destroyed", "ROOM DISTROY");
        const roomNumber = member?.room_number;
        if (roomNumber) {
            // socket.to(roomNumber)..clear();
            const index = rooms.findIndex(i => i.room_number === roomNumber);
            rooms.splice(index, 1);
        }
        logger(`${socket.id} disconnected due to ${reason}`, "DISCONNECT");
    }
}