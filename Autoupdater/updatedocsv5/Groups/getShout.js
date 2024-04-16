
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const GroupTypeLibrarySingleParam = [
    "getShout"
]

var pushDebounce = true

module.exports = {
	name: "getShout",
    description: "N/A",
    args: false,
    argsOptional: false,
    socketType: "groups",
	async execute(interaction, noblox, admin) {
        var db = admin.database();
        const isReady = db.ref("szeebe/alapha-universe-docs-signature/Groups/getShout");

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
					.child("groups");
				ref.once("value", (snapshot) => {
					snapshot.forEach((childSnapshot) => {
						var childKey = childSnapshot.key;
						var childData = childSnapshot.val();
						console.log(childKey, childData);
						userdata.push({ childKey, childData });
					});
                    for (let i = 0; i < GroupTypeLibrarySingleParam.length; i++) {
					    checkGroupsSingleParam(GroupTypeLibrarySingleParam[i], userdata);
                    }
				});
                async function checkGroupsSingleParam(GroupType, userData) {//(userData) {
                    console.log(GroupType);
                    for (let i = 0; i < userData.length; i++) {
                        setTimeout(async function timer() {
                            try {
                                const groupInfo = await noblox[GroupType](
                                    Number(userData[i].childData.groupId)
                                );
                                console.log(groupInfo);
                                getGroupGithub(groupInfo, GroupType);
                            } catch {
                                console.log(
                                    `Error getting group info for ${userData[i].childKey} [${userData[i].childData.groupId}.`
                                );
                            }
                            async function getGroupGithub(groupInfo, GroupType) {
        
                                try {
                                    const res = await axios.get(
                                        `https://raw.githack.com/Alpha-Authority/alapha-universe-docs/main/Docs/Groups/${userData[i].childKey}/${GroupType}.json`
                                    )
                                    if (res.data == null) {
                                        continueGroupData(false, "", groupInfo, GroupType)
                                    } else {
                                        console.log(res.data)
                                        continueGroupData(true, res, groupInfo, GroupType)
                                    }
                                } catch (error) {
                                    const res = ""
                                    continueGroupData(false, res, groupInfo, GroupType)
                                }
                            }
                            async function continueGroupData(Flag, res, groupInfoCont, GroupType){
                                if (Flag == true) {
                                    var newdatastring = JSON.stringify(res.data);
                                    var newdatajson = JSON.parse(newdatastring);
                                    var newdatajsonstring = JSON.stringify(newdatajson);
                                    const file = fs.writeFileSync(
                                        `../Docs/Groups/${userData[i].childKey}/${GroupType}.json`,
                                        newdatajsonstring,
                                        "utf8"
                                    )
                                    const datafile2 = require(`../../../Docs/Groups/${userData[i].childKey}/${GroupType}.json`);
                                    var str = JSON.stringify(datafile2);
                                    var strgD = JSON.stringify(groupInfoCont);
                                    console.log(str != strgD)
                                    if (str != strgD) {
                                        const file2 = fs.writeFileSync(
                                            `../Docs/Groups/${userData[i].childKey}/${GroupType}.json`,
                                            strgD,
                                            "utf8"
                                        );
        
                                    } else {
                                        console.log(false)
                                    }
        
                                } else {
                                    var strgD = JSON.stringify(groupInfoCont);
                                    const file2 = fs.writeFile(
                                        `../Docs/Groups/${userData[i].childKey}/${GroupType}.json`,
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