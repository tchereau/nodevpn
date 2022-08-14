import { Tun, Tap} from 'tuntap2';
import { WebSocketServer } from 'ws';
import {config} from 'dotenv';
import fs from 'fs';
config();
const tap = new Tap();

//let passphrase= process.env.passphrase;

/* let pubkeyobj = readArmored(fs.readFileSync('pub.asc', 'utf8'));
let privkeyobj = readArmored(fs.readFileSync('priv.asc', 'utf8')); */

try{

    tap.mtu = 1400;
    //tap.ipv4 = "10.11.12.1/24";
/*     tap.on('data', (buf) => {
        console.log(`received: ${buf}`);
    }); */
    tap.isUp = true;
    console.log(`created tap: ${tap.name}, ip: ${tap.ipv4}, mtu: ${tap.mtu}`);
    //console.log(tap);
    //tap.release();
}catch(e){
    console.log(`error: ${e}`);
    process.exit(0);
}
var webs = new WebSocketServer({port: 8124});
webs.on('connection', function(c) {
    console.log('client connected');
    if(tap) {
        tap.on('data', (buf) => {
            //console.log(`sent: ${buf}`);
            c.send(buf);
        }
        );
        c.on('message', (buf) => {
            //console.log(`received: ${buf}`);
            tap.write(buf);
        }
        );
    }
});
webs.on('error', function(e) {
    console.log(`error: ${e}`);
    process.exit(0);
}
);
