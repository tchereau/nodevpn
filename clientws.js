import { Tun, Tap} from 'tuntap2';
import WebSocket  from 'ws';
import {config} from 'dotenv';
import fs from 'fs';
config();
const tap = new Tap();
try{
    tap.mtu = 1400;
    tap.isUp = true;
    console.log(`created tap: ${tap.name}, ip: ${tap.ipv4}, mtu: ${tap.mtu}`);
}catch(e){
    console.log(`error: ${e}`);
    process.exit(0);
}

//connect to websocket server
const ws = new WebSocket ('ws://192.168.1.23:8124/');
ws.on('open', function open() {
    if(tap) {
        tap.on('data', (buf) => {
            //console.log(`sent: ${buf}`);
            ws.send(buf);
        }
        );
        ws.on('message', (buf) => {
            //console.log(`received: ${buf}`);
            tap.write(buf);
        }
        );
    }
});
