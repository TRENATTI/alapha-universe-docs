
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const PlayerTypeLibrarySingleParam = [
    "getGroups"
]

var pushDebounce = true

module.exports = {
	name: "getGroups",
    description: "N/A",
    args: false,
    argsOptional: false,
    socketType: "Players",
	async execute(interaction, noblox, admin) {
        var db = admin.database();
        const isReady = db.ref("szeebe/alapha-universe-docs-signature/Players/getFriends");

        // Attach an asynchronous callback to read the data at our posts reference
        isReady.once("value", (snapshot) => {
            console.log(snapshot.val());
            if (snapshot.val()) {
                isReady.set(false);
                start();
            }
        });
        async function start() {
            const userdata = [];
				var ref = db
					.ref("szeebe")
					.child("alapha-universe-docs")
					.child("players");
				ref.once("value", (snapshot) => {
					snapshot.forEach((childSnapshot) => {
						var childKey = childSnapshot.key;
						var childData = childSnapshot.val();
						console.log(childKey, childData);
						userdata.push({ childKey, childData });
					});
                    for (let i = 0; i < PlayerTypeLibrarySingleParam.length; i++) {
					    checkPlayersSingleParam(PlayerTypeLibrarySingleParam[i], userdata);
                    }
				});
                async function checkPlayersSingleParam(PlayerType, userData) {//(userData) {
                    console.log(PlayerType);
                    for (let i = 0; i < userData.length; i++) {
                        setTimeout(async function timer() {
                            try {
                                const playerInfo = await noblox[PlayerType](Number(userData[i].childData.userId));
                                console.log(playerInfo);
                                getPlayerGithub(playerInfo, PlayerType);
                            } catch {
                                console.log(
                                    `Error getting player info for ${userData[i].childKey} [${userData[i].childData.userId}.`
                                );
                            }
                            async function getPlayerGithub(playerInfo, PlayerType) {
        
                                try {
                                    const res = await axios.get(
                                        `https://raw.githack.com/Alpha-Authority/alapha-universe-docs/main/Docs/Players/${userData[i].childKey}/${PlayerType}.json`
                                    )
                                    if (res.data == null) {
                                        continuePlayerData(false, "", playerInfo, PlayerType)
                                    } else {
                                        console.log(res.data)
                                        continuePlayerData(true, res, playerInfo, PlayerType)
                                    }
                                } catch (error) {
                                    const res = ""
                                    continuePlayerData(false, res, playerInfo, PlayerType)
                                }
                            }
                            async function continuePlayerData(Flag, res, playerInfoCont, PlayerType){
                                if (Flag == true) {
                                    var newdatastring = JSON.stringify(res.data);
                                    var newdatajson = JSON.parse(newdatastring);
                                    var newdatajsonstring = JSON.stringify(newdatajson);
                                    const file = fs.writeFileSync(
                                        `../Docs/Players/${userData[i].childKey}/${PlayerType}.json`,
                                        newdatajsonstring,
                                        "utf8"
                                    )
                                    const datafile2 = require(`../../../Docs/Players/${userData[i].childKey}/${PlayerType}.json`);
                                    var str = JSON.stringify(datafile2);
                                    var strgD = JSON.stringify(playerInfoCont);
                                    console.log(str != strgD)
                                    if (str != strgD) {
                                        const file2 = fs.writeFileSync(
                                            `../Docs/Players/${userData[i].childKey}/${PlayerType}.json`,
                                            strgD,
                                            "utf8"
                                        );
        
                                    } else {
                                        console.log(false)
                                    }
        
                                } else {
                                    var strgD = JSON.stringify(playerInfoCont);
                                    const file2 = fs.writeFile(
                                        `../Docs/Players/${userData[i].childKey}/${PlayerType}.json`,
                                        strgD, 
                                        function(err) {
                                            console.log(err);
                                        }
                                    );
                                }
                                if (i == userData.length - 1) {
                                    updateDb()
                                }
                            }
                        }, i * 7500);
                    }
                }
                async function updateDb(){ 
                    if (pushDebounce == true) {
                        pushDebounce = false
                        isReady.set(true);
                        pushDebounce = true
                    }
                }
        }
    }
}