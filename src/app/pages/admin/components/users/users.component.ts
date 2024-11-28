import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../material.module';
import { Transaction } from '../../../../core/intefaces/Transaction';
import { User, UserFilterForm, UserFilterQuery } from '../../interfaces/admin';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RoleMap, StatusMap, TransactionIconMap } from '../../../../core/mapData';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../../core/components/confirm/confirm.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TranslateModule, MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  page = 0
  limit = 10
  totalUsers = 0
  readonly confirm = signal(false);
  readonly dialog = inject(MatDialog);
  adminService = inject(AdminService)

  displayedColumns: string[] = ['icon', 'info', 'rol', 'status', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource: Array<User> = [];
  all: boolean = false;
  expandedElement!: Transaction | null;
  clickedRows = new Set<Transaction>();
  isMobile: boolean = false
  roleMap = RoleMap
  statusMap = StatusMap
  @Output() moreTransactions = new EventEmitter<void>();
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver)
  private snack = inject(SnackbarService)
  form: FormGroup = new FormGroup<UserFilterForm>({
    firstName: new FormControl('', {nonNullable: true, validators:[Validators.minLength(4)]}),
    lastName: new FormControl('', {nonNullable: true, validators:[Validators.minLength(4)]}),
    email: new FormControl('', {nonNullable: true, validators:[Validators.minLength(4)]}),
    wallet: new FormControl('', {nonNullable: true, validators:[Validators.minLength(4)]}),
    status: new FormControl('', {nonNullable: true, validators:[]}),
  });
  constructor() {}
  ngOnInit() {

    this.getUsers()
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true
        this.displayedColumns = ['icon', 'info', 'rol']
      } else {
        this.displayedColumns = ['icon', 'info', 'rol', 'status', 'action'];
        this.isMobile = false
      }
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatHash(hash: string): string {
    if (hash == '') return 'No wallet set'
    if (!this.isMobile) return hash;
    
    const first = hash.substring(0, (this.isMobile ? 10 : 30));
    const last = hash.substring(hash.length - 4);
  
    return `${first}...${last}`;
  }
  confirmUser(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {confirm: this.confirm()},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getUsers()
    });
  }

  getUsers(query: UserFilterQuery = {page: this.page, limit: this.limit}) {
    this.adminService.getUsers(query).subscribe({
      next: (response) => {
        const { data, total } = response
        this.dataSource = data
        this.totalUsers = total
      },
      error: (err) => {
        console.log(err);
        this.snack.openSnackBar(err.message, 'error')
      }
    })
  }
  handlePageEvent(e: PageEvent) {
    console.log(e);
    const query = {
      page: e.pageIndex,
      limit: this.limit
    }
    this.getUsers(query)
  }

  submit() {

    const query = {
      page: 0,
      limit: this.limit,
      ...this.form.value
    }
    this.getUsers(query)
  }
  clear() {
    this.form.reset()
    const query = {
      page: 0,
      limit: this.limit
    }
    this.getUsers(query)
  }
}
