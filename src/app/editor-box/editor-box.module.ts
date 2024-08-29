import {NgModule} from '@angular/core';
import {MonacoEditorModule, NgxMonacoEditorConfig} from 'ngx-monaco-editor-v2';
import {FormsModule} from '@angular/forms';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets',
  defaultOptions: {
    scrollBeyondLastLine: false
  },
  requireConfig: { preferScriptTags: true },
  monacoRequire: (<any>window).monacoRequire
};

@NgModule({
  imports: [
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig)
  ],
  exports: [
    FormsModule,
    MonacoEditorModule
  ]
})
export class EditorBoxModule {}
