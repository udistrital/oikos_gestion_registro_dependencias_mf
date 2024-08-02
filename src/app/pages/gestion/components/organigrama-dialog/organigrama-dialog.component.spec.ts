import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganigramaDialogComponent } from './organigrama-dialog.component';

describe('OrganigramaDialogComponent', () => {
  let component: OrganigramaDialogComponent;
  let fixture: ComponentFixture<OrganigramaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganigramaDialogComponent]
    });
    fixture = TestBed.createComponent(OrganigramaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
