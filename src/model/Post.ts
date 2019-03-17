import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Post {
  /* required columns, it will be delivered from database server */
  @PrimaryGeneratedColumn("uuid")
  readonly id?: string

  @CreateDateColumn()
  readonly createdAt?: Date
  @UpdateDateColumn()
  readonly updatedAt?: Date

  /* entity-specific columns */
  @Column('user_id')
  @Index('IDX_posts_user_id-created_at_DESC', { synchronize: false })
  readonly userId: string

  @Column()
  readonly text: string
  @Column()
  readonly visibility: string = 'public'

  /* relations, use if needed */
  @ManyToOne(type => User)
  @JoinColumn({ name: "user_id" })
  readonly user?: User

  constructor(text: string, userId: string) {
    this.userId = userId
    this.text = text
  }
}
