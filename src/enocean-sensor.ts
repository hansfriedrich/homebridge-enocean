import { PlatformAccessory } from 'homebridge';
import { EventEmitter } from 'stream';
import { EEPProfile } from './abstract-eep-profile';
import { EEPProfileFactory } from './eep_mappings';
import { EnoceanSensorContext } from './enocean-sensor-context';
import { EnoceanSensorHomebridgePlatform } from './platform';

export class EnoceanSensor {

  public readonly eepProfile : EEPProfile;

  constructor(
    public platform: EnoceanSensorHomebridgePlatform,
    public accessory: PlatformAccessory<EnoceanSensorContext>,
    private events: EventEmitter,
  ) {
    const eepId = accessory.context.eepProfileId;
    this.eepProfile = EEPProfileFactory.createEEPProfile(platform, accessory, eepId);
    //this.accessory.context.eepProfile = eepProfile;
    this.platform.log.debug('device with id ', accessory.context.id, 'is listing');
    this.events.on(accessory.context.id, (telegram) => this.eepProfile.on_message(telegram));
  }
}
export { EEPProfile };

