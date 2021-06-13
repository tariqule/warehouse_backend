import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("Product")
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  SKU: string;

  @Field()
  @Column("text")
  brand: string;

  @Field()
  @Column("text")
  title: string;

  @Field()
  @Column("text")
  unit: string;
}
