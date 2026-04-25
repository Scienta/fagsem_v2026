# Snake Game — Java 25 Implementation Plan

## Context
Single-player Snake game built from scratch in a clean Java 25 project. Goal is a playable terminal game that demonstrates modern Java features (records, sealed interfaces, pattern matching), with full unit test coverage on all non-UI logic. Uses **Lanterna 3** for terminal rendering (the standard Java curses-equivalent library — pure Java, no native bindings required).

---

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Build system | Maven | Standard `mvn exec:java` workflow, no classpath wiring needed |
| UI framework | Lanterna 3 | Pure-Java terminal UI, no native ncurses binding required, cross-platform |
| Game loop | Dedicated thread + `Thread.sleep` | Simple timing loop; Lanterna input is polled non-blocking each tick |

---

## Project Layout

```
/var/home/ivark/snake/
├── pom.xml
└── src/
    ├── main/java/no/scienta/snake/
    │   ├── Main.java
    │   ├── model/
    │   │   ├── Point.java          (record)
    │   │   ├── Direction.java      (enum)
    │   │   ├── GameConfig.java     (record)
    │   │   ├── GameState.java      (record + sealed Phase hierarchy)
    │   │   └── GameEvent.java      (sealed interface hierarchy)
    │   ├── engine/
    │   │   └── GameEngine.java
    │   └── ui/
    │       ├── TerminalGame.java   (screen setup + game loop + input)
    │       └── TerminalRenderer.java (TextGraphics rendering)
    └── test/java/no/scienta/snake/
        ├── model/
        │   ├── PointTest.java
        │   ├── DirectionTest.java
        │   ├── GameConfigTest.java
        │   └── GameStateTest.java
        └── engine/
            └── GameEngineTest.java
```

---

## Maven Dependencies

```xml
<!-- Lanterna terminal UI -->
<dependency>
    <groupId>com.googlecode.lanterna</groupId>
    <artifactId>lanterna</artifactId>
    <version>3.1.2</version>
</dependency>

<!-- JUnit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.11.0</version>
    <scope>test</scope>
</dependency>
```

Compiler plugin targets Java 25. `exec-maven-plugin` points to `no.scienta.snake.Main`. `maven-jar-plugin` sets `Main-Class` in manifest. `maven-surefire-plugin` configured for JUnit 5.

---

## Model Layer

### `Point.java` — record
`record Point(int x, int y)` with a `translate(Point delta)` method. Used everywhere for coordinates and direction deltas.

### `Direction.java` — enum
Constants: `UP`, `DOWN`, `LEFT`, `RIGHT`. Methods:
- `delta()` → `Point` unit vector via enhanced switch
- `isOpposite(Direction other)` → prevents snake reversal

### `GameConfig.java` — record
`record GameConfig(int columns, int rows, int initialSpeed, int speedIncrement, int speedFloor)`

No `cellSize` — terminal cells are the grid cells. Defaults: 40×20 grid. Initial tick 150 ms, −5 ms per 5 points scored, floor at 60 ms.

### `GameState.java` — record
`record GameState(List<Point> snake, Point food, Direction direction, int score, Phase phase)`

Immutable snapshot. Every tick the engine builds a new instance. The `snake` list is a `List.copyOf` of the internal deque.

**Nested sealed `Phase` hierarchy:**
```java
sealed interface Phase permits Phase.Waiting, Phase.Playing, Phase.Paused, Phase.Dead {}
record Waiting()           implements Phase {}
record Playing()           implements Phase {}
record Paused()            implements Phase {}
record Dead(String reason) implements Phase {}
```

### `GameEvent.java` — sealed interface
```java
sealed interface GameEvent
    permits GameEvent.Turn, GameEvent.Tick, GameEvent.PauseToggle, GameEvent.Restart {}
record Turn(Direction direction) implements GameEvent {}
record Tick()         implements GameEvent {}
record PauseToggle()  implements GameEvent {}
record Restart()      implements GameEvent {}
```
Events are the only channel from UI to engine.

---

## Engine Layer

