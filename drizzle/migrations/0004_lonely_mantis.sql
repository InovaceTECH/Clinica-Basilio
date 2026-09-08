CREATE TABLE "ai_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"provider" varchar(50) NOT NULL,
	"model" varchar(160) NOT NULL,
	"objection_category" "objection_category" NOT NULL,
	"context_analysis" text NOT NULL,
	"contact_goal" text NOT NULL,
	"strategy" text NOT NULL,
	"suggested_approach" text NOT NULL,
	"suggested_message" text NOT NULL,
	"next_action" text NOT NULL,
	"suggested_follow_up_days" integer NOT NULL,
	"prompt_version" varchar(100) NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_analyses_clinic_opportunity_created_at_idx" ON "ai_analyses" USING btree ("clinic_id","opportunity_id","created_at");