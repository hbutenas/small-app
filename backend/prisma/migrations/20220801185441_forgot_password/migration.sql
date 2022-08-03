-- CreateTable
CREATE TABLE "forgotpasswords" (
    "id" SERIAL NOT NULL,
    "forgotToken" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forgotpasswords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "forgotpasswords" ADD CONSTRAINT "forgotpasswords_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
