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
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Link)
  @JoinColumn({ name: 'linkId' })
  link: Link;
  @Column('uuid') linkId: string;
  @CreateDateColumn() createdAt: Date;
}
