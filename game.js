var Game = function() {

    // Game settings
    var settings = {};                                // Containes all game settings
    settings.heroSpeed = 3;
    settings.monsterOneSpeed = 20;
    settings.monsterSpawnRate = 5;
    settings.moveSqr = true;
    settings.moveSqrInitial = 64;
    settings.walls = true;                     // The zombie and character cannot go outside the screen
    settings.mapWalls = true;

    var turn = {};
    turn.turnNum = 1;                         //track change in controls
    turn.playerOne = true;                    //control whose turn it is
    turn.playerTwo = false;
    turn.monsters = false;

    // World settings
    var assets = [];                                 // All game objects
    var player1 = new Player1(settings);              // The player
    var player2 = new Player2(settings);
    var monsterOne = new Monster(settings);          // The monsters
    assets[0] = player1;
    assets[1] = player2;
    assets[2] = monsterOne;

    var frame = 0;                        // Frames since the start of the game
    var endGame = false;                  // Game ends when this is true
    var promptScreen = document.getElementById('promptScreen');
    var itemInfoTop = document.getElementById('itemInfoTop');
    var itemInfoBottom = document.getElementById('itemInfoBottom');
    var itemName = document.getElementById('itemName');
    var parent = document.getElementById("container");
    var explosion = document.getElementById("explosion");
    var explosionMusic = document.getElementById("explosionMusic");
    var explosionMusicTrigger = true;
    explosionMusic.muted = explosionMusicTrigger;
    var mainMusic = document.getElementById("mainMusic");
    var moveSqr = [];
    var players;
    var monsters;
    var playerArr = [];
    var monsterArr = [];
    var playerBags = [];
    var player1bag = [];
    var player2bag = [];
    playerBags[0] = player1bag;
    playerBags[1] = player2bag;
    var nightPosition = [{
      top:224,
      left:200,
      width:384,
      height:352
    },{
      top:32,
      left:456,
      width:128,
      height:195
    },{
      top:32,
      left:840,
      width:32,
      height:544
    },{
      top:256,
      left:584,
      width:448,
      height:128
    }]

    var harryPotter = false;
    var cloak = false;
    var monsterDetonator = false;
    var bossDiv;
    var boss = {
      name: "Boss",
      row:0,
      col:15,
      canBefound:false,
      image: "url('./assets/Boss.png')",
      tempAppear:false,
      appeared:false,
      died: false,
      canBeKilled: false,
      killedByPlayer:false
    };

    // All items for the Game
    var items = [{
      name: "Harry Potter",
      row: 6,
      col: 8,
      message: "you love to read!",
      found: false
    },{
      name: "Flying Axe",
      row:2,
      col:3,
      message: "An axe that flys on its own, so COOL~",
      found: false
    },{
      name: "Cloak",
      row: 12,
      col:25,
      message: "A cloak...hmmm...remember a certian book?...Combine with Harry Potter book to gain the invisibility cloak for 1 turn for that player",
      found: false
    },{
      name:"Machine Gun",
      row:12,
      col:24,
      message: "Congrats on getting a gun with unlimited bullets!",
      found: false
    },{
      name:"Herbal Soup",
      row:0,
      col:4,
      message: "Herbal soups are good for health"+"...."+"you can walk further in 1 turn",
      found: false
    },{
      name:"Hole",
      row:0,
      col:8,
      message:" You tripped. you sit down and tend to your wounds for this turn",
      found: false
    },{
      name:"Fresh Air",
      row:6,
      col:2,
      message: "the fresh air outside have revatalised you"+"...."+"you can walk further in 1 turn",
      found:false
    },{
      name:"A Hint",
      row:12,
      col:17,
      message: "Hint..Hint, the lab technician left a bomb in the monster"+"...."+"He dropped the detonator in the grass somewhere",
      found: false
    },{
      name:"Spider",
      row:14,
      col:15,
      message:"you got bitten by a spider"+"...."+"you must sit down and tend to your wounds for this turn",
      found: false
    },{
      name:"Monster Detonator",
      row:16,
      col:0,
      message: "Congrats you have killed the monster!!",
      found: false
    },{
      name:"Laboratory Log",
      row:0,
      col:25,
      message: "lure the monster out with Z-virus vaccine",
      found: false
    },{
      name:"Z-virus vaccine",
      row:3,
      col:11,
      message: "now you can take on the Boss monster",
      found: false
    },{
      name:"Z-virus vaccine",
      row:0,
      col:22,
      message: "now you can take on the monster",
      found: false
    },{
      name:"Fresh Air",
      row:10,
      col:14,
      message: "the fresh air outside have revatalised you"+"...."+"you can walk further in 1 turn",
      found:false
    },{
      name:"Death Hole",
      row:10,
      col:25,
      message: "it's a pitless hole"+"...."+"you have fell to your death. GAME OVER",
      found:false
    },{
      name:"Bowl",
      row:5,
      col:13,
      message: "you almost tripped "+"...."+"the noise of the bowl dropping woke the monster for a while...",
      found:false
    },{
      name:"Door",
      row:5,
      col:15,
      message: "the boss have appeared. Quickly attack!",
      found: false
    },{
      name:"Door",
      row:5,
      col:16,
      message: "the boss have appeared. Quickly attack!",
      found: false
    }
    ];

  var map = {
      cols: 26,
      rows: 17,
      tsize: 32,
      startTop: 32,
      startLeft: 200,
      layers: [[
          2, 2, 2, 2, 2, 2, 2, 3, 5,14,15, 4,13, 2, 2, 2, 2, 2, 2,13, 5, 3, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 2, 3, 4,14,15, 4,13, 2, 2, 2, 2, 2, 2,13, 4,12, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 2,12, 4,14,15, 4,13, 2, 2, 2, 2, 2, 2,13, 4, 3, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 2,12, 4,14,15, 5,13, 2, 2, 2, 2, 2, 2,13, 4, 3, 2, 2, 2, 2,
          2, 2, 2, 2, 2, 2, 2, 3, 4,14,15, 4,13, 2, 2, 2, 2, 2, 2,13, 4, 3, 2, 2, 2, 2,
          3, 3,12,12, 3, 3, 3, 3, 4,14,15, 4,13, 2, 2, 2, 2, 2, 2,13, 4, 3, 2, 2, 2, 2,
          4, 4, 5, 4, 4, 4, 4, 4, 5,14,15, 4,13,13,13,12,12,13,13,13, 4, 3,12, 3, 3, 3,
          5, 4, 4, 4, 4, 4, 4, 4, 4,14,15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4,
         10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
         11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
          4, 4, 4, 4, 4, 5, 4, 4, 4,14,15, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5,
          6, 7, 7, 7, 7, 7, 7, 8, 4,14,15, 4, 3, 3,12, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3,
          9, 9, 9, 9, 9, 9, 9, 9, 4,14,15, 4, 3, 2, 2, 2, 2, 2, 2, 3, 4,12, 2, 2, 2, 2,
          9, 9, 9, 9, 9, 9, 9, 9, 4,14,15, 4, 3, 2, 2, 2, 2, 2, 2, 3, 4, 3, 2, 2, 2, 2,
          9, 9, 9, 9, 9, 9, 9, 9, 4,14,15, 5, 3, 2, 2, 2, 2, 2, 2,12, 5, 3, 2, 2, 2, 2,
          9, 9, 9, 9, 9, 9, 9, 9, 4,14,15, 4,12, 2, 2, 2, 2, 2, 2, 3, 4, 3, 2, 2, 2, 2,
          9, 9, 9, 9, 9, 9, 9, 9, 4,14,15, 4, 3, 2, 2, 2, 2, 2, 2, 3, 4, 3, 2, 2, 2, 2,
      ], [
        0, 0, 0, 0, 8, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 3, 9, 0, 4,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
        0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 9, 9,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
      ]],
      getTile: function (layer, col, row) {
          return this.layers[layer][row * map.cols + col];
      },
      isSolidTileAtXY: function (x, y) {
          var col = Math.abs(Math.floor(x / this.tsize));
          var row = Math.abs(Math.floor(y / this.tsize));

          // tiles 3 and 13 are solid -- the rest are walkable
          // loop through all layers and return TRUE if any tile is solid
          return this.layers.reduce(function (res, layer, index) {
              var tile = this.getTile(0, col, row);
              var isSolid = tile === 3||tile === 13;
              return res || isSolid;
          }.bind(this), false);
      },
      getCol: function (x) {
          return Math.floor(x / this.tsize); //column where character is at
      },
      getRow: function (y) {
          return Math.floor(y / this.tsize); //row where character is at
      },
      getX: function (col) {
          return col * this.tsize + 200;  //character top and left when collide
      },
      getY: function (row) {
          return row * this.tsize + 32;

      }
  };

    // Interactions
    var interactions = {};
    interactions.up = false;              // Up arrow key pressed
    interactions.down = false;            // Down arrow key pressed
    interactions.left = false;            // Left arrow key pressed
    interactions.right = false;           // Right arrow ket pressed
    interactions.space = false;           // Space key pressed
    interactions.attack = false;
    interactions.enter = false;
    interactions.open = false;
    interactions.pause = false;
    interactions.menu = false;
    interactions.close = false;

    // Setup event listeners
    function setupEvents() {

      document.addEventListener('keyup', function(event){
        var keyName = event.key;

        switch(keyName) {
          case "ArrowRight":
              interactions.right = false;
              break;
          case "ArrowLeft":
              interactions.left = false;
              break;
          case "ArrowUp":
              interactions.up = false;
              break;
          case "ArrowDown":
              interactions.down = false;
              break;
          case " ":
              interactions.space = false;
              break;
          case "a":
              interactions.attack = false;              //pressing A to attack
              break;
          case "Enter":
              interactions.enter = false;
              break;
          case "c":
              interactions.close = false;              //close pop-up box
              break;
          default:
              break;
        }
      });

      document.addEventListener('keydown', function(event){
        var keyName = event.key;

        switch(keyName) {
          case "ArrowRight":
              interactions.right = true;
              break;
          case "ArrowLeft":
              interactions.left = true;
              break;
          case "ArrowUp":
              interactions.up = true;
              break;
          case "ArrowDown":
              interactions.down = true;
              break;
          case " ":
              interactions.space = true;
              break;
          case "a":
              interactions.attack = true;              //pressing A
              break;
          case "Enter":
              interactions.enter = true;
              break;
          case "c":
              interactions.close = true;
              break;
          default:
              break;
        }
      });
    }

    function drawMap(){
      for(var l = 0 ; l < 2; l++){            //for each layer
        for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(l, c, r);  //get the tile from map array

            if (tile !== 0) { // 0 => empty tile
              var drawingMap = document.createElement("div");

              drawingMap.className = "map";
              drawingMap.style.height = map.tsize + "px";
              drawingMap.style.width = map.tsize + "px";
              drawingMap.style.top = r * map.tsize +32+ "px";
              drawingMap.style.left = c * map.tsize +200+ "px";
              drawingMap.style.position = "absolute";
              drawingMap.style.display = "inline";
              if(l==0){
                drawingMap.style.background = "url('./assets/Mytiles.png') "+(-32*tile+64)+"px 0px";
              }else{
                drawingMap.style.background = "url('./assets/houseInterior.png') "+((tile-1)*-32)+"px 0px";
              }
              document.getElementById("container").appendChild(drawingMap);

            }
        }
    }
  }
};

