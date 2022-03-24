import { XmlService } from './xml.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { XmlController } from './xml.controller';

@Module({
    imports: [],
    controllers: [XmlController],
    providers: [XmlService],
    exports: [XmlService]
})
export class XmlModule { }
