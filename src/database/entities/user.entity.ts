import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  education: string;

  @Column()
  cinc: string;

  @Column()
  address: string;

  @Column()
  phoneNo: string;
}
