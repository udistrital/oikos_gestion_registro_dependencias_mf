import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDependenciaDialogComponent } from './editar-dependencia-dialog.component';

describe('EditarDependenciaDialogComponent', () => {
  let component: EditarDependenciaDialogComponent;
  let fixture: ComponentFixture<EditarDependenciaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarDependenciaDialogComponent]
    });
    fixture = TestBed.createComponent(EditarDependenciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
