import {NgModule} from '@angular/core';
import {MonacoEditorModule, NgxMonacoEditorConfig} from 'ngx-monaco-editor-v2';
import {FormsModule} from '@angular/forms';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets',
  defaultOptions: {
    scrollBeyondLastLine: false,
    automaticLayout: true
  },
  requireConfig: { preferScriptTags: true },
  // @ts-expect-error not sure how to use global window objects
  monacoRequire: (window as unknown).monacoRequire
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
