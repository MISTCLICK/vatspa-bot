"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
class SayCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'admin',
            memberName: 'say',
            description: 'Allows to say something as a bot in any channel!',
            guildOnly: true,
            userPermissions: ["MANAGE_MESSAGES"],
            argsType: 'multiple'
        });
    }
    //@ts-ignore
    async run(message, args) {
        const channel = message.mentions.channels.first();
        if (channel) {
            channel?.send(args.join(' ').replace(`<#${channel.id}>`, '').trim());
        }
        else {
            message.channel.send(args);
        }
    }
}
exports.default = SayCommand;
