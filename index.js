"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = __importDefault(require("discord.js-commando"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const autoNotifyATC_1 = __importDefault(require("./util/autoNotifyATC"));
const config_json_1 = require("./config.json");
const client = new discord_js_commando_1.default.CommandoClient({
    owner: ['349553169035952140'],
    commandPrefix: '!'
});
client.once('ready', async () => {
    if (!config_json_1.mongoURI)
        throw new Error('Bot error > No MongoDB URI provided');
    try {
        mongoose_1.default.connect(config_json_1.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('MongoDB connection successfully established.');
    }
    catch (err) {
        console.error('ERROR: MongoDB connection failed.');
        console.error(err);
    }
    //Automatic action functions
    autoNotifyATC_1.default(client);
    console.log(`${client.user?.username} is ready to perform their duties.`);
});
client.registry
    .registerDefaultTypes()
    .registerGroups([
    ['admin', 'Admin commands'],
    ['vatsim', 'VATSIM commands'],
    ['misc', 'Other commands']
])
    .registerDefaultGroups()
    .registerDefaultCommands({
    ping: false,
    unknownCommand: false,
    prefix: false
})
    .registerCommandsIn(path_1.default.join(__dirname, 'cmds'));
client.on('unknownCommand', m => console.log(`${m.author.username} tried to use an unknown command: "${m.content}"`));
client.login(config_json_1.token);