### `GameEngine.java`
Single public method: `void process(GameEvent event)`. Uses pattern matching for switch:
```java
switch (event) {
    case GameEvent.Turn(var dir)  -> handleTurn(dir);
    case GameEvent.Tick()         -> handleTick();
    case GameEvent.PauseToggle()  -> handlePause();
    case GameEvent.Restart()      -> handleRestart();
}
```

**`handleTick` logic:**
1. Guard: return if phase is not `Playing`
2. Compute new head = `snake.peekFirst().translate(direction.delta())`
3. Wall collision → `Dead("Hit wall")`
4. Self collision → `Dead("Hit self")`
5. Food hit → increment score, spawn new food, possibly increase speed
6. No food → remove last tail segment
7. Publish new `GameState` snapshot

**Speed callback:** Engine accepts a `Consumer<Integer> onSpeedChange` at construction. When speed changes, it calls this with the new ms value so `TerminalGame` can adjust its sleep interval.

**Food spawning:** All grid cells minus occupied snake cells → pick random. If grid is full → game won.

Internal snake storage: `ArrayDeque<Point>` for O(1) head/tail ops.

---

## UI Layer

### `TerminalGame.java`
Sets up a Lanterna `DefaultTerminalFactory` → `Screen`. Owns the game loop and the `GameEngine`. Responsibilities:

- `start()` — enters alternate screen, starts the game loop thread, blocks until quit
- **Game loop thread:**
  ```
  while (running) {
      long tickStart = System.currentTimeMillis();
      pollAndProcessInput();          // non-blocking: screen.pollInput()
      engine.process(new Tick());
      renderer.render(screen, engine.currentState(), highScore);
      screen.refresh();
      long elapsed = System.currentTimeMillis() - tickStart;
      Thread.sleep(max(0, currentTickMs - elapsed));
  }
  ```
- **Input mapping** via `KeyStroke`:
  - `KeyType.ArrowUp` / char `'w'` / `'W'` → `Turn(UP)`
  - `KeyType.ArrowDown` / char `'s'` / `'S'` → `Turn(DOWN)`
  - `KeyType.ArrowLeft` / char `'a'` / `'A'` → `Turn(LEFT)`
  - `KeyType.ArrowRight` / char `'d'` / `'D'` → `Turn(RIGHT)`
  - char `'p'` / `'P'` / `KeyType.Escape` → `PauseToggle`
  - char `'r'` / `'R'` / `KeyType.Enter` → `Restart`
  - char `'q'` / `'Q'` / `KeyType.EOF` → quit (set `running = false`)
- Speed callback from engine → updates `currentTickMs` field (volatile)
- Tracks high score across restarts

### `TerminalRenderer.java` — final class, static helpers
Pure rendering, no state. Main method: `render(Screen screen, GameState state, GameConfig cfg, int highScore)`.

Clears the back buffer, then draws:

- **Border** — single-char box drawn around the grid using `+`, `-`, `|` characters in `WHITE`
- **Snake body** — `'o'` in `GREEN`; head drawn as `'@'` in `BRIGHT_GREEN`
- **Food** — `'*'` in `RED` (or `BRIGHT_RED`)
- **Score line** — top of screen above the border: `Score: NNN   High: NNN`
- **Overlay** — pattern-matching switch on `Phase`:
  - `Waiting` → centered text block:
    ```
    SNAKE
    Arrow keys / WASD to move
    P = pause   Q = quit
    Press any direction to start
    ```
  - `Paused` → centered `-- PAUSED --` in `YELLOW`
  - `Dead(var reason)` → centered reason + score + `Press R to restart`
  - `Playing` → no overlay

All coordinates are offset by `(1, 2)` to account for the border column and score+border rows.

---

## Game Mechanics

| Parameter | Value |
|---|---|
| Grid | 40 × 20 cells |
| Terminal size | 42 × 23 (grid + border + score row) |
| Starting length | 4 segments |
| Starting position | Center of grid, heading RIGHT |
| Initial tick | 150 ms |
| Speed step | −5 ms per 5 points |
| Minimum tick | 60 ms |
| Score per food | 10 points |
| High score | In-session only (`TerminalGame` field) |

