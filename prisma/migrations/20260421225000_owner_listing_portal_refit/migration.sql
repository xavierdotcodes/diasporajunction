ALTER TYPE "HousingListingStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_PENDING';
ALTER TYPE "HousingListingStatus" ADD VALUE IF NOT EXISTS 'PENDING_REVIEW';

ALTER TABLE "HousingListing"
ADD COLUMN "ownerSupabaseUserId" TEXT,
ADD COLUMN "ownerEmail" TEXT,
ADD COLUMN "ownerName" TEXT,
ADD COLUMN "ownerPhone" TEXT,
ADD COLUMN "moderationNotes" TEXT,
ADD COLUMN "stripeCheckoutSessionId" TEXT,
ADD COLUMN "submittedAt" TIMESTAMP(3),
ADD COLUMN "paidAt" TIMESTAMP(3);

ALTER TABLE "HousingListingImage"
ADD COLUMN "storagePath" TEXT;

CREATE UNIQUE INDEX "HousingListing_stripeCheckoutSessionId_key" ON "HousingListing"("stripeCheckoutSessionId");
CREATE INDEX "HousingListing_ownerSupabaseUserId_createdAt_idx" ON "HousingListing"("ownerSupabaseUserId", "createdAt");
CREATE INDEX "HousingListing_ownerEmail_createdAt_idx" ON "HousingListing"("ownerEmail", "createdAt");

CREATE TABLE "HousingListingPayment" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeCustomerId" TEXT,
    "ownerSupabaseUserId" TEXT,
    "ownerEmail" TEXT NOT NULL,
    "amountTotal" INTEGER,
    "currency" TEXT,
    "status" "HousingPurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "source" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HousingListingPayment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HousingListingPayment_stripeSessionId_key" ON "HousingListingPayment"("stripeSessionId");
CREATE INDEX "HousingListingPayment_listingId_status_createdAt_idx" ON "HousingListingPayment"("listingId", "status", "createdAt");
CREATE INDEX "HousingListingPayment_ownerEmail_status_createdAt_idx" ON "HousingListingPayment"("ownerEmail", "status", "createdAt");
CREATE INDEX "HousingListingPayment_ownerSupabaseUserId_createdAt_idx" ON "HousingListingPayment"("ownerSupabaseUserId", "createdAt");

ALTER TABLE "HousingListingPayment" ADD CONSTRAINT "HousingListingPayment_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "HousingListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE "HousingAccessGrant";
DROP TABLE "HousingAccessPurchase";
DROP TYPE "HousingAccessStatus";
