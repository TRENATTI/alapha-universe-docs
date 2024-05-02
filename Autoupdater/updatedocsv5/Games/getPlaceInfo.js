
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const GameTypeLibrarySingleParam = [
    "getPlaceInfo"
]

var pushDebounce = true

module.exports = {
	name: "getPlaceInfo",
    description: "N/A",
    args: false,
    argsOptional: false,
    socketType: "games",
	async execute(interaction, noblox, admin) {
        var db = admin.database();
        const isReady = db.ref("szeebe/alapha-universe-docs-signature/Games/getPlaceInfo");

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
					.child("games");
				ref.once("value", (snapshot) => {
					snapshot.forEach((childSnapshot) => {
						var childKey = childSnapshot.key;
						var childData = childSnapshot.val();
						console.log(childKey, childData);
						userdata.push({ childKey, childData });
					});
                    for (let i = 0; i < GameTypeLibrarySingleParam.length; i++) {
					    checkGamesSingleParam(GameTypeLibrarySingleParam[i], userdata);
                    }
				});
                async function checkGamesSingleParam(GameType, userData) {//(userData) {
                    console.log(GameType);
                    for (let i = 0; i < userData.length; i++) {
                        setTimeout(async function timer() {
                            try {
                                const gameInfo = await noblox[GameType]([
                                    Number(userData[i].childData.placeId)
                                ]);
                                console.log(gameInfo);
                                getGameGithub(gameInfo, GameType);
                            } catch {
                                console.log(
                                    `Error getting game info for ${userData[i].childKey} [${userData[i].childData.universeId}.`
                                );
                            }
                            async function getGameGithub(gameInfo, GameType) {
        
                                try {
                                    const res = await axios.get(
                                        `https://raw.githack.com/Alpha-Authority/alapha-universe-docs/main/Docs/Games/${userData[i].childKey}/${GameType}.json`
                                    )
                                    if (res.data == null) {
                                        continueGameData(false, "", gameInfo, GameType)
                                    } else {
                                        console.log(res.data)
                                        continueGameData(true, res, gameInfo, GameType)
                                    }
                                } catch (error) {
                                    const res = ""
                                    continueGameData(false, res, gameInfo, GameType)
                                }
                            }
                            async function continueGameData(Flag, res, gameInfoCont,GameType){
                                if (Flag == true) {
                                    var newdatastring = JSON.stringify(res.data);
                                    var newdatajson = JSON.parse(newdatastring);
                                    var newdatajsonstring = JSON.stringify(newdatajson);
                                    const file = fs.writeFileSync(
                                        `../Docs/Games/${userData[i].childKey}/${GameType}.json`,
                                        newdatajsonstring,
                                        "utf8"
                                    )
                                    const datafile2 = require(`../../../Docs/Games/${userData[i].childKey}/${GameType}.json`);
                                    var str = JSON.stringify(datafile2);
                                    var strgD = JSON.stringify(gameInfoCont);
                                    console.log(str != strgD)
                                    if (str != strgD) {
                                        const file2 = fs.writeFileSync(
                                            `../Docs/Games/${userData[i].childKey}/${GameType}.json`,
                                            strgD,
                                            "utf8"
                                        );
        
                                    } else {
                                        console.log(false)
                                    }
        
                                } else {
                                    var strgD = JSON.stringify(gameInfoCont);
                                    const file2 = fs.writeFile(
                                        `../Docs/Games/${userData[i].childKey}/${GameType}.json`,
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