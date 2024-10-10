import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CODE_OBJECT} from './app.types';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public resizing = false;

  public $code_object = new ReplaySubject<CODE_OBJECT>(3);

  constructor() {
      this.$code_object.pipe( $obs => {
        return $obs;
      })
  }

  public update_editor_width(pixels: number): void {
    const dynamic_styles_id = 'dynamic_styles'
    let dynamic_styles_tag = document.querySelector(`#${dynamic_styles_id}`);
    if(!dynamic_styles_tag){
      dynamic_styles_tag = document.createElement('style');
      document.body.appendChild(dynamic_styles_tag);
    }
    dynamic_styles_tag.innerHTML = `:root { --width-editor: ${pixels}px; }`
  }
}
