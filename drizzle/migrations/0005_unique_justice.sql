CREATE TYPE "public"."interaction_channel" AS ENUM('WHATSAPP', 'PHONE', 'IN_PERSON', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."interaction_result" AS ENUM('NO_RESPONSE', 'REQUESTED_CALLBACK', 'STILL_THINKING', 'INTERESTED', 'NEGOTIATING', 'RETURN_SCHEDULED', 'PROCEDURE_SCHEDULED', 'CLOSED', 'DECLINED', 'DO_NOT_CONTACT');--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"channel" "interaction_channel" NOT NULL,
	"result" "interaction_result" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "interactions_clinic_opportunity_created_at_idx" ON "interactions" USING btree ("clinic_id","opportunity_id","created_at");