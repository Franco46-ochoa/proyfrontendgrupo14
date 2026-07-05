import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastoListComponent } from './gasto-list.component';

describe('GastoListComponent', () => {
  let component: GastoListComponent;
  let fixture: ComponentFixture<GastoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
