import { Component, OnInit } from '@angular/core'
import Prando from 'prando'

@Component({
  selector: 'app-tiny-towns',
  template: `
    <div class="buildings">
      <div
        *ngFor="let selectableBuilding of selectableBuildings"
        [class]="selectableBuilding.class"
        [class.selected]="selectedThing == selectableBuilding"
        (click)="selectThing(selectableBuilding)"></div>
    </div>

    <div id="grid">
      <div *ngFor="let cell of cells"
        [class.active]="selectedThing"
        (click)="selectCell(cell)">
        <div *ngFor="let thing of cell.things; let i = index"
          [class]="thing.class"
          [class.removable]="!selectedThing"
          (click)="removeThing(cell, i)">
        </div>
      </div>
    </div>

    <div id="deck">
      <div id="drawPile"
        (click)="drawOrReshuffle()">
        <div class="card reshuffle">Reshuffle</div>
        <div *ngFor="let card of drawPile"
          [class]="card.class"></div>
      </div>
      <div id="discardPile">
        <div *ngFor="let card of discardPile"
          [class]="card.class"></div>
      </div>
    </div>

    <div id="cubes">
      <div
        *ngFor="let selectableCube of selectableCubes"
        [class]="selectableCube.class"
        [class.selected]="selectedThing == selectableCube"
        (click)="selectThing(selectableCube)"></div>
    </div>
  `,
  styles: [`
    $cardWidth: 110px;
    $cardRatio: 1.7;
    $cardHeight: $cardWidth * $cardRatio;
    $resourceCardWidth: 131px;
    $resourceCardRatio: 1.5;
    $resourceCardHeight: $resourceCardWidth * $resourceCardRatio;
    $brick: #D64B36;
    $glass: #569BA4;
    $wheat: #F0C059;
    $stone: #BAAFA1;
    $wood: #613B37;
    $resourceTypes: ('brick': $brick, 'glass': $glass, 'wheat': $wheat, 'stone': $stone, 'wood': $wood);

    :host {
      margin: 20px 0;
    }

    #top {
      display: grid;
      gap: 20px;
      align-items: center;
      grid-template-columns: repeat(3, min-content);
    }

    .removable {
      cursor: pointer;
    }
    .removable:hover:after {
      content: "x";
      font-weight: bold;
      color: white;
      text-shadow: 0 0 2px black;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: grid;
      justify-content: center;
      align-content: center;
    }
    .active {
      cursor: pointer;
    }
    .active:hover {
      outline: 2px solid black;
    }
    #cubes, .buildings, #deck {
      padding-top: 30px;
      display: grid;
      grid-auto-flow: column;
      gap: 20px;
      justify-items: center;
      justify-content: center;
    }
    #deck {
      padding-top: 40px;
      gap: 40px;
    }
    .card {
      border: 1px solid black;
      border-radius: 10px;
      width: $resourceCardWidth;
      height: $resourceCardHeight;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, .5);
    }
    #drawPile {
      cursor: pointer;
    }
    #drawPile, #discardPile {
      width: $resourceCardWidth;
      height: $resourceCardHeight;
      position: relative;
      .card {
        position: absolute;
        @for $i from 1 to 30 {
          &:nth-child(#{$i}) {
            top: calc(#{$i} * -1.5px);
            left: calc(#{$i} * -1.5px);
            transform: rotateZ(random(8) - 4 + deg);
          }
        }
      }
    }
    #drawPile .card {
      background: repeating-linear-gradient(
        45deg,
        #606dbc,
        #606dbc 10px,
        #465298 10px,
        #465298 20px
      );
    }
    .buildings {
      grid-template-rows: repeat(2, max-content);
      padding: 0;
      margin-bottom: 20px;
    }
    #cubes > *, .buildings > * {
      cursor: pointer;
    }
    .selected {
      outline: 4px solid black;
      outline-offset: 2px;
    }
    .cube {
      position: relative;
      width: 30px;
      height: 30px;
      border: 1px solid rgba(0, 0, 0, .5);
    }
    #cubes .cube {
      width: 60px;
      height: 60px;
    }
    .buildings .building {
      width: $cardWidth;
      height: $cardHeight;
      background-color: white;
    }
    @each $resourceType, $resourceColor in $resourceTypes {
      .cube.#{$resourceType} {
        background: $resourceColor;
      }
    }
    .card {
      background: white;
      display: grid;
      justify-content: center;
      align-items: center;
    }
    #discardPile .card:after {
      content: "";
      border: 1px solid rgba(0, 0, 0, .4);
      width: 40px;
      height: 40px;
    }
    @each $resourceType, $resourceColor in $resourceTypes {
      #discardPile .card.#{$resourceType}:after {
        background: $resourceColor;
      }
    }
    #discardPile .card.wild:after {
      content: "Wild";
      width: auto;
      height: auto;
      border: none;
      font-weight: bold;
    }
    .building {
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: 30px;
      height: 30px;
    }
    @each $i, $scale in (1: 70, 2: 80, 3: 60, 4: 90, 5: 70, 6: 90, 7: 100, 8: 45) {
      .building#{$i} {
        background-image: url(../assets/building#{$i}.png);
        background-size: #{$scale} + '%';
      }
    }
    .buildings {
      .building {
        background-size: contain;
      }
      .building1 {
        background-image: url(../assets/building1a.png);
      }
      @for $i from 2 through 7 {
        @each $j in ['a', 'b', 'c', 'd'] {
          .building#{$i}#{$j} {
            background-image: url(../assets/building#{$i}#{$j}.png);
          }
        }
      }
      @each $i in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'] {
        .building8#{$i} {
          background-image: url(../assets/building8#{$i}.png);
        }
      }
      @media (hover: hover) and (pointer: fine) {
        .building:after {
          opacity: 0;
          pointer-events: none;
          content: "";
          position: fixed;
          top: 50%;
          left: 50%;
          background: inherit;
          transform: translate(-50%, -50%);
          width: $cardWidth * 3;
          height: $cardHeight * 3;
          max-width: 90vw;
          max-height: 90vh;
          box-shadow: 0 0px 80px rgba(0, 0, 0, 1);
          z-index: 999;
        }
        .building:hover:after {
          opacity: 1;
          transition-delay: .333s;
        }
      }
    }
    #grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      background: #BEC760;
      max-width: 500px;
      gap: 10px;
      padding: 10px;
      align-items: center;
    }
    #grid > * {
      border: 2px solid rgba(0, 0, 0, .15);
      min-width: 100px;
      min-height: 100px;
      background: #BFBA6D;
      display: grid;
      justify-items: center;
      justify-content: center;
      align-content: center;
      grid-template-columns: auto auto;
    }
    #grid .cube, #grid .building {
      filter: drop-shadow(0px 2px 1px rgba(0, 0, 0, .2));
    }
    #grid > * > * {
      margin: 5px;
    }
    #grid .building {
      transform: scale(2);
    }
    #grid .building8 {
      transform: scale(2.4);
    }
    .card.reshuffle {
      display: grid;
      justify-content: center;
      align-items: center;
      transform: none !important;
      box-shadow: none;
      border: none;
      background: rgba(0, 0, 0, .1) !important;
    }
  `]
})
export class TinyTownsComponent implements OnInit {
  cells: Cell[]
  selectableCubes: Cube[] = [new BrickCube(), new WheatCube(), new GlassCube(), new WoodCube(), new StoneCube()]
  selectableBuildings: Thing[]
  selectedThing: Thing | undefined
  drawPile!: Card[]
  discardPile!: Card[]
  seed: number
  rng: Prando