function playerKillsBoss(){
  moveSqr.push(document.getElementsByClassName('showMove1')[0]);
  moveSqr.push(document.getElementsByClassName('showMove2')[0]);
  for (var i = 0; i < moveSqr.length; i++) {
    if(moveSqr[i]!=null){
      if(interactions.attack &&
        parseInt(bossDiv.style.top) >= parseInt(moveSqr[i].style.top) &&
        (parseInt(bossDiv.style.top)<=(parseInt(moveSqr[i].style.top) + parseInt(moveSqr[i].style.height) - parseInt(bossDiv.style.height)))
      && (parseInt(bossDiv.style.left) >= parseInt(moveSqr[i].style.left)) &&
        (parseInt(bossDiv.style.left)<=(parseInt(moveSqr[i].style.left) + parseInt(moveSqr[i].style.width) - parseInt(bossDiv.style.width))))
      {
          boss.killedByPlayer = true;
          bossDeathEffects();
      }
    }
  }
}

function bossDeathEffects(){
  bossDiv.className = "animated rotateDownLeft";
  if(boss.killedByPlayer){
    boss.died = true;
    winning();
  }
}

function bossDisappear(){
  parent.removeChild(bossDiv);
}


function createBoss(){
  bossDiv = document.createElement("div");
  bossDiv.style.height = "64px";
  bossDiv.style.width = "64px";
  bossDiv.style.background = boss.image;
  bossDiv.style.zIndex = "3";
  bossDiv.style.top = boss.row*32 + 32 + "px";
  bossDiv.style.left = boss.col*32 + 200 + "px";
  bossDiv.style.position = "absolute";
  bossDiv.style.display = "inline";
  bossDiv.id = "boss";
  document.getElementById("container").appendChild(bossDiv);
}

