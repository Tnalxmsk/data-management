import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { IsEmail, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { RolesEnum } from '../const/roles.const';

@Entity()
export class UsersModel extends BaseModel {
  @Column({ type: 'varchar', length: 20 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  phone: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
