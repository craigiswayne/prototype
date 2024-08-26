import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {ToggleComponent} from '../toggle/toggle.component';

@Component({
  selector: 'app-editor-box',
  standalone: true,
  imports: [
    NgClass,
    ToggleComponent
  ],
  templateUrl: './editor-box.component.html',
  styleUrl: './editor-box.component.scss'
})
export class EditorBoxComponent {
  @Input() language: 'HTML' | 'CSS' | 'JAVASCRIPT' = 'HTML';
  @HostBinding('class.collapsed') collapsed: boolean = false;
  @Output() changed: EventEmitter<string> = new EventEmitter();
}
