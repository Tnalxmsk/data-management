import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RampsService } from './ramps.service';
import { ImageType } from '../common/entities/image.entity';
import { PaginateRampDto } from './dto/paginate-ramp.dto';
import { DeleteRampDto } from './dto/delete-ramp.dto';
import { CreateRampDto } from './dto/create-ramp.dto';
import { UpdateRampDto } from './dto/update-ramp.dto';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';
import { UserDecorator } from '../users/decorator/user.decorator';
import { QueryRunnerDecorator } from '../common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { UsersModel } from '../users/entities/users.entity';
import { ApiBasicAuth, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('ramps')
export class RampsController {
  constructor(private readonly rampsService: RampsService) {}

  @Get()
  @ApiBearerAuth('authorization')
  getRamps(@Query() query: PaginateRampDto) {
    return this.rampsService.paginateRamps(query);
  }

  @Get(':id')
  @ApiBearerAuth('authorization')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.rampsService.getRampsById(id);
  }

  /*@Post()
  @UseInterceptors(TransactionInterceptor)
  async postRamp(
    @UserDecorator('id') userId?: number,
    @Body() body: CreateRampDto,
    @QueryRunnerDecorator() qr: QR,
  ) {
    const ramp = this.rampsService.createRamp(userId, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.rampsImageService.createRampsImage(
        {
          ramp,
          order: i,
          path: body.images[i],
          type: ImageType.RAMP_IMAGE,
        },
        qr,
      );
    }

    return this.rampsService.getRampsById(ramp.id);
  }*/

  @Delete()
  @ApiBearerAuth('authorization')
  deleteRamps(@Body() body: DeleteRampDto) {
    return this.rampsService.deleteRamps(body);
  }

  @Patch(':id')
  @ApiBearerAuth('authorization')
  patchRamps(@Param('id', ParseIntPipe) id: number, body: UpdateRampDto) {
    return this.rampsService.patchRamps(id, body);
  }

  @Post('random')
  @ApiBearerAuth('authorization')
  async postRandomRamp(@UserDecorator('id') userId?: number) {
    await this.rampsService.generateRamps(userId);
    return { ok: true };
  }
}
