import { Session, SessionRef } from '../model/session'

export interface SessionRepository {
  fetchByRef(ref: SessionRef): Promise<Session | null>
  save(session: Session): Promise<void>
}