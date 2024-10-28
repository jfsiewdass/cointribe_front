import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import {Clipboard} from '@angular/cdk/clipboard';
export interface PeriodicElement {
  date: string;
  wallet: string;
  currency: string;
  amount: number;
  transactionId: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {wallet: 'TDpNb7voXx8oDbwyJ2jWLCpucb9URxCKcB', date: '01-01-2024 12:00.00', currency: 'Usdt', amount: 1.0079, status: 'Procesado', transactionId: 'TDpNb7voXx8oDbwyJ2jWLCpucb9URxCKcB'},
];

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule, ReactiveFormsModule, QRCodeModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  form!:FormGroup;
  copyIcon: string = 'content_copy'
  displayedColumns: string[] = ['date', 'wallet', 'currency', 'amount', 'status', 'transactionId'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();
  constructor(private router: Router,
    private clipboard: Clipboard
  ){}

  ngOnInit() {
    this.form = new FormGroup({
      currency: new FormControl('USDT TetherUs', [Validators.required, Validators.minLength(6)]),
      network: new FormControl('BNB Smart chain (BEP20)', [Validators.required]),
      wallet: new FormControl('TDpNb7voXx8oDbwyJ2jWLCpucb9URxCKcB', [Validators.required]),
    });
    this.form.get('currency')?.disable()
    this.form.get('network')?.disable()
    // this.form.get('wallet')?.disable()
  }
  copy(){
    this.clipboard.copy('TDpNb7voXx8oDbwyJ2jWLCpucb9URxCKcB');
    this.copyIcon = 'check'
    setTimeout(() => {
      this.copyIcon = 'content_copy'
    }, 5000);
  }
}
