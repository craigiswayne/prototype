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

  public editorCSSWidth = '';

  @ViewChild(ToolbarComponent) toolbar!: ToolbarComponent;
  @ViewChild(EditorBoxComponent) first_box_component!: EditorBoxComponent;
  @ViewChild(PreviewComponent) preview_component!: PreviewComponent;

  @HostListener('window:beforeunload', ['$event'])
  // @ts-expect-error need to type the $event
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  doSomething($event) {
    // $event.returnValue='Your data will be lost!';
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
