import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherorlowerComponent } from './higherorlower.component';

describe('HigherorlowerComponent', () => {
  let component: HigherorlowerComponent;
  let fixture: ComponentFixture<HigherorlowerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HigherorlowerComponent]
    });
    fixture = TestBed.createComponent(HigherorlowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
