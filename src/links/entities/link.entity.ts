import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar', length: 2048 })
  originUrl: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'int', default: 0 })
  clicks: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner?: User;

  @Column({ type: 'uuid', nullable: true }) ownerId?: string | null;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true }) deletedAt?: Date | null;
}
