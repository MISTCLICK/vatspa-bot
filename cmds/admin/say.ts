import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class SayCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'say',
      group: 'admin',
      memberName: 'say',
      description: 'Allows to say something as a bot in any channel!',
      guildOnly: true,
      userPermissions: ["MANAGE_MESSAGES"],
      argsType: 'multiple'
    });
  }

  //@ts-ignore
  async run(message: CommandoMessage, args: any) {
    const channel = message.mentions.channels.first();
    if (channel) {
      channel?.send(args.join(' ').replace(`<#${channel.id}>`, '').trim());
    } else {
      message.channel.send(args);
    }
  }
}