import {Component, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgClass, NgIf, UpperCasePipe} from '@angular/common';
import {ToggleComponent} from '../toggle/toggle.component';
import {SUPPORTED_LANGUAGES} from '../app.types';
import {AppService} from '../app.service';
import {EditorBoxModule} from './editor-box.module';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';

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
  @Input() autofocus = false;
  private current_value = '';
  private editor!: editor.IStandaloneCodeEditor;

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

  public onInit(initialized_editor: editor.IStandaloneCodeEditor): void {
    this.editor = initialized_editor;
    this.maybeAutofocus();
  }

  private maybeAutofocus(): void {
    if(!this.autofocus){
      return;
    }

    this.editor.focus();
    const ranges = this.editor.getVisibleRanges();

    this.editor.setSelection({
      ...ranges[0],
      ...{
        startLineNumber: ranges[0].endLineNumber,
        startColumn: ranges[0].endColumn
      }
    });
  }
}
