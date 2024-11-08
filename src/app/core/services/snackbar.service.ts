import { inject, Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { AlertComponent } from '../components/alert/alert.component';
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private _snackBar: MatSnackBar = inject(MatSnackBar)

  error({statusCode, message}: any){
    return this._snackBar.open(`${statusCode} ${message}`, 'X', {
      panelClass: 'message-danger',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
  success({statusCode, message}: any){
    return this._snackBar.open(`${statusCode} ${message}`, 'X', {
      panelClass: 'message-success',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  public openSnackBar(message:string, type:string, duration?:number, verticalPosition?:MatSnackBarVerticalPosition, horizontalPosition?:MatSnackBarHorizontalPosition) {
    const _snackType = type !== undefined ? type : 'success';
    this._snackBar.openFromComponent(AlertComponent, {
      // duration: duration || 4000,
      horizontalPosition: horizontalPosition || 'end',
      verticalPosition: verticalPosition || 'top',
      data: { message: message, snackType: _snackType, snackBar: this._snackBar },
      panelClass: `message-${type}`
    });
  }
}