function specialCases(el){
  if(el.name=="Monster Detonator"){monsterDetonator = true; winning();}
  if(el.name=="Harry Potter"){ harryPotter = true;}
  if(el.name=="Cloak"){cloak = true;}
  if(el.name=="Death Hole"){
    promptScreenToggle("block","rgba(255, 0, 0,0.7)","You have found...","Bottomless Pit", +"you have tripped and fell to your DEATH"+"Thanks for playing! "+ "\n"+"press space to play again", );
    endGame = true;
  }
  if(el.name=="Laboratory Log"){boss.canBeFound = true;}
  if(el.name=="Door"&&boss.canBeKilled){
    el.found = true;
    boss.appeared = true;
    createBoss();
  }
  if(el.name=="Z-virus vaccine" && boss.canBeFound){
    el.found = true;
    boss.canBeKilled = true;
    promptScreenToggle("block","rgba(51, 51, 255,0.7)","You have found.....",el.name,el.message);
  }
  if(el.name=="Bowl"){
    createBoss();
    boss.tempAppear = true;
  }
}

var menuClose = false;
function getItems(){

    items.forEach(function(el,index,arr){
      playerArr.forEach(function(playerWhich,i,a){
          if(!el.found){
            var playerWhichTop = parseInt(playerWhich.style.top)+10;
            var playerWhichLeft = parseInt(playerWhich.style.left)+10;
            var itemTop = map.getY(el.row);
            var itemLeft = map.getX(el.col);

            if(playerWhichTop >= itemTop && playerWhichTop <=(itemTop+ 32) && playerWhichLeft>= itemLeft && playerWhichLeft <= (itemLeft+32)){
              menuClose = false;
              if(!(el.name=="Door"||el.name=="Z-virus vaccine")){
                  promptScreenToggle("block","rgba(51, 51, 255,0.7)","You have found.....",el.name,el.message,)
                  el.found = true;
              }
              specialCases(el);
              if(i==0){player1bag.push(el);}else{player2bag.push(el);}

              }

              if(interactions.close){
                menuClose = true;
              }
              if(menuClose){
                promptScreenToggle("none","none","none","none","none");
              }
          }
        });
  });
}

