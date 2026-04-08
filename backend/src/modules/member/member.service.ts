import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.member.findMany({
        include: {
          _count: {
            select: { loans: true, savings: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('FindAll Members failed:', error);
      throw new InternalServerErrorException('Gagal mengambil data anggota dari database');
    }
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
    try {
      return await this.prisma.member.create({
        data: {
          ...data,
          status: 'AKTIF',
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('NIK sudah terdaftar dalam sistem');
        }
      }
      console.error('Create Member failed:', error);
      throw new InternalServerErrorException('Gagal menyimpan data anggota baru');
    }
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
