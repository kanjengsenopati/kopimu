import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Mengatur Persentase Pembagian SHU secara dinamis.
   */
  async updateSHUConfig(configs: { key: string; percentage: number }[]) {
    return this.prisma.$transaction(
      configs.map((config) =>
        this.prisma.configSHU.upsert({
          where: { key: config.key },
          update: { percentage: config.percentage },
          create: { key: config.key, percentage: config.percentage },
        }),
      ),
    );
  }

  /**
   * Mengatur Matrix Permission untuk Role tertentu.
   */
  async updateRolePermissions(roleId: string, permissions: { permissionId: string; scope: string }[]) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Hapus permission lama
      await tx.rolePermission.deleteMany({ where: { roleId } });
      
      // Insert permission baru
      return tx.rolePermission.createMany({
        data: permissions.map((p) => ({
          roleId,
          permissionId: p.permissionId,
          scope: p.scope,
        })),
      });
    });
  }

  async getGlobalConfig() {
    return this.prisma.systemConfig.findMany();
  }

  async updateSystemConfig(configs: { key: string; value: string }[]) {
    return this.prisma.$transaction(
      configs.map((config) =>
        this.prisma.systemConfig.upsert({
          where: { key: config.key },
          update: { value: config.value },
          create: { key: config.key, value: config.value },
        }),
      ),
    );
  }

  async getSHUConfig() {
    return this.prisma.configSHU.findMany();
  }

  async getRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async getPermissions() {
    return this.prisma.permission.findMany();
  }
}
