CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid,
	"definition_id" uuid,
	"activity_date" timestamp with time zone DEFAULT now(),
	"notes" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"group" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_reports" (
	"activity_id" uuid,
	"report_id" uuid,
	CONSTRAINT "activity_reports_activity_id_report_id_pk" PRIMARY KEY("activity_id","report_id")
);
--> statement-breakpoint
CREATE TABLE "data_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"group" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"primary_email" text,
	"primary_phone" text,
	"bio" text,
	"data" jsonb DEFAULT '{}'::jsonb,
	"bio_embedding" vector(1536),
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "person_primary_email_unique" UNIQUE("primary_email")
);
--> statement-breakpoint
CREATE TABLE "report_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid,
	"chunk_index" integer NOT NULL,
	"content_chunk" text NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "report_links" (
	"parent_report_id" uuid,
	"child_report_id" uuid,
	CONSTRAINT "report_links_parent_report_id_child_report_id_pk" PRIMARY KEY("parent_report_id","child_report_id"),
	CONSTRAINT "no_self_link" CHECK ("report_links"."parent_report_id" != "report_links"."child_report_id")
);
--> statement-breakpoint
CREATE TABLE "report_people" (
	"report_id" uuid,
	"person_id" uuid,
	CONSTRAINT "report_people_report_id_person_id_pk" PRIMARY KEY("report_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"subtitle" text,
	"group" text,
	"content" text,
	"tags" text[],
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_definition_id_activity_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."activity_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_reports" ADD CONSTRAINT "activity_reports_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_reports" ADD CONSTRAINT "activity_reports_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_embeddings" ADD CONSTRAINT "report_embeddings_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_links" ADD CONSTRAINT "report_links_parent_report_id_reports_id_fk" FOREIGN KEY ("parent_report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_links" ADD CONSTRAINT "report_links_child_report_id_reports_id_fk" FOREIGN KEY ("child_report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_people" ADD CONSTRAINT "report_people_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_people" ADD CONSTRAINT "report_people_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_activities_person_id" ON "activities" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "idx_activities_date" ON "activities" USING btree ("activity_date");--> statement-breakpoint
CREATE INDEX "idx_activity_reports_report" ON "activity_reports" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "person_bio_embedding_index" ON "person" USING hnsw ("bio_embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_person_name" ON "person" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_person_data" ON "person" USING gin ("data");--> statement-breakpoint
CREATE INDEX "report_embeddings_embedding_index" ON "report_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_report_embeddings_report_id" ON "report_embeddings" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "idx_report_links_child" ON "report_links" USING btree ("child_report_id");--> statement-breakpoint
CREATE INDEX "idx_report_people_person" ON "report_people" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "idx_reports_group" ON "reports" USING btree ("group");--> statement-breakpoint
CREATE INDEX "idx_reports_tags" ON "reports" USING gin ("tags");