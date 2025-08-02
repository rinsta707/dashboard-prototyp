export interface SystemLog {
    id: number,
    operation: string,
    result: 'SUCCESS' | 'ERROR',
    message: string,
    createdBy: string,
    timestamp: string
}
