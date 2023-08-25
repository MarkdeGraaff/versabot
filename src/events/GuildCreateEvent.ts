// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { AppDataSource } from "../index";
import { GuildConfiguration } from '../typeorm/entities/GuildConfiguration';

export default class GuildCreateEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository = AppDataSource.getRepository
      (GuildConfiguration)
  ) {
    super('guildCreate');
  }

  async run(client: DiscordClient, guild: Guild) {
    console.log(`Joined ${guild.name}`);

    const config = await this.guildConfigRepository.findOne({
      where: {
        guildId: guild.id,
      }
    })

    if (config) {
      console.log(`Config was found for ${guild.name}`);
    } else {
      console.log(`Config was NOT found. Creating...`);
      const newConfig = this.guildConfigRepository.create({
        guildId: guild.id,
      });
      console.log(`Config was created for ${guild.name}`);
      return this.guildConfigRepository.save(newConfig);
    }
  }
}