import { Entity, Index, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn, PrimaryColumn, Column } from 'typeorm'
import { User } from './User'

@Entity('users_profiles')
export class UserProfile {
  /* required columns, it will be delivered from database server */
  @CreateDateColumn()
  readonly createdAt?: Date
  @UpdateDateColumn()
  readonly updatedAt?: Date

  /* entity-specific columns */
  @PrimaryColumn()
  readonly id: string
  @Column()
  name: string = 'Nameless'

  /* relations, use if needed */
  @ManyToOne(type => User)
  @JoinColumn({ name: "id" })
  readonly user?: User

  constructor(userId: string) {
    this.id = userId
  }
}
