import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransaction1615327046521 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions",
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            
          }
        ]
      }
      ))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
