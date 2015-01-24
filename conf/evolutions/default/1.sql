# --- Created by Slick DDL
# To stop Slick DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table "MODEL" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL,"USER_ID" VARCHAR(254) NOT NULL,"DATE" TIMESTAMP NOT NULL,"MATERIAL" VARCHAR(254) NOT NULL,"LOCATION" VARCHAR(254) NOT NULL,"TEXT" VARCHAR(254) NOT NULL,"PATH_OBJECT" VARCHAR(254) NOT NULL,"PATH_TEXTURE" VARCHAR(254) NOT NULL,"PATH_THUMBNAIL" VARCHAR(254) NOT NULL);
create table "ORGANIZATION" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL);
create table "TAG" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL);
create unique index "IDX_NAME" on "TAG" ("NAME");
create table "TAG_MODEL" ("TAG_ID" INTEGER NOT NULL,"MODEL_ID" INTEGER NOT NULL);
create unique index "IDX_MODEL_TAG" on "TAG_MODEL" ("TAG_ID","MODEL_ID");
create table "token" ("uuid" VARCHAR(254) NOT NULL,"email" VARCHAR(254) NOT NULL,"creationTime" TIMESTAMP NOT NULL,"expirationTime" TIMESTAMP NOT NULL,"isSignUp" BOOLEAN NOT NULL);
create table "user" ("id" BIGSERIAL NOT NULL PRIMARY KEY,"userId" VARCHAR(254) NOT NULL,"providerId" VARCHAR(254) NOT NULL,"firstName" VARCHAR(254),"lastName" VARCHAR(254),"fullName" VARCHAR(254),"email" VARCHAR(254),"avatarUrl" VARCHAR(254),"authMethod" VARCHAR(254) NOT NULL,"token" VARCHAR(254),"secret" VARCHAR(254),"accessToken" VARCHAR(254),"tokenType" VARCHAR(254),"expiresIn" INTEGER,"refreshToken" VARCHAR(254),"hasher" VARCHAR(254),"password" VARCHAR(254),"salt" VARCHAR(254),"role" VARCHAR(254) NOT NULL,"ADDRESS_ID" INTEGER NOT NULL);
create unique index "idx_a" on "user" ("email");
alter table "user" add constraint "ORAGNIZATION" foreign key("ADDRESS_ID") references "ORGANIZATION"("ID") on update NO ACTION on delete NO ACTION;

# --- !Downs

alter table "user" drop constraint "ORAGNIZATION";
drop table "user";
drop table "token";
drop table "TAG_MODEL";
drop table "TAG";
drop table "ORGANIZATION";
drop table "MODEL";

