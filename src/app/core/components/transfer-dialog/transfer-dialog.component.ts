import { Component, inject, model } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { WalletService } from '../../services/transaction.service';
import { AuthWallet } from '../../intefaces/Auth';
import { from } from 'rxjs';
import { walletsTypeEnum } from '../../enums/wallet-type.enum';
import { CommonModule } from '@angular/common';
import { greaterThanZeroValidator } from '../../validators/numbers';
import { SnackbarService } from '../../services/snackbar.service';
import { TokenService } from '../../services/token.service';

export interface Common {
  id: number,
  description: string
}

export interface Hint {
  from: number,
  to: number
}
@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.css'
})
export class TransferDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TransferDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  wallet!: AuthWallet
  readonly dialog = inject(MatDialog);
  readonly walletService = inject(WalletService);
  readonly snackbarService = inject(SnackbarService);
  readonly tokenService = inject(TokenService);
  form!: FormGroup;
  walletDetail: string = ''
  faDatabase = faDatabase
  wallets: Array<Common> = [
    { id: 1, description: 'Spot wallet' },
    { id: 2, description: 'Earn wallet' },
    { id: 3, description: 'Games wallet' },
  ]
  hint: Hint = {
    from: 0,
    to: 0
  }
  ngOnInit() {
    this.wallet = this.data.wallet
    this.form = new FormGroup({
      from: new FormControl(walletsTypeEnum.SPOT, [Validators.required]),
      to: new FormControl(walletsTypeEnum.EARN, [Validators.required]),
      coin: new FormControl('AVAX', [Validators.required]),
      amount: new FormControl(null, [Validators.required, greaterThanZeroValidator()]),
    });
    this.hint.from = this.wallet.balance
    this.hint.to = this.wallet.earn
    this.walletDetail = `${this.wallet.balance}/${this.wallet.earn}` 
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  walletTrackedBy(item: any) {}
  
  setMaxAmount(from: number) {
    let transferAmunt = 0
    if (from == walletsTypeEnum.SPOT) 
      transferAmunt = this.wallet.balance
    if (from == walletsTypeEnum.EARN) 
      transferAmunt = this.wallet.earn
    if (from == walletsTypeEnum.GAME) 
      transferAmunt = this.wallet.game
    
    this.form.get('amount')?.setValue(transferAmunt)
  }
  changeWallet(value: number, select: string) {
    
    if (select == 'from' && value == walletsTypeEnum.SPOT) this.hint.from = this.wallet.balance
    if (select == 'from' && value == walletsTypeEnum.EARN) this.hint.from = this.wallet.earn
    if (select == 'from' && value == walletsTypeEnum.GAME) this.hint.from = this.wallet.game
    
    if (select == 'to' && value == walletsTypeEnum.SPOT) this.hint.to = this.wallet.balance
    if (select == 'to' && value == walletsTypeEnum.EARN) this.hint.to = this.wallet.earn
    if (select == 'to' && value == walletsTypeEnum.GAME) this.hint.to = this.wallet.game

    this.walletDetail = `${this.hint.from}/${this.hint.to}` 
  }

  swapWallet() {
    const {from, to} = this.form.value
    this.form.patchValue({
      from: to,
      to: from,
      amount: null
    })
  }
  transfer() {
    if (this.form.invalid) return;
    this.walletService.transfer(this.form.value).subscribe({
      next: (data) => {
        // const {balance, earn, game} = data
        this.snackbarService.openSnackBar('Transferencia exitosa', 'success')
        this.tokenService.setUserData({
          ...this.tokenService.getUserData(),
          wallet: {
            ...this.wallet,
            balance: this.wallet.balance  + data.balance, 
            earn: this.wallet.earn  + data.earn, 
            game: this.wallet.game  + data.game
          }
        })
        this.dialogRef.close();
      },
      error: (error) =>{
        this.snackbarService.openSnackBar(error, 'error')
        this.dialogRef.close();
      }
    })
  }
}
