import { Socket, Server as ScoketServ } from 'socket.io';
import { Server } from 'http';
import { roomsInterface, socketMemberType } from './interfaces/interfaces';
import { logger } from './utils/etc';
import { readdirSync } from 'fs';
import { roomEventObject } from './interfaces/roomEvent.interface';
import { coordEventObject } from './interfaces/coordEvent.interface';

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

            socket.on("disconnect", (reason) => {
                this.onDisconnect(socket, reason);
            });
        });
    }

    private onDisconnect(socket: Socket, reason: string) {
        const member = members.find(i => i.id === socket.id);
        const room = rooms.find(i => i.room_number === member?.room_number);
        if (!member || room?.ownerId !== member.id) return;
        logger(member.room_number + " is destroyed", "ROOM DISTROY");
        const roomNumber = member?.room_number;
        if (roomNumber) {
            const index = rooms.findIndex(i => i.room_number === roomNumber);
            rooms.splice(index, 1);
        }
        logger(`${socket.id} disconnected due to ${reason}`, "DISCONNECT", -1);
    }
}