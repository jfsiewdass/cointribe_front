import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ApexAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { AuthWallet } from '../../intefaces/Auth';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { walletsTypeEnum } from '../../enums/wallet-type.enum';


export interface monthlyChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    responsive: ApexResponsive;
}

@Component({
    selector: 'app-balance',
    standalone: true,
    imports: [NgApexchartsModule, MaterialModule, CommonModule, RouterModule],
    templateUrl: './balance.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBalanceComponent {
    walletsTypeEnum = walletsTypeEnum
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    @Input() wallet!: AuthWallet | null
    @Input() isMainPage: boolean = true
    @Input() walletType:  walletsTypeEnum = walletsTypeEnum.SPOT
    isMobile: boolean = false
    readonly dialog = inject(MatDialog);
    public monthlyChart!: Partial<monthlyChart> | any;
    walletDescription: { [key in walletsTypeEnum]: string } = {
        [walletsTypeEnum.SPOT]: 'Spot balance',
        [walletsTypeEnum.EARN]: 'Earn balance',
        [walletsTypeEnum.GAME]: 'Game balance'
    };
    

    constructor(private breakpointObserver: BreakpointObserver) {
        this.monthlyChart = {
            series: [
                {
                    name: '',
                    color: '#131667',
                    data: [25, 66, 20, 140, 85, 60, 540],
                },
            ],

            chart: {
                type: 'area',
                fontFamily: "'Plus Jakarta Sans', sans-serif;",
                foreColor: '#adb0bb',
                toolbar: {
                    show: false,
                },
                height: 60,
                sparkline: {
                    enabled: true,
                },
                group: 'sparklines',
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            fill: {
                colors: ['#E8F7FF'],
                type: 'solid',
                opacity: 0.05,
            },
            markers: {
                size: 0,
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false,
                },
            },
        };
    }

    ngOnInit() {
        // console.log(this.walletType.toString());
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (result.matches) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        });
    }
    openTransferDialog(): void {
        const dialogRef = this.dialog.open(TransferDialogComponent, {
            data: {
                wallet: this.wallet
            }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }
}
