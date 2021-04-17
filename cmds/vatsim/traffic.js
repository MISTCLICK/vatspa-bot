"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_js_commando_1 = require("discord.js-commando");
class TrafficCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'traffic',
            description: 'Da información de traficos en un aeropuerto.',
            memberName: 'traffic',
            aliases: ['trfc'],
            group: 'vatsim',
            argsType: 'multiple',
        });
    }
    async run(message, args) {
        let onlineStations = await axios_1.default.get('https://data.vatsim.net/v3/vatsim-data.json');
        if (args && args.length === 1 && args[0].length === 4) {
            const departureCount = onlineStations.data.pilots.filter((p) => p.flight_plan && p.flight_plan.departure === args[0].toUpperCase()).length;
            const arrivalCount = onlineStations.data.pilots.filter((p) => p.flight_plan && p.flight_plan.arrival === args[0].toUpperCase()).length;
            return message.reply(`Trafico actual en ${args[0].toUpperCase()}:\n\`Salidas: ${departureCount}\`\n\`Llegadas: ${arrivalCount}\`\n\`Total: ${departureCount + arrivalCount}\``);
        }
        else {
            const flightFilter = (p) => p.flight_plan && (p.flight_plan.departure.startsWith('LE') || p.flight_plan.departure.startsWith('GC') || p.flight_plan.arrival.startsWith('GC') || p.flight_plan.arrival.startsWith('LE'));
            const filteredPilotFlightPlans = onlineStations.data.pilots.filter(flightFilter);
            let airportList = [];
            for (const pilot of filteredPilotFlightPlans) {
                if (!airportList.some((apt) => apt === pilot.flight_plan?.departure))
                    airportList.push(pilot.flight_plan?.departure);
                if (!airportList.some((apt) => apt === pilot.flight_plan?.arrival))
                    airportList.push(pilot.flight_plan?.arrival);
            }
            let fullAptList = [];
            for (const apt of airportList.filter(airport => airport.startsWith('LE') || airport.startsWith('GC'))) {
                const departureCount = onlineStations.data.pilots.filter((p) => p.flight_plan && p.flight_plan.departure === apt).length;
                const arrivalCount = onlineStations.data.pilots.filter((p) => p.flight_plan && p.flight_plan.arrival === apt).length;
                const totalCount = departureCount + arrivalCount;
                fullAptList.push({
                    icao: apt,
                    departureCount,
                    arrivalCount,
                    totalCount
                });
            }
            fullAptList.sort((a, b) => b.totalCount - a.totalCount);
            let finalText = '*Aeropuertos con más trafico en ESP:*\n**ICAO / Sal / Lleg  / Total**```\n';
            let outLength = fullAptList.length >= 10 ? 9 : fullAptList.length;
            for (let i = 0; i < outLength; i++) {
                finalText += `${fullAptList[i].icao} | ${fullAptList[i].departureCount} | ${fullAptList[i].arrivalCount} | ${fullAptList[i].totalCount}\n`;
            }
            finalText += '```';
            return message.channel.send(finalText);
        }
    }
}
exports.default = TrafficCommand;
