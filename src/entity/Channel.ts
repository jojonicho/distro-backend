import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
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

  @ManyToMany(() => User, (user) => user.channels)
  @Field(() => [User])
  users: User[];

  @Field()
  @Column("text", { default: "https://i.imgur.com/7lIcAP5.gif" })
  image: string;

  @OneToMany(() => Message, (message) => message.channel, { lazy: true })
  @JoinTable()
  messages: Message[];
}
