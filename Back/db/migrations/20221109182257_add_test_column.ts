import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('places', table => {
    table.string('postCode', 128);
    table.string('block', 128);
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('places', table => {
    table.dropColumn('postCode');
    table.dropColumn('block');
  })
}

