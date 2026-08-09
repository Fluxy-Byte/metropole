import { prisma } from "@/lib/prisma";
import { storageService } from "@/lib/s3";
import { CACHE_KEYS, cacheDelByPrefix } from "@/lib/redis";

async function readFile(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function invalidate(houseId: string) {
  await cacheDelByPrefix(CACHE_KEYS.housesListPrefix);
  await cacheDelByPrefix(`${CACHE_KEYS.houseDetailPrefix}`);
  void houseId;
}

export const houseMediaService = {
  async addImages(houseId: string, files: File[]) {
    const existingCount = await prisma.houseImage.count({ where: { houseId } });

    const uploads = await Promise.all(
      files.map(async (file, index) => {
        const buffer = await readFile(file);
        const uploaded = await storageService.upload("houses/images", buffer, file.name, file.type);
        return prisma.houseImage.create({
          data: {
            houseId,
            key: uploaded.key,
            url: uploaded.url,
            type: uploaded.type,
            size: uploaded.size,
            originalName: uploaded.originalName,
            isCover: existingCount === 0 && index === 0,
            order: existingCount + index,
          },
        });
      }),
    );

    await invalidate(houseId);
    return uploads;
  },

  async removeImage(houseId: string, imageId: string) {
    const image = await prisma.houseImage.findFirst({ where: { id: imageId, houseId } });
    if (!image) return null;

    await storageService.delete(image.key).catch(() => undefined);
    await prisma.houseImage.delete({ where: { id: imageId } });

    if (image.isCover) {
      const next = await prisma.houseImage.findFirst({ where: { houseId }, orderBy: { order: "asc" } });
      if (next) await prisma.houseImage.update({ where: { id: next.id }, data: { isCover: true } });
    }

    await invalidate(houseId);
    return image;
  },

  async addDocuments(houseId: string, files: File[]) {
    const uploads = await Promise.all(
      files.map(async (file) => {
        const buffer = await readFile(file);
        const uploaded = await storageService.upload("houses/documents", buffer, file.name, file.type);
        return prisma.houseDocument.create({
          data: {
            houseId,
            key: uploaded.key,
            url: uploaded.url,
            type: uploaded.type,
            size: uploaded.size,
            originalName: uploaded.originalName,
          },
        });
      }),
    );

    await invalidate(houseId);
    return uploads;
  },

  async removeDocument(houseId: string, documentId: string) {
    const document = await prisma.houseDocument.findFirst({ where: { id: documentId, houseId } });
    if (!document) return null;

    await storageService.delete(document.key).catch(() => undefined);
    await prisma.houseDocument.delete({ where: { id: documentId } });

    await invalidate(houseId);
    return document;
  },
};
