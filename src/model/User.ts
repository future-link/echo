import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Index, UpdateDateColumn, Column, Unique } from 'typeorm'

@Entity()
@Unique(['handleName'])
export class User {
  /* required columns, it will be delivered from database server */
  @PrimaryGeneratedColumn("uuid")
  readonly id?: string

  @CreateDateColumn()
  readonly createdAt?: Date
  @UpdateDateColumn()
  readonly updatedAt?: Date

  /* entity-specific columns */
  @Column()
  @Index()
  readonly handleName: string

  // TODO: password

  constructor(handleName: string, password: string) {
    this.handleName = handleName
  }
}
