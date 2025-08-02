import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { convertThemeName, registerTheme } from '@siemens/ix-echarts';
import { DateDropdownOption, DateRangeChangeEvent } from '@siemens/ix';
import * as echarts from 'echarts/core';
import { EChartsOption, LineSeriesOption } from 'echarts';
import { apiCalls } from '../mockData/mock-data';
import { ModalService } from '@siemens/ix-angular';
import { FilterModalComponent } from './filter/filter-modal/filter-modal.component';
import * as XLSX from 'xlsx';
import * as saveAs from 'file-saver';
import { ToastService } from '@siemens/ix-angular';

const formatDate = (date: Date) =>
  date.toISOString().substring(0, 10);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  hasError = false;

  @ViewChild(FilterModalComponent)
  filterModalComp!: FilterModalComponent;

  constructor(private readonly modalService: ModalService, private readonly toastService: ToastService) { }

  dateDropdownOptions: DateDropdownOption[] = [
    {
      id: 'last-7',
      label: 'Last 7 days',
      from: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      to: formatDate(new Date()),
    },
    {
      id: 'today',
      label: 'Today',
      from: formatDate(new Date()),
      to: formatDate(new Date()),
    },
  ];

  theme = convertThemeName('light');
  selectedFilters: any = null;

  cardStates = {
    apiUsers: true,
    topUsers: true,
    topServices: true,
    httpStatus: true
  };

  topApiUsers: string[] = [];
  topServices: string[] = [];
  topStatusCodes: string[] = [];

  topListTitle = 'Top 5 API Users';
  topListstatuscodeTitle = 'Top 5 HTTP Status Codes';
  topListstatuscodeTooltip = 'The top 5 list of HTTP status codes for the selected period';
  topListTooltip = 'Top API users or services, grouped by category';
  apiUserTitle = 'API Users';
  apiUserTooltip = 'Number of API users per day, grouped by service';
  statuscodeTitle = 'HTTP Status Codes';
  statuscodeTooltip = 'Number of HTTP status codes per day, grouped by status code';


  userChartOptions: EChartsOption = {
    legend: {
      icon: 'rect',
      bottom: 0,
      left: 0,
      textStyle: { color: '#167b97' },
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: { lineStyle: { color: '#167b97' } },
      axisLabel: { color: '#167b97' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#167b97' } },
      axisLabel: { color: '#167b97' },
      splitLine: { lineStyle: { color: '#dddddd' } }
    },
    series: []
  };

  statusCodeChartOptions: EChartsOption = {
    legend: {
      icon: 'rect',
      bottom: 0,
      left: 0,
      textStyle: { color: '#167b97' },
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: { lineStyle: { color: '#167b97' } },
      axisLabel: { color: '#167b97' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#167b97' } },
      axisLabel: { color: '#167b97' },
      splitLine: { lineStyle: { color: '#dddddd' } }
    },
    series: []
  };

  // Initialisiert das Dashboard und lädt die Standarddaten für die letzten 7 Tage
  ngOnInit() {
    registerTheme(echarts);
    const last7 = this.dateDropdownOptions.find(d => d.id === 'last-7')!;
    this.prepareChartData(last7.from, last7.to);
    this.updateTopLists(last7.from, last7.to);
  }

  // Registriert das Theme nach dem Laden der View und wendet ggf. Favoritenfilter an
  ngAfterViewInit(): void {
    registerTheme(echarts);

    // Prüfen, ob Favoriten vorhanden sind und den ersten anwenden
    const favorites = this.filterModalComp?.favorites;
    if (favorites && favorites.length > 0) {
      const defaultFavorite = favorites[0];
      this.selectedFilters = defaultFavorite;

      // optional: auch Datum aus Dropdown wie in ngOnInit holen
      const lastRange = this.dateDropdownOptions.find(d => d.id === 'last-7')!;
      this.prepareChartData(lastRange.from, lastRange.to);
      this.updateTopLists(lastRange.from, lastRange.to);
    }
  }


  // Wendet die ausgewählten Filter an und aktualisiert die Diagramme und Top-Listen
  onFilterApply(filters: any) {
    try {
      this.selectedFilters = filters;
      const lastRange = this.dateDropdownOptions.find(d => d.id === 'last-7')!;
      this.prepareChartData(lastRange.from, lastRange.to);
      this.updateTopLists(lastRange.from, lastRange.to);
    } catch (error) {
      this.showToast('Filters could not be applied. Please check the filter settings.');
      console.error(error);
    }
  }

  // Zeigt eine Fehlermeldung als Toast an
  showToast(message: string) {
    this.toastService.show({
      message: message,
      type: 'error'
    });
  }


  // Blendet die jeweilige Karte (API Nutzer, Services, Statuscodes) ein oder aus
  toggleCard(card: keyof typeof this.cardStates) {
    this.cardStates[card] = !this.cardStates[card];
  }

  // Öffnet das Filtermodal und reagiert auf die Anwendung von Filtern
  openFilterModal() {
    this.filterModalComp.createModal('840');
    this.filterModalComp.applyFilters.subscribe((filters: any) => {
      this.onFilterApply(filters);
    });
  }

  // Reagiert auf Änderungen des Datumsbereichs und aktualisiert die Daten
  onDateRangeChange(event: CustomEvent<DateRangeChangeEvent>) {
    const dateRange = event.detail;

    if (!dateRange) {
      return;
    }

    let from = dateRange.from;
    let to = dateRange.to;

    // Wenn nur ein Wert gesetzt ist, setze den fehlenden Wert auf den vorhandenen
    if (from && !to) {
      to = from;
    } else if (to && !from) {
      from = to;
    }

    // Werte speichern
    this.currentFrom = from;
    this.currentTo = to;


    this.prepareChartData(from, to);
    this.updateTopLists(from, to);

    if (new Date(from) > new Date() || new Date(to) > new Date()) {
      this.hasError = true;
      this.showToast(' The selected time period must not include any days in the future. Please select a valid date range.');
      return;
    }

  }

  showDateDropdown = true;

  // Setzt alle Filter zurück und lädt die Standarddaten
  clearFilters() {
    this.selectedFilters = null;

    const defaultRange = this.dateDropdownOptions.find(d => d.id === 'last-7')!;

    this.currentFrom = defaultRange.from;
    this.currentTo = defaultRange.to;
    this.hasError = false;


    this.prepareChartData(defaultRange.from, defaultRange.to);
    this.updateTopLists(defaultRange.from, defaultRange.to);

    // Dropdown neu rendern, damit es auf "last-7" zurückspringt
    this.showDateDropdown = false;
    setTimeout(() => {
      this.showDateDropdown = true;
    });
  }



  // Prüft, ob die Kategorie ein API Nutzer ist
  public isApiUser(category: string): boolean {
    // Beispiel: Kategorie gilt als "API Nutzer", wenn sie in den user-Werten vorkommt
    return apiCalls.some(call => call.user === category);
  }

  // Aktualisiert die Top-Listen (API Nutzer, Services, Statuscodes) basierend auf Filter und Zeitraum
  updateTopLists(from: string, to: string) {
    let filteredCalls = apiCalls.filter(call => {
      const callDate = call.timestamp.substring(0, 10);
      return callDate >= from && callDate <= to;
    });

    if (this.selectedFilters?.statusCodes?.length) {
      filteredCalls = filteredCalls.filter(call =>
        this.selectedFilters.statusCodes.includes(call.statusCode.toString())
      );
    }

    if (this.selectedFilters?.category) {
      // WICHTIG: Filter nur auf Nutzer ODER Service je nach Kategorie
      // (nicht auf beide gleichzeitig)
      if (this.isApiUser(this.selectedFilters.category)) {
        filteredCalls = filteredCalls.filter(call => call.user === this.selectedFilters.category);
      } else if (this.selectedFilters.category === 'statusCode') {
        // HTTP Statuscodes sind Sonderfall: keine Filterung auf user/service hier
        // filteredCalls bleibt unverändert
      } else {
        filteredCalls = filteredCalls.filter(call => call.service === this.selectedFilters.category);
      }
    }

    const showAmount = this.selectedFilters?.showAmount || '5';
    const limit = showAmount === 'all' ? undefined : Number(showAmount);
    const limitLabel = showAmount === 'all' ? 'all' : limit; // Anzeige-Text für Titel

    // Dynamische Titel-Anpassung für Top-Listen (außer statusCode)
    if (this.selectedFilters?.category && this.selectedFilters.category !== 'statusCode') {
      const selected = this.selectedFilters.category;
      const isUser = this.isApiUser(selected);

      if (isUser) {
        this.topListTitle = `Top ${limitLabel} Services`;
        this.topListTooltip = `Top ${limitLabel} Services used by ${selected}`;
        this.apiUserTitle = `Requests by ${selected}`;
        this.apiUserTooltip = `Number of requests from API user ${selected}, grouped by services`;
        this.topListstatuscodeTitle = `Top ${limitLabel} HTTP Status Codes`;
        this.topListstatuscodeTooltip = `The top ${limitLabel} list of HTTP status codes for the selected period`;
        this.statuscodeTitle = `HTTP Status Codes for ${selected}`;
        this.statuscodeTooltip = `Number of HTTP status codes per day, grouped by status code for ${selected}`;
      } else {
        this.topListTitle = `Top ${limitLabel} API Users`;
        this.topListTooltip = `Top ${limitLabel} API users who have used the service ${selected}`;
        this.apiUserTitle = `Requests for ${selected}`;
        this.apiUserTooltip = `Number of requests to service ${selected}, grouped by API users`;
        this.topListstatuscodeTitle = `Top ${limitLabel} HTTP Status Codes`;
        this.topListstatuscodeTooltip = `The top ${limitLabel} list of HTTP status codes for the selected period`;
        this.statuscodeTitle = `HTTP Status Codes for ${selected}`;
        this.statuscodeTooltip = `Number of HTTP status codes per day, grouped by status code for ${selected}`;
      }
    } else {
      this.topListTitle = `Top ${limitLabel} API Users`;
      this.topListTooltip = 'Top API users or services, grouped by category';
      this.apiUserTitle = 'API Users';
      this.apiUserTooltip = 'Number of API users per day, grouped by service';
      this.topListstatuscodeTitle = `Top ${limitLabel} HTTP Status Codes`;
      this.topListstatuscodeTooltip = `The top ${limitLabel} list of HTTP status codes for the selected period`;
    }


    // Top API Nutzer
    const userCallCounts = filteredCalls.reduce((acc, call) => {
      acc[call.user] = (acc[call.user] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.topApiUsers = Object.entries(userCallCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([user, count]) => `${user} (${count} Requests)`);


    // Top Services
    const serviceCallCounts = filteredCalls.reduce((acc, call) => {
      acc[call.service] = (acc[call.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.topServices = Object.entries(serviceCallCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([service, count]) => `${service} (${count} Requests)`);


    // Top StatusCodes (immer gleich, Titel bleibt statisch)
    const statusCodeCounts = filteredCalls.reduce((acc, call) => {
      const code = call.statusCode.toString();
      acc[code] = (acc[code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.topStatusCodes = Object.entries(statusCodeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([code, count]) => `${code} (${count} Requests) `);

  }

  // Bereitet die Daten für die Diagramme (API Nutzer, Statuscodes) vor
  prepareChartData(from: string, to: string) {
  let filteredCalls = apiCalls.filter(call => {
    const callDate = call.timestamp.substring(0, 10);
    return callDate >= from && callDate <= to;
  });

  if (this.selectedFilters?.statusCodes?.length) {
    filteredCalls = filteredCalls.filter(call =>
      this.selectedFilters.statusCodes.includes(call.statusCode.toString())
    );
  }

  if (this.selectedFilters?.category && this.selectedFilters.category !== 'statusCode') {
    const selected = this.selectedFilters.category;
    if (this.isApiUser(selected)) {
      filteredCalls = filteredCalls.filter(call => call.user === selected);
    } else {
      filteredCalls = filteredCalls.filter(call => call.service === selected);
    }
  }

  const dates = Array.from(new Set(filteredCalls.map(c => c.timestamp.substring(0, 10)))).sort();

  // User Chart Daten
  let userSeries: LineSeriesOption[] = [];

  if (this.selectedFilters?.category && this.selectedFilters.category !== 'statusCode') {
    const selected = this.selectedFilters.category;

    if (this.isApiUser(selected)) {
      const services = Array.from(new Set(filteredCalls.map(c => c.service)));
      userSeries = services.map(service => ({
        name: service,
        type: 'line',
        data: dates.map(date => {
          const count = filteredCalls.filter(c => c.service === service && c.timestamp.startsWith(date)).length;
          return count === 0 ? null : count;
        }),
        connectNulls: true
      }));
    } else {
      const users = Array.from(new Set(filteredCalls.map(c => c.user)));
      userSeries = users.map(user => ({
        name: user,
        type: 'line',
        data: dates.map(date => {
          const count = filteredCalls.filter(c => c.user === user && c.timestamp.startsWith(date)).length;
          return count === 0 ? null : count;
        }),
        connectNulls: true
      }));
    }
  } else {
    const users = Array.from(new Set(filteredCalls.map(c => c.user)));
    userSeries = users.map(user => ({
      name: user,
      type: 'line',
      data: dates.map(date => {
        const count = filteredCalls.filter(c => c.user === user && c.timestamp.startsWith(date)).length;
        return count === 0 ? null : count;
      }),
      connectNulls: true
    }));
  }

  this.userChartOptions = {
    ...this.userChartOptions,
    xAxis: { type: 'category', data: dates },
    series: userSeries
  };

  // StatusCode Chart Daten
  const statusCodes = Array.from(new Set(filteredCalls.map(c => c.statusCode)));

  const statusCodeSeries: LineSeriesOption[] = statusCodes.map(code => ({
    name: `Status Code ${code}`,
    type: 'line',
    data: dates.map(date => {
      const count = filteredCalls.filter(c => c.statusCode === code && c.timestamp.startsWith(date)).length;
      return count === 0 ? null : count;
    }),
    connectNulls: true
  }));

  this.statusCodeChartOptions = {
    ...this.statusCodeChartOptions,
    xAxis: { type: 'category', data: dates },
    series: statusCodeSeries
  };
}


  openExportOptions = false;

  // Öffnet die Exportoptionen und exportiert die gefilterten Daten als CSV oder Excel
  exportData(format: 'csv' | 'xlsx') {
    // Gefilterte Daten im aktuellen Zeitraum und mit Filtern holen
    let filteredCalls = apiCalls.filter(call => {
      const callDate = call.timestamp.substring(0, 10);
      return callDate >= this.currentFrom && callDate <= this.currentTo;
    });

    if (this.selectedFilters) {
      if (this.selectedFilters.statusCodes?.length) {
        filteredCalls = filteredCalls.filter(call =>
          this.selectedFilters.statusCodes.includes(call.statusCode.toString())
        );
      }

      if (this.selectedFilters.category) {
        filteredCalls = filteredCalls.filter(call =>
          call.user === this.selectedFilters.category || call.service === this.selectedFilters.category
        );
      }
    }

    // Filename mit Zeitraum (von-bis)
    const from = this.currentFrom ?? formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const to = this.currentTo ?? formatDate(new Date());
    const filename = `export_${from}_to_${to}.${format}`;

    if (format === 'csv') {
      this.exportCSV(filteredCalls, filename);
    } else if (format === 'xlsx') {
      this.exportExcel(filteredCalls, filename);
    }

    this.openExportOptions = false;
  }


  // Variablen für aktuellen Zeitraum speichern (wichtig für Export)
  currentFrom = this.dateDropdownOptions[0].from;
  currentTo = this.dateDropdownOptions[0].to;


  // Exportiert die Daten als CSV-Datei
  private exportCSV(data: any[], filename: string) {
    if (!data.length) {
      return;
    }
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    const csv = [
      header.join(','), // header row first
      ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  // Exportiert die Daten als Excel-Datei
  private exportExcel(data: any[], filename: string) {
    if (!data.length) {
      return;
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }

}
