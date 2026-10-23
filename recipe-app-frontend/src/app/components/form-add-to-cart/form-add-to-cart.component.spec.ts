import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddToCartComponent } from './form-add-to-cart.component';

describe('FormAddToCartComponent', () => {
  let component: FormAddToCartComponent;
  let fixture: ComponentFixture<FormAddToCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddToCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
