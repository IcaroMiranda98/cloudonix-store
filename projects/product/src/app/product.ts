export class Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  cost: number;
  profile: Record<string, string | number>;

  constructor(
    id: number,
    name: string,
    description: string,
    sku: string,
    cost: number,
    profile: Record<string, string | number>,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.sku = sku;
    this.cost = cost;
    this.profile = profile;
  }
}
