import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CODE_OBJECT} from './app.types';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public $code_object = new ReplaySubject<CODE_OBJECT>(3);

  constructor() {
      this.$code_object.pipe( $obs => {
        return $obs;
      })
  }
}