  get leftSelectableBuildings(): Thing[] {
    return this.selectableBuildings.slice(0, 4)
  }

  get rightSelectableBuildings(): Thing[] {
    return this.selectableBuildings.slice(4)
  }

  constructor() {
    this.seed = Math.floor(Math.random() * 100000)
    this.rng = new Prando(this.seed)

    this.selectableBuildings = [
      new Building1(),
      new Building2(this.rng.nextInt(0, 100000)),
      new Building3(this.rng.nextInt(0, 100000)),
      new Building4(this.rng.nextInt(0, 100000)),
      new Building5(this.rng.nextInt(0, 100000)),
      new Building6(this.rng.nextInt(0, 100000)),
      new Building7(this.rng.nextInt(0, 100000)),
      new Building8(this.rng.nextInt(0, 100000)),
    ]

    this.cells = Array.from({ length: 16 }, (x, i) => <Cell>{ things: [] })
    this.prepareDeck()
  }

  prepareDeck() {
    this.discardPile = []
    this.drawPile = [
      new GlassCard(), new GlassCard(), new GlassCard(),
      new StoneCard(), new StoneCard(), new StoneCard(),
      new WoodCard(), new WoodCard(), new WoodCard(),
      new WheatCard(), new WheatCard(), new WheatCard(),
      new BrickCard(), new BrickCard(), new BrickCard(),
    ]
    this.shuffleArray(this.drawPile)
    this.drawPile.splice(-5, 5)
    for (var i = 0; i < this.drawPile.length; i += 3) {
      this.drawPile.splice(i, 0, new WildCard())
    }
  }

  ngOnInit(): void {
  }

  drawOrReshuffle() {
    const card = this.drawPile.pop()
    if (card) {
      this.discardPile.push(card)
      this.selectedThing = this.selectableCubes.find(x => x.id == card.id)
    }
    else {
      this.prepareDeck()
    }
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng.next() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  selectThing(thing: Thing) {
    if (this.selectedThing == thing) this.selectedThing = undefined
    else this.selectedThing = thing
  }

  selectCell(cell: Cell) {
    if (this.selectedThing) cell.things = [...cell.things, this.selectedThing]
    this.selectedThing = undefined
  }

  removeThing(cell: Cell, nthThing: number) {
    if (!this.selectedThing) cell.things.splice(nthThing, 1)
  }
}

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
      default:
        throw new Error()
    }
  }

  get class(): string {
    return 'building ' + this.classBase + ' ' + this.classBase + this.variation
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