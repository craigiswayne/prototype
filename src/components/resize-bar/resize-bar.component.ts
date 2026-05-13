import {Component, effect, signal} from '@angular/core';

@Component({
  selector: 'app-resize-bar',
  standalone: true,
  templateUrl: './resize-bar.component.html',
  host: {
    '(mousedown)': 'resizing.set(true)',
    '(window:mouseup)': 'this.resizing.set(false)',
    '(window:mousemove)': 'inject_resizer_style($event.clientX + "px")'
  },
  styleUrl: './resize-bar.component.scss'
})
export class ResizeBarComponent {

  protected resizing = signal(false);

  private on_resizing_change = effect(() => {
    const resizing = this.resizing();
    // document.documentElement.style.setProperty('--resizing', resizing ? 'true' : 'false');
    document.documentElement.classList.toggle('resizing', resizing);
  })

  protected inject_resizer_style(width: string): void {
    if(!this.resizing()){
      return
    }

    const resizer_style_id = 'resizer_styles'
    let resizer_style_tag = document.querySelector(`#${resizer_style_id}`);

    if (!resizer_style_tag) {
      resizer_style_tag = document.createElement('style');
      resizer_style_tag.setAttribute('id', resizer_style_id);
      document.body.appendChild(resizer_style_tag);
    }

    resizer_style_tag.innerHTML = `:root { --width-from-resizer: ${width}; }`
  }
}
