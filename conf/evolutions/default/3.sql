# --- !Ups
ALTER TABLE "MODEL" ADD COLUMN "LATITUDE" INTEGER;
ALTER TABLE "MODEL" ADD COLUMN "LONGITUDE" INTEGER;

# --- !Downs
ALTER TABLE "MODEL" DROP COLUMN "LATITUDE";
ALTER TABLE "MODEL" DROP COLUMN "LONGITUDE";