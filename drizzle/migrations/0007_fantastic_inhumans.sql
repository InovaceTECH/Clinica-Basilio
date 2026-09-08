CREATE TABLE "commercial_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"title" varchar(160) NOT NULL,
	"content" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "objection_playbooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"category" "objection_category" NOT NULL,
	"title" varchar(160) NOT NULL,
	"objective" text NOT NULL,
	"guidelines" text NOT NULL,
	"suggested_questions" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commercial_rules" ADD CONSTRAINT "commercial_rules_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objection_playbooks" ADD CONSTRAINT "objection_playbooks_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "commercial_rules_clinic_active_idx" ON "commercial_rules" USING btree ("clinic_id","active");--> statement-breakpoint
CREATE INDEX "playbooks_clinic_category_idx" ON "objection_playbooks" USING btree ("clinic_id","category");--> statement-breakpoint
CREATE UNIQUE INDEX "playbooks_clinic_title_unique" ON "objection_playbooks" USING btree ("clinic_id","title");