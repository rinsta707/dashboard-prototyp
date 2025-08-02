export interface SystemLogsFilterParameters {
  dateFrom: string;
  dateTo: string;
  users: number[];
  operations: string[];
  success: boolean;
  failure: boolean;
  text: string;
}
