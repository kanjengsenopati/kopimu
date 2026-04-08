import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.member.findMany({
      include: {
        _count: {
          select: { loans: true, savings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.member.findUnique({
      where: { id },
      include: {
        loans: true,
        savings: true,
        user: true,
      }
    });
  }

  async create(data: { nik: string; nama: string; alamat?: string; telepon?: string }) {
    return this.prisma.member.create({
      data: {
        ...data,
        status: 'AKTIF',
      }
    });
  }

  async update(id: string, data: Partial<{ nama: string; alamat: string; telepon: string; status: string }>) {
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.member.delete({
      where: { id },
    });
  }
}
