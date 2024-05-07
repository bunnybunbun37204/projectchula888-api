```
npm install
npm run dev
```

```
npm run deploy
```

```
bunx wrangler d1 migrations create project888 create_user_table
bunx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output migrations/0001_create_user_table.sql
bunx wrangler d1 migrations apply project888 --local
bunx prisma generate
```

