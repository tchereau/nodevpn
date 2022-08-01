import { Tun, Tap} from 'tuntap2';
import net from 'net';
//import dotenv
import {config} from 'dotenv';
config();

try{
    const tap = new Tap();
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
let client = net.connect({host: process.env.serverAdress, port: 8124}, function() {
    console.log('server connected');

    if(tap) {
        var muxer = Tap.muxer(1500);
        var demuxer = Tap.demuxer(1500);
        tap
            .pipe(muxer)
            .pipe(c)
            .pipe(demuxer)
            .pipe(tap);
    }
});