function promptScreenToggle(a,b,c,d,e){
  //a
  promptScreen.style.display = a;

  promptScreen.className="animated bounce";
  promptScreen.style.zIndex = "100";
  promptScreen.style.border = "5px solid rgba(255, 255,255,0.5)";
  promptScreen.style.borderRadius = "10px";
  //b
  promptScreen.style.backgroundColor = b;

  //c
  itemInfoTop.textContent= c;
  itemInfoTop.style.fontSize = "20px";
  itemInfoTop.style.margin = "10px";
  itemName.textContent = d;
  itemName.style.margin = "10px";
  itemName.style.position= "relative";
  itemInfoBottom.textContent = e;
  itemInfoBottom.style.fontSize = "20px";
  itemInfoBottom.style.margin = "10px";

}

var nightTrigger = true;
var dayTrigger = true;
function nightTime(){
      var drawBlackBox;
      if((turn.actualTurn==2||(turn.actualTurn-2)%5==0) && nightTrigger){
        for (var i = 0; i < 4; i++) {
          drawBlackBox = document.createElement('div');
          drawBlackBox.className = "blackBox";
          drawBlackBox.style.zIndex = "2";
          drawBlackBox.style.backgroundColor = "black";
          drawBlackBox.style.top = nightPosition[i].top + "px";
          drawBlackBox.style.left = nightPosition[i].left + "px";
          drawBlackBox.style.width = nightPosition[i].width + "px";
          drawBlackBox.style.height = nightPosition[i].height + "px";
          document.getElementById("container").appendChild(drawBlackBox);
        }
        nightTrigger = false;
        dayTrigger = true;
      }
    if((turn.actualTurn-3)%5==0 && dayTrigger){
      var parent = document.getElementById("container");
      var element;
      for (var i = 3; i >= 0; i--) {
        element = document.getElementsByClassName("blackBox")[i];
        parent.removeChild(element);
      }
      nightTrigger = true;
      dayTrigger = false;
    }
}

