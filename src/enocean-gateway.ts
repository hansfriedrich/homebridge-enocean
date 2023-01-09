import * as EnOcean from 'enocean-core';
import { Logger, PlatformConfig } from 'homebridge';
import { EventEmitter } from 'stream';

export class EnoceanGateway {

  private gateway? : EnOcean.Gateway;
  public events: EventEmitter;

  constructor(config: PlatformConfig, log: Logger){
    this.events = new EventEmitter();
    log.debug('configuring gateway with ', config);

    try{
      this.gateway = EnOcean.Gateway.connectToSerialPort(config.device);
      config.accessories.forEach((accessory_config) => {
        this.gateway?.teachDevice(
          EnOcean.DeviceId.fromString(accessory_config.id),
          EnOcean.EEPId.fromString(accessory_config.eep),
        );
      });

      this.gateway.onReceivedERP1Telegram((telegram) => {
        const sender = telegram.sender.toString();
        this.events.emit(sender, telegram);
      });
    } catch (e){
      log.error('error occured while loading enocean device', e);
    }
  }

  close(): void {
    //TODO: gracefully shut down Serial Port
  }

}