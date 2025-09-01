import { ConfigTypeEnum } from "../enums/config.enum";

export class PaginatorConfig {
    constructor(
        public enabled = ConfigTypeEnum.NONE,
        public page = 0,
        public size = 10,
        public length = 0,
        public displayLoadMore = false,
    ) { }
}
