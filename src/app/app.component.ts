import {Component, ElementRef, HostListener, inject, isDevMode, OnInit, viewChild, ViewChild} from '@angular/core';
import {PreviewComponent} from '../components/preview/preview.component';
import {ToolbarComponent} from '../components/toolbar/toolbar.component';
import {ResizeBarComponent} from '../components/resize-bar/resize-bar.component';
import {CommonModule} from '@angular/common';
import {EditorBoxComponent} from '../components/editor-box/editor-box.component';
import {FullScreenToggleComponent} from '../components/full-screen-toggle/full-screen-toggle.component';
import {ColorSchemeSwitcherService} from '../services/color-scheme-switcher.service';

declare global {
  interface Window {
    monaco?: {
      editor: {
        setTheme: (theme: string) => void
      }
    }
  }
}

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, PreviewComponent, ToolbarComponent, ResizeBarComponent, EditorBoxComponent, FullScreenToggleComponent],
  templateUrl: './app.component.html',
  /**
   * Catch the Save action
   * @link https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
   * @link https://github.com/angular/angular/blob/35d7ca55b2141c7d9a3e86163e85dd883f60c171/adev/src/content/guide/templates/event-listeners.md?plain=1#L96
   **/
  host: {
    '(window:keydown.code.control.KeyS)': 'save_this_shit($event)',
    '(window:keydown.code.meta.KeyS)': 'save_this_shit($event)'
  },
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild(ToolbarComponent) toolbar!: ToolbarComponent;
  @ViewChild(EditorBoxComponent) first_box_component!: EditorBoxComponent;
  @ViewChild(PreviewComponent) preview_component!: PreviewComponent;

  private _scheme_service = inject(ColorSchemeSwitcherService);

  @HostListener('window:beforeunload', ['$event'])
  doSomething(event: BeforeUnloadEvent) {
    if(isDevMode()){
      return;
    }
    event.preventDefault();
    return 'All your work will be erased!';
  }

  private _download_link_ref = viewChild.required<ElementRef<HTMLAnchorElement>>('download_link');

  public ngOnInit():void  {
    this._scheme_service.$observable
      .subscribe(scheme => {
        const theme_to_use = scheme === 'light' ? 'vs-light' : 'vs-dark';

        if(undefined === window.monaco){
          return;
        }

        window.monaco.editor.setTheme(theme_to_use);
      })
  }

  public default_code = {
    html: `<h1>TODO:</h1>\n<ol>\n\t<li>sidebar</li>\n\t<li>import from codepen</li>\n\t<li>export to codepen</li>\n\t<li>maybe we could implement a service worker for changes to each code box?</li>\n\t<li>check for errors before triggering render</li>\n\t<li>randomly display a different codepen as a startup?</li>\n\t<li>cache up to last 20 prototypes in the browsers local storage</li>\n\t<li>stylelint</li>\n\t<li>custom monaco editor theme to look like the original prototype</li>\n\t<li>format the boxes on load</li>\n\t<li>save functionality as a separate standalone library or component?</li>\n\t<li>toolbar to use angular material toolbar</li>\n\t<li>angular material slide out menu</li>\n\t<li>angular coverage tests</li>\n\t<li>unit tests</li>\n\t<li>lighthouse tests</li>\n\t<li>auto-generate screenshots for README / documentation purposes</li>\n\t<li>window unload event as a separate standalone library or component?</li>\n\t<li>should be no vulnerabilities issues after install</li>\n\t<li>bottom drawer to show last 20 items saved?</li>\n\t<li>extract webpage into code boxes</li>\n\t<li>ability to turn off automatic render, see js fiddle run button</li>\n\t<li>diff comparer</li>\n</ol>`,
    css: `* {\n\tbox-sizing: border-box;\n}\n\nbody {\n\tbackground-color: white;\n\tfont-family: sans-serif;\n\tfont-size: 16px;\n\tpadding: 1rem;\n}`
  }

  protected save_this_shit($event: KeyboardEvent): void {
    $event.stopPropagation();
    $event.preventDefault();

    const filename = this.toolbar.filename;
    const download_link = this._download_link_ref().nativeElement;
    if (!filename || !download_link) {
      return;
    }
    const data = 'data:application/xml;charset=utf-8,' + encodeURIComponent(this.preview_component.full_code);

    download_link.setAttribute('download', `captured-`  + filename );
    download_link.setAttribute('href', data);
    download_link.click();
  }

}
