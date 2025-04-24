import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {ElementRef, isDevMode} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ColorSchemeSwitcherService} from '../services/color-scheme-switcher.service';
import {PreviewComponent} from '../components/preview/preview.component';
import {ToolbarComponent} from '../components/toolbar/toolbar.component';
import {ResizeBarComponent} from '../components/resize-bar/resize-bar.component';
import {EditorBoxComponent} from '../components/editor-box/editor-box.component';
import {FullScreenToggleComponent} from '../components/full-screen-toggle/full-screen-toggle.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let colorSchemeService: jasmine.SpyObj<ColorSchemeSwitcherService>;

  beforeEach(() => {
    colorSchemeService = jasmine.createSpyObj('ColorSchemeSwitcherService', [], {
      $behaviour: new BehaviorSubject<'light' | 'dark'>('light')
    });

    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        CommonModule,
        PreviewComponent,
        ToolbarComponent,
        ResizeBarComponent,
        EditorBoxComponent,
        FullScreenToggleComponent,
      ],
      providers: [
        {provide: ColorSchemeSwitcherService, useValue: colorSchemeService},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default code object', () => {
    expect(component.default_code).toBeDefined();
    expect(component.default_code.html).toContain('TODO:');
  });

  it('should inject ColorSchemeSwitcherService', () => {
    expect((component as any)._scheme_service).toBe(colorSchemeService);
  });

  it('should subscribe to color scheme changes and set monaco theme if monaco is defined', () => {
    const monaco = {editor: {setTheme: jasmine.createSpy()}};
    (window as any).monaco = monaco;

    colorSchemeService.$behaviour.next('dark');
    expect(monaco.editor.setTheme).toHaveBeenCalledWith('vs-dark');

    colorSchemeService.$behaviour.next('light');
    expect(monaco.editor.setTheme).toHaveBeenCalledWith('vs-light');

    delete (window as any).monaco; // Clean up global object
  });

  it('should not set monaco theme if window.monaco is undefined', () => {
    const monaco = {editor: {setTheme: jasmine.createSpy()}};
    (window as any).monaco = undefined;

    colorSchemeService.$behaviour.next('dark');
    expect(monaco.editor.setTheme).not.toHaveBeenCalled();
  });

  // describe('beforeunload HostListener', () => {
  //   let event: BeforeUnloadEvent;
  //
  //   beforeEach(() => {
  //     event = jasmine.createSpyObj('BeforeUnloadEvent', ['preventDefault']);
  //     spyOn(isDevMode, 'and').returnValue({
  //       calls: {any: () => false},
  //       returnValue: false,
  //     });
  //   });
  //
  //   it('should prevent default and return a warning message in production mode', () => {
  //     const result = component.doSomething(event);
  //     expect(event.preventDefault).toHaveBeenCalled();
  //     expect(result).toEqual('All your work will be erased!');
  //   });
  //
  //   it('should not prevent default and return undefined in dev mode', () => {
  //     spyOn(isDevMode, 'and').returnValue({
  //       calls: {any: () => true},
  //       returnValue: true,
  //     });
  //     const result = component.doSomething(event);
  //     expect(event.preventDefault).not.toHaveBeenCalled();
  //     expect(result).toBeUndefined();
  //   });
  // });
  //
  // describe('catch_save_action HostListener', () => {
  //   let event: KeyboardEvent;
  //
  //   beforeEach(() => {
  //     event = jasmine.createSpyObj('KeyboardEvent', ['stopPropagation', 'preventDefault']);
  //     spyOn(component, 'save_this_shit');
  //   });
  //
  //   it('should call save_this_shit and prevent default/propagation for ctrl+S', () => {
  //     component.catch_save_action(event);
  //     expect(event.stopPropagation).toHaveBeenCalled();
  //     expect(event.preventDefault).toHaveBeenCalled();
  //     expect(component.save_this_shit).toHaveBeenCalled();
  //   });
  // });
  //
  // describe('listener HostListener (meta+S)', () => {
  //   let event: KeyboardEvent;
  //
  //   beforeEach(() => {
  //     event = jasmine.createSpyObj('KeyboardEvent', ['stopPropagation', 'preventDefault']);
  //     spyOn(component, 'save_this_shit');
  //   });
  //
  //   it('should call save_this_shit and prevent default/propagation for meta+S', () => {
  //     component.listener(event);
  //     expect(event.stopPropagation).toHaveBeenCalled();
  //     expect(event.preventDefault).toHaveBeenCalled();
  //     expect(component.save_this_shit).toHaveBeenCalled();
  //   });
  // });
  //
  // describe('save_this_shit', () => {
  //   beforeEach(() => {
  //     component.toolbar = {filename: 'test.html'} as ToolbarComponent;
  //     component.preview_component = {full_code: '<p>Test Code</p>'} as PreviewComponent;
  //     component['_download_link_ref'] = {
  //       nativeElement: {
  //         setAttribute: jasmine.createSpy(),
  //         click: jasmine.createSpy(),
  //       },
  //     } as ElementRef<HTMLAnchorElement>;
  //   });
  //
  //   it('should set download attribute and href on the download link and click it', () => {
  //     component.save_this_shit();
  //     expect(component['_download_link_ref']().nativeElement.setAttribute).toHaveBeenCalledWith('download', 'captured-test.html');
  //     expect(component['_download_link_ref']().nativeElement.setAttribute).toHaveBeenCalledWith('href', 'data:application/xml;charset=utf-8,%3Cp%3ETest%20Code%3C/p%3E');
  //     expect(component['_download_link_ref']().nativeElement.click).toHaveBeenCalled();
  //   });
  //
  //   it('should return early if filename is missing', () => {
  //     component.toolbar.filename = '';
  //     component.save_this_shit();
  //     expect(component['_download_link_ref']().nativeElement.setAttribute).not.toHaveBeenCalled();
  //     expect(component['_download_link_ref']().nativeElement.click).not.toHaveBeenCalled();
  //   });
  //
  //   it('should return early if download link ref is missing', () => {
  //     component['_download_link_ref'] = {nativeElement: null} as ElementRef<HTMLAnchorElement>;
  //     component.save_this_shit();
  //     expect(component['_download_link_ref']().nativeElement).toBeNull();
  //   });
  // });
});
