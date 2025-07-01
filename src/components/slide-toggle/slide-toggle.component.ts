import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-slide-toggle',
  template: '',
  standalone: true,
  styleUrl: './slide-toggle.component.scss'
})
export class SlideToggleComponent {
  @HostBinding('class.checked') @Input() checked?: boolean;
}
