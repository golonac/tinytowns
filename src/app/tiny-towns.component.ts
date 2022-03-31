import { Location } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import Prando from 'prando'
import { BrickCard, BrickCube, Building1, Building2, Building3, Building4, Building5, Building6, Building7, Building8, Card, Cell, Cube, GlassCard, GlassCube, ResourceType, StoneCard, StoneCube, Thing, WheatCard, WheatCube, WildCard, WoodCard, WoodCube } from './model'

declare let window: any

@Component({
  selector: 'app-tiny-towns',
  template: `
    <div class="tools">
      <button (click)="newGame()">New game</button>
      <button *ngIf="history" (click)="restartGame()">Restart</button>
      <button *ngIf="history" ngxClipboard [cbContent]="url">Share</button>
      <button *ngIf="!showCardCounters" (click)="showCardCounters = true">Show counters</button>
      <button *ngIf="showCardCounters" (click)="showCardCounters = false">Hide counters</button>
    </div>

    <div class="buildings">
      <div
        *ngFor="let selectableBuilding of selectableBuildings"
        [class]="selectableBuilding.class"
        [class.selected]="selectedThing == selectableBuilding"
        (click)="selectThing(selectableBuilding)"></div>
    </div>

    <div *ngIf="monument === undefined" class="selectMonument">
      <h3>Select monument:</h3>
      <div class="buildings">
      <div *ngFor="let building of monumentOptions; let i = index"
        [class]="building.class"
        (click)="selectMonument(i)"></div>
      </div>
    </div>

    <ng-container *ngIf="monument !== undefined">
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
        <div id="cubesInDrawPile" *ngIf="showCardCounters">
          <div *ngFor="let selectableCube of selectableCubes"
            [class]="selectableCube.class">
            {{cubesInDrawPile(selectableCube.id)}}
          </div>
        </div>
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
        <div id="cubesInDiscardPile" *ngIf="showCardCounters">
          <div *ngFor="let selectableCube of selectableCubes"
            [class]="selectableCube.class">
            {{cubesInDiscardPile(selectableCube.id)}}
          </div>
        </div>
      </div>

      <div id="cubes">
        <div
          *ngFor="let selectableCube of selectableCubes"
          [class]="selectableCube.class"
          [class.selected]="selectedThing == selectableCube"
          (click)="selectThing(selectableCube)">
          <ng-container *ngIf="showCardCounters">{{getCubeTotals(selectableCube.id)}}</ng-container>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    $cardWidth: 110px;
    $cardRatio: 1.71;
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

    .tools {
      margin-bottom: 20px;
      text-align: center;
    }

    button {
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 1);
      border-radius: 6px;
      padding: 8px 12px;
      background: $glass;
      margin-right: 10px;
      color: white;
      border: none;
      cursor: pointer;
    }

    :host {
      margin: 20px 0;
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
      outline: 4px solid black;
    }
    #cubes, .buildings, #deck {
      padding-top: 30px;
      display: grid;
      gap: 20px;
      justify-items: center;
      justify-content: center;
    }
    #cubes, #deck {
      grid-auto-flow: column;
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
    #cubesInDrawPile, #cubesInDiscardPile, #cubesTotal {
      display: grid;
    }
    .cube {
      display: grid;
      align-items: center;
      justify-content: center;
      color: white;
      width: 24px;
      height: 24px;
      font-size: 14px;
      text-shadow: 0 0 2px rgba(0, 0, 0, 1);
      border: none;
    }
    .buildings {
      grid-template-columns: repeat(4, max-content);
      padding: 0;
      margin-bottom: 20px;
    }
    #cubes > *, .buildings > *, .selectMonument > * {
      cursor: pointer;
    }
    .selectMonument h3 {
      margin-top: 2em;
      text-align: center;
      pointer-events: none;
      display: block;
    }
    .selected {
      outline: 6px solid black;
      outline-offset: 4px;
    }
    .cube {
      position: relative;
      width: 30px;
      height: 30px;
      border: 1px solid rgba(0, 0, 0, .5);
      border-radius: 1px;
    }
    #cubes .cube {
      width: 60px;
      height: 60px;
    }
    .buildings .building {
      width: $cardWidth;
      height: $cardHeight;
      background-color: white;
      border-radius: 1px;
    }
    .selectMonument .building {
      width: $cardWidth * 1.5;
      height: $cardHeight * 1.5;
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
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { margin-top: -100px; }
      to { margin-top: 0; }
    }
    #discardPile .card.animate {
      animation: fadeIn .07s linear, slideIn .15s ease-out;
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
    #grid .cube.animate {
      animation: fadeIn .1 linear, slideIn .1s ease-out;
    }
    #grid .building.animate {
      animation: fadeIn .2 linear, slideIn .2s ease-out;
    }
    @each $i, $scale in (1: 70, 2: 80, 3: 60, 4: 90, 5: 70, 6: 90, 7: 100, 8: 45) {
      .building#{$i} {
        background-image: url(../assets/building#{$i}.png);
        background-size: #{$scale} + '%';
      }
    }
    .buildings, .selectMonument {
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
          border-radius: 8px;
          opacity: 0;
          pointer-events: none;
          content: "";
          position: fixed;
          top: 50%;
          left: 50%;
          background: inherit;
          background-color: transparent;
          transform: translate(-50%, -50%) scale(.85);
          width: $cardWidth * 3;
          height: $cardHeight * 3;
          max-width: 90vw;
          max-height: 90vh;
          box-shadow: 0 0px 80px rgba(0, 0, 0, 1);
          z-index: 999;
        }
        .building:hover:after {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
          transition: opacity .05s ease, transform .2s ease;
          transition-delay: .333s;
        }
      }
    }
    #grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      border-radius: 2px;
      background: #BEC760;
      max-width: 500px;
      gap: 10px;
      padding: 10px;
      align-items: center;
    }
    #grid > * {
      border: 2px solid rgba(0, 0, 0, .15);
      border-radius: 2px;
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
export class TinyTownsComponent {
  cells!: Cell[]
  selectableCubes: Cube[] = [new BrickCube(), new WheatCube(), new GlassCube(), new WoodCube(), new StoneCube()]
  cubeTotals!: Array<{ res: ResourceType, total: number }>
  selectableBuildings!: Thing[]
  selectedThing: Thing | undefined
  drawPile!: Card[]
  discardPile!: Card[]
  seed: number
  rng!: Prando
  history: string
  monument?: Thing
  monumentOptions!: Thing[]
  showCardCounters = false

  constructor(private route: ActivatedRoute, public router: Router, public location: Location) {
    route.queryParams.subscribe(q => {
      this.history = q.a ?? ''
      this.seed = q.s ?? Math.floor(Math.random() * 100000) + ''
      this.clear()
      this.replayHistory()
    })

    const q = route.snapshot.queryParams
    this.history = q.a ?? ''
    this.seed = q.s ?? Math.floor(Math.random() * 100000) + ''
    this.updateHistory()
    this.clear()
    this.replayHistory()
  }

  clear() {
    this.rng = new Prando(this.seed)
    this.monument = undefined
    this.cubeTotals = [
      { res: ResourceType.Brick, total: 0 },
      { res: ResourceType.Glass, total: 0 },
      { res: ResourceType.Stone, total: 0 },
      { res: ResourceType.Wheat, total: 0 },
      { res: ResourceType.Wild, total: 0 },
      { res: ResourceType.Wood, total: 0 },
    ]
    do {
      this.monumentOptions = [
        new Building8(this.rng.nextInt(0, 100000)),
        new Building8(this.rng.nextInt(0, 100000)),
      ]
    }
    while (this.monumentOptions[0].class == this.monumentOptions[1].class)

    this.selectableBuildings = [
      new Building1(),
      new Building2(this.rng.nextInt(0, 100000)),
      new Building3(this.rng.nextInt(0, 100000)),
      new Building4(this.rng.nextInt(0, 100000)),
      new Building5(this.rng.nextInt(0, 100000)),
      new Building6(this.rng.nextInt(0, 100000)),
      new Building7(this.rng.nextInt(0, 100000)),
    ]

    this.cells = Array.from({ length: 16 }, (x, i) => new Cell(Math.floor(i / 4) + '' + (i % 4), []))
    this.prepareDeck()
  }

  replayHistory() {
    for (let action of this.history.split(',')) {
      switch (action[0]) {
        case 'm':
          this.selectMonument(parseInt(action[1]), false)
          break
        case 'd':
          this.drawOrReshuffle(false)
          break
        case 'r':
          const s = action.substring(1)
          const [cellId, nthThingString] = s.split('_')
          const nthThing = parseInt(nthThingString)
          const cell = this.cells.find(x => x.id == cellId)
          if (cell) this.removeThing(cell, nthThing, false)
          break
        case 'b':
          {
            const [buildingId, cellId] = action.split('_')
            const building = this.selectableBuildings.find(x => x.id == buildingId)
            const cell = this.cells.find(x => x.id == cellId)
            if (building && cell) this.addToCell(cell, building, false)
            this.selectedThing = undefined
          }
          break
        default:
          {
            const [resourceId, cellId] = action.split('_')
            const resource = this.selectableCubes.find(x => x.id + '' == resourceId)
            const cell = this.cells.find(x => x.id == cellId)
            if (resource && cell) this.addToCell(cell, resource, false)
            this.selectedThing = undefined
          }
          break
      }
    }
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

  drawOrReshuffle(addToHistory: boolean = true) {
    const card = this.drawPile.pop()
    if (card) {
      const asd = this.cubeTotals.find(x => x.res == card.id)
      if (asd) asd.total++
    }
    if (card) {
      this.discardPile.push(card)
      this.selectedThing = this.selectableCubes.find(x => x.id == card.id)
    }
    else {
      this.prepareDeck()
    }
    if (addToHistory) this.updateHistory('d')
  }

  updateHistory(s: string = '') {
    if (this.history && s) this.history += ','
    if (s) this.history += s
    this.router.navigate([], { queryParams: { s: this.seed, a: this.history } })
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

  selectMonument(i: number, addToHistory: boolean = true) {
    const thing = this.monumentOptions[i]
    this.monument = thing
    this.selectableBuildings = this.selectableBuildings.concat(thing)
    if (addToHistory) this.updateHistory('m' + i)
  }

  addToCell(cell: Cell, thing: Thing, addToHistory: boolean = true) {
    const t = Object.create(thing)
    t.animate = addToHistory
    cell.things = [...cell.things, t]
    if (addToHistory) this.updateHistory(`${thing.id}_${cell.id}`)
  }

  selectCell(cell: Cell) {
    if (this.selectedThing) this.addToCell(cell, this.selectedThing)
    this.selectedThing = undefined
  }

  removeThing(cell: Cell, nthThing: number, addToHistory: boolean = true) {
    if (!this.selectedThing) {
      cell.things.splice(nthThing, 1)
      if (addToHistory) this.updateHistory(`r${cell.id}_${nthThing}`)
    }
  }

  newGame() {
    this.history = ''
    this.monument = undefined
    this.seed = Math.floor(Math.random() * 100000)
    this.updateHistory()
    this.clear()
  }

  restartGame() {
    this.history = ''
    this.monument = undefined
    this.updateHistory()
    this.clear()
  }

  get url(): string {
    return window.location.href
  }

  cubesInDiscardPile(cube: ResourceType) {
    return this.discardPile.filter(x => x.id == cube).length
  }

  cubesInDrawPile(cube: ResourceType) {
    return 3 - this.discardPile.filter(x => x.id == cube).length
  }

  getCubeTotals(cube: ResourceType) {
    return this.cubeTotals.find(x => x.res == cube)?.total
  }
}