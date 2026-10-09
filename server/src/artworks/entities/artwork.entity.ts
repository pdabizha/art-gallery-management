import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Artwork {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  artist: string

  @Column()
  type: string

  @Column('decimal')
  price: number

  @Column({ default: true })
  availability: boolean

  @Column()
  imageUrl: string
}