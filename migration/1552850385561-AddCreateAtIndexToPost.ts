import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreateAtIndexToPost1552850385561 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_posts_user_id-created_at_DESC" ON "posts" ("user_id", "created_at" DESC) `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_posts_user_id-created_at_DESC"`);
    }

}
