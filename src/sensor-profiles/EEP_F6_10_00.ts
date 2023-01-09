import { ERP1Telegram } from 'enocean-core';
import { PlatformAccessory } from 'homebridge';
import { EEPProfile } from '../enocean-sensor';
import { EnoceanSensorContext } from '../enocean-sensor-context';
import { EnoceanSensorHomebridgePlatform } from '../platform';

export class EEP_F6_10_00 extends EEPProfile {

  constructor(platform: EnoceanSensorHomebridgePlatform, accessory: PlatformAccessory<EnoceanSensorContext>) {
    super(platform, accessory, [platform.Service.ContactSensor]);

  }

  on_message(telegram: ERP1Telegram) {
    const service = this.accessory.getService(this.platform.Service.ContactSensor)
    || this.accessory.addService(this.platform.Service.ContactSensor);
    const data = telegram.userData.readUInt8() >>> 4;
    if (data === 0b1111) {
      this.platform.log.debug('closed');
      service.updateCharacteristic(
        this.platform.Characteristic.ContactSensorState,
        this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED);
    }
    if (data === 0b1101) {
      this.platform.log.debug('kipp');
      service.updateCharacteristic(
        this.platform.Characteristic.ContactSensorState,
        this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED,
      );
    }
    if (data === 0b1100 || data === 0b1110) {
      this.platform.log.debug('open');
      service.updateCharacteristic(
        this.platform.Characteristic.ContactSensorState,
        this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED,
      );
    }
  }
}