import { ERP1Telegram } from 'enocean-core';
import { PlatformAccessory, Service, WithUUID } from 'homebridge';
import { EnoceanSensorContext } from './enocean-sensor-context';
import { EnoceanSensorHomebridgePlatform } from './platform';

export abstract class EEPProfile {

  protected platform: EnoceanSensorHomebridgePlatform;
  protected serviceList: Array<WithUUID<typeof Service>>;
  protected accessory: PlatformAccessory<EnoceanSensorContext>;

  constructor(
    platform: EnoceanSensorHomebridgePlatform,
    accessory: PlatformAccessory<EnoceanSensorContext>,
    serviceList: Array<WithUUID<typeof Service>>) {
    this.platform = platform;
    this.serviceList = serviceList;
    this.accessory = accessory;
  }

    abstract on_message(telegram: ERP1Telegram): void;
}