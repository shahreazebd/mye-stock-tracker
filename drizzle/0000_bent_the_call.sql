CREATE TABLE "inventoryReports" (
	"id" text PRIMARY KEY NOT NULL,
	"platformId" text NOT NULL,
	"storeId" text NOT NULL,
	"accuracy" double precision DEFAULT 0,
	"total" integer DEFAULT 0,
	"success" integer DEFAULT 0,
	"failed" integer DEFAULT 0,
	"unmapped" integer DEFAULT 0,
	"failedSku" text[] DEFAULT '{}',
	"unmappedSku" text[] DEFAULT '{}',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text NOT NULL,
	"accuracy" integer DEFAULT 0,
	"totalTest" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "platforms_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"platformId" text NOT NULL,
	"myeStoreId" text NOT NULL,
	"locationId" text NOT NULL,
	"companyId" text NOT NULL,
	"name" text NOT NULL,
	"accuracy" integer DEFAULT 0,
	"totalTest" integer DEFAULT 0,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "inventoryReports" ADD CONSTRAINT "inventoryReports_platformId_platforms_id_fk" FOREIGN KEY ("platformId") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventoryReports" ADD CONSTRAINT "inventoryReports_storeId_stores_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_platformId_platforms_id_fk" FOREIGN KEY ("platformId") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;