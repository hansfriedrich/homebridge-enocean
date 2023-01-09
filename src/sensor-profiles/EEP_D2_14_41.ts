import { ERP1Telegram } from 'enocean-core';
import { PlatformAccessory } from 'homebridge';
import { urlToHttpOptions } from 'url';
import { EEPProfile } from '../enocean-sensor';
import { EnoceanSensorContext } from '../enocean-sensor-context';
import { EnoceanSensorHomebridgePlatform } from '../platform';

export class EEP_D2_14_41 extends EEPProfile {


  private temperature =0;
  private humidity =0;
  private illumination=0.001;

  constructor(platform: EnoceanSensorHomebridgePlatform, accesory: PlatformAccessory<EnoceanSensorContext>) {
    super(platform, accesory, [platform.Service.TemperatureSensor]);

    const temperatureSensorService = accesory.getService(platform.Service.TemperatureSensor)
    || accesory.addService(platform.Service.TemperatureSensor);
    (temperatureSensorService.getCharacteristic(platform.Characteristic.CurrentTemperature) ||
    temperatureSensorService.addCharacteristic(platform.Characteristic.CurrentTemperature))
      .onGet(() => this.temperature);

    const humidity_service = accesory.getService(platform.Service.HumiditySensor)
    || accesory.addService(platform.Service.HumiditySensor);
    (humidity_service.getCharacteristic(platform.Characteristic.CurrentRelativeHumidity) ||
    humidity_service.addCharacteristic(platform.Characteristic.CurrentRelativeHumidity))
      .onGet(()=>this.humidity);

    const illumination_service = accesory.getService(platform.Service.LightSensor)
    || accesory.addService(platform.Service.LightSensor);
    (illumination_service.getCharacteristic(platform.Characteristic.CurrentAmbientLightLevel) ||
      illumination_service.addCharacteristic(platform.Characteristic.CurrentAmbientLightLevel))
      .onGet(()=>this.illumination);
  }




  on_message(telegram: ERP1Telegram): void {
    const userData = telegram.userData;

    const temp_raw = (userData.readUInt8(0) << 2) + (userData.readUInt8(1) >>> 6);
    this.temperature = temp_raw/10 - 40;
    this.platform.log.debug('temperature: ', temp_raw/10 - 40, ' °C');

    const humidity_raw = ((userData.readUInt8(1) & 0x3F) << 2) + (userData.readUInt8(2) >>> 6);
    this.humidity = humidity_raw / 2;
    this.platform.log.debug('humidity: ', humidity_raw/2, ' %');

    const illumination_raw = ((userData.readUInt8(2) & 0x3F) << 11) + (userData.readUInt8(3) << 3) + (userData.readUInt8(4) >>> 5);
    this.illumination = illumination_raw+0.001;
    this.platform.log.debug('illumionation: ', illumination_raw, ' lx');

    const temp_service = this.accessory.getService(this.platform.Service.TemperatureSensor)
    || this.accessory.addService(this.platform.Service.TemperatureSensor);
    temp_service.updateCharacteristic(this.platform.Characteristic.CurrentTemperature, this.temperature);

    const humidiity_service = this.accessory.getService(this.platform.Service.HumiditySensor)
    || this.accessory.addService(this.platform.Service.HumiditySensor);
    humidiity_service.updateCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, this.humidity);

    const illumination_service = this.accessory.getService(this.platform.Service.LightSensor)
    || this.accessory.addService(this.platform.Service.LightSensor);
    illumination_service.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, this.illumination);
  }
}