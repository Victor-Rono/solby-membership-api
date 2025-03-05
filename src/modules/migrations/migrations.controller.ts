/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { MigrationsService } from './migrations.service';

@Controller('migrations')
export class MigrationsController {
  constructor(private readonly migrationsService: MigrationsService) { }



  @Get()
  async findAll(@Res() res: any,
  ) {
    // Set response headers for PDF download
    const file = await this.migrationsService.migrate();
    const { fileName, pdfBuffer } = file;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
    res.send(pdfBuffer);

  }


}
