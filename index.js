const express = require('express')
const moment = require('moment')
const fs = require('fs')
const router = express.Router();
const LocalTunnel = require("localtunnel")
const Request_IP = require("request-ip")
const app = express();
const { execSync } = require('child_process');
const config = fs.readFileSync("config.json");
const ver = (config.version)
const { Webhook, MessageBuilder } = require("discord-webhook-node");

app.set("view engine", "js");
app.set("trust proxy", 1);

app.get("/api/authenticate", (req, res) => {
 async function LocalTunnel_establisher(){
    const tunnel = await LocalTunnel(Port)

}
     const IP = Request_IP.getClientIp(req)

    const key = req.query.key;
    const hwid = req.query.hwid;
    const keyData = require("./keys.json")
    const hook = new Webhook(config.webhook;
 
    const embed = new MessageBuilder()
    .setTitle('User Logged in!')
    .setAuthor(`Key: ${key} | IP: ${IP}`)
    .setColor('#00b0f4')
     
    



    const embed2 = new MessageBuilder()
    .setTitle('User Failed Logged in!')
    .setAuthor(`Key: ${key}`)
    .setColor('#00b0f4')
     





    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    const together = [currentYear, currentMonth, currentDay];
    if ("expiry" in keyData[key]) {
        const expiry = moment(keyData[key].expiry.toString(), ["MMMM DD, YYYY", "x", "X", "MM/DD/YYYY"]);
        if (expiry.isSameOrBefore(moment())) return res.status(401).json({error: true, message: "Key has expired."});
    }    

        if (!keyData[key]) return res.send({"error": true, "message": "invalid key."});
    if(!hwid) return res.send({"error": true, "message": "hwid invalid."});    
    if(!keyData[key].hwid) return res.send({"error": true, "message": "key invalid"});
    
    
    hook.send(embed);
    return res.status(401).json({error: false, message: "Key Valid"}) ;
    
});
app.listen("80", function () {
    console.log("Webserver Started On Port:", `80`);
});





