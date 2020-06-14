import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity("messages")
export class Message extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.messages, { cascade: true })
  @JoinColumn({ referencedColumnName: "username", name: "username" })
  user: User;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column("text", { nullable: false })
  content: string;
}
