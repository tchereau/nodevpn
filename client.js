import { Tun, Tap} from 'tuntap2';
import net from 'net';
import crypto from 'crypto';
//import dotenv
import {config} from 'dotenv';
config();
const tap = new Tap();
try{

    tap.mtu = 1400;
    tap.ipv4 = "10.11.12.2/24";
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
let client = net.connect({host: process.env.serverAdress, port: process.env.serverPort}, function(c) {
    console.log('server connected');

    if(tap) {
        client.on('data', (buf) => {
            console.log(`received: ${buf}`);
            tap.write(buf);
        });
        tap.on('data', (buf) => {
            console.log(`sent: ${buf}`);
            client.write(buf);
        });
    }
});