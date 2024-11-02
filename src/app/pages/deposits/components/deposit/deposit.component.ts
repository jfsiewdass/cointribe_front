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
  styleUrl: './deposit.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DepositComponent {
  form!:FormGroup;
  copyIcon: string = 'content_copy'
  displayedColumns: string[] = ['date', 'wallet', 'currency', 'amount', 'status', 'transactionId'];
  dataSource = ELEMENT_DATA;
  columnsToDisplayWithExpand = ['expand', ...this.displayedColumns];
  expandedElement: PeriodicElement | null = null;
  clickedRows = new Set<PeriodicElement>();
  userData!: UserData | null 
  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private tokenService: TokenService,
    private snackbar: SnackbarService
  ){}

  ngOnInit() {
    this.userData = this.tokenService.getUserData();
    if (!this.userData?.wallet) {
      this.snackbar.error({ statusCode: 500, message: 'wallet not set' })
      this.router.navigate([''])
    }
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
