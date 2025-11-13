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
  @Column() linkId: string;
  @CreateDateColumn() createdAt: Date;
}
