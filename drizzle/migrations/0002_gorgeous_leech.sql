CREATE TYPE "public"."objection_category" AS ENUM('FINANCIAL', 'SHARED_DECISION', 'INDECISION', 'COMPARISON', 'LOW_URGENCY', 'INSECURITY', 'NO_RESPONSE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."opportunity_priority" AS ENUM('HIGH', 'MEDIUM', 'LOW');--> statement-breakpoint
CREATE TYPE "public"."opportunity_status" AS ENUM('NEW', 'TO_ANALYZE', 'CONTACT_PENDING', 'CONTACTED', 'WAITING_PATIENT', 'FOLLOW_UP_SCHEDULED', 'NEGOTIATING', 'RECOVERED', 'LOST', 'DO_NOT_CONTACT');--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"treatment" varchar(500) NOT NULL,
	"budget_value" numeric(12, 2) NOT NULL,
	"final_budget_value" numeric(12, 2),
	"budget_date" date NOT NULL,
	"professional_name" varchar(160),
	"lead_source" varchar(100),
	"raw_objection" text,
	"objection_category" "objection_category",
	"priority_score" integer DEFAULT 0 NOT NULL,
	"priority" "opportunity_priority" DEFAULT 'MEDIUM' NOT NULL,
	"status" "opportunity_status" DEFAULT 'NEW' NOT NULL,
	"last_contact_at" timestamp with time zone,
	"next_follow_up_at" timestamp with time zone,
	"responsible_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "opportunities_budget_value_non_negative" CHECK ("opportunities"."budget_value" >= 0),
	CONSTRAINT "opportunities_final_budget_value_non_negative" CHECK ("opportunities"."final_budget_value" IS NULL OR "opportunities"."final_budget_value" >= 0),
	CONSTRAINT "opportunities_priority_score_range" CHECK ("opportunities"."priority_score" BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"name" varchar(160) NOT NULL,
	"phone" varchar(32),
	"external_reference" varchar(160),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_responsible_user_id_users_id_fk" FOREIGN KEY ("responsible_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "opportunities_clinic_id_idx" ON "opportunities" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "opportunities_patient_id_idx" ON "opportunities" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "opportunities_clinic_status_idx" ON "opportunities" USING btree ("clinic_id","status");--> statement-breakpoint
CREATE INDEX "opportunities_clinic_priority_idx" ON "opportunities" USING btree ("clinic_id","priority");--> statement-breakpoint
CREATE INDEX "opportunities_clinic_budget_date_idx" ON "opportunities" USING btree ("clinic_id","budget_date");--> statement-breakpoint
CREATE INDEX "opportunities_clinic_next_follow_up_at_idx" ON "opportunities" USING btree ("clinic_id","next_follow_up_at");--> statement-breakpoint
CREATE INDEX "patients_clinic_id_idx" ON "patients" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "patients_clinic_phone_idx" ON "patients" USING btree ("clinic_id","phone");--> statement-breakpoint
CREATE UNIQUE INDEX "patients_clinic_external_reference_unique" ON "patients" USING btree ("clinic_id","external_reference");