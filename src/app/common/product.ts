export class Product {

    constructor(
        public id: number,
        public sku : string,
        public name: string,
        public description: string,
        public unitPrice: number,
        public imageUrl: string,
        public active : string,
        public unitsInStock: string,
        public dateCreated: Date,
        public lastUpdate: Date,
    ){}

}
