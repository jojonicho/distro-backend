import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  // JoinColumn,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Channel } from "./Channel";

@ObjectType()
@Entity("messages")
export class Message extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  date: Date;

  @Field()
  @Column("text", { nullable: false })
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  // @Field(() => Channel, { defaultValue: -1 })
  @Field(() => Channel, { defaultValue: -1 })
  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;
}
