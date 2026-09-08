CREATE TYPE "public"."follow_up_status" AS ENUM('PENDING', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"assigned_user_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"reason" text NOT NULL,
	"notes" text,
	"status" "follow_up_status" DEFAULT 'PENDING' NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "follow_ups_clinic_scheduled_at_idx" ON "follow_ups" USING btree ("clinic_id","scheduled_at");--> statement-breakpoint
CREATE INDEX "follow_ups_clinic_opportunity_status_idx" ON "follow_ups" USING btree ("clinic_id","opportunity_id","status");