import { MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { mainColor, mainFooter } from '../../config.json';

export default class MetarCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'info',
      description: 'Informacion del bot!',
      memberName: 'info',
      group: 'misc',
      aliases: ['i'],

    });
  }

  async run(message: CommandoMessage,) {
    const embed = new MessageEmbed()
      .setColor(mainColor)
      .setFooter(mainFooter)
      .setDescription("Version 1.0\n\n **What is my purpose?**\n\n The purpose of this bot is to provide useful information to this server's members and help staff manage it. Use !help to find out what I can do.\n\n **About the project.**\n\n This bot is custom-made by <@349553169035952140> and <@532316313310199818>\n The bot is written in JavaScript.\n\n **Bug to report?**\n\n Report any bug by messaging the staff.\n\n **Author**\n\n <@349553169035952140> and <@532316313310199818>\n *Currently running in a stable server environment.*")
      .setAuthor('Information about this bot', this.client.user?.displayAvatarURL(), 'https://github.com/MISTCLICK/')

    return message.reply(embed);
  }
}
