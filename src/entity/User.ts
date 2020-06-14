import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Message } from "./Message";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text", { nullable: false, unique: true })
  email: string;

  @Field()
  @Column("text", { nullable: false, unique: true })
  username: string;

  @Column("text", { nullable: false })
  password: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @OneToMany((_) => Message, (inverseSide) => inverseSide.user)
  messages: [Message];
}
