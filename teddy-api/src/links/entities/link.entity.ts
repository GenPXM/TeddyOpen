import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 2048 })
  originUrl: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'int', default: 0 })
  clicks: number;

  @Column({ type: 'int', nullable: true })
  ownerId?: number | null;

  @Column({ name: 'tenantId', type: 'int', nullable: true })
  tenantId?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
