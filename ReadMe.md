<div align="center">
    <img src='./md/GreenZone_Circle.png' width=80 />
    <h1>GreenZone Socket Server</h1>
</div>

## GreenZone Socket Server?
This repository is socket server for `GreenZone`.
We using `Socket.IO` and `Express`, `http` for socket server,
And using typescript and zod for typings.
More package information is in [package.json](./package.json).

## API Features
- Common
    - chat
    - log
    - schedule
- Coords
    - update
- Manage
    - boundary_update
    - notice
    - kick
    - rename
- Room
    - create
    - destroy
    - find
    - info
    - join
    - leave

## Usage?
`npm install` to install `GreenZone Socket Server`'s packages.
And `tsc` to compiles TypeScript code for JavaScript.
> tsc need `typescript` package for global.  

Next, create .env file and modify it to fit the .env.dev format.
And using `npm run start` to start the server.

## TODO?
- [x] Add set title feature
- [x] Add set safe area feature
- [x] Add send Anouncement feature
- [x] Add send warning feature
- [x] Add kick member feature
- [x] Add destroy room feature
- [x] Add Event Message feature
- [x] Add Chat feature
- [x] Add Logs sender feature
- [ ] ~~Add get special member infomation feature~~