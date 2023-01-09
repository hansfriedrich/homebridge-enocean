import { UnknownContext } from 'homebridge';
import { Keys } from './eep_mappings';
import { EnoceanSensor } from './enocean-sensor';


export interface EnoceanSensorContext extends UnknownContext{
    eepProfileId: Keys;
    //eepProfile : EEPProfile;
    sensor: EnoceanSensor;
    id: string;
}