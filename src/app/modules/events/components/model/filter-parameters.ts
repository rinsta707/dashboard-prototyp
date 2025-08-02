export interface EventsFilterParameters {
  dateFrom: string;
  dateTo: string;
  apikey: string[];
  events: string[];
  service: string[];
  year: boolean;
  month: boolean;
  day: boolean;
  hour: boolean;
  minute: boolean;
}
