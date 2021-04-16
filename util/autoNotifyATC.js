"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../config.json");
const axios_1 = __importDefault(require("axios"));
const atcNotifySchema_1 = __importDefault(require("../schema/atcNotifySchema"));
const OnlineATCschema_1 = __importDefault(require("../schema/OnlineATCschema"));
const moment_1 = __importDefault(require("moment"));
const discord_js_1 = require("discord.js");
async function autoNotifyATC(client) {
    setInterval(async () => {
        let onlineStations = await axios_1.default.get('https://data.vatsim.net/v3/vatsim-data.json');
        const prevStations = await OnlineATCschema_1.default.findOne({ permanent: 0 });
        await OnlineATCschema_1.default.findOneAndUpdate({
            permanent: 0
        }, {
            result: onlineStations.data
        }, {
            upsert: true
        });
        const guildData = await atcNotifySchema_1.default.find();
        if (guildData === null)
            return;
        if (prevStations && prevStations.result.controllers.length !== onlineStations.data.controllers.length) {
            let currentATClist = [];
            let oldATClist = [];
            for (const station of onlineStations.data.controllers.filter(({ callsign }) => callsign.startsWith('LE') || callsign.startsWith('GC') || callsign.startsWith('ACCSP'))) {
                if (!station.callsign.endsWith('ATIS') && !station.callsign.endsWith('OBS'))
                    currentATClist.push(station.callsign);
            }
            for (const station of prevStations.result.controllers.filter(({ callsign }) => callsign.startsWith('LE') || callsign.startsWith('GC') || callsign.startsWith('ACCSP'))) {
                if (!station.callsign.endsWith('ATIS') && !station.callsign.endsWith('OBS'))
                    oldATClist.push(station.callsign);
            }
            //Check if new ATC logged on
            for (let i = 0; i < currentATClist.length; i++) {
                if (!oldATClist.find(station => station === currentATClist[i])) {
                    for (const guildSetting of guildData) {
                        const channel = client.channels.cache.get(guildSetting.channelID);
                        const atcOnlineEmbed = new discord_js_1.MessageEmbed()
                            .setColor('#00ff04')
                            .setFooter(config_json_1.mainFooter)
                            .setAuthor(`${currentATClist[i]} is online!`, client.user?.displayAvatarURL())
                            .setDescription(`**${onlineStations.data.controllers.find((controller) => controller.callsign === currentATClist[i]).name}** went online on position **${currentATClist[i]}**\n${moment_1.default(new Date()).utc().format('HH:mm')}z\nFrequency **${onlineStations.data.controllers.find((controller) => controller.callsign === currentATClist[i]).frequency}**`);
                        //@ts-ignore
                        channel?.send(atcOnlineEmbed);
                    }
                }
            }
            //Check if ATC logged off
            for (let j = 0; j < oldATClist.length; j++) {
                if (!currentATClist.find(station => station === oldATClist[j])) {
                    for (const guildSetting of guildData) {
                        const channel = client.channels.cache.get(guildSetting.channelID);
                        const atcOfflineEmbed = new discord_js_1.MessageEmbed()
                            .setColor('#ff0000')
                            .setFooter(config_json_1.mainFooter)
                            .setAuthor(`${oldATClist[j]} went offline!`, client.user?.displayAvatarURL())
                            .setDescription(`ATC station **${oldATClist[j]}** (${prevStations.result.controllers.find((controller) => controller.callsign === oldATClist[j]).name}) was closed!\n${moment_1.default(new Date()).utc().format('HH:mm')}z`);
                        //@ts-ignore
                        channel?.send(atcOfflineEmbed);
                    }
                }
            }
        }
    }, 1000 * 60);
}
exports.default = autoNotifyATC;
