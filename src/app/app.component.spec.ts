import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'Cloudonix Store' title`, () => {
    expect(component.title).toEqual('Cloudonix Store');
  });

  it('should return true if the current route is "/auth"', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/auth');
    expect(component.isLoginPage()).toBeTrue();
  });

  it('should return false if the current route is not "/auth"', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/home');
    expect(component.isLoginPage()).toBeFalse();
  });

  it('should render the header and footer when not on the login page', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/home');
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('app-header');
    const footer = fixture.nativeElement.querySelector('app-footer');

    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should not render the header and footer when on the login page', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/auth');
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('app-header');
    const footer = fixture.nativeElement.querySelector('app-footer');

    expect(header).toBeNull();
    expect(footer).toBeNull();
  });
});
