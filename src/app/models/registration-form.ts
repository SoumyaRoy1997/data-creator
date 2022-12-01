import { dashboard } from './dashboard-details'

export interface registration{
    username: string,
    password?: string,
    fname?: string,
    lname?: string
    dashboard?:dashboard[]
}