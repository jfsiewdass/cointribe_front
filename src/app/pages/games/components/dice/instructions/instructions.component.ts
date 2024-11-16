import { Component, inject, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../material.module';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.css'
})
export class InstructionsComponent {
  readonly dialogRef = inject(MatDialogRef<InstructionsComponent>);
  // readonly data = inject<any>(MAT_DIALOG_DATA);
  // readonly animal = model(this.data.animal);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
