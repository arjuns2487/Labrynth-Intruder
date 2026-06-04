# 🎮 Labyrinth Intruder

**An intense, top-down tactical survival shooter built with Phaser**

A high-octane extraction survival game where you navigate a shifting maze, battle escalating enemy waves, and survive for 10 minutes against overwhelming odds.

---

## 📋 Overview

Labyrinth Intruder is a fast-paced arcade shooter that combines:
- **Dynamic maze geometry** that shifts mid-game
- **Escalating enemy waves** with diverse unit types
- **Tactical upgrades** that change your playstyle
- **Physics-based combat** with knockback and collision dynamics
- **Co-op AI drone support** for advanced tactics
- **Environmental hazards** including acid pools and explosive barrels

**Objective:** Eliminate 1,000 hostiles OR survive the 10-minute extraction timer.

---

## 🎮 Game Mechanics

### Core Movement & Combat
- **Movement:** `W`, `A`, `S`, `D` - Navigate the labyrinth
- **Fire:** `LEFT MOUSE BUTTON` - Spray ammo from your magazine
- **Melee Push:** `SPACEBAR` - Emergency shockwave (60-second cooldown)
- **Bomb Charge:** `T` - Drop explosives (deducts 2 minutes from timer)

### Enemy Types

| Enemy | HP | Speed | Behavior | Notes |
|-------|----|----|----------|-------|
| **Red Scout** | 1 | 80 | Basic ground trooper | Most common early-game |
| **Orange Brute** | 3 | 105 | Armored fighter | Appears mid-game (3+ min) |
| **Yellow Tank** | 7 | 120 | Heavy unit | Late-game spawn, leads phalanx formations |
| **Exploder** | 1 | Variable | Self-destructing | 15% spawn chance, damages player/drone on death |
| **Ghost Phantom** | 2 | 65 | Phasing unit | Appears after 3 minutes, ignores world bounds |

### Enemy Tactics
- **Phalanx Formations:** Red scouts cluster around yellow tanks for coordinated attacks
- **Targeting Priority:** Enemies focus fire on closest threat (player or drone)
- **Smart Pathing:** Navigate maze walls; reset if stuck in walls

### Gameplay Mechanics

#### 💥 Combat System
- **Fire Rate:** 150ms between shots (decreases to 150ms in Berserker mode)
- **Bullet Knockback:** 120 base force (upgradeable)
- **Ammo Magazine:** 50 rounds per clip
- **Reload Time:** 2 seconds (600ms in Berserker mode)
- **Accuracy Tracking:** Shots hit ratio calculated for debrief stats

#### 💎 Gem & Upgrade System
- Collect gems from defeated enemies and barrel explosions
- Every 60 gems collected → Opens upgrade shop
- **Gem sources:** Enemy eliminations, barrel detonations, bomb blasts

#### 🏥 Health & Survival
- **Player Health:** 100 HP max
- **Damage per Hit:** 15 HP from enemy melee
- **Immunity Window:** 400ms between consecutive hits
- **Berserker Trigger:** Below 30% health activates enhanced reload speed
- **Soul Reap:** Every 50 eliminations = +10% health recovery

#### 🎯 Upgrade Tiers

| Upgrade | Effect | Category |
|---------|--------|----------|
| **Boost Speed Agility** | +25% movement velocity | Mobility |
| **Multi-Barrel Upgrade** | Unlocks 3-bullet spread pattern | Firepower |
| **Heavy Impact Knockback** | +150% bullet recoil force | Control |
| **Recon Drone Co-Op** | Deploy autonomous companion AI | Support |
| **Repair Hull Protocol** | Restore player to 100% health | Defense |

---

## 🕰️ Timeline & Progression

### Game Duration: 10 Minutes

**0:00 - 3:00** (Early Game)
- Basic enemy waves (red scouts)
- Maze remains stable
- Foundation phase

**3:00 - 5:00** (Mid Game)
- Orange brutes appear
- Ghost phantoms emerge
- Increased spawn frequency

**5:00** ⚠️ **LABYRINTH SHIFT EVENT**
- Entire maze geometry restructures
- Camera flash & shake warning
- New paths created, old routes blocked
- Strategic repositioning required

**5:00 - 10:00** (Late Game)
- Yellow tank commanders spawn
- Phalanx formations active
- Maximum difficulty
- All enemy types converging

---

## 🎯 Victory Conditions

### Win Scenarios
1. **Elimination Victory:** Reach 1,000 hostile eliminations
2. **Extraction Success:** Survive the full 10:00 timer

### Defeat Condition
- **Health Depleted:** Player health drops to 0 HP

---

## 🛠️ Upgrade Strategy Guide

### Early Game (0-3 min)
Prioritize **Speed Agility** → **Multi-Barrel** for crowd control

### Mid Game (3-5 min)
Consider **Drone Co-Op** for damage multiplier or **Knockback** for control

