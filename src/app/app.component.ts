import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PreviewComponent} from './preview/preview.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {ResizeBarComponent} from './resize-bar/resize-bar.component';
import {CommonModule} from '@angular/common';
import {EditorBoxComponent} from './editor-box/editor-box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PreviewComponent, ToolbarComponent, ResizeBarComponent, EditorBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild(ToolbarComponent) toolbar!: ToolbarComponent;
  @ViewChild(EditorBoxComponent) first_box_component!: EditorBoxComponent;
  @ViewChild(PreviewComponent) preview_component!: PreviewComponent;

  // TODO: maybe use a separate library or service?
  @HostListener('window:beforeunload', ['$event'])
  doSomething(event: BeforeUnloadEvent) {
    event.preventDefault();
    return 'All your work will be erased!';
  }

  @ViewChild('download_link') download_link_ref?: ElementRef<HTMLAnchorElement>;

  // TODO: maybe move this to a service / library or component
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
