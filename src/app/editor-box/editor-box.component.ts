import {Component, HostBinding, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {ToggleComponent} from '../toggle/toggle.component';
import {SUPPORTED_LANGUAGES} from '../app.types';
import {AppService} from '../app.service';

@Component({
  selector: 'app-editor-box',
  standalone: true,
  imports: [
    NgClass,
    ToggleComponent
  ],
  templateUrl: './editor-box.component.html',
  styleUrl: './editor-box.component.scss'
})
export class EditorBoxComponent {
  @Input() language: SUPPORTED_LANGUAGES = 'HTML';
  @HostBinding('class.collapsed') collapsed: boolean = false;

  private current_value: string = '';

  constructor(private readonly app_service: AppService) {}

  public trigger_change(value: string): void {

    // make sure it is a different value
    if(this.current_value === value){
      return;
    }

    this.current_value = value;

    this.app_service.$code_object.next({
      [this.language]: this.current_value
    })
  }
}
