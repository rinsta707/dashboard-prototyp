export interface EventLog {
    id: number,
    apikey: string,
    eventtype: string,
    service: string,
    timeunit: string,
    quota: number,
    requests: number,
    timestamp: string
}
