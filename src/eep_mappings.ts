import { PlatformAccessory } from 'homebridge';
import { EnoceanSensorContext } from './enocean-sensor-context';
import { EnoceanSensorHomebridgePlatform } from './platform';
import { EEP_D2_14_41 } from './sensor-profiles/EEP_D2_14_41';
import { EEP_F6_10_00 } from './sensor-profiles/EEP_F6_10_00';

const EEPProfileMap = {
  'F6-10-00': EEP_F6_10_00,
  'D2-14-41': EEP_D2_14_41,
};

export type Keys = keyof typeof EEPProfileMap;

type EEPProfileTypes = typeof EEPProfileMap[Keys];

type ExtractInstanceType<T> = T extends new (platform: EnoceanSensorHomebridgePlatform, accessory: PlatformAccessory<EnoceanSensorContext>)
  => infer R ? R : never;

export class EEPProfileFactory {

  static createEEPProfile(
    platform: EnoceanSensorHomebridgePlatform,
    accessory: PlatformAccessory<EnoceanSensorContext>,
    k: Keys): ExtractInstanceType<EEPProfileTypes> {
    return new EEPProfileMap[k](platform, accessory);
  }
}