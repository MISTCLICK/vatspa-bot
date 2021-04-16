"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const moment_1 = __importDefault(require("moment"));
const warnScript_1 = __importDefault(require("../../schema/warnScript"));
const config_json_1 = require("../../config.json");
module.exports = class ListWarnsCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'list-warnings',
            group: 'admin',
            memberName: 'list-warnings',
            description: 'Allows to get all warning issued to a certain member.',
            guildOnly: true,
            userPermissions: ["MANAGE_MESSAGES"],
            aliases: ['lw']
        });
    }
    //@ts-ignore
    async run(message) {
        const targetMember = message.mentions.users.first();
        if (!targetMember)
            return;
        const data = await warnScript_1.default.findOne({
            guildID: message.guild.id,
            userID: targetMember.id
        });
        if (data === null)
            return message.reply('This user has not been warned once.');
        let reasons = '';
        for (const warning of data.warns) {
            const { author, timeStamp, reason } = warning;
            reasons += `${moment_1.default(timeStamp).utc().format('DD.MM.YYYY | HH:mm:ss')}, warned by: <@${author}>, reason: "${reason}"\n\n`;
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor(config_json_1.mainColor)
            .setAuthor(`Warnings issued to ${targetMember.tag}:`, this.client.user?.displayAvatarURL())
            .setDescription(reasons)
            .setFooter(config_json_1.mainFooter);
        return message.reply(embed);
    }
};
