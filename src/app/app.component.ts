import {Component, ElementRef, HostListener, isDevMode, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PreviewComponent} from './preview/preview.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ResizeBarComponent} from './resize-bar/resize-bar.component';
import {CommonModule} from '@angular/common';
import {EditorBoxComponent} from './editor-box/editor-box.component';
import {FullScreenToggleComponent} from './full-screen-toggle/full-screen-toggle.component';
import {ColorSchemeSwitcherService} from './color-scheme-switcher/color-scheme-switcher.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, PreviewComponent, ToolbarComponent, ResizeBarComponent, EditorBoxComponent, FullScreenToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild(ToolbarComponent) toolbar!: ToolbarComponent;
  @ViewChild(EditorBoxComponent) first_box_component!: EditorBoxComponent;
  @ViewChild(PreviewComponent) preview_component!: PreviewComponent;

  @HostListener('window:beforeunload', ['$event'])
  doSomething(event: BeforeUnloadEvent) {
    if(isDevMode()){
      return;
    }
    event.preventDefault();
    return 'All your work will be erased!';
  }

  @ViewChild('download_link') download_link_ref?: ElementRef<HTMLAnchorElement>;

  /**
   * Catch the Save action
   * @link https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
   * @link https://github.com/angular/angular/blob/35d7ca55b2141c7d9a3e86163e85dd883f60c171/adev/src/content/guide/templates/event-listeners.md?plain=1#L96
   */
  @HostListener('window:keydown.code.control.KeyS', ['$event']) catch_save_action(event: KeyboardEvent) {
    event.preventDefault();
    this.save_this_shit();
  }

  constructor(public schemeService: ColorSchemeSwitcherService) {}


  public ngOnInit():void  {
    this.schemeService.$observable
      .subscribe(scheme => {
        const theme_to_use = scheme === 'light' ? 'vs-light' : 'vs-dark';

        // @ts-expect-error todo
        if(undefined === window?.monaco){
          return;
        }

        // @ts-expect-error todo move this to somewhere else
        window.monaco.editor.setTheme(theme_to_use);
      })
  }

  public default_code = {
    html: `<h1>TODO:</h1>
    <ol>
      <li>sidebar</li>
      <li>import from codepen</li>
      <li>export to codepen</li>
      <li>maybe we could implement a service worker for changes to each code box?</li>
      <li>check for errors before triggering render</li>
      <li>randomly display a different codepen as a startup?</li>
      <li>cache up to last 20 prototypes in the browsers local storage</li>
      <li>stylelint</li>
      <li>custom monaco editor theme to look like the original prototype</li>
      <li>format the boxes on load</li>
      <li>download functionality to be standalone component</li>
      <li>toolbar to use angular material toolbar</li>
      <li>angular material slide out menu</li>
      <li>angular coverage tests</li>
      <li>unit tests</li>
      <li>lighthouse tests</li>
      <li>auto-generate screenshots for README / documentation purposes</li>
      <li>window unload event as a separate standalone library or component?</li>
      <li>save functionality as a separate standalone library or component?</li>
      <li>save functionality doesn't work when clicking on the preview pane and then triggering the save</li>
      <li>should be no vulnerabilities issues after install</li>
      <li>bottom drawer to show last 20 items saved?</li>
      <li>extract webpage into code boxes</li>
      <li>remove postMessage debug from index.html</li>
      <li>ability to turn off automatic render, see js fiddle run button</li>
      <li>diff comparer</li>
      </ol>`
  }

  public save_this_shit(): void {
    const filename = this.toolbar.get_filename();
    const download_link = this.download_link_ref?.nativeElement;
    if (!filename || !download_link) {
      return;
    }
    const data = 'data:application/xml;charset=utf-8,' + encodeURIComponent(this.preview_component.full_code);

    download_link.setAttribute('download', filename);
    download_link.setAttribute('href', data);
    download_link.click();
  }

}
