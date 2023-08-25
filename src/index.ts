require('dotenv').config();
import 'reflect-metadata';
import { registerCommands, registerEvents } from './utils/registry';
import config from '../slappey.json';
import DiscordClient from './client/client';
import { GatewayIntentBits } from 'discord.js';
import { DataSource } from 'typeorm';
import { GuildConfiguration } from './typeorm/entities/GuildConfiguration';
const client = new DiscordClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  entities: [GuildConfiguration]
});

(async () => {
  AppDataSource.initialize().then(() => { console.log("Data source is initialized!") }).catch((err) => { console.log("Error during data initialization!", err) });
  client.prefix = config.prefix || client.prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DJS_TOKEN);
})();