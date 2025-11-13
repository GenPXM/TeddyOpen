import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Link } from './link.entity';

@Entity('clicks')
export class Click {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Link)
  @JoinColumn({ name: 'linkId' })
  link: Link;
  @Column({ type: 'int' })
  linkId: number;

  @CreateDateColumn() createdAt: Date;
}
