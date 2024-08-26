import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-toggle',
  template: '',
  standalone: true,
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  @HostBinding('class.checked') @Input()  checked?: boolean;
}
