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
    /*this.editor.getModel()?.onDidChangeContent((ev) => {
      console.info('DEBUG: onDidChangeContent', ev);

      console.info('DEBUG: onDidChangeContent', {
        language: this.language
      });
    })
    this.editor.onEndUpdate(() => {
      console.info('DEBUG: onEndUpdate', {
        language: this.language
      });
    })
    this.editor.onDidChangeModel(() => {
      console.info('DEBUG: onDidChangeModel', {
        language: this.language
      });
    })
    this.editor.onDidChangeConfiguration((config: editor.ConfigurationChangedEvent) => {
      console.info('DEBUG: onDidChangeConfiguration', config);

      console.info('DEBUG: onDidChangeConfiguration', {
        language: this.language
      });
    })
    this.editor.onDidCompositionEnd((config) => {
      console.info('DEBUG: onDidCompositionEnd', config);
      console.info('DEBUG: onDidCompositionEnd', {
        language: this.language
      });
    })
    this.editor.onDidChangeModelContent(() => {
      console.info('DEBUG: onDidChangeModelContent', {
        language: this.language
      });
    })*/
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

  private maybeFormatCode(): void {
    const action = this.editor.getAction('editor.action.formatDocument');
    if(!action?.isSupported()){
      return;
    }

    action.run();
    // setTimeout(() => {
    //   if(action){
    //     // action.run();
    //     console.info('DEBUG: formatting stuff', {
    //       language: this.language
    //     });
    //   }
    // }, 1000)
  }
}
