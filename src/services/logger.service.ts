import {Injectable, isDevMode} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  public info(message: string, data: object): void {
    console.info(message, data);
  }
  public debug(message: string, data: object): void {
    if(!isDevMode()){
      return
    }
    this.info(message, data);
  }
}
