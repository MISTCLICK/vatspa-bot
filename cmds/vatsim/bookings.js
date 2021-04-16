"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const xml2json_1 = __importDefault(require("xml2json"));
const discord_js_commando_1 = require("discord.js-commando");
class BookingsCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'bookings',
            description: 'Ver reservas de VATSPA.',
            memberName: 'bookings',
            aliases: ['books'],
            group: 'vatsim',
        });
    }
    async run(message) {
        try {
            let res = await axios_1.default.get('http://vatbook.euroutepro.com/xml2.php');
            const xmlDoc = xml2json_1.default.toJson(res.data, { object: true });
            let firstText = '**Posicion / Controlador / Hora Inicio / Hora Fin**```\n';
            for (const booking of xmlDoc.bookings.atcs.booking.filter((book) => book.callsign.startsWith('LE') || book.callsign.startsWith('GC'))) {
                firstText += `${booking.callsign} | ${booking.name} ${booking.cid} | ${booking.time_start} | ${booking.time_end}\n`;
            }
            let finText = '';
            let otherFinText = '```';
            let allLines = firstText.split('\n');
            for (const line of allLines) {
                if (finText.length + line.length < 2000) {
                    finText += `${line}\n`;
                }
                else {
                    otherFinText += `${line}\n`;
                }
            }
            finText += '```';
            otherFinText += '```';
            message.channel.send(finText);
            return message.channel.send(otherFinText);
        }
        catch (err) {
            console.error(err);
            return message.reply('ERROR!');
        }
    }
}
exports.default = BookingsCommand;
