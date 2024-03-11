import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./Client";
import { Dietitian } from "./Dietitian";
import { Role } from "./Role";
  
  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column({ unique: true })
    username!: string;
  
    @Column()
    first_name!: string;
  
    @Column()
    last_name!: string;
  
    @Column({ unique: true })
    email!: string;
  
    @Column()
    password_hash!: string;
  
    @Column()
    phone!: string;
  
    @Column()
    birthday_date!: Date;
  
    @CreateDateColumn({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP(6)",
    })
    register_date?: Date;
  
    @UpdateDateColumn({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP(6)",
      onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    modified_date?: Date;
  
    @DeleteDateColumn()
    deleted_date?: Date;
  
    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: "role_id" })
    role!: Role;
  
    @OneToOne(() => Dietitian, (dietitian) => dietitian.user)
    dietitian?: Dietitian;
  
    @OneToOne(() => Client, (client) => client.user)
    client?: Client;

  }
  