### Late Game (5-10 min)
If drone active: **Repair Protocol**  
If solo: **Heavy Knockback** for survival

---

## 📊 HUD Display

- **Top-Left:** Vitality % | Magazine ammo count
- **Top-Center:** Real-time countdown timer
- **Top-Right:** Elimination counter | Bomb charges
- **Bottom-Center:** Melee push cooldown status
- **Edge Fog:** Vignette effect during reload

---

## ⚙️ Technical Features

### Physics Engine
- Arcade physics with collision detection
- Circular hit circles for player & enemies (14px, 11px radius)
- Bounce mechanics on wall collisions
- Knockback physics with velocity calculations

### World & Level Design
- **World Size:** 1,600×1,600 pixels
- **Camera:** Follows player with 0.08 damping (smooth tracking)
- **Maze Grid:** 25×13 tile grid (64px per tile)
- **2 Dynamic Maze Patterns:** Original + Shifted layout

### AI Systems
- **Partner Drone:** Autonomous targeting within 300px range
- **Enemy Pathfinding:** Angle-based velocity steering
- **Formation AI:** Tank-led phalanx grouping
- **Stun Mechanics:** Melee push stuns enemies for 600ms

### Visual Effects
- Canvas-based sprite generation (no external assets)
- Procedural textures for all game entities
- Screen shake on significant events (damage, explosions)
- Flash effects for reloading & critical moments
- Radial fog vignette for atmospheric edge darkening
- Color tinting for damage feedback (red flashes)

---

## 🎨 Game Entities

### Player
- 28×28 px white square with cyan eye
- Circular collision (14px radius)
- Default speed: 180 px/frame

### Partner Drone
- 26×26 px gray square with orange thruster
- Autonomous targeting & firing
- Spawns at 50% health

### Enemies
- 24×24 px colored squares with black eyes
- Circular collision (11px radius)
- 4 color variants + ghost variant

### Projectiles
- **Player Bullets:** 8×4 px white rectangles, 650 px/s velocity
- **Drone Bullets:** 8×4 px with orange tint, 550 px/s velocity

### Environmental
- **Walls:** 64×64 px dark blocks with blue outline
- **Acid Pools:** 96×96 px green circles, 10-second duration
- **Barrels:** 24×32 px green drums, detonates on bullet impact
- **Gems:** 10×10 px cyan collectibles

### Hazards
- **Bombs:** 20×20 px red circles with white fuse detail
- **Explosions:** Circular blast radius visualizations

---

## 📈 Statistics & Metrics

Tracked throughout gameplay:
- **Total Shots Fired:** Accuracy baseline
- **Total Shots Hit:** Damage efficiency
- **Barrels Destroyed:** Environmental interaction
- **Time in Berserker:** Low-health duration
- **Kill Count:** Primary objective tracker

---

## 🎮 Difficulty Scaling

Enemy spawn rate increases progressively:
- Base spawn: 4 enemies every 2 seconds
- Escalation tied to elapsed time
- Higher-tier units appear in later waves
- Explosive/ghost variants increase spawn chance

---

## 🔧 Developer Notes

### Code Architecture
- **Phaser 3 Framework:** Canvas rendering, arcade physics
- **Scene Management:** Preload → Create → Update loop
- **Global State:** Centralized game variables
- **Event-Driven:** Physics overlaps, collider callbacks

### Key Functions
- `update()` - Main game loop (player/enemy/AI logic)
- `spawnGatedHorde()` - Wave spawning system
- `damageEnemy()` / `damagePlayer()` - Damage resolution
- `handleBombMechanic()` - Explosive physics
- `triggerLabyrinthStructuralShift()` - Dynamic level changes

### Performance Considerations
- Object pooling for bullets & enemies (200 & 100 max)
- Static wall groups for collision efficiency
- Physics world pause during menus
- Sprite visibility culling

---

## 🎓 How to Play

1. **Start** the mission from the main menu
2. **Read** the tactical manual for strategy overview
3. **Navigate** the maze with WASD, aim with mouse
4. **Survive** enemy waves and collect gems
5. **Upgrade** at gem thresholds (60 gems = 1 upgrade)
6. **Adapt** to the maze shift at 5-minute mark
7. **Endure** or eliminate to victory conditions

---

## 🏆 Victory Tips

- **Early Upgrades:** Speed → Multi-barrel for crowd control
- **Gem Farming:** Focus on clustered enemies near barrels
- **Drone Strategy:** Deploy by mid-game for damage multiplier
- **Melee Timing:** Use SPACEBAR to escape surrounded situations
- **Maze Mastery:** Memorize layout before 5:00 shift
- **Berserker Advantage:** Below 30% HP enables faster reload spam

---

## 📝 License & Credits

**Built with:** [Phaser 3](https://phaser.io)

**Game Design & Development:** arjuns2487

---

**Are you ready for extraction? ⚔️**
