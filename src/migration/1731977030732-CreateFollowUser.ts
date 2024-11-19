import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollowUser1731977030732 implements MigrationInterface {
    name = 'CreateFollowUser1731977030732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_followers\` (\`followerId\` int NOT NULL, \`followingId\` int NOT NULL, INDEX \`IDX_c3f56a3157b50bc8adcc6acf27\` (\`followerId\`), INDEX \`IDX_b319cdc26936df06bca3feb3bc\` (\`followingId\`), PRIMARY KEY (\`followerId\`, \`followingId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_c3f56a3157b50bc8adcc6acf278\` FOREIGN KEY (\`followerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_b319cdc26936df06bca3feb3bc2\` FOREIGN KEY (\`followingId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_b319cdc26936df06bca3feb3bc2\``);
        await queryRunner.query(`ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_c3f56a3157b50bc8adcc6acf278\``);
        await queryRunner.query(`DROP INDEX \`IDX_b319cdc26936df06bca3feb3bc\` ON \`user_followers\``);
        await queryRunner.query(`DROP INDEX \`IDX_c3f56a3157b50bc8adcc6acf27\` ON \`user_followers\``);
        await queryRunner.query(`DROP TABLE \`user_followers\``);
    }

}
