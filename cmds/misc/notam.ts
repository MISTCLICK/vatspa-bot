import Commando, { CommandoClient, CommandoMessage } from 'discord.js-commando';
import axios from 'axios';
import { notamkey, mainColor, mainFooter } from '../../config.json';
import { MessageEmbed } from 'discord.js';

export default class NOTAMcommand extends Commando.Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'notam',
      group: 'misc',
      memberName: 'notam',
      description: 'Comando para obtener los NOTAMs de un aeropuerto.',
      args: [
        {
          key: 'airport',
          prompt: "De que aeropuerto quieres ver los NOTAMs?",
          type: 'string',
          validate: (text: string) => text.length === 4
        }
      ],
      argsCount: 1,
      examples: ['!notam LEGE']
    });
  }

  async run(message: CommandoMessage, args: any) {
    let getNOTAM = async () => {
      let airportString = args.airport;
      let airportCode = airportString.toUpperCase();
      let NOTAMURL = `https://applications.icao.int/dataservices/api/notams-realtime-list?api_key=${notamkey}&format=&criticality=&locations=${airportCode}`;
      let notams = await axios.get(NOTAMURL);
      return notams;
    }
    let notamValue = await getNOTAM().catch(() => null);
    //@ts-ignore
    for (const notam of notamValue.data) {
      const notamember = new MessageEmbed()
      .setColor(mainColor)
      .setAuthor(`NOTAM para ${args.airport.toUpperCase()}`, this.client.user?.displayAvatarURL(), 'http://veuroexpress.org')
      .setDescription(notam.all)
      .setFooter(mainFooter, this.client.user?.displayAvatarURL())

      message.author.send(notamember);
    }

    //@ts-ignore
    if (notamValue.data[0].all) {
      message.reply('te he mandado un chat privado con la información.');
    }

    return null;
  }
}