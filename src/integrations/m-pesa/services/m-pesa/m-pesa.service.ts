/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MPesaService {

    constructor(
        private databaseService: DatabaseService,
        private httpService: HttpService,
    ) { }
}
