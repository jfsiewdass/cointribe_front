import { inject, Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
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
}
