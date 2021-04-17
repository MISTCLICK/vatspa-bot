import axios from 'axios';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class OnlineATCcommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'online',
      group: 'vatsim',
      description: 'Allows to display online ATC in VATSPA.',
      memberName: 'online',
      aliases: ['online-atc', 'atc'],
    });
  }

  decimalTimeToFormat(val: number): string {
    let stringVal = val.toString();
    let splitVals = stringVal.split('.');

    let first = splitVals[0];
    let rawSecond = Math.round((parseInt(splitVals[1]) * 60) / 100) || 0;
    let second = rawSecond < 10 ? `0${rawSecond}` : rawSecond;
    return `${first}:${second}`;
  }

  makeAtcList(stations: any[]) {
    let finalString = `*Online ATC in VATSPA:*\n**Callsign / Controller name / Frequency / Rating / Online time**\`\`\`\n`;
    let additionalString = '```';

    for (const station of stations) {
      let timeOnline = parseFloat(((new Date().getTime() - new Date(station.logon_time).getTime()) / 3600000).toFixed(2));
      let trueTimeOnline = this.decimalTimeToFormat(timeOnline);
      let stationRating = station.rating.toString()
        .replace('-1', 'Inactive')
        .replace('0', 'Suspended')
        .replace('1', 'OBS')
        .replace('2', 'S1')
        .replace('3', 'S2')
        .replace('4', 'S3')
        .replace('5', 'C1')
        .replace('6', 'C2')
        .replace('7', 'C3')
        .replace('8', 'I1')
        .replace('9', 'I2')
        .replace('10', 'I3')
        .replace('11', 'SUP')
        .replace('12', 'ADM')
      let stationLine = `${station.callsign} | ${station.name} ${station.cid} | ${station.frequency} | ${stationRating} | ${trueTimeOnline}\n`;

      if (finalString.length + stationLine.length < 1995) {
        finalString += stationLine;
      } else {
        additionalString += stationLine;
      }
    }

    finalString += '```';
    additionalString += '```';

    return [finalString, additionalString];
  }

  async run(message: CommandoMessage) {
    let onlineStations = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');

    const stationFilter = (station: any) => station.callsign.startsWith('LE') || station.callsign.startsWith('GC') || station.callsign.startsWith('ACCSP');
    const filteredStations = onlineStations.data.controllers.filter(stationFilter);

    if (filteredStations.length < 1) return message.reply('Sadly, no ATC in VATSPA is online right now... :(');

    const stringsList = this.makeAtcList(filteredStations);

    message.channel.send(stringsList[0]);
    if (stringsList[1].length > 6) message.channel.send(stringsList[1]);
    return null;
  }
}