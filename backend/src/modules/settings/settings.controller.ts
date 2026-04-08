import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('config')
  getGlobalConfig() {
    return this.settingsService.getGlobalConfig();
  }

  @Post('config')
  updateSystemConfig(@Body() configs: { key: string; value: string }[]) {
    return this.settingsService.updateSystemConfig(configs);
  }

  @Get('shu')
  getSHUConfig() {
    return this.settingsService.getSHUConfig();
  }

  @Put('shu')
  updateSHUConfig(@Body() configs: { key: string; percentage: number }[]) {
    return this.settingsService.updateSHUConfig(configs);
  }

  @Get('roles')
  getRoles() {
    return this.settingsService.getRoles();
  }

  @Get('permissions')
  getPermissions() {
    return this.settingsService.getPermissions();
  }

  @Put('roles/:roleId/permissions')
  updateRolePermissions(
    @Param('roleId') roleId: string,
    @Body() permissions: { permissionId: string; scope: string }[]
  ) {
    return this.settingsService.updateRolePermissions(roleId, permissions);
  }
}
