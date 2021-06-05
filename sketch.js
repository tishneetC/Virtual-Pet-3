var dog, sadDog, happyDog, garden, washroom, bedroom, database; 
var foodS, foodStock; 
var fedTime, lastFed;
var feed, addFood; 
var foodObj; 
var gameState; 

function preload()
{
	sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden = loadImage("Images2/Garden.png"); 
  washroom = loadImage("Images2/Wash Room.png");
  bedroom = loadImage("Images2/Bed Room.png");
}

function setup() {
	
  database= firebase.database();
  createCanvas(1000, 400);
  foodObj = new Food(); 

  foodStock=database.ref('Food'); 
  foodStock.on("value", readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
      lastFed = data.val(); 
  });

  readState = database.ref('gameState');
  readState.on("value", function(data){
      gameState = data.val();
  });
  
  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the Dog");  
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood= createButton("Add Food");
  addFood.position(800,95); 
  addFood.mousePressed(addFoods); 


  
}


function draw() { 
  
  currentTime=hour(); 
  if(currentTime==(lastFed+1)){

    update("Playing"); 
    foodObj.garden();
    
  }else if(currentTime==(lastFed+2)){

    update("Sleeping");
    foodObj.bedroom(); 

  }else if(currentTime>(lastFed+2) && current <= (lastFed+4)){

    update("Bathing"); 
    foodObj.washroom(); 

  }else{

    update("Hungry")
    foodObj.display(); 

  }

  if(gameState!="Hungry"){

    feed.hide(); 
    addFood.hide(); 
    dog.remove(); 

  }else{

    feed.show(); 
    dog.addImage(sadDog);

  }
  


  background(46,139,87)
  foodObj.display();

  fedTime= database.ref('FeedTime'); 
  fedTime.on("value", function(data){
    elastFed=data.val();
    getFedTime(lastFed)
  })

  fill(255,255,254); 
  textSize(15); 
  if(lastFed>=12){
    text("Last Feed : " + lastFed%12 + "PM", 350, 30);
  }else if(lastFed ===0){
    text("Last Feed : 12 AM" ,350, 30);
  }else{
    text("Last Feed : " + lastFed + "AM", 350, 30); 
  }

  


  drawSprites();
 

}

function readStock(data){

  foodS = data.val(); 
  foodObj.updateFoodStock(foodS); 

}

function feedDog(){
  dog.addImage(happyDog); 

  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({
    Food:foodObj.getFoodStock(), 
    FeedTime:hour()
  })
}

function addFoods(){

  foodS++; 
  database.ref('/').update({
    Food:foodS
    
  })

}

function update(state){

  database.ref('/').update({

      gameState:state

  })

}





