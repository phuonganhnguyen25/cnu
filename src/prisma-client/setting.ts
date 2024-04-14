import { PrismaClient } from "@prisma/client";

class SingletonPrismaClient {
  private static instance: PrismaClient;
  constructor() {}

  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient();
    }
    return this.instance;
  }
}

export const prismaClientSingleton = SingletonPrismaClient.getInstance();
