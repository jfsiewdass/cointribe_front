import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslateModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
})
export class ConfirmComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly confirm = model(this.data.confirm);
  ngOnInit() {
    this.confirm.set(true)
  }
}
