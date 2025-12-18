CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email_hash" text NOT NULL,
	"encrypted_email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_hash_unique" UNIQUE("email_hash")
);
--> statement-breakpoint
CREATE INDEX "waitlist_email_hash_idx" ON "waitlist" USING btree ("email_hash");--> statement-breakpoint
CREATE INDEX "waitlist_created_at_idx" ON "waitlist" USING btree ("created_at" DESC NULLS LAST);