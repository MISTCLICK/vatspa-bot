import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'; 

export = class BanCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'ban',
      group: 'admin',
      memberName: 'ban',
      description: 'Banear un usuario.',
      userPermissions: ['BAN_MEMBERS'],
      argsType: 'multiple'
    });
  }

  async run(message: CommandoMessage, args: String[]) {
    const target = message.mentions.users.first();
    if (!target) return message.reply('Usuario no encontrado.');
    args.shift();
    const reason = args.join(' ');
    if (reason == '') return message.reply('Por favor, especifica una razón');
    const targetMember = message.guild.members.cache.get(target.id);
    if (!targetMember) return message.reply('Usuario no encontrado.');
    await target.send(`Fuiste baneado de **${message.guild.name}** por un moderador **${message.author.username}** por: \`${reason}\``);
    targetMember.ban({ reason: reason });
    return message.reply(`${target.username} fue baneado.`);
  }
}