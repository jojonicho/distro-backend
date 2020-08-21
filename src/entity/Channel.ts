import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";
import { Message } from "./Message";

@ObjectType()
@Entity("channels")
export class Channel extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text", { nullable: false })
  name: string;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.channels)
  users: User[];

  @Field()
  @Column("text", { default: "https://i.imgur.com/7lIcAP5.gif" })
  image: string;

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}
