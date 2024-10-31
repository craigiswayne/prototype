import {Component, HostBinding} from '@angular/core';
import {ColorSchemeSwitcherService} from './color-scheme-switcher.service';

@Component({
  standalone: true,
  selector: 'app-color-scheme-switcher',
  templateUrl: 'color-scheme-switcher.component.html',
  styleUrl: 'color-scheme-switcher.component.scss'
})
export class ColorSchemeSwitcherComponent {

  @HostBinding('attr.color_scheme') color_scheme = this.schemeService.$behaviour.value;

  constructor(private schemeService: ColorSchemeSwitcherService) {}

  public toggle() {
    const new_value = this.schemeService.$behaviour.value === 'light' ? 'dark' : 'light';
    this.color_scheme = new_value;
    this.schemeService.$behaviour.next(new_value);
  }
}
