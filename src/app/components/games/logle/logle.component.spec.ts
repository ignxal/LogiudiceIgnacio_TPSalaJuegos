import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogleComponent } from './logle.component';

describe('LogleComponent', () => {
  let component: LogleComponent;
  let fixture: ComponentFixture<LogleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogleComponent]
    });
    fixture = TestBed.createComponent(LogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
