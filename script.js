
const config = {
    type: Phaser.CANVAS, 
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    backgroundColor: '#05050d', 
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);


let player;
let wasd;
let spacebar;
let tKey; 
let bullets;
let companionBullets; 
let enemies; 
let walls; 
let gems;
let barrels;      
let acidPools;    
let activeBomb = null; 


let partnerAgent = null; 
let partnerHealth = 50;  
let partnerLastFired = 0;
const PARTNER_FIRE_RATE = 400; 

let lastFired = 0;       
let fireRate = 150;   
let playerSpeed = 180;
let bulletCount = 1; 
let bulletKnockbackForce = 120; 
const WORLD_SIZE = 1600; 


let currentAmmo = 50;
const MAX_AMMO = 50;
let isReloading = false;
let reloadTimerText;
let playerHealth = 100;
let healthText;
let lastHitTime = 0;       
const IMMUNITY_WINDOW = 400; 
let collectedGems = 0; 


let nextMeleeTime = 0;
let meleeCooldownText;


let killCount = 0;
let killCountCheckpoint = 0; 
let killScoreText;
let bombInventory = 0; 
let bombInventoryText; 
let fogVignette;


let totalShotsFired = 0;
let totalShotsHit = 0;
let barrelsDestroyed = 0;
let timeSpentInBerserk = 0;


let gameTimer;
let barrelSpawnerTimer;
let totalTimeSeconds = 600; 
let timerText;
let gameState = 'START_MENU'; 
let menuGroup;
let manualGroup; 
let upgradeUiGroup;
let gameOverGroup; 


let mazePattern = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];


function preload() {
    
    let playerCanvas = this.textures.createCanvas('hero', 28, 28);
    let pCtx = playerCanvas.context;
    pCtx.fillStyle = '#ffffff'; pCtx.fillRect(0, 0, 28, 28);
    pCtx.fillStyle = '#00ffff'; pCtx.fillRect(20, 10, 8, 8); 
    playerCanvas.refresh();

    
    let droneCanvas = this.textures.createCanvas('partner_drone', 26, 26);
    let dCtx = droneCanvas.context;
    dCtx.fillStyle = '#555566'; dCtx.fillRect(0, 0, 26, 26);
    dCtx.fillStyle = '#ffaa00'; dCtx.fillRect(18, 9, 8, 8); 
    droneCanvas.refresh();

    
    let bulletCanvas = this.textures.createCanvas('bullet', 8, 4);
    let bCtx = bulletCanvas.context;
    bCtx.fillStyle = '#ffffff'; bCtx.fillRect(0, 0, 8, 4);
    bulletCanvas.refresh();

    
    let wallCanvas = this.textures.createCanvas('wall_block', 64, 64);
    let wCtx = wallCanvas.context;
    wCtx.fillStyle = '#2d6a36'; wCtx.fillRect(0, 0, 64, 64);
    wCtx.strokeStyle = '#1e4824'; wCtx.strokeRect(0, 0, 64, 64);
    wCtx.fillStyle = '#3a8b46';
    wCtx.fillRect(10, 20, 4, 12);
    wCtx.fillRect(45, 15, 4, 15);
    wCtx.fillRect(25, 40, 4, 10);
    wCtx.fillRect(50, 45, 4, 8);
    wallCanvas.refresh();

    
    let gemCanvas = this.textures.createCanvas('gem', 10, 10);
    let gCtx = gemCanvas.context;
    gCtx.fillStyle = '#00ffcc'; gCtx.fillRect(0, 0, 10, 10);
    gemCanvas.refresh();

    
    let bombCanvas = this.textures.createCanvas('bomb_sprite', 20, 20);
    let boCtx = bombCanvas.context;
    boCtx.fillStyle = '#ff3333'; boCtx.beginPath(); boCtx.arc(10, 10, 10, 0, Math.PI * 2); boCtx.fill();
    boCtx.fillStyle = '#ffffff'; boCtx.fillRect(8, 8, 4, 4); 
    bombCanvas.refresh();

    
    let barrelCanvas = this.textures.createCanvas('barrel_sprite', 24, 32);
    let baCtx = barrelCanvas.context;
    baCtx.fillStyle = '#00cc44'; baCtx.fillRect(0, 0, 24, 32);
    baCtx.fillStyle = '#003311'; baCtx.fillRect(0, 6, 24, 4); baCtx.fillRect(0, 22, 24, 4);
    barrelCanvas.refresh();

    
    let poolCanvas = this.textures.createCanvas('acid_pool', 96, 96);
    let poCtx = poolCanvas.context;
    poCtx.fillStyle = 'rgba(0, 255, 68, 0.4)'; poCtx.beginPath(); poCtx.arc(48, 48, 44, 0, Math.PI * 2); poCtx.fill();
    poolCanvas.refresh();

    
    createEnemyTexture(this, 'enemy_red', '#ff0044');       
    createEnemyTexture(this, 'enemy_orange', '#ff6600');    
    createEnemyTexture(this, 'enemy_yellow', '#ffff00');    
    createEnemyTexture(this, 'enemy_exploder', '#00ff00');  
    createEnemyTexture(this, 'enemy_ghost', '#aa00ff');     

    
    let fogCanvas = this.textures.createCanvas('edge_fog', 800, 600);
    let fCtx = fogCanvas.context;
    let gradient = fCtx.createRadialGradient(400, 300, 200, 400, 300, 480);
    gradient.addColorStop(0, 'rgba(5, 5, 13, 0)');     
    gradient.addColorStop(0.6, 'rgba(5, 5, 13, 0.85)'); 
    gradient.addColorStop(1, 'rgba(2, 2, 5, 1)');       
    fCtx.fillStyle = gradient; fCtx.fillRect(0, 0, 800, 600);
    fogCanvas.refresh();
}

