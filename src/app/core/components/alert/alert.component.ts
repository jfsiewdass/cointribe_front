import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faClose, faExclamationCircle, faInfo, faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  faClose = faClose
  
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    // console.log(data);
  }

  ngOnInit() {}

  get getIcon() {
    switch (this.data.snackType) {
      case 'success':
        return {type: this.data.snackType, icon: faCheck};
      case 'error':
        return {type: this.data.snackType, icon: faExclamationCircle};
      case 'warn':
        return {type: this.data.snackType, icon: faWarning};
      case 'info':
        return {type: this.data.snackType, icon:  faInfo};
      default:
          return {type: this.data.snackType, icon: faInfo};
    }
  }

  closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}
