import { UUID, Session, SessionRef } from '../../model'
import { SessionRepository } from '../../repositories'

export class MemSessionRepository implements SessionRepository {
  private sessions: Map<UUID, Session>

  constructor(sessions: Session[]) {
    this.sessions = new Map(sessions.map(s => [s.id, s]))
  }

  fetchByRef(ref: SessionRef): Promise<Session | null> {
    return Promise.resolve(this.sessions.get(ref.id) || null)
  }

  async save(session: Session): Promise<void> {
    this.sessions.set(session.id, session)
  }
}