---

## Java 25 Features Checklist

| Feature | Where |
|---|---|
| Records | `Point`, `GameConfig`, `GameState`, all `GameEvent` permits, all `Phase` permits |
| Sealed interfaces | `GameEvent`, `Phase` |
| Pattern matching for switch | `GameEngine.process`, `TerminalRenderer` overlay dispatch |
| Record deconstruction patterns | `case GameEvent.Turn(var dir)`, `case Dead(var reason)` |
| Enhanced switch expressions | `Direction.delta()`, input key mapping in `TerminalGame` |
| `var` | Local variables where type is obvious |
| Text blocks | Multi-line waiting overlay message |
| `List.copyOf` | Immutable snapshot in `GameState` |

---

## Implementation Steps

1. `pom.xml` — Java 25 compiler plugin + exec plugin + Lanterna + JUnit 5
2. `model/Point.java` + `PointTest.java`
3. `model/Direction.java` + `DirectionTest.java`
4. `model/GameConfig.java` + `GameConfigTest.java`
5. `model/GameState.java` + `GameStateTest.java` — snapshot record + `Phase` sealed hierarchy
6. `model/GameEvent.java` — sealed event hierarchy (covered by engine tests)
7. `engine/GameEngine.java` + `GameEngineTest.java` — core game logic + full test suite
8. `ui/TerminalRenderer.java` — pure rendering against Lanterna `Screen`
9. `ui/TerminalGame.java` — game loop + input + screen lifecycle
10. `Main.java` — constructs and starts `TerminalGame`

Each step: write the production class, write its tests, run `mvn test` green before moving on.

---

## Test Coverage

### Framework
JUnit 5 (Jupiter) as `test`-scoped Maven dependency. No Mockito — all classes are designed to be testable without mocking (pure functions, constructor injection, no static state).

### Test layout

```
src/test/java/no/scienta/snake/
    model/
        PointTest.java
        DirectionTest.java
        GameConfigTest.java
        GameStateTest.java
    engine/
        GameEngineTest.java
```

UI classes (`TerminalGame`, `TerminalRenderer`) are **not unit tested** — terminal rendering requires a live TTY. All game logic lives in the model and engine layers, which are fully headless.

---

### `PointTest.java`
| Test | What it verifies |
|---|---|
| `translateAddsCoordinates` | `new Point(3,4).translate(new Point(1,-1))` equals `(4,3)` |
| `translateByZeroIsIdentity` | translate by `(0,0)` returns equal point |
| `recordEquality` | Two `Point(2,2)` instances are equal and have the same hash |
| `recordToString` | `toString()` contains the coordinate values |

---

### `DirectionTest.java`
| Test | What it verifies |
|---|---|
| `upDeltaIsNegativeY` | `UP.delta()` = `Point(0,-1)` |
| `downDeltaIsPositiveY` | `DOWN.delta()` = `Point(0,1)` |
| `leftDeltaIsNegativeX` | `LEFT.delta()` = `Point(-1,0)` |
| `rightDeltaIsPositiveX` | `RIGHT.delta()` = `Point(1,0)` |
| `oppositeDetectedCorrectly` | `UP.isOpposite(DOWN)` = true, `UP.isOpposite(LEFT)` = false |
| `directionNotOppositeOfItself` | `RIGHT.isOpposite(RIGHT)` = false |
| `allFourDeltasAreUnitVectors` | each delta has `abs(x)+abs(y) == 1` |

---

### `GameConfigTest.java`
| Test | What it verifies |
|---|---|
| `defaultConfigHasPositiveDimensions` | columns, rows both > 0 |
| `speedFloorBelowInitialSpeed` | `speedFloor < initialSpeed` |
| `speedIncrementPositive` | `speedIncrement > 0` |

---

