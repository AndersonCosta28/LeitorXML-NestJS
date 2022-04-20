import { XmlService } from './xml.service';
import { Module } from '@nestjs/common';
import { XmlController } from './xml.controller';
import { XmlParse } from './xml-parse.util';
import { XmlReports } from './xml-reports.util';

@Module({
    imports: [],
    controllers: [XmlController],
    providers: [XmlService, XmlParse, XmlReports],
    exports: [XmlService]
})
export class XmlModule { }
