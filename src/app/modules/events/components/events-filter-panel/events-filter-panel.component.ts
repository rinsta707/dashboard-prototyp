import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HclSelectOption, HclTranslationService } from "@hacon/hcl";
import { EventsFilterParameters } from '../model/filter-parameters';
import { EventsService } from '../../services/events-logs.service';

@Component({
  selector: 'app-events-filter-panel',
  templateUrl: './events-filter-panel.component.html',
  styleUrl: './events-filter-panel.component.scss'
})
export class EventsFilterPanelComponent implements OnInit, AfterViewInit {

  @Output() filterEvent = new EventEmitter<EventsFilterParameters>();
  @Output() clearEvent = new EventEmitter<void>();

  constructor(private eventsService: EventsService, private translate: HclTranslationService) { }

  protected dateFrom: Date = new Date();
  protected dateTo: Date = new Date();
  protected selectedApiKey: string[] = [];
  protected selectedEvents: string[] = [];
  protected selectedServices: string[] = [];
  protected selectYear: boolean = true;
  protected selectMonth: boolean = true;
  protected selectDay: boolean = true;
  protected selectHour: boolean = true;
  protected selectMinute: boolean = true;

  selectApiKeyOptions: HclSelectOption<string>[] = [
    { modelValue: '', viewValue: '' }
  ]

  selectEventsOptions: HclSelectOption<string>[] = [
    { modelValue: '', viewValue: '' }
  ]

  selectServiceOptions: HclSelectOption<string>[] = [
    { modelValue: '', viewValue: '' }
  ]

  getApikeyFromLogs(): void {
    this.eventsService.getApiKeyFromEvents().subscribe((apikeys: string[]) => {
      this.selectApiKeyOptions = [];
      apikeys.forEach(apikey => {
        this.selectApiKeyOptions.push({ modelValue: apikey, viewValue: apikey });
        this.selectedApiKey = [...this.selectedApiKey, apikey];
      })
    });
  }

  getEventsFromLogs(): void {
    this.eventsService.getEventsFromEvents().subscribe((events: string[]) => {
      this.selectEventsOptions = [];
      events.forEach(event => {
        let eventName: string = this.translate.instant('events.table.events.' + event);
        this.selectEventsOptions.push({ modelValue: event, viewValue: eventName });
        this.selectedEvents = [...this.selectedEvents, event];
      })
    });
  }

  getServicesFromLogs(): void {
    this.eventsService.getServicesFromEvents().subscribe((services: string[]) => {
      this.selectServiceOptions = [];
      services.forEach(service => {
        this.selectServiceOptions.push({ modelValue: service, viewValue: service });
        this.selectedServices = [...this.selectedServices, service];
      })
    });
  }

  getDatesFromLogs(): void {
    this.eventsService.getDatesFromEvents().subscribe((dates: { FROM: string, TO: string }) => {
      if (dates.FROM) {
        this.dateFrom = new Date(dates.FROM);
      }
      if (dates.TO) {
        this.dateTo = new Date(dates.TO);
      }
    });
  }

  ngOnInit(): void {
    this.updateFields();
  }

  ngAfterViewInit(): void {
    this.updateFields();
  }

  onFilter() {
    let filterParameters: EventsFilterParameters = {
      dateFrom: this.dateFrom.toISOString(),
      dateTo: this.dateTo.toISOString(),
      apikey: this.selectedApiKey,
      events: this.selectedEvents,
      service: this.selectedServices,
      year: this.selectYear,
      month: this.selectMonth,
      day: this.selectDay,
      hour: this.selectHour,
      minute: this.selectMinute,
    }

    this.filterEvent.emit(filterParameters);
  }

  onClear() {
    this.selectApiKeyOptions = [{ modelValue: '', viewValue: '' }];
    this.selectEventsOptions = [{ modelValue: '', viewValue: '' }];
    this.selectServiceOptions = [{ modelValue: '', viewValue: '' }];
    this.selectedApiKey = [];
    this.selectedEvents = [];
    this.selectedServices = [];
    this.selectYear = true;
    this.selectMonth = true;
    this.selectDay = true;
    this.selectHour = true;
    this.selectMinute = true;
    this.updateFields();

    this.clearEvent.emit();
  }

  private updateFields() {
    this.getApikeyFromLogs();
    this.getEventsFromLogs();
    this.getServicesFromLogs();
    this.getDatesFromLogs();
  }
}
