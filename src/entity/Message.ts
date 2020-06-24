import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  // JoinColumn,
  BaseEntity,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity("messages")
export class Message extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column("text", { nullable: false })
  content: string;

  @ManyToOne(() => User, (user) => user.message, { lazy: true, cascade: true })
  @Field(() => User)
  user: User;
}
