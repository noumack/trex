var trex, trex_running,trexCollider; 
var ground, invisibleGround, groundImage;
var cloud, cloudImage, cloudsGroup;
var obstacle,obstacle1,obstacle3,obstacle4,obstacle5,obstacle6, obstaclesGroup;
var palabra = "AXEL";

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;
var game_over,game_over_image;
var restart,restart_image;
var jump_sound;
var die_sound;
var checkpoint_sound;


function preload(){
  //CARGAR IMAGENES Y ANIMACIONES
  trex_running =    loadAnimation("trex1.png","trex3.png","trex4.png");
  trexCollider = loadAnimation("trex_collided.png")
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  game_over_image = loadImage("gameOver.png")
  restart_image = loadImage("restart.png")
  
  jump_sound = loadSound("jump.mp3");
  die_sound = loadSound("die.mp3");
  checkpoint_sound = loadSound("checkPoint.mp3");
  
 
}

function setup() {
  //crear espacio de juego
  createCanvas(600, 200);
  
  //sprite de trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  
  
  // trex.debug = true;
  //trex.setCollider("rectangle", 0,0,100,50,130);
  trex.setCollider("circle",0,0,40 )
  trex.addAnimation("choque",trexCollider )
  
  //crear sprite de suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  //crear suelo invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //ejemplo de concatenacion
  //console.log("hola "+ palabra + " "+5);
  
  game_over = createSprite(300,80,200,50);
  game_over.addImage(game_over_image);
  
  
  restart = createSprite(300,150,100,50);
  restart.addImage(restart_image);
  
  
  
  //crear grupos
  cloudsGroup = new Group();
  obstaclesGroup = new Group();

 
}

function draw() {
  background(255);

  
  text("puntos " + score,530,20);
  
  if(gameState === PLAY){
    //cuando sea play
    if(Math.abs(ground.velocityX) < 15){
    ground.velocityX = -(4 + score/100);
    }
    //console.log(ground.velocityX)
    //trex salta
  if(keyDown("space") && trex.y>=160) {
    trex.velocityY = -12;
    jump_sound.play()
  }
    //gravedad
  trex.velocityY = trex.velocityY +0.7; 
    //suelo infinito
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  //aparece las nubes
  spawnClouds();
  spawnObstacles();
    
  //choque de el trex
  if(obstaclesGroup.isTouching(trex))  {
  gameState = END;
  die_sound.play()
   // trex.velocityY = -12;
  }
    
   //puntuacion
  score = score + Math.round (getFrameRate() / 60);   
  
  if(score > 0 && score % 100 === 0)  {
    
    checkpoint_sound.play()
  }
    
    
    
  //los sprites de game over y reset seagan invisisbles
    game_over.visible = false;
    restart.visible = false;
    
    
  }
  
  
  
  else if(gameState === END){
    //cuando game over
    ground.velocityX = 0;
  //que se detengan los sprites de el suelo y opstaculos
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  //animacion y velosidad de el trex al chocar  
    trex.changeAnimation("choque",trexCollider);
    trex.velocityY = 0;
  //no desaparicion de las nubes
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
  //asemos visibles los sprites de fin del juego y reiniciar
    game_over.visible = true;
    restart.visible = true;
    
    
    if(mousePressedOver(restart) ){
    reset();
    console.log("presionado");
  }
    
  }
  
  
    
  //trex esta sobre suelo invisible
  trex.collide(invisibleGround);
  
  
  
  //dibuja sprites
  drawSprites();
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 100 === 0) {
    //crear sprite de nubes
    cloud = createSprite(600,100,40,10);
    //cargar imagen sobre sprite cloud
    cloud.addImage(cloudImage);
    //posicion de nube aleatoria
    cloud.y = Math.round(random(10,60))
    //cloud.scale = 0.4;
    //velocidad de nube
    cloud.velocityX = -3;
    
    //ajusta la profundidad
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    cloud.lifetime = 220;
    
    //grupo de nubes
    cloudsGroup.add(cloud);
    }
}

function spawnObstacles(){
  if(frameCount % 80 === 0){
    obstacle = createSprite(600,163,10,40);
    obstacle.velocityX = ground.velocityX;
  var numero = Math.round(random(1,6));
  switch (numero){
    case 1:obstacle.addImage(obstacle1);
    break;
    case 2:obstacle.addImage(obstacle2);
    break;
    case 3:obstacle.addImage(obstacle3);
    break;
    case 4:obstacle.addImage(obstacle4);
    break;
    case 5:obstacle.addImage(obstacle5);
    break;
    case 6:obstacle.addImage(obstacle6);
    break;    
      
  }
    
  obstacle.scale = 0.5  
  obstacle.lifetime = 220
  obstacle.depth = trex.depth
  trex.depth = trex.depth + 1;
    
  obstaclesGroup.add(obstacle);
    
  }
  
  //framecount "importante"
  
}

function reset (){
  
  gameState = PLAY;
  
  game_over.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach(); 
  cloudsGroup.destroyEach(); 
  trex.changeAnimation("running", trex_running);
  trex.y = 160;
  score = 0;
}