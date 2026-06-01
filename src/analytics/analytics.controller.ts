import {
  Controller,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AnalyticsService } from "./analytics.service";
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags('Analytical Dashboard')
@Controller("analytics")
export class AnalyticsController {

  constructor(
    private analyticsService: AnalyticsService
  ) {}

  @ApiOperation({
              summary: 'Get statistical data'
          })
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("dashboard")
  getDashboard(
    @Request() req,
  ) {
    return this.analyticsService.getDashboard(
      req.user
    );
  }
}