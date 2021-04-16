import axios from 'axios';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

interface thisArgs {
  airport: string;
}

export default class MetarCommand extends Command {
  constructor(client: CommandoClient) {
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

  async run(message: CommandoMessage, { airport }: thisArgs) {
    try {
      if (airport.length !== 4) return message.reply('Please provide a 4 letter long ICAO code.');
      let metar = await axios.get(`https://metar.vatsim.net/${airport.toUpperCase()}`);
      return message.reply('```' + metar.data + '```');
    } catch (err) {
      return message.reply('Such airport was not found!')
    }
  }
}