import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './app-header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent] // standalone component, import it here
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have menuOpen initially false', () => {
    expect(component.menuOpen).toBeFalse();
  });

  it('should toggle menuOpen when toggleMenu is called', () => {
    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();

    component.toggleMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('should emit categorySelected with correct value', () => {
    spyOn(component.categorySelected, 'emit');

    const category = 'sports';
    component.selectCategory(category);

    expect(component.categorySelected.emit).toHaveBeenCalledWith(category);
    expect(component.categorySelected.emit).toHaveBeenCalledTimes(1);
  });

  it('should toggle menu and emit category correctly in sequence', () => {
    spyOn(component.categorySelected, 'emit');

    expect(component.menuOpen).toBeFalse();

    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();

    const category = 'politics';
    component.selectCategory(category);

    expect(component.categorySelected.emit).toHaveBeenCalledWith(category);
  });
});
