import {Component} from '@angular/core';
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
  public editorCSSWidth: string = '';
}
