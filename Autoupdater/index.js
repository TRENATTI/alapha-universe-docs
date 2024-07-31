// Structure Setup

// node_modules
// modules
// settings
// events
// startup
// functions

// This is absolutely cursed - 04/11/2024 // SI

// // //

require("dotenv").config();
const fs = require("fs");
const {
    Collection,
    Client,
} = require("discord.js");

const noblox = require("noblox.js");
const admin = require("firebase-admin");

// // //

const clientSystem = "./System/Client";

const v4System = "./updatedocsv5";
const v4Folders = fs
	.readdirSync(v4System);
	//.filter((file) => file.endsWith(".js"));

// // //

function getKeys(flags) {
	if (process.env.DEVELOPER_MODE == "true") {
		if (flags == "token") {
			return process.env.TESTING_TOKEN;
		} else if (flags == "rbxcookie") {
			return process.env.TESTING_RBXCOOKIE;
		} else if (flags == "applicationid") {
			return process.env.TESTING_APPLICATION_ID;
		} else if (flags == "prefix") {
			return process.env.TESTING_PREFIX;
		}
	} else {
		if (flags == "token") {
			return process.env.TOKEN;
		} else if (flags == "rbxcookie") {
			return process.env.RBXCOOKIE;
		} else if (flags == "applicationid") {
			return process.env.APPLICATION_ID;
		} else if (flags == "prefix") {
			return process.env.PREFIX;
		}
	}
}

const token = getKeys("token");
const prefix = getKeys("prefix");
const applicationid = getKeys("applicationid");
const rbxcookie = getKeys("rbxcookie");

//

function startApp(currentUser, client, admin) {
    client.updatedocsv4_apitypes = new Collection();
    client.updatedocsv4_apisockets = new Collection();

    for (const folder of v4Folders) {
        client.updatedocsv4_apitypes.set(folder);
    }
    
    const apitypes = client.updatedocsv4_apitypes
    if (apitypes.length == 0) return;
    
    var v4FolderData = []
    v4FolderData.push(
        "``" +
            apitypes 
                .map((folderName) => folderName)
                .sort()
                .join("``, ``") +
            "``"
    );
    var y = ``;
    var x;
    for (x of v4FolderData) {
            console.log(x)
            y = y + `\n` + x;
    }
    //interaction.reply(`Response Date.. ${y}`)
    
    for (const api of apitypes) {
        let apiName = api.slice(0, -1)
        let socketSystem = "./updatedocsv5/" + apiName
        //socketSystem.slice(0, -1)
        const socketFolders = fs
            .readdirSync(socketSystem)
            .filter((file) => file.endsWith(".js"));
    
        for (const socket of socketFolders) {
            const socketFile = require(`./updatedocsv5/${apiName}/${socket}`);
            client.updatedocsv4_apisockets.set(socketFile.name, socketFile);
        }
    }
    
    const apisockets = client.updatedocsv4_apisockets
    
    for (const api of apitypes) {
        let apiName = api.slice(0, -1)
        console.log(apiName)
        let socketSystem = "./updatedocsv5/" + apiName
        //socketSystem.slice(0, -1)
        const socketFolders = fs
            .readdirSync(socketSystem)
            .filter((file) => file.endsWith(".js"));

        for (const socket of socketFolders) {
            let executorName = socket.slice(0,-3)
            console.log(executorName)
            const executor = apisockets.get(executorName)
            if (!executor) return;
            //if (executor.args) return; // temporary
            console.log(executor.name)
            //if (executor.socketType == "groups" && !executor.args){
            try {
                executor.execute("", noblox, admin);
            } catch {
                console.log("Failed!")
            }}
        
    }
}

//

async function startFirebase(currentUser, client) {
	const SA_PRIVATE_KEY = process.env.SA_PRIVATE_KEY.split("\\n").join("\n");

	var serviceAccount = {
		type: process.env.SA_TYPE,
		project_id: process.env.SA_PROJECT_ID,
		private_key_id: process.env.SA_PRIVATE_KEY_ID,
		private_key: SA_PRIVATE_KEY,
		client_email: process.env.SA_CLIENT_EMAIL,
		client_id: process.env.SA_CLIENT_ID,
		auth_uri: process.env.SA_AUTH_URI,
		token_uri: process.env.SA_TOKEN_URI,
		auth_provider_x509_cert_url: process.env.SA_AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.SA_CLIENT_X509_CERT_URL,
	};

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: process.env.SA_DATABASEURL,
	});

	startApp(currentUser, client, admin);
}

async function startNoblox(client) {
	// You MUST call setCookie() before using any authenticated methods [marked by 🔐]
	// Replace the parameter in setCookie() with your .ROBLOSECURITY cookie.
	const currentUser = await noblox.setCookie(`${rbxcookie}`);
	console.log(
		new Date(),
		`| index.js |`,
		`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`
	);

	// Do everything else, calling functions and the like.
	startFirebase(currentUser, client);
}

//

async function startDiscord() {
	const client = new Client({
		intents: [
		],
	});

	//

	client.login(token);

	startNoblox(client);
}

//

startDiscord();

//