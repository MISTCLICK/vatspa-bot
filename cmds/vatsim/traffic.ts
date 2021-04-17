import axios from 'axios';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class TrafficCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'traffic',
      description: 'Provides traffic information for given airport.',
      memberName: 'traffic',
      aliases: ['trfc'],
      group: 'vatsim',
      argsType: 'multiple',
    });
  }

  async run(message: CommandoMessage, args: string[]) {
    let onlineStations = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');
    if (args && args.length === 1 && args[0].length === 4) {
      const departureCount = onlineStations.data.pilots.filter((p: any) => p.flight_plan && p.flight_plan.departure === args[0].toUpperCase()).length;
      const arrivalCount = onlineStations.data.pilots.filter((p: any) => p.flight_plan && p.flight_plan.arrival === args[0].toUpperCase()).length;
  
      return message.reply(`Current traffic at ${args[0].toUpperCase()}:\n\`Departures: ${departureCount}\`\n\`Arrivals: ${arrivalCount}\`\n\`Total: ${departureCount + arrivalCount}\``);
    } else {
      const flightFilter = (p: any) => p.flight_plan && (p.flight_plan.departure.startsWith('LE') || p.flight_plan.departure.startsWith('GC') || p.flight_plan.arrival.startsWith('GC') || p.flight_plan.arrival.startsWith('LE'));
      const filteredPilotFlightPlans = onlineStations.data.pilots.filter(flightFilter);

      let airportList: string[] = [];
      for (const pilot of filteredPilotFlightPlans) {
        if (!airportList.some((apt) => apt === pilot.flight_plan?.departure)) airportList.push(pilot.flight_plan?.departure);
        if (!airportList.some((apt) => apt === pilot.flight_plan?.arrival)) airportList.push(pilot.flight_plan?.arrival);
      }

      let fullAptList = [];
      for (const apt of airportList.filter(airport => airport.startsWith('LE') || airport.startsWith('GC'))) {
        const departureCount = onlineStations.data.pilots.filter((p: any) => p.flight_plan && p.flight_plan.departure === apt).length;
        const arrivalCount = onlineStations.data.pilots.filter((p: any) => p.flight_plan && p.flight_plan.arrival === apt).length;
        const totalCount = departureCount + arrivalCount;
        fullAptList.push({
          icao: apt,
          departureCount,
          arrivalCount,
          totalCount
        });
      }

      fullAptList.sort((a, b) => b.totalCount - a.totalCount);
      let finalText = '*Busiest airports in VATSPA airspace:*\n**ICAO / Sal / Lleg  / Total**```\n';
      let outLength = fullAptList.length >= 10 ? 9 : fullAptList.length;

      for (let i = 0; i < outLength; i++) {
        finalText += `${fullAptList[i].icao} | ${fullAptList[i].departureCount} | ${fullAptList[i].arrivalCount} | ${fullAptList[i].totalCount}\n`;
      }

      finalText += '```';

      return message.channel.send(finalText);
    }
  }
}