import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenService } from '../../services/screen.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Transaction } from '../../intefaces/Transaction';
import dayjs from 'dayjs'
import { TransactionIconMap } from '../../mapData';
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
  displayedColumns: string[] = ['icon', 'type', 'status', 'amount'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @Input() dataSource: Array<Transaction> = [];
  @Input() all: boolean = false;
  expandedElement!: Transaction | null;
  clickedRows = new Set<Transaction>();
  isMobile: boolean = false
  transactionIconMap = TransactionIconMap
  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true
        this.displayedColumns = ['icon', 'type', 'amount']
      } else {
        this.displayedColumns = ['icon', 'type', 'status', 'amount'];
        this.isMobile = false
      }
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatHash(hash: string): string {
    if (hash.length < (this.isMobile ? 14 : 34)) {
      return hash;
    }
    const first = hash.substring(0, (this.isMobile ? 10 : 30));
    const last = hash.substring(hash.length - 4);
  
    return `${first}...${last}`;
  }
}
