# jsauthapi
Quick authentication api I made for another project its not the best but it works. Made in Javascript and used json file for keys or anything you want also has an expiry

# Updated
I finally updated it!
Added Anti Spam which is configurable in config.json 
Added configurable logs to log failed logins or successful logins and to log ips or not


I have added an api to ban,unban,remove,see user info, and see all users with an admin api key found in admins.json

# Updates
I will add more to the user api
 - Create users
 - Edit users discord, exipry
 
I will add a discord bot to do the same features to the api


user api: 
- user info http://127.0.0.1/api/v2/users/info?key=adminkey&user=userkey
- list users http://127.0.0.1/api/v2/users/list?key=adminkey
- ban user http://127.0.0.1/api/v2/ban?key=adminkey&user=userkey
- unban user http://127.0.0.1/api/v2/unban?key=adminkey&user=userkey
- remove user http://127.0.0.1/api/v2/remove?key=adminkey&user=userkey
