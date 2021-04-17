import axios from 'axios';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

interface thisArgs {
  airport: string;
}

export default class MetarCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'metar',
      description: 'Devuelve el metar de un aeropuerto.',
      memberName: 'metar',
      group: 'misc',
      aliases: ['m'],
      args: [{
        key: 'airport',
        type: 'string',
        default: '',
        prompt: 'Porfavor, escribe el codigo ICAO del aeropuerto a consultar.'
      }]
    });
  }

  async run(message: CommandoMessage, { airport }: thisArgs) {
    try {
      if (airport.length !== 4) return message.reply('Porfavor, escribe el codigo ICAO del aeropuerto a consultar.');
      let metar = await axios.get(`https://metar.vatsim.net/${airport.toUpperCase()}`);
      return message.reply('```' + metar.data + '```');
    } catch (err) {
      return message.reply('Aeropuerto no encontrado!')
    }
  }
}