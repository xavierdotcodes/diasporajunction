DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_type
		WHERE typname = 'CommunityAccessStatus'
	) THEN
		CREATE TYPE "CommunityAccessStatus" AS ENUM ('REQUESTED', 'ACTIVE', 'REVOKED');
	END IF;
END $$;

CREATE TABLE IF NOT EXISTS "CommunityAccessGrant" (
	"id" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"firstName" TEXT,
	"note" TEXT,
	"source" TEXT,
	"status" "CommunityAccessStatus" NOT NULL DEFAULT 'REQUESTED',
	"grantedByEmail" TEXT,
	"requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"grantedAt" TIMESTAMP(3),
	"revokedAt" TIMESTAMP(3),
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "CommunityAccessGrant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CommunityAccessGrant_email_key" ON "CommunityAccessGrant"("email");
CREATE INDEX IF NOT EXISTS "CommunityAccessGrant_status_requestedAt_idx" ON "CommunityAccessGrant"("status", "requestedAt");
CREATE INDEX IF NOT EXISTS "CommunityAccessGrant_source_createdAt_idx" ON "CommunityAccessGrant"("source", "createdAt");
