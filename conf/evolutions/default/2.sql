# --- !Ups
ALTER TABLE "MODEL" ADD COLUMN "ORGANIZATION_ID" INTEGER NOT NULL DEFAULT 2;

# --- !Downs
ALTER TABLE "MODEL" DROP COLUMN "ORGANIZATION_ID" INTEGER NOT NULL