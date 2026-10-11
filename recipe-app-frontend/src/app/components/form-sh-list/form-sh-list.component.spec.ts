import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShListComponent } from './form-sh-list.component';

describe('FormShListComponent', () => {
  let component: FormShListComponent;
  let fixture: ComponentFixture<FormShListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormShListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormShListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
