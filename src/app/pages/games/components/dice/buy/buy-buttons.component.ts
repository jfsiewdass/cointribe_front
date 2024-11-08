import { Component, Inject, inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatListModule } from "@angular/material/list";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'buy-button',
    templateUrl: './buy-buttons.component.html',
    standalone: true,
    imports: [MatListModule, FontAwesomeModule],
  })
  export class BuyButtons {
    faCoins = faCoins
    private _bottomSheetRef =
      inject<MatBottomSheetRef<BuyButtons>>(MatBottomSheetRef);

      constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any){}
    ngOnInit() {
      console.log(this.data);
      
    }
    selectAmount(event: MouseEvent, value: number): void {
        event.preventDefault();
      this._bottomSheetRef.dismiss(value);
      
    }
  }