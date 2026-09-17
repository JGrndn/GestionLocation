-- AlterTable
ALTER TABLE "ContractDocument" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "pdfGeneratedAt" TIMESTAMP(3);
