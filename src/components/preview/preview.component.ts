import {AfterViewInit, Component, ElementRef, inject, viewChild} from '@angular/core';
import {CODE_OBJECT} from '../../app/app.types';
import {AppService} from '../../app/app.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements AfterViewInit {

  private _iframe = viewChild<ElementRef<HTMLIFrameElement>>('iframe');

  public full_code = '';

  private _preview_document?: Document | null;
  private _current_code: CODE_OBJECT = {
    html: {
      value: '',
      options: []
    },
    css:  {
      value: '',
      options: []
    },
    javascript:  {
      value: '',
      options: []
    }
  }
  private _app_service = inject(AppService);

  public ngAfterViewInit(): void {
    this._app_service.$code_object.subscribe(res => {
      this.render(res);
    });
  }

  public force_refresh(): void {
    if(this._iframe() !== undefined){
      return;
    }

    this._preview_document = this._preview_document || this._iframe()!.nativeElement.contentDocument;
    if(!this._preview_document){
      return;
    }

    if(!this._iframe()!.nativeElement?.contentWindow){
      return;
    }

    this._iframe()!.nativeElement.contentWindow!.location.reload();
    this.render(this._current_code);
  }

  public render(code: CODE_OBJECT): void {

    if(!this._iframe){
      return;
    }

    this._preview_document = this._preview_document || this._iframe()!.nativeElement.contentDocument;
    if(!this._preview_document){
      return;
    }

    this._current_code = {...this._current_code, ...code};
    const styles = this._current_code.css?.value ? `<style>${this._current_code.css.value}</style>` : '';
    let scripts = '';
    if(this._current_code.javascript?.value){
      if(this._current_code.javascript?.options){
        console.log('options', this._current_code.javascript?.options);
      }
      scripts = `<script>${this._current_code.javascript.value}</script>`
    }
    this.full_code = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>My Prototype</title>
            ${styles}
            ${scripts}
        </head>
        <body>
           ${this._current_code.html?.value}
        </body>
    </html>`;

    this._preview_document.open();
    this._preview_document.write(this.full_code);
    this._preview_document.close();
  }
}
