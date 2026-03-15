CREATE TABLE "relationship_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"group" text,
	"user_id" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"person1_id" uuid,
	"person2_id" uuid,
	"relationship_type_id" uuid,
	CONSTRAINT "relationships_person1_id_person2_id_pk" PRIMARY KEY("person1_id","person2_id")
);
--> statement-breakpoint
ALTER TABLE "relationship_types" ADD CONSTRAINT "relationship_types_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_person1_id_person_id_fk" FOREIGN KEY ("person1_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_person2_id_person_id_fk" FOREIGN KEY ("person2_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_relationship_type_id_relationship_types_id_fk" FOREIGN KEY ("relationship_type_id") REFERENCES "public"."relationship_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_relationships_person1" ON "relationships" USING btree ("person1_id");--> statement-breakpoint
CREATE INDEX "idx_relationships_person2" ON "relationships" USING btree ("person2_id");--> statement-breakpoint
CREATE INDEX "idx_relationships_relationship_type" ON "relationships" USING btree ("relationship_type_id");