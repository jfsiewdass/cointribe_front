import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import {Clipboard} from '@angular/cdk/clipboard';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TokenService } from '../../../../core/services/token.service';
import { UserData } from '../../../../core/intefaces/Auth';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TransactionComponent } from '../../../../core/components/transaction/transaction.component';
import { WalletService } from '../../../../core/services/transaction.service';
import { Transaction } from '../../../../core/intefaces/Transaction';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule, ReactiveFormsModule, QRCodeModule, TransactionComponent],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  form!:FormGroup;
  copyIcon: string = 'content_copy'
  transactions: Transaction[] = [];
  userData!: UserData | null 
  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private tokenService: TokenService,
    private snackbar: SnackbarService,
    private txService: WalletService
  ){}

  ngOnInit() {
    this.userData = this.tokenService.getUserData();
    if (!this.userData?.wallet) {
      this.snackbar.error({ statusCode: 500, message: 'wallet not set' })
      this.router.navigate([''])
    }
    this.txService.getTransactions().subscribe({
      next: (data: Array<Transaction>) => {
        this.transactions = data.filter(f => f.typeId != 2)
      }
    })
    this.form = new FormGroup({
      currency: new FormControl('USDT TetherUs', [Validators.required, Validators.minLength(6)]),
      network: new FormControl('BNB Smart chain (BEP20)', [Validators.required]),
      wallet: new FormControl(this.userData? this.userData!.wallet!.address : '', [Validators.required]),
    });
    this.form.get('currency')?.disable()
    this.form.get('network')?.disable()
  }
  copy(){
    this.clipboard.copy(this.userData? this.userData!.wallet!.address : '');
    this.copyIcon = 'check'
    setTimeout(() => {
      this.copyIcon = 'content_copy'
    }, 5000);
  }
}
