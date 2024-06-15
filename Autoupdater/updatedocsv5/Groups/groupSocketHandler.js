// CONCURRENTLY THE V3 SYSTEM, NEEDS TO BE CUT DOWN AND SUPPORT MORE CHECKS ON FIREBASE.
// ONLY HERE TO CHECK FIREBASE VALUES AND SEE IF EVERYTHING IS ABSOLUTELY READY.

require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

var pushDebounce = true


module.exports = {
	name: "groupSocketHandler",
    description: "N/A",
    args: false,
    argsOptional: false,
    socketType: "groups",
	async execute(interaction, noblox, admin) {
        var db = admin.database();	
		isAuthorized();
		 function isAuthorized() {
			const isReady = db.ref("szeebe/alapha-universe-docs-ready");

			// Attach an asynchronous callback to read the data at our posts reference
			isReady.once("value", (snapshot) => {
				console.log(snapshot.val());
				if (snapshot.val()) {
					isReady.set(false);
					start();
				}
			});
			async function start() {
				var ref = db
					.ref("szeebe/alapha-universe-docs-signature/Groups");

                var intervalId = null;
                var varCounter = 0;
                var startDbCheck = function(){
                    if(varCounter <= 10) {
                        ref.once("value", (snapshot) => {
                            var userdata = []
                            const all = (arr, fn = Boolean) => arr.every(fn);
                            snapshot.forEach((childSnapshot) => {
                                var childKey = childSnapshot.key;
                                var childData = childSnapshot.val();
                                console.log(childKey, childData);
                                userdata.push(childData);
                                if (all(userdata)) {    
                                    async function gitPush() {
                                        var spawn = require("child_process").spawn;
                                        var npm = (process.platform === "win32" ? "exec_aud.bat" : "bat"),
                                        child = spawn(npm, [""]);
                                        child.stdout.on('data', function (data) { console.log(data.toString()); });
                                        child.stderr.on('data', function (data) { console.log(data.toString()); });
                                        child.on('error', function() { console.log(arguments); });
                                        
                                    }
                                    //gitPush();
                                    db.ref("szeebe/alapha-universe-docs-ready").set(
                                        true
                                    );
                                    
                                    clearInterval(intervalId);

                                    process.exit()
                                }
                            });
                        })
                    }
                }
                intervalId = setInterval(startDbCheck, 60000);
			}
		}
	},
};
