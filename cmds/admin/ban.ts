import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'; 

export = class BanCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'ban',
      group: 'admin',
      memberName: 'ban',
      description: 'Allows you to ban a user.',
      userPermissions: ['BAN_MEMBERS'],
      guildOnly: true,
      argsType: 'multiple'
    });
  }

  async run(message: CommandoMessage, args: String[]) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('User not found.');
    args.shift();
    const reason = args.join(' ');
    if (reason == '') return message.reply('Please provide a reason.');
    const targetMember = message.guild.members.cache.get(target.id);
    if (!targetMember) return message.reply('User not found.');
    await target.send(`You were banned from **${message.guild.name}** by a moderator **${message.author.username}** for: \`${reason}\``);
    targetMember.ban({ reason: reason });
    return message.reply(`${target.username} was successfully banned.`);
  }
}