function createEnemyTexture(scene, key, color) {
    let canvas = scene.textures.createCanvas(key, 24, 24);
    let ctx = canvas.context;
    ctx.fillStyle = color; ctx.fillRect(0, 0, 24, 24);
    ctx.fillStyle = '#000000'; ctx.fillRect(4, 5, 4, 4); ctx.fillRect(14, 5, 4, 4);
    canvas.refresh();
}


function create() {
    this.physics.world.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE);
    
    walls = this.physics.add.staticGroup();
    bullets = this.physics.add.group({ defaultKey: 'bullet', maxSize: 200 });
    companionBullets = this.physics.add.group({ defaultKey: 'bullet', maxSize: 100 }); 
    enemies = this.physics.add.group();
    gems = this.physics.add.group();
    barrels = this.physics.add.staticGroup();
    acidPools = this.physics.add.group();

    buildLabyrinthWalls.call(this);

    player = this.physics.add.sprite(800, 352, 'hero');
    player.setCollideWorldBounds(true).body.setCircle(14); 

    this.cameras.main.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);

    wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D
    });
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    tKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

    
    this.physics.add.collider(player, walls);
    this.physics.add.collider(enemies, walls, null, (enemy, wall) => { return !enemy.isGhost; }); 
    this.physics.add.collider(enemies, enemies); 
    this.physics.add.collider(barrels, bullets, detonateBarrel, null, this);
    this.physics.add.collider(barrels, companionBullets, detonateBarrel, null, this);
    this.physics.add.collider(bullets, walls, (bullet) => { bullet.setActive(false).setVisible(false).body.stop(); });
    this.physics.add.collider(companionBullets, walls, (bullet) => { bullet.setActive(false).setVisible(false).body.stop(); });
    
    this.physics.add.overlap(bullets, enemies, damageEnemy, null, this);
    this.physics.add.overlap(companionBullets, enemies, damageEnemy, null, this); 
    this.physics.add.overlap(player, enemies, damagePlayer, null, this);
    this.physics.add.overlap(player, gems, collectGem, null, this);
    this.physics.add.overlap(enemies, acidPools, burnEnemyByAcid, null, this);

    this.time.addEvent({ delay: 2000, callback: spawnGatedHorde, callbackScope: this, loop: true });
    gameTimer = this.time.addEvent({ delay: 1000, callback: updateClock, callbackScope: this, loop: true });
    
    spawnAcidBarrels.call(this);
    barrelSpawnerTimer = this.time.addEvent({ delay: 60000, callback: spawnAcidBarrels, callbackScope: this, loop: true });

    setupHudUI.call(this);
    fogVignette = this.add.image(400, 300, 'edge_fog').setScrollFactor(0).setDepth(15).setVisible(false);

    showStartMenu.call(this);
}

function buildLabyrinthWalls() {
    walls.clear(true, true);
    for (let r = 0; r < mazePattern.length; r++) {
        for (let c = 0; c < mazePattern[r].length; c++) {
            if (mazePattern[r][c] === 1) {
                walls.create(c * 64 + 32, r * 64 + 32, 'wall_block');
            }
        }
    }
}


