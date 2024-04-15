const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const util = require("util");
const child_process = require("child_process");
const process = require("process");
require("dotenv").config();

const exec = util.promisify(child_process.exec);

async function execSh(command) {
	await exec(command, { windowsHide: true }, (e, stdout, stderr) => {
		console.log(`${stdout}\n`);
	});
}


module.exports = {
	name: "reset",
    description: "N/A",
    args: false,
    argsOptional: false,
    socketType: "update",
	async execute(interaction, noblox, admin) {
        var db = admin.database();
        db.ref("szeebe/alapha-universe-docs-ready").set(
            true
        );
        db.ref("szeebe/alapha-universe-docs-signature/Groups/getGroup").set(
            true
        );
        db.ref("szeebe/alapha-universe-docs-signature/Groups/getGroupFunds").set(
            true
        );
        db.ref("szeebe/alapha-universe-docs-signature/Groups/getGroupGames").set(
            true
        );
        db.ref("szeebe/alapha-universe-docs-signature/Groups/getGroupSocialLinks").set(
            true
        );
        db.ref("szeebe/alapha-universe-docs-signature/Groups/getRoles").set(
            true
        );
        db.ref("szeebe/alapha-universe-docs-signature/Groups/getShout").set(
            true
        );
        db.ref("szeebe/alapha-universe-docs-signature/Groups/getLogo").set(
            true
        );
        console.log("Reset!")
    }
};
