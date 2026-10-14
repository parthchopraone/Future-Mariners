ALTER TABLE "Enrollment" RENAME COLUMN "stripeSessionId" TO "razorpayOrderId";
ALTER TABLE "Enrollment" RENAME COLUMN "stripePaymentId" TO "razorpayPaymentId";
ALTER INDEX "Enrollment_stripeSessionId_key" RENAME TO "Enrollment_razorpayOrderId_key";