function showStartMenu() {
    gameState = 'START_MENU';
    this.physics.world.pause();

    menuGroup = this.add.group();

    let backgroundPlate = this.add.graphics().fillStyle(0x05050d, 1).fillRect(0, 0, 800, 600).setScrollFactor(0).setDepth(20);
    menuGroup.add(backgroundPlate);

    let gameTitle = this.add.text(400, 160, 'LABYRINTH INTRUDER', { 
        fontSize: '36px', fill: '#2222aa', fontFamily: 'monospace', fontWeight: 'bold' 
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
    
    let subTitle = this.add.text(400, 210, 'Advanced Tactical Survival Build', { 
        fontSize: '13px', fill: '#666666', fontFamily: 'monospace' 
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21);

    menuGroup.add(gameTitle); menuGroup.add(subTitle);

    let startBtn = this.add.text(400, 320, '[ ENGAGE MISSION ]', { 
        fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace', backgroundColor: '#090924', padding: { x: 25, y: 12 } 
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21).setInteractive({ useHandCursor: true });
    menuGroup.add(startBtn);

    let manualBtn = this.add.text(400, 410, '[ FIELD MANUAL / INTEL ]', { 
        fontSize: '16px', fill: '#00ffcc', fontFamily: 'monospace', backgroundColor: '#0c1a0c', padding: { x: 20, y: 10 } 
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21).setInteractive({ useHandCursor: true });
    menuGroup.add(manualBtn);

    startBtn.on('pointerover', () => startBtn.setStyle({ fill: '#00ffff', backgroundColor: '#141444' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ fill: '#ffffff', backgroundColor: '#090924' }));
    startBtn.on('pointerdown', () => {
        menuGroup.clear(true, true); 
        gameState = 'PLAYING';
        this.physics.world.resume();
        setHudVisibility(true);
    });

    manualBtn.on('pointerover', () => manualBtn.setStyle({ fill: '#ffffff', backgroundColor: '#163316' }));
    manualBtn.on('pointerout', () => manualBtn.setStyle({ fill: '#00ffcc', backgroundColor: '#0c1a0c' }));
    manualBtn.on('pointerdown', () => {
        menuGroup.clear(true, true); 
        showTacticalManual.call(this); 
    });
}

function showTacticalManual() {
    manualGroup = this.add.group();

    let backdrop = this.add.graphics().fillStyle(0x020207, 0.98).fillRect(0, 0, 800, 600).setScrollFactor(0).setDepth(25);
    manualGroup.add(backdrop);

    let manualHeader = this.add.text(400, 40, 'LABYRINTH STANDARD INFILTRATION MANUAL', {
        fontSize: '22px', fill: '#00ffcc', fontFamily: 'monospace', fontWeight: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(26);
    manualGroup.add(manualHeader);

    
    let detailedGuideString = 
        `[1] CORE MISSION OBJECTIVE PARAMETERS\n` +
        `    - PRIMARY GOAL: NEUTRALIZE EXACTLY 1000 ENEMIES BEFORE TIME RUNS OUT.\n` +
        `    - PROTOCOL    : Secure grids and survive for a maximum of 10:00 MINUTES.\n` +
        `    - EXTRACTION  : Exfil portal locks release when countdown hits 00:00.\n\n` +
        `[2] MOVEMENT & ABILITY DIAGNOSTICS\n` +
        `    - LOCOMOTION     : Move agent via [ W, A, S, D ] key bindings.\n` +
        `    - WEAPONS ENGINE : Fire standard ammo clip via LEFT MOUSE BUTTON.\n` +
        `    - RADIAL MELEE   : Tap [ SPACEBAR ] to emit shockwave. (1-MIN COOLDOWN).\n` +
        `    - THERMAL CHARGE : Tap [ T ] to drop/detonate bomb. (Deducts 2 mins off clock).\n\n` +
        `[3] SYSTEM OPERATIONS & TACTICAL INTEGRATION\n` +
        `    - SHIFTER PHENOMENON: At 5:00, structural wall matrices completely move and \n` +
        `                          rearrange to toggle corridors and block camping tracks.\n` +
        `    - RECON SQUAD CO-OP : Purchase Drone card to deploy an AI wingman partner drone.\n` +
        `                          Autonomous ally spawns damaged at 50% vitality and auto-attacks.\n` +
        `    - SOUL REAP ENGINE  : For every 50 hostiles neutralized, system rewards you with \n` +
        `                          an immediate 10% vital health recovery siphon effect instantly.\n` +
        `    - BERSERKER SPRINT  : Drop below 30% HP to slash reloader lock times down by 300%.`;

    let manualTextPane = this.add.text(50, 95, detailedGuideString, {
        fontSize: '12px', fill: '#cccccc', fontFamily: 'monospace', lineSpacing: 4, align: 'left'
    }).setScrollFactor(0).setDepth(26);
    manualGroup.add(manualTextPane);

    let returnBtn = this.add.text(400, 545, '[ RETURN TO START TERMINAL ]', {
        fontSize: '16px', fill: '#ffffff', fontFamily: 'monospace', backgroundColor: '#222233', padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(26).setInteractive({ useHandCursor: true });
    manualGroup.add(returnBtn);

    returnBtn.on('pointerover', () => returnBtn.setStyle({ fill: '#00ffff', backgroundColor: '#333355' }));
    returnBtn.on('pointerout', () => returnBtn.setStyle({ fill: '#ffffff', backgroundColor: '#222233' }));
    returnBtn.on('pointerdown', () => {
        manualGroup.clear(true, true); 
        showStartMenu.call(this); 
    });
}


function update() {
    if (gameState !== 'PLAYING') return;

    
    let actualReloadSpeed = 2000; 
    if (playerHealth <= 30) {
        actualReloadSpeed = 600; 
        timeSpentInBerserk++;
        if (this.time.now % 200 < 100) player.setTint(0xffaa00);
        else player.clearTint();
    } else {
        player.clearTint();
    }

    player.setVelocity(0);

    if (wasd.left.isDown) player.setVelocityX(-playerSpeed);
    else if (wasd.right.isDown) player.setVelocityX(playerSpeed);

    if (wasd.up.isDown) player.setVelocityY(-playerSpeed);
    else if (wasd.down.isDown) player.setVelocityY(playerSpeed);

    let pointer = this.input.activePointer;
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);

    if (partnerAgent && partnerAgent.active) {
        let distanceToOwner = Phaser.Math.Distance.Between(partnerAgent.x, partnerAgent.y, player.x, player.y);
        
        if (distanceToOwner > 70) {
            let angleToPlayer = Phaser.Math.Angle.Between(partnerAgent.x, partnerAgent.y, player.x, player.y);
            partnerAgent.body.setVelocity(Math.cos(angleToPlayer) * 140, Math.sin(angleToPlayer) * 140);
        } else {
            partnerAgent.body.setVelocity(0, 0); 
        }

        let targetEnemy = null;
        let minimumTargetDistance = 300; 

        enemies.children.each(e => {
            if (e.active && e.body) {
                let dist = Phaser.Math.Distance.Between(partnerAgent.x, partnerAgent.y, e.x, e.y);
                if (dist < minimumTargetDistance) {
                    minimumTargetDistance = dist;
                    targetEnemy = e;
                }
            }
        });

        if (targetEnemy) {
            let droneAimAngle = Phaser.Math.Angle.Between(partnerAgent.x, partnerAgent.y, targetEnemy.x, targetEnemy.y);
            partnerAgent.rotation = droneAimAngle;

            if (this.time.now > partnerLastFired) {
                let pBullet = companionBullets.get(partnerAgent.x, partnerAgent.y);
                if (pBullet) {
                    pBullet.setActive(true).setVisible(true).setRotation(droneAimAngle);
                    pBullet.setTint(0xffaa00); 
                    this.physics.velocityFromRotation(droneAimAngle, 550, pBullet.body.velocity);
                    partnerLastFired = this.time.now + PARTNER_FIRE_RATE;
                }
            }
        }
    }

    
    if (pointer.isDown && this.time.now > lastFired && !isReloading) {
        if (currentAmmo > 0) {
            totalShotsFired += bulletCount;
            if (bulletCount === 1) {
                fireBullet.call(this, player.rotation);
            } else {
                let spread = 0.15;
                let startAngle = player.rotation - (Math.floor(bulletCount / 2) * spread);
                for (let i = 0; i < bulletCount; i++) {
                    fireBullet.call(this, startAngle + (i * spread));
                }
            }
            
            currentAmmo--;
            reloadTimerText.setText('MAG: ' + currentAmmo + '/50 | GEMS: ' + collectedGems + '/60');
            lastFired = this.time.now + fireRate;

            if (currentAmmo <= 0) triggerReload.call(this, actualReloadSpeed);
        }
    }

    if (Phaser.Input.Keyboard.JustDown(spacebar)) triggerMeleeEmergencyPush.call(this);
    if (Phaser.Input.Keyboard.JustDown(tKey)) handleBombMechanic.call(this);

    let secondsLeftMelee = Math.max(0, Math.ceil((nextMeleeTime - this.time.now) / 1000));
    if (secondsLeftMelee > 0) {
        meleeCooldownText.setText('MELEE PUSH (SPACE): LOCK ' + secondsLeftMelee + 's');
    } else {
        meleeCooldownText.setText('MELEE PUSH (SPACE): READY');
    }

    
    enemies.children.each(function(enemy) {
        if (enemy.active && enemy.body) {
            
            if (!enemy.isGhost) {
                let currentTileC = Math.floor(enemy.x / 64);
                let currentTileR = Math.floor(enemy.y / 64);
                
                if (mazePattern[currentTileR] && mazePattern[currentTileR][currentTileC] === 1) {
                    enemy.x = 96; enemy.y = 96;
                    enemy.body.reset(96, 96);
                    return;
                }
            }

            
            
            if (enemy.isStunned && this.time.now < enemy.stunExpiration) {
                
                enemy.body.setDrag(150);
                return; 
            }
            
            
            enemy.isStunned = false;
            enemy.body.setDrag(0);

            let distToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
            let distToDrone = (partnerAgent && partnerAgent.active) ? Phaser.Math.Distance.Between(enemy.x, enemy.y, partnerAgent.x, partnerAgent.y) : 99999;
            
            let focusTarget = (distToDrone < distToPlayer) ? partnerAgent : player;

            let targetX = focusTarget.x;
            let targetY = focusTarget.y;

            if (enemy.isPhalanxGrunt) {
                let closeTank = null; let minD = 9999;
                enemies.children.each(t => {
                    if (t.active && t.isTank) {
                        let d = Phaser.Math.Distance.Between(enemy.x, enemy.y, t.x, t.y);
                        if (d < minD) { minD = d; closeTank = t; }
                    }
                });

                if (closeTank) {
                    let angleTank = Phaser.Math.Angle.Between(closeTank.x, closeTank.y, focusTarget.x, focusTarget.y);
                    targetX = closeTank.x - Math.cos(angleTank) * 35;
                    targetY = closeTank.y - Math.sin(angleTank) * 35;
                    enemy.speedStat = closeTank.speedStat; 
                }
            }

            
            
            let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, targetX, targetY);
            this.physics.velocityFromRotation(angle, enemy.speedStat, enemy.body.velocity);
            enemy.rotation = angle;
        }
    }, this);
}

function fireBullet(angle) {
    let bullet = bullets.get(player.x, player.y);
    if (bullet) {
        bullet.setActive(true).setVisible(true).setRotation(angle);
        this.physics.velocityFromRotation(angle, 650, bullet.body.velocity);
    }
}


function triggerMeleeEmergencyPush() {
    if (this.time.now < nextMeleeTime) return; 
    nextMeleeTime = this.time.now + 60000; 

    this.cameras.main.shake(200, 0.015);
    let pushRadius = 150;

    let blastRing = this.add.graphics();
    blastRing.lineStyle(3, 0xffffff, 1);
    blastRing.strokeCircle(player.x, player.y, pushRadius);
    this.time.delayedCall(150, () => { blastRing.destroy(); });

    enemies.children.each(function(enemy) {
        if (enemy && enemy.active && enemy.body) {
            let distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
            if (distance <= pushRadius) {
                let pushAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
                
                
                enemy.isStunned = true;
                enemy.stunExpiration = this.time.now + 600; 
                
                
                enemy.body.setVelocity(Math.cos(pushAngle) * 600, Math.sin(pushAngle) * 600);
            }
        }
    }, this);
}


function handleBombMechanic() {
    if (!activeBomb) {
        if (bombInventory > 0) {
            bombInventory--;
            bombInventoryText.setText('CHARGES (T): ' + bombInventory);
            activeBomb = this.physics.add.sprite(player.x, player.y, 'bomb_sprite').setDepth(12);
            this.tweens.add({ targets: activeBomb, alpha: 0.3, duration: 250, yoyo: true, loop: -1 });
        }
    } else {
        this.cameras.main.shake(400, 0.03); 
        let blastRadius = 250; 
        
        enemies.children.each(function(enemy) {
            if (enemy && enemy.active) {
                let dist = Phaser.Math.Distance.Between(activeBomb.x, activeBomb.y, enemy.x, enemy.y);
                if (dist <= blastRadius) {
                    gems.create(enemy.x, enemy.y, 'gem');
                    registerElimination.call(this); 
                    enemy.destroy();
                }
            }
        }, this);

        activeBomb.destroy(); activeBomb = null;
    }
}


function spawnAcidBarrels() {
    if (gameState !== 'PLAYING') return;
    barrels.clear(true, true);

    for (let i = 0; i < 2; i++) {
        let spawned = false; let attempt = 0;
        
        while (!spawned && attempt < 100) {
            attempt++;
            let tileX = Phaser.Math.Between(1, 23);
            let tileY = Phaser.Math.Between(1, 11);

            if (mazePattern[tileY] && mazePattern[tileY][tileX] === 0) {
                let pixelX = tileX * 64 + 32;
                let pixelY = tileY * 64 + 32;

                if (Phaser.Math.Distance.Between(pixelX, pixelY, player.x, player.y) > 150) {
                    let barrelObj = barrels.create(pixelX, pixelY, 'barrel_sprite');
                    barrelObj.body.setSize(24, 32);
                    spawned = true;
                }
            }
        }
    }
}

function detonateBarrel(barrel, bullet) {
    bullet.setActive(false).setVisible(false).body.stop();
    barrelsDestroyed++;
    let spawnX = barrel.x; let spawnY = barrel.y;
    barrel.destroy(); 

    let pool = acidPools.create(spawnX, spawnY, 'acid_pool');
    pool.body.setCircle(48); pool.setDepth(4);

    this.tweens.add({
        targets: pool, alpha: 0, delay: 8500, duration: 1500,
        onComplete: () => { pool.destroy(); }
    });
}

function burnEnemyByAcid(enemy, pool) {
    if (enemy && enemy.active) {
        enemy.healthPool -= 0.1; 
        enemy.setTint(0x00ff00); 
        if (enemy.healthPool <= 0) {
            gems.create(enemy.x, enemy.y, 'gem');
            registerElimination.call(this);
            enemy.destroy();
        }
    }
}


function registerElimination() {
    killCount++;
    killCountCheckpoint++;
    
    killScoreText.setText('ELIMINATIONS: ' + String(killCount).padStart(3, '0'));

    
    if (killCount >= 1000) {
        endGame.call(this, 'VICTORY\nElimination Goal Achieved!', '#00ffcc');
        return;
    }

    if (killCountCheckpoint >= 50) {
        killCountCheckpoint = 0; 
        
        playerHealth = Math.min(100, playerHealth + 10); 
        healthText.setText('VITALITY: ' + playerHealth + '%');

        this.cameras.main.flash(150, 0, 255, 100, false);
    }
}


function triggerReload(cooldownSpeed) {
    isReloading = true;
    reloadTimerText.setText('MAG: RELOADING CHAMBER...');
    reloadTimerText.setStyle({ fill: '#ff3333' });
    fogVignette.setTint(0xff5555);

    let flashAlert = this.time.addEvent({
        delay: 200, callback: () => { reloadTimerText.setVisible(!reloadTimerText.visible); }, loop: true
    });

    this.time.delayedCall(cooldownSpeed, () => {
        flashAlert.destroy(); currentAmmo = 50; isReloading = false; fogVignette.clearTint(); 
        reloadTimerText.setVisible(true).setStyle({ fill: '#ffffff' });
        reloadTimerText.setText('MAG: ' + currentAmmo + '/50 | GEMS: ' + collectedGems + '/60');
    });
}


function spawnGatedHorde() {
    if (gameState !== 'PLAYING') return;
    let elapsedSeconds = 600 - totalTimeSeconds;
    
    for (let i = 0; i < 4; i++) {
        let spawnX = Phaser.Math.Between(100, WORLD_SIZE - 100);
        let spawnY = Phaser.Math.Between(100, WORLD_SIZE - 100);

        if (Phaser.Math.Distance.Between(spawnX, spawnY, player.x, player.y) < 300) continue;

        let key, hp, speed;
        let isExploder = false; let isGhost = false; let isTank = false;
        let exploderRoll = Phaser.Math.Between(1, 100);
        
        if (exploderRoll <= 15) {
            key = 'enemy_exploder'; hp = 1; speed = 140; isExploder = true;
        } else if (elapsedSeconds > 180 && Phaser.Math.Between(1, 100) <= 20) {
            key = 'enemy_ghost'; hp = 2; speed = 65; isGhost = true;
        } else if (elapsedSeconds < 60) {
            key = 'enemy_red'; hp = 1; speed = 80;
        } else if (elapsedSeconds < 180) {
            let roll = Phaser.Math.Between(1, 100);
            if (roll <= 75) { key = 'enemy_red'; hp = 1; speed = 80; }
            else { key = 'enemy_orange'; hp = 3; speed = 105; }
        } else {
            let roll = Phaser.Math.Between(1, 100);
            if (roll <= 50) { key = 'enemy_red'; hp = 1; speed = 80; }
            else if (roll <= 80) { key = 'enemy_orange'; hp = 3; speed = 105; }
            else { key = 'enemy_yellow'; hp = 7; speed = 120; isTank = true; } 
        }

        let enemy = enemies.create(spawnX, spawnY, key);
        if (enemy) {
            enemy.setCollideWorldBounds(!isGhost); 
            enemy.body.setCircle(11); enemy.body.setBounce(1, 1); 
            enemy.healthPool = hp; enemy.speedStat = speed; enemy.baseSpeed = speed;
            enemy.isExploder = isExploder; enemy.isGhost = isGhost; enemy.isTank = isTank;
            enemy.isStunned = false; 

            if (isTank) {
                enemies.children.each(e => {
                    if (e.active && e.texture.key === 'enemy_red' && !e.isPhalanxGrunt) {
                        if (Phaser.Math.Distance.Between(enemy.x, enemy.y, e.x, e.y) < 200) e.isPhalanxGrunt = true;
                    }
                });
            }
        }
    }
}


function damageEnemy(bullet, enemy) {
    if (bullet.active && enemy.active) {
        bullet.setActive(false).setVisible(false).body.stop();
        if (bullet.texture.key === 'bullet') totalShotsHit++; 

        
        let knockbackAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
        if(!enemy.isStunned) {
            enemy.body.setVelocity(Math.cos(knockbackAngle) * bulletKnockbackForce, Math.sin(knockbackAngle) * bulletKnockbackForce);
        }
        enemy.healthPool--;

        if (enemy.healthPool <= 0) {
            if (enemy.isExploder) triggerExploderBlast.call(this, enemy.x, enemy.y);
            else gems.create(enemy.x, enemy.y, 'gem');
            
            this.cameras.main.shake(100, 0.005);
            registerElimination.call(this);
            enemy.destroy();
        } else {
            enemy.setTint(0xffffff);
            this.time.delayedCall(60, () => { if (enemy.active) enemy.clearTint(); });
        }
    }
}

function triggerExploderBlast(exX, exY) {
    this.cameras.main.shake(150, 0.01);
    let boomCircle = this.add.graphics().fillStyle(0x00ff00, 0.4); 
    boomCircle.fillCircle(exX, exY, 60);
    this.time.delayedCall(120, () => { boomCircle.destroy(); });

    enemies.children.each(function(enemy) {
        if (enemy && enemy.active && !enemy.isExploder) {
            if (Phaser.Math.Distance.Between(exX, exY, enemy.x, enemy.y) <= 60) {
                gems.create(enemy.x, enemy.y, 'gem'); 
                registerElimination.call(this);
                enemy.destroy();
            }
        }
    }, this);

    if (Phaser.Math.Distance.Between(exX, exY, player.x, player.y) <= 60) {
        applyBiteDamage.call(this, 25, false); 
    }

    if (partnerAgent && partnerAgent.active && Phaser.Math.Distance.Between(exX, exY, partnerAgent.x, partnerAgent.y) <= 60) {
        applyBiteDamage.call(this, 25, true);  
    }
}

function damagePlayer(playerSprite, enemy) {
    if (gameState !== 'PLAYING') return;
    if (this.time.now > lastHitTime + IMMUNITY_WINDOW) {
        lastHitTime = this.time.now;
        let attackAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        if (enemy.isExploder) {
            enemy.destroy(); triggerExploderBlast.call(this, enemy.x, enemy.y);
        } else {
            applyBiteDamage.call(this, 3, false);
        }
    }
}

function createDroneCollider(scene) {
    scene.physics.add.overlap(enemies, partnerAgent, (partner, enemy) => {
        if (gameState !== 'PLAYING') return;
        if (scene.time.now % 600 < 30) { 
            applyBiteDamage.call(scene, 3, true); 
        }
    }, null, scene);
}

function applyBiteDamage(damageAmount, isHitTargetDrone) {
    if (isHitTargetDrone) {
        if (!partnerAgent || !partnerAgent.active) return;
        partnerHealth -= damageAmount;
        partnerAgent.setTint(0xff0000);
        this.time.delayedCall(100, () => { if (partnerAgent && partnerAgent.active) partnerAgent.clearTint(); });

        if (partnerHealth <= 0) {
            partnerAgent.destroy();
            partnerAgent = null; 
            this.cameras.main.flash(200, 100, 0, 0, false);
        }
    } else {
        playerHealth -= damageAmount;
        healthText.setText('VITALITY: ' + playerHealth + '%');
        this.cameras.main.shake(200, 0.02);
        player.setTint(0xff0000);
        this.time.delayedCall(150, () => { player.clearTint(); });

        if (playerHealth <= 0) endGame.call(this, 'MISSION COMPROMISED\nYou were overrun.', '#ff0000');
    }
}

function collectGem(playerSprite, gem) {
    if (gameState !== 'PLAYING') return;
    gem.destroy(); collectedGems++;
    reloadTimerText.setText('MAG: ' + currentAmmo + '/50 | GEMS: ' + collectedGems + '/60');

    if (collectedGems >= 60) {
        collectedGems = 0; reloadTimerText.setText('MAG: ' + currentAmmo + '/50 | GEMS: ' + collectedGems + '/60');
        showUpgradeShop.call(this);
    }
}


function showUpgradeShop() {
    gameState = 'UPGRADE_MENU';
    this.physics.world.pause();
    player.body.setVelocity(0, 0); enemies.setVelocity(0, 0); bullets.setVelocity(0, 0);
    if (partnerAgent && partnerAgent.active) partnerAgent.body.setVelocity(0,0);

    upgradeUiGroup = this.add.group();
    let overlay = this.add.graphics().fillStyle(0x000000, 0.95).fillRect(0, 0, 800, 600).setScrollFactor(0).setDepth(30);
    upgradeUiGroup.add(overlay);

    let title = this.add.text(400, 60, '60 GEMS INVESTED: CHOOSE UPGRADE', { 
        fontSize: '18px', fill: '#00ffcc', fontFamily: 'monospace', fontWeight: 'bold' 
    }).setOrigin(0.5).setScrollFactor(0).setDepth(31);
    upgradeUiGroup.add(title);

    const choices = [
        { name: '[ BOOST SPEED AGILITY ]', desc: 'Increases WASD keyboard velocity settings by 25%.', action: () => { playerSpeed *= 1.25; } },
        { name: '[ UPGRADE MULTI-BARREL ]', desc: 'Weapon transitions to an advanced spread layout, adding 2 extra bullets.', action: () => { bulletCount += 2; } },
        { name: '[ HEAVY IMPACT KNOCKBACK ]', desc: 'Increases bullet recoil knockback thrust impact force by 150%.', action: () => { bulletKnockbackForce *= 2.5; } },
    ];

    if (!partnerAgent) {
        choices.push({
            name: '[ RECON DRONE CO-OP ]',
            desc: 'Deploys an autonomous companion AI drone with target tracking hardware.\nFIXED FACT: Enters active field loops damaged at 50% INTEL HP.',
            action: () => {
                partnerHealth = 50; 
                partnerAgent = this.physics.add.sprite(player.x - 30, player.y - 30, 'partner_drone').setDepth(13);
                partnerAgent.setCollideWorldBounds(true).body.setCircle(13);
                this.physics.add.collider(partnerAgent, walls); 
                createDroneCollider(this); 
            }
        });
    } else {
        choices.push({
            name: '[ REPAIR HULL PROTOCOL ]',
            desc: 'Instantly patch chassis wiring. Restores player health back to 100% full caps.',
            action: () => { playerHealth = 100; healthText.setText('VITALITY: ' + playerHealth + '%'); }
        });
    }

    choices.forEach((choice, idx) => {
        let cardY = 150 + (idx * 105);
        let btn = this.add.text(400, cardY, choice.name, { fontSize: '13px', fill: '#ffffff', fontFamily: 'monospace', backgroundColor: '#0c1a0c', padding: { x: 12, y: 6 } }).setOrigin(0.5).setScrollFactor(0).setDepth(31).setInteractive({ useHandCursor: true });
        let sub = this.add.text(400, cardY + 32, choice.desc, { fontSize: '10px', fill: '#aaaaaa', align: 'center', fontFamily: 'monospace' }).setOrigin(0.5).setScrollFactor(0).setDepth(31);
        upgradeUiGroup.add(btn); upgradeUiGroup.add(sub);

        btn.on('pointerover', () => btn.setStyle({ fill: '#00ffcc', backgroundColor: '#163316' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#ffffff', backgroundColor: '#0c1a0c' }));
        btn.on('pointerdown', () => {
            choice.action(); upgradeUiGroup.clear(true, true);
            gameState = 'PLAYING'; this.physics.world.resume();
        });
    });
}


function triggerLabyrinthStructuralShift() {
    this.cameras.main.flash(600, 255, 0, 0, false); 
    this.cameras.main.shake(500, 0.02);

    let alertBanner = this.add.text(400, 120, '!! WARNING: LABYRINTH GEOMETRY SHIFTING !!', {
        fontSize: '24px', fill: '#ff0000', fontFamily: 'monospace', fontWeight: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
    this.time.delayedCall(3000, () => { alertBanner.destroy(); });

    mazePattern = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1],
        [1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1],
        [1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1],
        [1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    buildLabyrinthWalls.call(this);
    spawnAcidBarrels.call(this);
}


function setupHudUI() {
    healthText = this.add.text(20, 20, 'VITALITY: ' + playerHealth + '%', { fontSize: '20px', fill: '#ff4444', fontFamily: 'monospace' }).setScrollFactor(0).setDepth(50).setVisible(false);
    reloadTimerText = this.add.text(20, 50, 'MAG: ' + currentAmmo + '/50 | GEMS: ' + collectedGems + '/60', { fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace' }).setScrollFactor(0).setDepth(50).setVisible(false);
    timerText = this.add.text(400, 20, 'TIME TILL EXTINCTION: 10:00', { fontSize: '20px', fill: '#ffff00', fontFamily: 'monospace' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50).setVisible(false);
    killScoreText = this.add.text(780, 20, 'ELIMINATIONS: 000', { fontSize: '20px', fill: '#ff0044', fontFamily: 'monospace', fontWeight: 'bold' }).setOrigin(1, 0).setScrollFactor(0).setDepth(50).setVisible(false);
    bombInventoryText = this.add.text(780, 50, 'CHARGES (T): 0', { fontSize: '18px', fill: '#ffaa00', fontFamily: 'monospace' }).setOrigin(1, 0).setScrollFactor(0).setDepth(50).setVisible(false);
    meleeCooldownText = this.add.text(400, 560, 'MELEE PUSH (SPACE): READY', { fontSize: '16px', fill: '#00ffff', fontFamily: 'monospace' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50).setVisible(false);
}

function setHudVisibility(visible) {
    healthText.setVisible(visible); reloadTimerText.setVisible(visible);
    timerText.setVisible(visible); killScoreText.setVisible(visible);
    bombInventoryText.setVisible(visible); meleeCooldownText.setVisible(visible);
    fogVignette.setVisible(visible);
}

function updateClock() {
    if (gameState !== 'PLAYING') return;
    totalTimeSeconds--;

    if (totalTimeSeconds === 300) {
        triggerLabyrinthStructuralShift.call(this);
    }

    let minutes = Math.floor(totalTimeSeconds / 60); let seconds = totalTimeSeconds % 60;
    if (seconds < 10) seconds = '0' + seconds;
    timerText.setText('TIME TILL EXTINCTION: ' + minutes + ':' + seconds);

    if (totalTimeSeconds <= 0) endGame.call(this, 'SURVIVED\nExtraction successful!', '#00ffcc');
}


function endGame(message, color) {
    gameState = 'GAME_OVER';
    this.physics.world.pause();
    setHudVisibility(false); 

    gameOverGroup = this.add.group();

    let backdrop = this.add.graphics().fillStyle(0x000005, 0.96).fillRect(0, 0, 800, 600).setScrollFactor(0).setDepth(58);
    gameOverGroup.add(backdrop);

    let title = this.add.text(400, 90, message, { 
        fontSize: '32px', fill: color, align: 'center', fontFamily: 'monospace', fontWeight: 'bold' 
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60);
    gameOverGroup.add(title);

    let accuracyRating = totalShotsFired > 0 ? Math.round((totalShotsHit / totalShotsFired) * 100) : 0;
    let berserkTimelineSecs = Math.round(timeSpentInBerserk / 60);

    let statsConsoleTemplate = 
        `============= DEBRIEF REPORT =============\n\n` +
        ` TOTAL ELIMINATIONS      :  ${killCount} HOSTILES\n` +
        ` COMBAT SHOOTING ACCURACY:  ${accuracyRating}%\n` +
        ` ACID CONTAINERS BLASTED :  ${barrelsDestroyed} ENVIRO DRUMS\n` +
        ` CRITICAL BERSERKER TIME :  ${berserkTimelineSecs} SECONDS\n\n` +
        `==========================================`;

    let statsConsole = this.add.text(400, 290, statsConsoleTemplate, {
        fontSize: '15px', fill: '#888899', fontFamily: 'monospace', lineSpacing: 8, align: 'left'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60);
    gameOverGroup.add(statsConsole);

    let restartBtn = this.add.text(400, 480, '[ RE-DEPLOY CLONE AGENT ]', {
        fontSize: '20px', fill: '#ffffff', fontFamily: 'monospace', backgroundColor: '#220000', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60).setInteractive({ useHandCursor: true });
    gameOverGroup.add(restartBtn);

    restartBtn.on('pointerover', () => restartBtn.setStyle({ fill: '#ff3333', backgroundColor: '#440000' }));
    restartBtn.on('pointerout', () => restartBtn.setStyle({ fill: '#ffffff', backgroundColor: '#220000' }));
    restartBtn.on('pointerdown', () => {
        gameOverGroup.clear(true, true); 
        resetGameVariables.call(this);   
    });
}

function resetGameVariables() {
    enemies.clear(true, true);
    bullets.clear(true, true);
    companionBullets.clear(true, true);
    gems.clear(true, true);
    acidPools.clear(true, true);
    if (activeBomb) { activeBomb.destroy(); activeBomb = null; }
    if (partnerAgent) { partnerAgent.destroy(); partnerAgent = null; }

    player.clearTint();
    player.x = 800; player.y = 352;
    player.body.reset(800, 352);

    playerHealth = 100;
    currentAmmo = 50;
    collectedGems = 0;
    killCount = 0;
    killCountCheckpoint = 0;
    bombInventory = 0;
    totalTimeSeconds = 600;
    playerSpeed = 180;
    bulletCount = 1;
    bulletKnockbackForce = 120;
    nextMeleeTime = 0;
    isReloading = false;

    totalShotsFired = 0;
    totalShotsHit = 0;
    barrelsDestroyed = 0;
    timeSpentInBerserk = 0;

    mazePattern = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    buildLabyrinthWalls.call(this);

    healthText.setText('VITALITY: ' + playerHealth + '%');
    reloadTimerText.setText('MAG: ' + currentAmmo + '/50 | GEMS: ' + collectedGems + '/60');
    timerText.setText('TIME TILL EXTINCTION: 10:00');
    killScoreText.setText('ELIMINATIONS: 000');
    bombInventoryText.setText('CHARGES (T): 0');

    setHudVisibility(true);
    gameState = 'PLAYING';
    this.physics.world.resume();
    spawnAcidBarrels.call(this);
}
