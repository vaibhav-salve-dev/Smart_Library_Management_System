import {
  Controller,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {

  constructor(
    private analyticsService: AnalyticsService
  ) {}

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