const express = require('express')
const moment = require('moment')
const Request_IP = require("request-ip")
const app = express();
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(config.settings.webhook);

  


const requestCounts = {};
app.use(express.static('html'))
// used to block ipaddress that exceeded the max request limit
app.use((req, res, next) => {
  const ip = req.ip;
  const embed4 = new MessageBuilder() 
  .setTitle('IP Blocked Due to Spam!')
  .setAuthor(`IP: ${ip}`)
  .setColor('#00b0f4')
  // adds 1 each request
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;
  
  // if limit is exeeded blocks requets
  if (requestCounts[ip] > config.protection.max_tries) {
    // Sets a timer to unblock a cnc
    setTimeout(() => {
      delete requestCounts[ip];
    }, config.protection.seconds_blocked * 1000);
    
    res.status(403).json({ error: true, message: 'Too many requests. Your IP has been blocked.' });
    hook.send(embed4)
    .catch(err => {
        console.error('[ERROR] Webhook invalid:', err);
      });
  }
  
  next();
});






app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})



app.get("/api/v2/authenticate", (req, res) => {
    var IP = Request_IP.getClientIp(req)

   const key = req.query.key;
   const keyData2 = require("./keys.json")

   if (config.logs.log_ip == "false") IP = "LOGGING DISABLED"
   const embed = new MessageBuilder() 
   .setTitle('User Logged in!')
   .setAuthor(`Key: ${key} | IP: ${IP}`)
   .setColor('#00b0f4')
    
   



   const embed2 = new MessageBuilder()
   .setTitle('User Failed Logged in! | IP: ${IP} ')
   .setAuthor(`Key: ${key}`)
   .setColor('#00b0f4')
    

   // checks if key is valid
   if (!key)  return res.status(401).json({"error": true, "message": "Invalid User."});
   if (!keyData2[key] ) return res.status(401).json({"error": true, "message": "Invalid User."});
   
   if (!keyData2[key] && config.logs.failed_login == "true") {
    res.status(401).json({"error": true, "message": "Invalid key."}); 
    hook.send(embed2);
    
   }

   if (keyData2[key].banned == "true") return res.status(401).json({"error": true, "message": "User Banned."});
       //hook.send(embed2);
   
   // checks if key is expired
   if ("expiry" in keyData2[key]) {
       const expiry = moment(keyData2[key].expiry.toString(), ["MMMM DD, YYYY", "x", "X", "MM/DD/YYYY"]);
       if (expiry.isSameOrBefore(moment())) return res.status(401).json({error: true, message: "User has expired."});
   } 
    if (config.logs.success_login == "true") hook.send(embed);
  
    // returns 200 status to say key is valid
    return res.status(200).json({error: false, message: "User Valid"}) ;
   

   
   
   



   
});




