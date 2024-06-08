import { Socket, Server as SocketServ } from 'socket.io';
import { Server } from 'http';
import { roomsInterface, socketMemberType } from './interfaces/interfaces';
import { logger } from './utils/etc';
import { readdirSync } from 'fs';
import { roomEventObject } from './interfaces/roomEvent.interface';
import { coordEventObject } from './interfaces/coordEvent.interface';

const rooms: roomsInterface[] = [];
var members: socketMemberType[] = [];

export class SocketServer {
    private io: SocketServ;

    public constructor(server: Server) {
        this.io = new SocketServ(server, {
            pingInterval: 5000,
            pingTimeout: 120000
        });
        this.listen();
        return this;
    }

    private async loadEvents(utils: {
        io: SocketServ,
        socket: Socket,
        members: socketMemberType[],
        rooms: roomsInterface[]
    }): Promise<void> {
        const events = readdirSync('./dist/Events', { encoding: 'utf8', withFileTypes: true }).filter(i => i.isDirectory());
        events.forEach(e => {
            const eventFile = readdirSync('./dist/Events/' + e.name, { encoding: 'utf8', withFileTypes: true }).filter(i => i.name.endsWith(".js"));
            eventFile.forEach(f => {
                const event = require("./Events/" + e.name + "/" + f.name) as { default: roomEventObject | coordEventObject };
                const eventName = e.name.toLowerCase() + "_" + f.name.replace('.js', '');
                utils.socket.on(eventName, (data) => {
                    event.default.run(utils, data);
                });
                // logger(eventName + " is Loaded", "Event Loaded");
            });
            logger("Events loaded successfully", "Events Loaded", 0);
        });
    }

    private listen(): void {
        logger("Socket is listening");

        this.io.on('connection', (socket: Socket) => {
            logger("New connection / " + socket.id);
            const utils = {
                io: this.io,
                socket,
                members,
                rooms
            };
            this.loadEvents(utils);

            socket.on("disconnect", (reason) => {
                this.onDisconnect(socket, reason);
            });
        });
    }

    private onDisconnect(socket: Socket, reason: string) {
        const member = members.find(i => i.id === socket.id);
        const room = rooms.find(i => i.room_number === member?.room_number);
        if (!member || room?.ownerId !== member.id) {
            logger(`${socket.id} disconnected due to ${reason}`, "DISCONNECT", -1);
            members.splice(members.findIndex(i => i.id === socket.id), 1);
            return; 
        };
        this.io.to(room.room_number).emit("room_destroyed", {
            status: 200,
            message: "Room is now destroyed"
        });

        this.io.in(room.room_number).socketsLeave(room.room_number);

        const roomMembers = members.filter(m => m.room_number === room.room_number);
        roomMembers.forEach(m => {
            const memberIndex = members.findIndex(i => i.id === m.id);
            members.splice(memberIndex, 1);
        });

        const index = rooms.findIndex(i => i.room_number === room.room_number);
        rooms.splice(index, 1);
        logger(member.room_number + " is destroyed", "ROOM DISTROY");
        logger(`Owner ${socket.id} disconnected due to ${reason}`, "DISCONNECT", -1);
    }
}