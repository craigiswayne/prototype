import {Injectable, isDevMode} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  public info(message: string, data: any): void {
    console.info(message, data);
  }
  public debug(message: string, data: any): void {
    if(!isDevMode()){
      return
    }
    console.info(message, data);
  }
}
