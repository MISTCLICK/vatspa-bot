"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_js_commando_1 = require("discord.js-commando");
class MetarCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'metar',
            description: 'Gives out airport\'s METAR.',
            memberName: 'metar',
            group: 'misc',
            aliases: ['m'],
            args: [{
                    key: 'airport',
                    type: 'string',
                    default: '',
                    prompt: 'Please provide a 4 letter long ICAO code.'
                }]
        });
    }
    async run(message, { airport }) {
        try {
            if (airport.length !== 4)
                return message.reply('Please provide a 4 letter long ICAO code.');
            let metar = await axios_1.default.get(`https://metar.vatsim.net/${airport.toUpperCase()}`);
            return message.reply('```' + metar.data + '```');
        }
        catch (err) {
            return message.reply('Such airport was not found!');
        }
    }
}
exports.default = MetarCommand;
