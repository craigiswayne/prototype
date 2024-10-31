import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';

type COLOR_SCHEME = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ColorSchemeSwitcherService {
  public $behaviour = new BehaviorSubject<COLOR_SCHEME>(this.get_initial_color_scheme());
  public $observable: Observable<COLOR_SCHEME>;
  private renderer: Renderer2;

  constructor(private readonly rendererFactor: RendererFactory2) {
    this.renderer = this.rendererFactor.createRenderer(null, null);
    this.$observable = this.$behaviour.asObservable().pipe(
      tap(scheme => {
        this.renderer.setAttribute(document.body, 'data-color-scheme', scheme);
      })
    )
  }


  private get_initial_color_scheme(): COLOR_SCHEME {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }
}
