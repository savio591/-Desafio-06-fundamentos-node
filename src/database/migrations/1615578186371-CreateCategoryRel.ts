import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export default class CreateCategoryRel1615578186371 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('transactions', new TableForeignKey({
      name: 'CategoryRel',
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'categories',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropForeignKey('transactions', 'CategoryRel')
  }

}
