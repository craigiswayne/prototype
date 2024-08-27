import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {CODE_OBJECT} from './app.types';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public $code_object = new BehaviorSubject<CODE_OBJECT>({});

  constructor() {
      this.$code_object.pipe( $obs => {
        return $obs;
      })
  }
}
