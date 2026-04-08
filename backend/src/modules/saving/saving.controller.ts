import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SavingService } from './saving.service';

@Controller('savings')
export class SavingController {
  constructor(private readonly savingService: SavingService) {}

  @Get()
  findAll() {
    return this.savingService.findAll();
  }

  @Post()
  create(@Body() data: { memberId: string; type: string; amount: number }) {
    return this.savingService.create(data);
  }

  @Get('member/:memberId/summary')
  getMemberSummary(@Param('memberId') memberId: string) {
    return this.savingService.getMemberSummary(memberId);
  }
}
