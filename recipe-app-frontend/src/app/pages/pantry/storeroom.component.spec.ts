import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreroomComponent } from './storeroom.component';

describe('StoreroomComponent', () => {
  let component: StoreroomComponent;
  let fixture: ComponentFixture<StoreroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreroomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
