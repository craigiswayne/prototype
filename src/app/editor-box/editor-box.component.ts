import {Component, HostBinding, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgIf, UpperCasePipe} from '@angular/common';
import {SlideToggleComponent} from '../slide-toggle/slide-toggle.component';
import {SUPPORTED_LANGUAGES} from '../app.types';
import {AppService} from '../app.service';
import {EditorBoxModule} from './editor-box.module';
import {editor} from 'monaco-editor/esm/vs/editor/editor.api';
import {ColorSchemeSwitcherService} from "../color-scheme-switcher/color-scheme-switcher.service";
import {LoggerService} from "../logger.service";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

/**
 * @link https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html
 */
interface EditorOptions {
  language: SUPPORTED_LANGUAGES;
  minimap: {
    enabled: boolean
  };
  theme?: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
}

@Component({
  selector: 'app-editor-box',
  standalone: true,
  imports: [
    SlideToggleComponent,
    EditorBoxModule,
    NgIf,
    UpperCasePipe,
    ReactiveFormsModule
  ],
  templateUrl: './editor-box.component.html',
  styleUrl: './editor-box.component.scss'
})
export class EditorBoxComponent implements OnChanges {

  @Input() language!: SUPPORTED_LANGUAGES;
  @Input() @HostBinding('class.collapsed') collapsed = false;


  public editorOptions?: EditorOptions;
  @Input() code = '';
  @Input() autofocus = false;
  @Input() header_dropdown: string[] = [];
  private current_value = '';
  private editor!: editor.IStandaloneCodeEditor;
  private form_builder = inject(FormBuilder);
  public form = this.form_builder.group({
    header_dropdown: [this.header_dropdown[0], [Validators.required]]
  })

  constructor(private readonly app_service: AppService, private schemeService: ColorSchemeSwitcherService, private logger: LoggerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.editorOptions = {
      theme: this.schemeService.$behaviour.getValue() === 'light' ? 'vs' : 'vs-dark',
      language: changes['language'].currentValue,
      minimap: {
        enabled: false
      }
    }
    if(changes['code']){
      this.trigger_change(changes['code'].currentValue);
    }
    if(changes['header_dropdown']){
      this.form.patchValue({
        header_dropdown: changes['header_dropdown'].currentValue[0]
      })
    }
  }

  public trigger_change(value: string): void {
    // make sure it is a different value
    if (this.current_value === value) {
      return;
    }

    this.app_service.$code_object.next({
      [this.language]: {
        value: this.current_value = value,
        options: this.form.value
      }
    })
  }

  public onInit(initialized_editor: editor.IStandaloneCodeEditor): void {
    this.editor = initialized_editor;
    this.editor.getModel()?.onDidChangeContent((ev) => {
      this.logger.debug('onDidChangeContent', ev);

      this.logger.debug('onDidChangeContent', {
        language: this.language
      });
    })
    this.editor.onEndUpdate(() => {
      this.logger.debug('onEndUpdate', {
        language: this.language
      });
    })
    this.editor.onDidChangeModel(() => {
      this.logger.debug('onDidChangeModel', {
        language: this.language
      });
    })
    this.editor.onDidChangeConfiguration((config: editor.ConfigurationChangedEvent) => {
      this.logger.debug('onDidChangeConfiguration', config);

      this.logger.debug('onDidChangeConfiguration', {
        language: this.language
      });
    })
    this.editor.onDidCompositionEnd((config) => {
      this.logger.debug('onDidCompositionEnd', config);
      this.logger.debug('onDidCompositionEnd', {
        language: this.language
      });
    })
    this.editor.onDidChangeModelContent(() => {
      this.logger.debug('onDidChangeModelContent', {
        language: this.language
      });
    })
    // this.maybeAutofocus();
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
    //     this.logger.debug('formatting stuff', {
    //       language: this.language
    //     });
    //   }
    // }, 1000)
  }
}
