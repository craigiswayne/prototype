import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PreviewComponent} from './preview/preview.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ResizeBarComponent} from './resize-bar/resize-bar.component';
import {CommonModule} from '@angular/common';
import {EditorBoxComponent} from './editor-box/editor-box.component';
import {FullScreenToggleComponent} from './full-screen-toggle/full-screen-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PreviewComponent, ToolbarComponent, ResizeBarComponent, EditorBoxComponent, FullScreenToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild(ToolbarComponent) toolbar!: ToolbarComponent;
  @ViewChild(EditorBoxComponent) first_box_component!: EditorBoxComponent;
  @ViewChild(PreviewComponent) preview_component!: PreviewComponent;

  @HostListener('window:beforeunload', ['$event'])
  doSomething(event: BeforeUnloadEvent) {
    event.preventDefault();
    return 'All your work will be erased!';
  }

  @ViewChild('download_link') download_link_ref?: ElementRef<HTMLAnchorElement>;

  @HostListener('window:keydown', ['$event']) catch_save_action(event: KeyboardEvent) {

    // Only care about save action
    if (event.key !== 's') {
      return;
    }

    // make sure either the CTRL (windows) or Command (mac) is being pressed as well
    if (!event.metaKey && !event.ctrlKey) {
      return;
    }

    event.preventDefault();
    this.save_this_shit();
  }

  public default_code = {
    html: `<h1>TODO:</h1>
      <ol>
      <li>dark mode with sun and moon icon in toolbar</li>
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
      <li>allow workbench to be on the right instead of the left</li>
      <li>settings to set which boxes to be opened by default</li>
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
      <li>investigate draggable resize bar?</li>
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