### `GameStateTest.java`
| Test | What it verifies |
|---|---|
| `snakeListIsImmutable` | returned list throws on mutation attempt |
| `phaseIsWaitingInitially` | freshly constructed state has `Waiting` phase |
| `deadPhaseCarriesReason` | `Dead("Hit wall").reason()` = `"Hit wall"` |
| `recordEqualityOnPhase` | two `Playing()` instances are equal |

---

### `GameEngineTest.java`
Engine is constructed with a no-op speed callback `_ -> {}` for all tests unless the test is specifically about speed scaling.

**Turn handling**
| Test | Scenario |
|---|---|
| `turnIsIgnoredWhenNotPlaying` | `Turn(RIGHT)` in `Waiting` → direction unchanged after start |
| `turnIsApplied` | start game, `Turn(UP)`, tick → snake moves up |
| `reverseDirectionIgnored` | moving RIGHT, `Turn(LEFT)` → still moves RIGHT |
| `turnToPerpendicularAllowed` | moving RIGHT, `Turn(UP)` → moves up |

**Tick — movement**
| Test | Scenario |
|---|---|
| `tickMovesHeadInCurrentDirection` | one tick RIGHT → head x increases by 1 |
| `tickPreservesLength` | no food eaten → body length unchanged |
| `tickDropsTail` | last segment removed on normal move |
| `tickDoesNothingWhenPaused` | tick in `Paused` → state unchanged |
| `tickDoesNothingWhenDead` | tick in `Dead` → state unchanged |
| `tickDoesNothingWhenWaiting` | tick in `Waiting` → state unchanged |

**Tick — collisions**
| Test | Scenario |
|---|---|
| `wallCollisionTopEdge` | head at y=0 moving UP → `Dead("Hit wall")` |
| `wallCollisionBottomEdge` | head at y=rows-1 moving DOWN → dead |
| `wallCollisionLeftEdge` | head at x=0 moving LEFT → dead |
| `wallCollisionRightEdge` | head at x=cols-1 moving RIGHT → dead |
| `selfCollisionKillsSnake` | U-shape snake, head enters own body → `Dead("Hit self")` |

**Tick — food**
| Test | Scenario |
|---|---|
| `eatingFoodIncreasesScore` | food at next head position, tick → score += 10 |
| `eatingFoodGrowsSnake` | length increases by 1 when food eaten |
| `eatingFoodSpawnsNewFood` | food position changes after eating |
| `newFoodNotOnSnakeBody` | new food position is not in snake list |

**Speed scaling**
| Test | Scenario |
|---|---|
| `speedIncreasesAtScoreMilestone` | eat 5 foods → callback called with lower ms value |
| `speedDoesNotGoBelowFloor` | max out speed → callback never called with value < `speedFloor` |
| `speedCallbackCalledOnChange` | fires exactly when score hits multiples of 5 |

**Pause / resume**
| Test | Scenario |
|---|---|
| `pauseTogglesFromPlayingToPaused` | `PauseToggle` in `Playing` → `Paused` |
| `pauseTogglesFromPausedToPlaying` | `PauseToggle` in `Paused` → `Playing` |
| `pauseIgnoredInWaiting` | `PauseToggle` in `Waiting` → still `Waiting` |
| `pauseIgnoredWhenDead` | `PauseToggle` in `Dead` → still `Dead` |

**Restart**
| Test | Scenario |
|---|---|
| `restartFromDeadResetsState` | die, `Restart` → `Playing`, score 0, snake at start |
| `restartFromPlayingResetsState` | mid-game `Restart` → back to initial |
| `restartFromWaitingIsNoop` | `Restart` in `Waiting` → still `Waiting` |

**Game start**
| Test | Scenario |
|---|---|
| `firstTurnStartsGame` | any `Turn` in `Waiting` → phase becomes `Playing` |

---

### Running Tests

```bash
mvn test                          # run all tests
mvn test -Dtest=GameEngineTest    # single class
```

Tests run headless (no TTY required). CI-safe.

---

## Build & Run

```bash
mvn compile          # compile check
mvn package          # → target/snake-1.0.jar
mvn exec:java        # run in current terminal
java -jar target/snake-1.0.jar
```
