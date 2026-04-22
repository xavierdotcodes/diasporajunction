CREATE TYPE "HousingListingStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "HousingListingType" AS ENUM ('APARTMENT', 'HOUSE', 'DEVELOPMENT');
CREATE TYPE "HousingStayType" AS ENUM ('SHORT_STAY', 'LONG_STAY', 'FLEXIBLE');
CREATE TYPE "HousingInquiryStatus" AS ENUM ('NEW', 'REVIEWED', 'CLOSED');
CREATE TYPE "HousingAccessStatus" AS ENUM ('ACTIVE', 'REVOKED');
CREATE TYPE "HousingPurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

CREATE TABLE "HousingListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "listingType" "HousingListingType" NOT NULL,
    "stayType" "HousingStayType" NOT NULL,
    "priceAmount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "pricePeriod" TEXT,
    "location" TEXT NOT NULL,
    "neighborhood" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "familyFriendly" BOOLEAN NOT NULL DEFAULT false,
    "availabilityText" TEXT,
    "contactMethod" TEXT,
    "inquiryDestination" TEXT,
    "providerName" TEXT,
    "diasporaFriendlyNotes" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "HousingListingStatus" NOT NULL DEFAULT 'DRAFT',
    "createdByEmail" TEXT,
    "updatedByEmail" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HousingListing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HousingListingImage" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HousingListingImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HousingInquiry" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "supabaseUserId" TEXT,
    "requesterEmail" TEXT NOT NULL,
    "requesterName" TEXT,
    "requesterPhone" TEXT,
    "moveTimeline" TEXT,
    "message" TEXT NOT NULL,
    "status" "HousingInquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HousingInquiry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HousingAccessPurchase" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeCustomerId" TEXT,
    "supabaseUserId" TEXT,
    "email" TEXT NOT NULL,
    "amountTotal" INTEGER,
    "currency" TEXT,
    "status" "HousingPurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "source" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HousingAccessPurchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HousingAccessGrant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "supabaseUserId" TEXT,
    "status" "HousingAccessStatus" NOT NULL DEFAULT 'ACTIVE',
    "source" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchaseId" TEXT,

    CONSTRAINT "HousingAccessGrant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HousingListing_slug_key" ON "HousingListing"("slug");
CREATE INDEX "HousingListing_status_featured_publishedAt_idx" ON "HousingListing"("status", "featured", "publishedAt");
CREATE INDEX "HousingListing_listingType_stayType_idx" ON "HousingListing"("listingType", "stayType");
CREATE INDEX "HousingListing_location_neighborhood_idx" ON "HousingListing"("location", "neighborhood");
CREATE INDEX "HousingListing_familyFriendly_furnished_idx" ON "HousingListing"("familyFriendly", "furnished");

CREATE INDEX "HousingListingImage_listingId_sortOrder_idx" ON "HousingListingImage"("listingId", "sortOrder");

CREATE INDEX "HousingInquiry_listingId_createdAt_idx" ON "HousingInquiry"("listingId", "createdAt");
CREATE INDEX "HousingInquiry_requesterEmail_createdAt_idx" ON "HousingInquiry"("requesterEmail", "createdAt");
CREATE INDEX "HousingInquiry_status_createdAt_idx" ON "HousingInquiry"("status", "createdAt");

CREATE UNIQUE INDEX "HousingAccessPurchase_stripeSessionId_key" ON "HousingAccessPurchase"("stripeSessionId");
CREATE INDEX "HousingAccessPurchase_email_status_createdAt_idx" ON "HousingAccessPurchase"("email", "status", "createdAt");
CREATE INDEX "HousingAccessPurchase_supabaseUserId_createdAt_idx" ON "HousingAccessPurchase"("supabaseUserId", "createdAt");

CREATE UNIQUE INDEX "HousingAccessGrant_email_key" ON "HousingAccessGrant"("email");
CREATE UNIQUE INDEX "HousingAccessGrant_supabaseUserId_key" ON "HousingAccessGrant"("supabaseUserId");
CREATE UNIQUE INDEX "HousingAccessGrant_purchaseId_key" ON "HousingAccessGrant"("purchaseId");
CREATE INDEX "HousingAccessGrant_status_grantedAt_idx" ON "HousingAccessGrant"("status", "grantedAt");

ALTER TABLE "HousingListingImage" ADD CONSTRAINT "HousingListingImage_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "HousingListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HousingInquiry" ADD CONSTRAINT "HousingInquiry_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "HousingListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HousingAccessGrant" ADD CONSTRAINT "HousingAccessGrant_purchaseId_fkey"
FOREIGN KEY ("purchaseId") REFERENCES "HousingAccessPurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
