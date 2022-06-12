import { XmlService } from './xml.service';
import { Module } from '@nestjs/common';
import { XmlController } from './xml.controller';
import { XmlUtil } from './Util/xml.util';

@Module({
    imports: [],
    controllers: [XmlController],
    providers: [XmlService, XmlUtil],
    exports: [XmlService]
})
export class XmlModule { }
