import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
// import { ColorSchemeSwitcherService } from '../services/color-scheme-switcher.service';
// import { of } from 'rxjs';

// Mock Service
// class MockColorSchemeSwitcherService {
//   $observable = of('dark'); // Mock observable emitting "dark" scheme
// }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  // let mockColorSchemeSwitcherService: MockColorSchemeSwitcherService;

  beforeEach(async () => {
    // Initialize mock service
    // mockColorSchemeSwitcherService = new MockColorSchemeSwitcherService();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      // providers: [
      //   {
      //     provide: ColorSchemeSwitcherService, // Replace actual with mock service
      //     useValue: mockColorSchemeSwitcherService,
      //   },
      // ],
    }).compileComponents();

    // Create component and test instance
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger lifecycle hooks
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize with the correct theme using ColorSchemeSwitcherService', () => {
  //   spyOn(window.monaco!.editor, 'setTheme'); // Spy on the Monaco API
  //   component.ngOnInit();
  //   expect(window.monaco!.editor.setTheme).toHaveBeenCalledTimes(1); // Check that "dark" theme is applied
  //   // expect(window.monaco?.editor.setTheme).toHaveBeenCalledWith('vs-dark'); // Check that "dark" theme is applied
  // });

  it('should prevent default and call save if Ctrl + S is pressed', () => {
    spyOn(component, 'save_this_shit'); // Spy on "save_this_shit" function
    const event = new KeyboardEvent('keydown', {
      code: 'KeyS',
      ctrlKey: true
    });
    window.dispatchEvent(event);
    expect(component.save_this_shit).toHaveBeenCalledTimes(1); // Verify it was executed
  });

  it('should prevent default and call save if Meta + S is pressed', () => {
    spyOn(component, 'save_this_shit'); // Spy on "save_this_shit" function
    const event = new KeyboardEvent('keydown', {
      code: 'KeyS',
      metaKey: true
    });
    window.dispatchEvent(event);
    expect(component.save_this_shit).toHaveBeenCalledTimes(1); // Verify it was executed
  });

  // it('should prevent navigation with window:beforeunload', () => {
  //   const event = new BeforeUnloadEvent();
  //   const returnValue = component.doSomething(event);
  //   expect(event.defaultPrevented).toBeTrue(); // Verify the event was prevented
  //   expect(returnValue).toEqual('All your work will be erased!');
  // });

  it('should initialize with default HTML code', () => {
    expect(component.default_code.html).toContain('<h1>TODO:</h1>');
  });
});
