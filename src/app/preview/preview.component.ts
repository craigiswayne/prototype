import {Component, ElementRef, ViewChild} from '@angular/core';
import {CODE_OBJECT} from '../app.types';
import {AppService} from '../app.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  @ViewChild('iframe') iframe?: ElementRef<HTMLIFrameElement>;
  private current_code: CODE_OBJECT = {
    HTML: '',
    CSS: '',
    JAVASCRIPT: ''
  }

  public full_code: string = '';

  constructor(private readonly app_service: AppService) {
    this.app_service.$code_object.subscribe(code_object => {
      this.render(code_object);
    })
  }


  public render(code: CODE_OBJECT): void {

    if(!this.iframe){
      return;
    }

    const native_element = this.iframe.nativeElement;
    const preview_document = native_element.contentDocument;
    if(!preview_document){
      return;
    }

    this.current_code = {...this.current_code, ...code};

    this.full_code = `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>${this.current_code.CSS}</style>
            <script>${this.current_code.JAVASCRIPT}</script>
        </head>
        <body>
            ${this.current_code.HTML}
        </body>
    </html>`;

    preview_document.open();
    preview_document.write(this.full_code);
    preview_document.close();
  }
}