app.get("/api/v2/users/info" , (req, res) => {
   const admin = req.query.key
   const name  = req.query.user
   const keyData = require("./keys.json")
   var expired = {}
   //const key   = req.query.key
   const admin_keys = JSON.parse(fs.readFileSync('admin.json'));
   //if (!admin) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
   //if (!name) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
   if (!admin_keys[admin]) return res.status(401).json({"error": true, "message": "Admin Access Is Denied!"});

  if (!keyData[name]) return res.status(401).json({"error": true, "message": "Invalid User!"});


  if ("expiry" in keyData[name]) {
    const expiry = moment(keyData[name].expiry.toString(), ["MMMM DD, YYYY", "x", "X", "MM/DD/YYYY"]);
    if (expiry.isSameOrBefore(moment())) {
        expired = true
    } else {
        expired = false
    }
}    


  res.status(200).json({"error": false, "message": "Valid User!", "discord": keyData[name].discord, "expired": expired });
 

    });



    app.get("/api/v2/users/list" , (req, res) => {
        const admin = req.query.key
        const name  = req.query.user
        const keyData = require("./keys.json")
        const keys = require("./keys.json")
        //const key   = req.query.key
        const admin_keys = JSON.parse(fs.readFileSync('admin.json'));
        //if (!admin) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
        //if (!name) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
        if (!admin_keys[admin])  return res.status(401).json({"error": true, "message": "Admin Access Is Denied!"});
     
     
     
     
       //res.status(200).json({"error": false, "message": "Valid User!", "discord": keyData[name].discord, "expired": expired });
       res.status(200).json(Object.keys(keyData).map(key => ({
        key: key.slice(0, -5) + '*****',
        discord: keyData[key].discord,
        expiry: keyData[key].expiry,
        expired: keyData[key].expired
      })));    
         });




    app.get("/api/v2/users/ban" , (req, res) => {
            const admin = req.query.key
            const name  = req.query.user
            const keyData = require("./keys.json")
            const keys = require("./keys.json")
            //const key   = req.query.key
            const admin_keys = JSON.parse(fs.readFileSync('admin.json'));
            //if (!admin) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
            //if (!name) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
            if (!admin_keys[admin]) return res.status(401).json({"error": true, "message": "Admin Access Is Denied!"});
            if (!keyData[name]) return res.status(401).json({"error": true, "message": "Invalid User"});
         
         
            const banned = "true";
            keyData[name].banned = banned;
            fs.writeFileSync("keys.json", JSON.stringify(keyData, null, 4));
           //res.status(200).json({"error": false, "message": "Valid User!", "discord": keyData[name].discord, "expired": expired });
           res.status(200).json({"error": false, "message": `user ${name} banned`});    
             });


    app.get("/api/v2/users/unban" , (req, res) => {
            const admin = req.query.key
            const name  = req.query.user
            const keyData = require("./keys.json")
            const keys = require("./keys.json")
            //const key   = req.query.key
            const admin_keys = JSON.parse(fs.readFileSync('admin.json'));
            //if (!admin) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
            //if (!name) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
            if (!admin_keys[admin]) return res.status(401).json({"error": true, "message": "Admin Access Is Denied!"});
            if (!keyData[name]) return res.status(401).json({"error": true, "message": "Invalid User"});
         
         
            const banned = "false";
            keyData[name].banned = banned;
            fs.writeFileSync("keys.json", JSON.stringify(keyData, null, 4));
           //res.status(200).json({"error": false, "message": "Valid User!", "discord": keyData[name].discord, "expired": expired });
           res.status(200).json({"error": false, "message": `user ${name} unbanned`});    
             });



             app.get("/api/v2/users/remove" , (req, res) => {
                const admin = req.query.key
                const name  = req.query.user
                const keyData = require("./keys.json")
                const keys = require("./keys.json")
                //const key   = req.query.key
                const admin_keys = JSON.parse(fs.readFileSync('admin.json'));
                //if (!admin) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
                //if (!name) res.status(401).json({"error": true, "message": "Key Query is Empty!"});
                if (!admin_keys[admin]) return res.status(401).json({"error": true, "message": "Admin Access Is Denied!"});
                if (!keyData[name]) return res.status(401).json({"error": true, "message": "Invalid User"});


             
             
                delete keyData[name];
                fs.writeFile("keys.json", JSON.stringify(keyData, null, 4), (err) => {});
               //res.status(200).json({"error": false, "message": "Valid User!", "discord": keyData[name].discord, "expired": expired });
               return res.status(200).json({"error": false, "message": `user ${name} removed`});    
                 });
    




app.listen("80", function () {
    console.log("Authentication Started On Port:", `80`);
});

process.on('uncaughtException', (err) => {
    console.log('\x1b[31m%s\x1b[0m','[error]', err);
  });
  
  process.on('unhandledRejection', (reason) => {
    console.log('\x1b[31m%s\x1b[0m','[error]', 'Unhandled Rejection:', reason.message);
  });
  



