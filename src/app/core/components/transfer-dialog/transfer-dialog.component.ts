import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.css'
})
export class TransferDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TransferDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);
  form!:FormGroup;
  faDatabase = faDatabase
  ngOnInit() {
    this.form = new FormGroup({
      from: new FormControl('Spot wallet', [Validators.required, Validators.minLength(6)]),
      to: new FormControl('Game wallet', [Validators.required, Validators.minLength(6)]),
      network: new FormControl('BNB Smart chain (BEP20)', [Validators.required]),
      wallet: new FormControl('', [Validators.required]),
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
