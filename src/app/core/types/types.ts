export class Item {
  id: number;
  name: string;
  description: string;
  sku: string;
  cost: number;
  profile: Record<string, any>;

  constructor(
    id: number,
    name: string,
    description: string,
    sku: string,
    cost: number,
    profile: Record<string, any> 
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.sku = sku;
    this.cost = cost;
    this.profile = profile;
  }
}
