import { Services } from '../services'
export type Usecase<F extends ((req: any) => Promise<any>)> = (services: Services) => F