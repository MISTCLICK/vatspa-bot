"use strict";
const discord_js_commando_1 = require("discord.js-commando");
module.exports = class BanCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'admin',
            memberName: 'ban',
            description: 'Banear un usuario.',
            userPermissions: ['BAN_MEMBERS'],
            argsType: 'multiple'
        });
    }
    async run(message, args) {
        const target = message.mentions.users.first();
        if (!target)
            return message.reply('Usuario no encontrado.');
        args.shift();
        const reason = args.join(' ');
        if (reason == '')
            return message.reply('Por favor, especifica una razón');
        const targetMember = message.guild.members.cache.get(target.id);
        if (!targetMember)
            return message.reply('Usuario no encontrado');
        await target.send(`Fuiste baneado de **${message.guild.name}** por un moderador **${message.author.username}** por: \`${reason}\``);
        targetMember.ban({ reason: reason });
        return message.reply(`${target.username} fue baneado.`);
    }
};
