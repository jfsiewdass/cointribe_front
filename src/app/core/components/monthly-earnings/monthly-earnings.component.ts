import { Component, ViewChild } from '@angular/core';
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
    selector: 'app-monthly-earnings',
    standalone: true,
    imports: [NgApexchartsModule, MaterialModule],
    templateUrl: './monthly-earnings.component.html',
})
export class AppMonthlyEarningsComponent {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public monthlyChart!: Partial<monthlyChart> | any;

    constructor() {
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
}
