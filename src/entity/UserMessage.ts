// import {
//   Entity,
//   PrimaryColumn,
//   ManyToOne,
//   JoinColumn,
//   OneToMany,
// } from "typeorm";
// import { User } from "./User";
// import { Message } from "./Message";

// @Entity()
// export class UserMessage extends {
//   @PrimaryColumn()
//   userId: number;

//   @PrimaryColumn()
//   messageId: number;

//   @ManyToOne(() => User, (user) => user.messageConnection, { primary: true })
//   @JoinColumn({ name: "user_id" })
//   user: Promise<User>;

//   @OneToMany(() => Message, (message) => message.userConnection, {
//     primary: true,
//   })
//   @JoinColumn({ name: "message_id" })
//   message: Promise<Message>;
// }
