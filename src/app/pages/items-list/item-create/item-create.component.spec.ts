import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCreateComponent } from './create-item.component';

describe('CreateItemComponent', () => {
  let component: ItemCreateComponent;
  let fixture: ComponentFixture<ItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
