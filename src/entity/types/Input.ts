import { Column } from "typeorm";
import { IsEmail, MinLength, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";
// import { User } from "../User";

@InputType()
export class MessageInput {
  @Field()
  @Column("text", { nullable: false })
  content: string;
  // @Field()
  // @Column("text", { nullable: false })
  // user: User;
}

@InputType()
export class RegisterInput {
  @Field()
  @Column("text", { nullable: false, unique: true })
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Field()
  @Column("text", { nullable: false, unique: true })
  @MinLength(6, {
    message:
      "Username is too short. Minimal length is $constraint1 characters, but actual is $value",
  })
  @MaxLength(25, {
    message:
      "Username is too long. Maximal length is $constraint1 characters, but actual is $value",
  })
  username: string;

  @Field()
  @MinLength(8)
  @Column("text", { nullable: false })
  password: string;
}