function updateOuterMessage(){
  var turnCountOutside = document.getElementById('turnCount');
  var designerMessage = document.getElementById('designerMessage');
  turnCountOutside.textContent = turn.actualTurn;
  switch(turn.actualTurn){
    case 1:
      turnCountOutside.style.color = "rgb(26, 117, 255)";
      turnCountOutside.style.fontSize = "30px";
      designerMessage.style.fontSize = "15px";
      designerMessage.textContent = "The zombies are spawning every few seconds! NASA have reported that a nuclear bomb will be dropped in the 20th turn. Quick! Find the boss monster and kill it to save the city. Explore the map, find items to defend yourself!";
      break;
    case 2:
      designerMessage.style.fontSize = "20px";
      designerMessage.textContent = "Heads up! When night comes, hide in house...And remember to find Weapons in order to ATTACK!";
      break;
    case 3:
      designerMessage.textContent = "Have you found your Weapon? Night coming in 5 turn. remember the brave are always rewarded!";
      break;
    case 5:
      turnCountOutside.style.color = "green";
      turnCountOutside.style.fontSize = "35px";
      designerMessage.textContent = "Night coming in 2 turns...Hint Hint, Night comes every 5 turns starting from turn 2";
      break;
    case 10:
      turnCountOutside.style.fontSize = "40px";
      designerMessage.textContent = "Hint Hint..there is a death trap hidden somewhere...";
      break;
    case 15:
      turnCountOutside.style.color = "rgb(255, 153, 51)";
      turnCountOutside.style.fontSize = "45px";
      designerMessage.textContent = "Are you doing fine? (whisper~) check the top right corner";
      break;
    case 18:
      designerMessage.textContent = "OH NO!!! The NUCLEAR BOMB is coming on the 20th turn";
      turnCountOutside.style.fontSize = "50px";
      break;
    default:
      break;
  }

}

function explosionEffects(){
  explosion.style.background = "url('./assets/explosion.png')";
  explosion.style.display = "inline";
  mainMusic.muted = true;
  explosionMusic.muted = false;
  setTimeout(function(){
    explosionMusic.muted = true;
  }, 1000);
}

