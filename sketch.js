/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
life = 185;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var coronaBg, invisiblecoronaBg;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  coronaBgImage = loadImage("assets/background.jpg");
  mask = loadImage("assets/mask5.png");
  fruits = loadImage("assets/fruits.png");
  sanitizer = loadImage("assets/sanitizer.png");
  obstacle1 = loadImage("assets/corona virus.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  bullet = loadImage("assets/injection.png")
}

function setup() {
  createCanvas(800, 400);

  coronaBg = createSprite(400,100,400,20);
  coronaBg.addImage("coronaBg",coronaBgImage);
  coronaBg.scale=0.57
  coronaBg.x = width /2;

  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle",0,0,300)

    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;
  
  pointsGroup = new Group();
  obstaclesGroup = new Group();
  injectionGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  kangaroo.x=camera.position.x-270;
   
  if (gameState===PLAY){

    coronaBg.velocityX=-3

    if(coronaBg.x<100)
    {
       coronaBg.x=400
    }
  
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    if (keyDown("right")){
      shoot();
    }
     
    
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnPoints();
    spawnObstacles();

    kangaroo.collide(invisibleGround);
    
    
    if(life <= 0){
      gameState = END;
    }
    
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
    
      if(life > 0 ){
        life -= 185/4;
      }
      obstaclesGroup.destroyEach();
    }
    
    if(pointsGroup.isTouching(kangaroo)){
      score = score+1
      pointsGroup.destroyEach();
      
      
    }
    text("Score =" + score,400,200,100,100)

    if(injectionGroup.isTouching(obstaclesGroup)){
      obstaclesGroup.destroyEach();
      injectionGroup.destroyEach();
      if(life < 185){
        life += 185/4;
      }
    }
    if(injectionGroup.isTouching(pointsGroup)){
      pointsGroup.destroyEach();
      injectionGroup.destroyEach();
      if(score > 0){
        score = score-1
      }
      if(life > 0){
        life -= 185/4;
      }
    }
  }
  else if (gameState === END) {
    //set velcity of each game object to 0
    kangaroo.velocityY = 0;
    coronaBg.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    pointsGroup.setVelocityXEach(0);
     
    swal(
      {
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      text: "Your score is -"+score,
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    },
    function(isConfirm){
      if(isConfirm) {
        location.reload();
      }
    }
    
    );

   
  }

  
  drawSprites();


  textSize(20)
  stroke(3)
  fill("black")
  text("score:  "+score,camera.position.x,50)

  showLife();

  if(score>=15){
    kangaroo.visible= false;
    textSize(30)
    stroke(3)
    swal({
      title: `YAY!!!`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
    gameState = WIN
    kangaroo.velocityY = 0;
    coronaBg.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    pointsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    pointsGroup.setLifetimeEach(-1);
  }
}

function spawnPoints() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {

    var point = createSprite(camera.position.x+500,330,40,10);
   
    
    point.velocityX = -(6 + 3*score/100)
    

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: point.addImage(mask);
             point.scale = 1;
              break;
      
      case 2: point.addImage(sanitizer);
              point.scale = 0.20;
              break;
              
      default: break;
    }
    
    //assign scale and lifetime to the point           
  
     //assign lifetime to the variable
    point.lifetime = 400;
    
    point.setCollider("rectangle",0,0,point.width/2,point.height/2)
    //add each cloud to the group
    pointsGroup.add(point);
    
  }
  
}
function restart(){
  location.reload();
}
function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;
    //assign scale and lifetime to the obstacle           
      
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
} function showLife() {
  push();
  
  fill("white");
  rect(camera.position.x - 200 ,40, 185, 20);
  fill("#f50057");
  rect(camera.position.x - 200 ,40, life, 20);
  noStroke();
  pop();
}

function shoot(){
  injection = createSprite(kangaroo.x,kangaroo.y,50,50)
  injection.addImage(bullet)
  injection.scale = 0.1
  injection.velocityX = 7
  injectionGroup.add(injection);
}

