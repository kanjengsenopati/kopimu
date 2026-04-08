import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { LendingService } from './lending.service';

@Controller('lending')
export class LendingController {
  constructor(private readonly lendingService: LendingService) {}

  @Get('loans')
  findAllLoans() {
    return this.lendingService.findAllLoans();
  }

  @Post('loans')
  createLoan(@Body() data: any) {
    return this.lendingService.createLoanRequest(data);
  }

  @Put('loans/:id/approve')
  approve(@Param('id') id: string) {
    return this.lendingService.approveAndDisburse(id);
  }

  @Post('installments/:id/pay')
  pay(@Param('id') id: string) {
    return this.lendingService.payInstallment(id);
  }
}
