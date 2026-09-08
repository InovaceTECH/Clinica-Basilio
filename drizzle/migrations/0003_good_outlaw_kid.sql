CREATE TYPE "public"."import_row_status" AS ENUM('IMPORTED', 'SKIPPED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."import_status" AS ENUM('PROCESSING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED');--> statement-breakpoint
CREATE TABLE "import_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_id" uuid NOT NULL,
	"clinic_id" uuid NOT NULL,
	"row_number" integer NOT NULL,
	"status" "import_row_status" NOT NULL,
	"source_fingerprint" varchar(64),
	"error_code" varchar(80),
	"error_message" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"sheet_name" varchar(255) NOT NULL,
	"column_mapping" jsonb NOT NULL,
	"total_rows" integer NOT NULL,
	"imported_rows" integer DEFAULT 0 NOT NULL,
	"skipped_rows" integer DEFAULT 0 NOT NULL,
	"failed_rows" integer DEFAULT 0 NOT NULL,
	"status" "import_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "opportunities" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "opportunities" ADD COLUMN "source_fingerprint" varchar(64);--> statement-breakpoint
ALTER TABLE "import_rows" ADD CONSTRAINT "import_rows_import_id_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."imports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_rows" ADD CONSTRAINT "import_rows_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imports" ADD CONSTRAINT "imports_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imports" ADD CONSTRAINT "imports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "import_rows_import_id_idx" ON "import_rows" USING btree ("import_id");--> statement-breakpoint
CREATE INDEX "import_rows_clinic_status_idx" ON "import_rows" USING btree ("clinic_id","status");--> statement-breakpoint
CREATE INDEX "imports_clinic_created_at_idx" ON "imports" USING btree ("clinic_id","created_at");--> statement-breakpoint
CREATE INDEX "imports_user_id_idx" ON "imports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "imports_clinic_status_idx" ON "imports" USING btree ("clinic_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "opportunities_clinic_source_fingerprint_unique" ON "opportunities" USING btree ("clinic_id","source_fingerprint");