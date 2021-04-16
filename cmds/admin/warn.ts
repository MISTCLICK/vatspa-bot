import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import warnScript from '../../schema/warnScript';

export = class WarnCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'warn',
      group: 'admin',
      memberName: 'warn',
      description: 'Allows you to warn a user.',
      clientPermissions: ["ADMINISTRATOR"],
      userPermissions: ["MANAGE_MESSAGES"],
      argsType: "multiple",
      guildOnly: true
    });
  }

  //@ts-ignore
  async run(message: CommandoMessage, args: string[]) {
    const targetMember = message.mentions.users.first();
    if (!targetMember) return;
    args.shift();
    const reason = args.join(' ');
    const guildID = message.guild.id;
    const userID = targetMember.id;
    if (reason == '') return message.reply('Please provide a reason.');
    const warn = {
      author: message.author.id,
      timeStamp: new Date().getTime(),
      reason
    }

    await warnScript.findOneAndUpdate({
      guildID,
      userID
    }, {
      guildID,
      userID,
      $push: {
        warns: warn
      }
    }, {
      upsert: true
    });

    targetMember.send(`Hi! Moderator **${message.author.username}** has issued a warning to you on **${message.guild.name}** for: \`${reason}\``);
    message.reply(`Warning to ${targetMember} was successfully issued! Reason: ${reason}`);
  }
}