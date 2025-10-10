import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewsLib } from './my-news-lib';

describe('MyNewsLib', () => {
  let component: MyNewsLib;
  let fixture: ComponentFixture<MyNewsLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNewsLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNewsLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
