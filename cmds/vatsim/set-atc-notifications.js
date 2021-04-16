"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const atcNotifySchema_1 = __importDefault(require("../../schema/atcNotifySchema"));
const discord_js_commando_1 = require("discord.js-commando");
class SetPermaAtcNotifyCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "set-atc-notifications",
            group: "vatsim",
            memberName: "set-atc-notifications",
            description: "Define el canal donde recibir notificaciones de conexion!",
            guildOnly: true,
            args: [
                {
                    key: "channelTag",
                    prompt: "Por favor, introduce un canal!",
                    type: "string"
                }
            ],
            userPermissions: ["ADMINISTRATOR"]
        });
    }
    async run(message, { channelTag }) {
        const channelID = channelTag.slice(2, -1);
        const guildID = message.guild.id;
        await atcNotifySchema_1.default.findOneAndUpdate({
            guildID
        }, {
            guildID,
            channelID
        }, {
            upsert: true,
            useFindAndModify: false
        });
        return message.reply('Completado!');
    }
}
exports.default = SetPermaAtcNotifyCommand;
