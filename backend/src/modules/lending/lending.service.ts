import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class LendingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Simulasi Akurat untuk Ajuan Pinjaman.
   * Digunakan oleh Member (PWA) dan Pengurus (Backoffice).
   */
  async simulateLoan(data: {
    productId: string;
    amount: number;
    tenor: number;
  }) {
    const product = await this.prisma.loanProduct.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw new Error('Jenis Pinjaman tidak ditemukan.');

    const principalPerMonth = data.amount / data.tenor;
    const interestPerMonth = (data.amount * (product.interestRate / 100)) / 12;
    const totalInstallment = principalPerMonth + interestPerMonth;

    const schedule = [];
    let currentDate = new Date();

    for (let i = 1; i <= data.tenor; i++) {
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      schedule.push({
        period: i,
        principal: principalPerMonth,
        interest: interestPerMonth,
        total: totalInstallment,
        dueDate: new Date(currentDate),
      });
    }

    return {
      summary: {
        principal: data.amount,
        totalInterest: interestPerMonth * data.tenor,
        totalReturn: totalInstallment * data.tenor,
        monthlyTotal: totalInstallment,
        principalPerMonth,
        interestPerMonth,
      },
      schedule,
    };
  }
}
