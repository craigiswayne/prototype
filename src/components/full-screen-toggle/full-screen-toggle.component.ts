import {Component, HostBinding, HostListener, Input} from '@angular/core';
import {NgSwitch, NgSwitchCase} from '@angular/common';

@Component({
  selector: 'app-full-screen-toggle',
  templateUrl: 'full-screen-toggle.component.html',
  styleUrl: 'full-screen-toggle.component.scss',
  imports: [
    NgSwitch,
    NgSwitchCase
  ],
  standalone: true
})
export class FullScreenToggleComponent {

  @Input() element_selector = 'body';

  @HostBinding('class') state?: 'fullscreen' | 'unsupported' | 'invalid' | 'ready';

  constructor() {
    if(!document.fullscreenEnabled){
      this.state = 'unsupported'
    }

    this.state = 'ready';
  }

  @HostListener('click') toggle() {

    if(this.state === 'unsupported'){
      return;
    }

    this.element_selector = this.element_selector || 'body';


    const el = document.querySelector(this.element_selector);
    if(!el){
      this.state = 'invalid';
      return;
    }

    const is_full_screen = document.fullscreenElement !== null;
    if(!is_full_screen){
      el.requestFullscreen();
      this.state = 'fullscreen';
    } else {
      document.exitFullscreen();
      this.state = 'ready';
    }
  }
}