function winning(){
  if(monsterDetonator){
    createBoss();
    explosionEffects();
    promptScreenToggle("block","rgb(0, 230, 230)","You have found.....","Monster Detonator","The Boss Monster have exploded and YOU WON!!!" +"\n"+"Thanks for playing! "+ "\n"+"press space to play again");
  }
  if(boss.died){
    promptScreenToggle("block","rgb(0, 230, 230)","You have.....", "killed Boss Monster!", "YOU WON!!!" +"\n"+"Thanks for playing! "+ "\n"+"press space to play again");
  }
  endGame = true;
}

function checkingHeroAndMonsterPosition(){
    players = document.getElementsByClassName('hero');
    monsters = document.getElementsByClassName('monster');

    monsterArr = [];
    playerArr = [];
    for(var j = 0; j< monsters.length; j++){
      monsterArr.push(monsters[j]);
      for (var i = 0; i < players.length; i++) {
        playerArr.push(players[i]);
        if(!(harryPotter&&cloak)){
          collideWithMonster(monsterArr[j].style.top,monsterArr[j].style.left,playerArr[i].style.top,playerArr[i].style.left,32);
      }
    }
  }
}

function collideWithMonster(a,b,c,d,range){
  var monsterTop = parseInt(a);
  var monsterLeft = parseInt(b);
  var playerTop = parseInt(c)+10;
  var playerLeft = parseInt(d)+10;

  if(playerTop >= monsterTop &&  playerTop <=( monsterTop + range) && playerLeft >= monsterLeft && playerLeft  <= (monsterLeft + range)){

    promptScreenToggle("block","rgba(255, 0, 0,0.7)","The zombies caught you!","YOU HAVE DIED", "Thanks for playing! "+ "\n"+"press space to play again");
    endGame = true;
  }
}


    function restart(){
      if(interactions.space){
          window.location.reload(true);
      }
    }

    //change turns for each player
    function changeOfTurns(){
        turn.turnNum++;
        switch(turn.turnNum%3){
          case 0:
            turn.playerOne = false;
            turn.playerTwo = false;
            turn.monsters = true;
            break;
          case 1:
            turn.playerOne = true;
            turn.playerTwo = false;
            turn.monsters = false;
            break;
          case 2:
            turn.playerOne = false;
            turn.playerTwo = true;
            turn.monsters = false;
            break;
          default:
            break;
        }
      }

    // Startup the game
    function init(){
      drawMap();
      setupEvents();
    }

    // The render function. It will be called 60/sec
    this.render = function(){

      if(!endGame){
        for(var i=0; i < assets.length; i++){
          //this calls the render function in player1.js, player2.js, Monster.js
          assets[i].render(interactions,turn,frame,map,playerBags);
        }

        //render monster movement, when it is their turn
        if(turn.turnNum%3==0){
          monsterOne.movement(map);
          setTimeout(changeOfTurns(),12000);
        }

        //change turn when player hits enter
        if(interactions.enter){
          changeOfTurns();
          interactions.enter = false;
          if(boss.tempAppear){bossDisappear(); boss.tempAppear = false;}
          if(harryPotter&&cloak){harryPotter = false; cloak = false;}
        }
        turn.actualTurn = Math.floor(turn.turnNum/3 + 1);
        updateOuterMessage();
        nightTime();
        checkingHeroAndMonsterPosition();
        getItems();
        if(boss.appeared||boss.tempAppear){
          for (var i = 0; i < playerArr.length; i++) {
          collideWithMonster(bossDiv.style.top,bossDiv.style.left,playerArr[i].style.top,playerArr[i].style.left,64);
          }
        }
        if(boss.canBeKilled&&(boss.appeared||boss.tempAppear)){playerKillsBoss();}
        if(turn.actualTurn==20){
          promptScreenToggle("block","rgba(255, 0, 0,0.7)","TIME OUT!!!","YOU HAVE DIED","Thanks for playing! "+ "\n"+"press space to play again");
          endGame = true;
        }
      }

      if(endGame){ restart();}

    }

    var self = this;
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
            })();


            (function animloop(){
                requestAnimFrame(animloop);
                self.render();
                frame++;

            })();

            init();
}

var g = new Game();
