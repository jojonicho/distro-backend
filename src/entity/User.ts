import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
  // JoinColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Message } from "./Message";
import { Channel } from "./Channel";

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

  @Field()
  @Column("text", { default: "https://i.imgur.com/7lIcAP5.gif" })
  image: string;

  @Field(() => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @JoinTable()
  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel, (channel: Channel) => channel.users)
  channels: Channel[];
}
