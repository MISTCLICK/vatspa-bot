import { MessageCollector, MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { mainColor, mainFooter } from '../../config.json';

export default class AnnounceCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'announce',
      group: 'admin',
      memberName: 'announce',
      description: 'Anunciar algo',
      guildOnly: true,
      aliases: ['ann'],
      userPermissions: ["MANAGE_CHANNELS"]
    });
  }

  async run(message: CommandoMessage) {
    const questions = [
      'Introduce el titulo del anuncio. En cualquier momento puedes escribir `-` y el proceso se parará.',
      'Introduce el link para el titulo del anuncio.',
      'Introduce el texto del anuncio.',
      'Introduce un link para la imagen del anuncio. Si no quieres poner ninguna imagen, escribe `N`.'
    ];
    let counter = 0;
    const filter = (m: CommandoMessage) => m.author.id === message.author.id;
    //@ts-ignore
    const collector = new MessageCollector(message.channel, filter, {
      max: questions.length,
      time: 1000 * 600
    });

    message.channel.send(questions[counter++]);
    collector.on('collect', async (m: CommandoMessage) => {
      if (m.content === '-') {
        collector.emit('end');
        return message.reply('Proceso de creación de anuncio parado.');
      } else if (counter < questions.length) {
        m.channel.send(questions[counter++]);
      }
    });

    collector.on('end', async (collected) => {
      if (collected == null) return;
      const collectedArr = collected.array();
      if (collectedArr[0].content == '-' || collectedArr[1].content == '-' || collectedArr[2].content == '-' || collectedArr[3].content == '-') {
        return;
      } else if (collectedArr.length < questions.length) {
        return message.reply('No hay información suficiente.');
      }

      const title = collectedArr[0].content;
      const titleURL = collectedArr[1].content;
      const description = collectedArr[2].content;
      let imageURL = 'http://veuroexpress.org';
      if (collectedArr[3].content !== 'N' && collectedArr[3].content !== 'n') imageURL = collectedArr[3].content;

      const embed = new MessageEmbed()
        .setColor(mainColor)
        .setAuthor(title, this.client.user?.displayAvatarURL(), titleURL)
        .setDescription(description)
        .setImage(imageURL)
        .setFooter(mainFooter)

      await message.channel.send(embed);
      message.channel.send('Esta es la vista previa de tu anuncio. Escribe `+` para publicarlo o  `-` para cancelarlo. **Si decides continuar con la publicación, no podrás revertir o parar esta acción!**');
      message.channel.awaitMessages(filter, { max: 1, time: 1000 * 30, errors: [ 'time' ] })
        .then(async (messages) => {
          if (messages.first()?.content == '+') {
            const questions2 = [
              'Etiqueta a los roles que serán notificados.',
              'Escribe el canal donde se publicará el anuncio.',
          ];
            counter = 0;
            //@ts-ignore
            const collector2 = new MessageCollector(message.channel, filter, {
              max: questions2.length,
              time: 1000 * 120
            });

            message.channel.send(questions2[counter++]);
            collector2.on('collect', async (m: CommandoMessage) => {
              if (counter < questions2.length) {
                m.channel.send(questions2[counter++]);
              }
            });

            collector2.on('end', async collected2 => {
              const collected2Arr = collected2.array();
              if (collected2Arr.length < questions2.length) {
                return message.reply('No hay suficiente información.');
              }

              const unEmbed = collected2Arr[0].content;
              const channelID = collected2Arr[1].content.slice(2, -1);
              const channel: any = this.client.channels.cache.get(channelID);

              const finalEmbed = new MessageEmbed()
                .setColor(mainColor)
                .setAuthor(title, this.client.user?.displayAvatarURL(), titleURL)
                .setDescription(description)
                .setImage(imageURL)
                .setFooter(mainFooter)
              
              channel.send(unEmbed, finalEmbed).catch(console.error);
              message.reply('Anuncio publicado correctamente!');
            });
          } else if (messages.first()?.content == '-') {
            return message.reply('Proceso cancelado.');
          } else {
            return message.reply('Respuesta incorrecta. Proceso cancelado.');
          }
        }).catch(() => { 
          return message.reply('No hay suficiente información.');
        });
    });
    return null;
  }
}