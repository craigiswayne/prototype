import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CODE_OBJECT} from '../app.types';
import {AppService} from '../app.service';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-preview',
  standalone: true,
  templateUrl: './preview.component.html',
  imports: [
    NgStyle
  ],
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements AfterViewInit {

  @Input() show_mask = false;
  @ViewChild('iframe') iframe?: ElementRef<HTMLIFrameElement>;

  public full_code = '';

  private preview_document?: Document | null;
  private current_code: CODE_OBJECT = {
    html: '',
    css: '',
    javascript: ''
  }

  constructor(private readonly app_service: AppService) {}

  public ngAfterViewInit(): void {
    this.app_service.$code_object.subscribe(res => {
      this.render(res);
    });
  }

  public render(code: CODE_OBJECT): void {

    if(!this.iframe){
      return;
    }

    this.preview_document = this.preview_document || this.iframe.nativeElement.contentDocument;
    if(!this.preview_document){
      return;
    }

    this.current_code = {...this.current_code, ...code};
    const styles = this.current_code.css ? `<style>${this.current_code.css}</style>` : '';
    const scripts = this.current_code.javascript ? `<script>${this.current_code.javascript}</script>` : '';
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
           ${this.current_code.html}
        </body>
    </html>`;

    this.preview_document.open();
    this.preview_document.write(this.full_code);
    this.preview_document.close();
  }
}