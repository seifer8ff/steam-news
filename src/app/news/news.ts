export class News {

    constructor(
        public title: string,
        public body: string,
        public url: string,
        public date: string,
        public appId: string,
        public articleId: string
    ) {}

    getDate() {
        return Number(this.date) * 1000;
    }
}
