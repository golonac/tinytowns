export class Cell {
  things!: Thing[]
}
export interface Thing {
  get class(): string
}
export interface Building { }
export interface Cube extends Thing {
  get id(): ResourceType
}

export enum ResourceType {
  Glass, Stone, Wheat, Wood, Brick, Wild
}

export class GlassCube implements Thing, Cube {
  get id(): ResourceType {
    return ResourceType.Glass
  }
  get class(): string {
    return 'cube glass'
  }
}
export class StoneCube implements Thing, Cube {
  get id(): ResourceType {
    return ResourceType.Stone
  }
  get class(): string {
    return 'cube stone'
  }
}
export class WoodCube implements Thing, Cube {
  get id(): ResourceType {
    return ResourceType.Wood
  }
  get class(): string {
    return 'cube wood'
  }
}
export class WheatCube implements Thing, Cube {
  get id(): ResourceType {
    return ResourceType.Wheat
  }
  get class(): string {
    return 'cube wheat'
  }
}
export class BrickCube implements Thing, Cube {
  get id(): ResourceType {
    return ResourceType.Brick
  }
  get class(): string {
    return 'cube brick'
  }
}
export class Building1 implements Thing, Building {
  variation: string = 'a'

  get class(): string {
    return 'building building1'
  }
}

export abstract class BuildingWithVariations implements Thing, Building {
  abstract get classBase(): string
  get numVariations(): number {
    return 4
  }

  seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  get variation(): string {
    switch (this.seed % this.numVariations) {
      case 0: return 'a'
      case 1: return 'b'
      case 2: return 'c'
      case 3: return 'd'
      case 4: return 'e'
      case 5: return 'f'
      case 6: return 'g'
      case 7: return 'h'
      case 8: return 'i'
      case 9: return 'j'
      case 10: return 'k'
      case 11: return 'l'
      default: throw new Error()
    }
  }

  get class(): string {
    return `building ${this.classBase} ${this.classBase}${this.variation}`
  }
}

export class Building2 extends BuildingWithVariations {
  get classBase(): string {
    return 'building2'
  }
}
export class Building3 extends BuildingWithVariations {
  get classBase(): string {
    return 'building3'
  }
}
export class Building4 extends BuildingWithVariations {
  get classBase(): string {
    return 'building4'
  }
}
export class Building5 extends BuildingWithVariations {
  get classBase(): string {
    return 'building5'
  }
}
export class Building6 extends BuildingWithVariations {
  get classBase(): string {
    return 'building6'
  }
}
export class Building7 extends BuildingWithVariations {
  get classBase(): string {
    return 'building7'
  }
}
export class Building8 extends BuildingWithVariations {
  get numVariations(): number {
    return 12
  }
  get classBase(): string {
    return 'building8'
  }
}



export interface Card {
  get id(): ResourceType
  get class(): string
}
export class GlassCard implements Card {
  get id(): ResourceType {
    return ResourceType.Glass
  }
  get class(): string {
    return 'card glass'
  }
}
export class StoneCard implements Card {
  get id(): ResourceType {
    return ResourceType.Stone
  }
  get class(): string {
    return 'card stone'
  }
}
export class WoodCard implements Card {
  get id(): ResourceType {
    return ResourceType.Wood
  }
  get class(): string {
    return 'card wood'
  }
}
export class WheatCard implements Card {
  get id(): ResourceType {
    return ResourceType.Wheat
  }
  get class(): string {
    return 'card wheat'
  }
}
export class BrickCard implements Card {
  get id(): ResourceType {
    return ResourceType.Brick
  }
  get class(): string {
    return 'card brick'
  }
}
export class WildCard implements Card {
  get id(): ResourceType {
    return ResourceType.Wild
  }
  get class(): string {
    return 'card wild'
  }
}