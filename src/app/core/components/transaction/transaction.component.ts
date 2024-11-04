import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenService } from '../../services/screen.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Transaction } from '../../intefaces/Transaction';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslateModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TransactionComponent {
  displayedColumns: string[] = ['created_at', 'currency', 'amount', 'status', 'confirmations',  'transactionId'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @Input() dataSource: Transaction[] = [];
  @Input() all: boolean = false;
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: Transaction | null;
  clickedRows = new Set<Transaction>();
  constructor(private breakpointObserver: BreakpointObserver) {
    
  }
  ngOnInit() {
    if (this.all) 
      this.displayedColumns.unshift('type')

    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        // console.log('mobile');
      } else {
        // console.log('pc');
      }
    });
  }
}
