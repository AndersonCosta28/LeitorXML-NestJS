export const ormconfig = JSON.parse(`
{
    "type": "postgres",
    "host":"kesavan.db.elephantsql.com",
    "username": "mwvqaohn",
    "password": "Dx7hUxolx6NMGVJHwyq0GJxlpiulqJuS",
    "database": "mwvqaohn",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "migrations": ["dist/database/migrations/**/*{.ts,.js}"],
    "synchronize": false,
    
    "cli": {
        "migrationsDir": "src/database/migrations/"
    }
}
`)