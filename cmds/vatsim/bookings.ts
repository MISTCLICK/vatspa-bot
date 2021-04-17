import axios from 'axios';
import parser from 'xml2json';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class BookingsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'bookings',
      description: 'Ver reservas de VATSPA.',
      memberName: 'bookings',
      aliases: ['books'],
      group: 'vatsim',
    });
  }

  async run(message: CommandoMessage) {
    try {
      let res = await axios.get('http://vatbook.euroutepro.com/xml2.php');
      const xmlDoc: any = parser.toJson(res.data, { object: true });
      
      let firstText = '**Posicion / Controlador / Hora Inicio / Hora Fin**```\n';

      for (const booking of xmlDoc.bookings.atcs.booking.filter((book: any) => book.callsign.startsWith('LE') || book.callsign.startsWith('GC'))) {
        firstText += `${booking.callsign} | ${booking.name} ${booking.cid} | ${booking.time_start} | ${booking.time_end}\n`;
      }

      let finText = '';
      let otherFinText = '```';

      let allLines = firstText.split('\n');
      for (const line of allLines) {
        if (finText.length + line.length < 1995) {
          finText += `${line}\n`;
        } else {
          otherFinText += `${line}\n`;
        }
      }

      finText += '```';
      otherFinText += '```';

      message.channel.send(finText);
      return message.channel.send(otherFinText);
    } catch (err) {
      console.error(err);
      return message.reply('ERROR!')
    }
  }
}