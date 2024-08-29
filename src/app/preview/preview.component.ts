import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CODE_OBJECT} from '../app.types';
import {AppService} from '../app.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements AfterViewInit {

  @ViewChild('iframe') iframe?: ElementRef<HTMLIFrameElement>;

  public full_code: string = '';

  private preview_document?: Document | null;
  private current_code: CODE_OBJECT = {
    html: '',
    css: '',
    javascript: ''
  }

  constructor(private readonly app_service: AppService) {}

  ngAfterViewInit(): void {
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

    this.full_code = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>My Prototype</title>
            <style>${this.current_code.css}</style>
            <script>${this.current_code.javascript}</script>
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
