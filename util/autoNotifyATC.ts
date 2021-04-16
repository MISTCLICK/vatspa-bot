import { CommandoClient } from "discord.js-commando";
import { mainColor, mainFooter } from '../config.json';
import axios from "axios";
import atcNotifyScript from '../schema/atcNotifySchema';
import OnlineATCscript from '../schema/OnlineATCschema';
import moment from "moment";
import { MessageEmbed } from "discord.js";

export default async function autoNotifyATC(client: CommandoClient) {
  setInterval(async () => {

    let onlineStations = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');

    const prevStations = await OnlineATCscript.findOne({ permanent: 0 });
    await OnlineATCscript.findOneAndUpdate({
      permanent: 0
    }, {
      result: onlineStations.data
    }, {
      upsert: true
    });

    const guildData = await atcNotifyScript.find();
    if (guildData === null) return;

    if (prevStations && prevStations.result.controllers.length !== onlineStations.data.controllers.length) {
      let currentATClist: string[] = [];
      let oldATClist: string[] = [];
      for (const station of onlineStations.data.controllers.filter(({ callsign }: any) => callsign.match(/^LE.+_.+$|^GC.+_.+$|^ACCSP.+$/))) {
        if (!station.callsign.endsWith('ATIS') && !station.callsign.endsWith('OBS')) currentATClist.push(station.callsign);
      }
      for (const station of prevStations.result.controllers.filter(({ callsign }: any) => callsign.match(/^LE.+_.+$|^GC.+_.+$|^ACCSP.+$/))) {
        if (!station.callsign.endsWith('ATIS') && !station.callsign.endsWith('OBS')) oldATClist.push(station.callsign);
      }

      //Check if new ATC logged on
      for (let i = 0; i < currentATClist.length; i++) {
        if (!oldATClist.find(station => station === currentATClist[i])) {
          for (const guildSetting of guildData) {
            const channel = client.channels.cache.get(guildSetting.channelID);

            const atcOnlineEmbed = new MessageEmbed()
              .setColor('#00ff04')
              .setFooter(mainFooter)
              .setAuthor(`${currentATClist[i]} está online!`, client.user?.displayAvatarURL())
              .setDescription(`**${onlineStations.data.controllers.find((controller: any) => controller.callsign === currentATClist[i]).name}** se conectó en la posición **${currentATClist[i]}**\n${moment(new Date()).utc().format('HH:mm')}z\nFrecuencia **${onlineStations.data.controllers.find((controller: any) => controller.callsign === currentATClist[i]).frequency}**`)

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

            const atcOfflineEmbed = new MessageEmbed()
              .setColor('#ff0000')
              .setFooter(mainFooter)
              .setAuthor(`${oldATClist[j]} está offline!`, client.user?.displayAvatarURL())
              .setDescription(`Posición ATC **${oldATClist[j]}** (${prevStations.result.controllers.find((controller: any) => controller.callsign === oldATClist[j]).name}) se cerró!\n${moment(new Date()).utc().format('HH:mm')}z`)

            //@ts-ignore
            channel?.send(atcOfflineEmbed);
          }
        }
      }
    }
  }, 1000 * 60);
}