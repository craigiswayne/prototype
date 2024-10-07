import {Component, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgClass, NgIf, UpperCasePipe} from '@angular/common';
import {ToggleComponent} from '../toggle/toggle.component';
import {SUPPORTED_LANGUAGES} from '../app.types';
import {AppService} from '../app.service';
import {EditorBoxModule} from './editor-box.module';

@Component({
  selector: 'app-editor-box',
  standalone: true,
  imports: [
    NgClass,
    ToggleComponent,
    EditorBoxModule,
    NgIf,
    UpperCasePipe
  ],
  templateUrl: './editor-box.component.html',
  styleUrl: './editor-box.component.scss'
})
export class EditorBoxComponent implements OnChanges {
  @Input() language!: SUPPORTED_LANGUAGES;
  @HostBinding('class.collapsed') collapsed = false;

  /**
   * @link https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html
   */
  public editorOptions?: { language: SUPPORTED_LANGUAGES, minimap: { enabled: boolean } };
  @Input() code = '';
  private current_value = '';

  constructor(private readonly app_service: AppService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.editorOptions = {
      language: changes['language'].currentValue,
      minimap: {
        enabled: false
      }
    }

    if(changes['code']){
      this.trigger_change(changes['code'].currentValue);
    }
  }

  public trigger_change(value: string): void {
    // make sure it is a different value
    if (this.current_value === value) {
      return;
    }

    this.app_service.$code_object.next({
      [this.language]: this.current_value = value
    })
  }
}
