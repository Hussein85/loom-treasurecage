# --- !Ups

create table "FILE" ("ID" VARCHAR(254) NOT NULL PRIMARY KEY,"MODEL_ID" INTEGER NOT NULL,"TYPE" VARCHAR(254) NOT NULL,"TIMESTAMP" TIMESTAMP NOT NULL,"FINISHED" BOOLEAN NOT NULL,"USER_ID" VARCHAR(254) NOT NULL);
create table "MODEL" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL,"USER_ID" VARCHAR(254) NOT NULL,"DATE" TIMESTAMP NOT NULL,"MATERIAL" VARCHAR(254) NOT NULL,"LOCATION" VARCHAR(254) NOT NULL,"TEXT" TEXT NOT NULL,"TIMESTAMP" TIMESTAMP NOT NULL,"PUBLISHED" BOOLEAN NOT NULL);
create table "ORGANIZATION" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL);
create table "TAG" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL);
create unique index "IDX_NAME" on "TAG" ("NAME");
create table "TAG_MODEL" ("TAG_ID" INTEGER NOT NULL,"MODEL_ID" INTEGER NOT NULL);
create unique index "IDX_MODEL_TAG" on "TAG_MODEL" ("TAG_ID","MODEL_ID");
create table "token" ("uuid" VARCHAR(254) NOT NULL,"email" VARCHAR(254) NOT NULL,"creationTime" TIMESTAMP NOT NULL,"expirationTime" TIMESTAMP NOT NULL,"isSignUp" BOOLEAN NOT NULL);
create table "user" ("id" BIGSERIAL NOT NULL PRIMARY KEY,"USER_ID" VARCHAR(254) NOT NULL,"PROVIDER_ID" VARCHAR(254) NOT NULL,"FIRST_NAME" VARCHAR(254),"LAST_NAME" VARCHAR(254),"FULL_NAME" VARCHAR(254),"EMAIL" VARCHAR(254),"AVATAR_URL" VARCHAR(254),"AUTH_METHOD" VARCHAR(254) NOT NULL,"TOKEN" VARCHAR(254),"SECRET" VARCHAR(254),"ACCESS_TOKEN" VARCHAR(254),"TOKEN_TYPE" VARCHAR(254),"EXPIRES_IN" INTEGER,"REFRESH_TOKEN" VARCHAR(254),"HASHER" VARCHAR(254),"PASSWORD" VARCHAR(254),"SALT" VARCHAR(254),"ROLE" VARCHAR(254) NOT NULL,"ORGANIZATION_ID" INTEGER NOT NULL);
create unique index "idx_a" on "user" ("EMAIL");
alter table "user" add constraint "ORAGNIZATION" foreign key("ORGANIZATION_ID") references "ORGANIZATION"("ID") on update NO ACTION on delete NO ACTION;

# --- !Downs

alter table "user" drop constraint "ORAGNIZATION";
drop table "user";
drop table "token";
drop table "TAG_MODEL";
drop table "TAG";
drop table "ORGANIZATION";
drop table "MODEL";
drop table "FILE";

