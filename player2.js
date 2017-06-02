var Player2 = function(settings) {

    // Settings
    var playerElement = null;
    var moveSqrPosition = {};
    var previous;
    var zombiesKilled = 0;
    var increaseFromZombie = false;
    var moveSqr = settings.moveSqrInitial;
    var monsterInfo;
    var canAttack = false;
    var increaseSpeed = 0;
    var increased = false;
    var cannotMove = false;
    var Int = {};
    var coord = {};
    var turn;
    var map;


    //track the coordinate when each turn ends
    var CoordBeforeMove = {};
    function trackEndingCoord(){
        CoordBeforeMove.top = parseInt(playerElement.style.top);
        CoordBeforeMove.left = parseInt(playerElement.style.left);
    }

    function avoidMapWall(){
      var left = coord.x_left - map.startLeft + 1;
      var top = coord.y_top - map.startTop + 1;
      var right = coord.x_right - map.startLeft - 1;
      var bottom = coord.y_bottom - map.startTop - 1;
        var row, col;
        var northWest = map.isSolidTileAtXY(left, top);
        var northEast = map.isSolidTileAtXY(right, top);
        var southEast = map.isSolidTileAtXY(right, bottom);
        var southWest = map.isSolidTileAtXY(left, bottom);


        // check for collisions on sprite sides
        var collision = northWest || northEast || southEast || southWest; //is SolidTile returns TRUE when the neighbour tile is solid

        if (!collision) { return; }						//!TRUE ==FALSE, hence this means SOLID, continue with the following

        if (northWest && southWest){
          col = map.getCol(coord.x_left - map.startLeft);
          playerElement.style.left= map.getX(col)+ Int.Width+ "px";
        }

        if (northEast&&southEast){
          col = map.getCol(coord.x_left - map.startLeft);
          playerElement.style.left= map.getX(col)+ "px";
        }

        if (northEast&&northWest){
          row = map.getRow(coord.y_top - map.startTop);
          playerElement.style.top= map.getY(row)+ Int.Height+ "px";
        }

        if (southEast&&southWest){
          row = map.getRow(coord.y_top - map.startTop);
          playerElement.style.top= map.getY(row)+ "px";
        }

    }

    //Square that limits player movement each turn
    function MoveSqr(){
      var w = 1000;
      var h = 524;

      if(turn.turnNum==2){  //setting the moveSqr with initial coordinate

        if(coord.y_top < (h - moveSqr)){
          playerElement.style.top = (h - moveSqr) + 'px';
        }

        if(coord.x_left < (w - moveSqr) ){
          playerElement.style.left = (w - moveSqr) + 'px';
        }

      }else {
        if( coord.x_left > (CoordBeforeMove.left + moveSqr) ){
          playerElement.style.left = CoordBeforeMove.left + moveSqr + 'px';
        }

        if( coord.x_left < (CoordBeforeMove.left - moveSqr) ){
          playerElement.style.left = CoordBeforeMove.left - moveSqr + 'px';
        }

        if( coord.y_top < (CoordBeforeMove.top - moveSqr) ){
          playerElement.style.top = CoordBeforeMove.top - moveSqr + 'px';
        }

        if( coord.y_top > (CoordBeforeMove.top + moveSqr) ){
          playerElement.style.top = CoordBeforeMove.top + moveSqr+ 'px';
        }
      }


    }


    function wall() {

      //integer value of player2 position info
      Int.YTop = parseInt(playerElement.style.top);
      Int.XLeft = parseInt(playerElement.style.left);
      Int.Width = parseInt(playerElement.style.width);
      Int.Height = parseInt(playerElement.style.height);

      //coord of player's 4 corners
      coord.x_right = Int.XLeft  + Int.Width;
      coord.x_left = Int.XLeft;
      coord.y_top = Int.YTop;
      coord.y_bottom = Int.YTop + Int.Height;

      var w = parseInt(window.innerWidth);
      var h = parseInt(window.innerWidth);

      //prevent the player from moving out of map
      if(coord.y_bottom > 576){
        playerElement.style.top = (576-Int.Height) + 'px';
      }

      if(coord.y_top < 32){
        playerElement.style.top = '32px';
      }

      if(coord.x_right > 1032){
        playerElement.style.left = (1032-Int.Width) + 'px';
      }

      if(coord.x_left < 200){
        playerElement.style.left = '200px';
      }

    }

    // Move the character around manually
    function move(interactions){
      if(increaseSpeed!==0&&!increased){
        moveSqr+=increaseSpeed;
        increased = true;
        removeElement('showMove1');
        create(turn);
      }
      //creating the MoveSqr
      if(createTrigger){
        create(turn);
      }

      //trackEndingCoord and remove moveSqr when player1 turn ends
      if (interactions.enter){
          if(increaseSpeed!==0&&increased){
            moveSqr-=increaseSpeed; increaseSpeed=0; increased = false;
          }
          if(increaseFromZombie){moveSqr = moveSqr + zombiesKilled * 5;}
          trackEndingCoord();
          removeElement('showMove2');
          increaseFromZombie = false;
          cannotMove = false;
      }

      if(!cannotMove){
      if(interactions.up){
        playerElement.style.top = parseInt(playerElement.style.top)-settings.heroSpeed+"px";
      }

      if(interactions.down){
        playerElement.style.top = parseInt(playerElement.style.top)+settings.heroSpeed+"px";
      }

      if(interactions.left){
        playerElement.style.left = parseInt(playerElement.style.left)-settings.heroSpeed+"px";
      }

      if(interactions.right){
        playerElement.style.left = parseInt(playerElement.style.left)+settings.heroSpeed+"px";
      }

      if(settings.walls){
        wall(turn, map, interactions);
      }

      if(interactions.attack&&canAttack){
        attack(interactions);
      }
    }
  }

    function checkItemEffect(playerBags){
      playerBags[1].forEach(function(el,i,a){
        switch(el.name){
          case "Machine Gun":
            canAttack = true;
            break;
          case "Flying Axe":
            canAttack = true;
            break;
          case "Herbal Soup":
            increaseSpeed = 30;
            a.splice(i,1);
            break;
          case "Fresh Air":
            increaseSpeed = 20;
            a.splice(i,1);
            break;
          case "Hole":
            cannotMove = true;
            a.splice(i,1);
            break;
          case "Spider":
            cannotMove = true;
            a.splice(i,1);
            break;
        }
      })
    }

    function attack(interactions){
      var monsterInfo = document.getElementsByClassName("monster");
      var inside = [];
      var monsterArr = [];
      for (var i = 0; i < monsterInfo.length; i++) {
        monsterArr.push(monsterInfo[i]);
          if((parseInt(monsterArr[i].style.top) >= moveSqrPosition.top) && (parseInt(monsterArr[i].style.top)<=(moveSqrPosition.top + moveSqrPosition.height - parseInt(monsterArr[i].style.height)))){
              //in y-direction, monster is inside moveSqr
              inside.push(true)
          }
          if((parseInt(monsterArr[i].style.left) >= moveSqrPosition.left) && (parseInt(monsterArr[i].style.left)<=(moveSqrPosition.left + moveSqrPosition.width - parseInt(monsterArr[i].style.width)))){
            //in x-direction, monster is inside moveSqr
            inside.push(true);
          }
          if(inside[0] && inside[1] && interactions.attack){
            removeElement(monsterArr[i].className, i);
            zombiesKilled++;
            increaseFromZombie = true;
          }
          inside = [];
      }
    }

    function removeElement(name,index){
        if (name=="showMove2"){index=0;}
        var element = document.getElementsByClassName(name)[index];
        var parent = document.getElementById("container");
        parent.removeChild(element);
        if (name=="showMove2"){createTrigger = true;}
    }

    var createTrigger = true;
    function create(turn) {

          if(CoordBeforeMove.top!=null){
             previous = CoordBeforeMove;
          }else {
            previous = {
              top: parseInt(playerElement.style.top),
              left: parseInt(playerElement.style.left)
            }
          }

          moveSqrPosition.height = moveSqr * 2 + parseInt(playerElement.style.height);
          moveSqrPosition.width = moveSqr * 2 + parseInt(playerElement.style.width);
          moveSqrPosition.top = previous.top - moveSqr;
          moveSqrPosition.left = previous.left - moveSqr;

          var showMove = document.createElement("div");

          showMove.className = "showMove2";
          showMove.style.backgroundColor = "rgba(200,200,255,0.3)";
          showMove.style.height = moveSqrPosition.height + "px";
          showMove.style.width = moveSqrPosition.width + "px";
          showMove.style.top = moveSqrPosition.top + "px";
          showMove.style.left = moveSqrPosition.left + "px";
          document.getElementById("container").appendChild(showMove);
          createTrigger = false;
    }

    function init(){
      playerElement = document.getElementById('hero2');

      playerElement.style.background = "url('./assets/boyFinal.png') 0px 0px";
      playerElement.style.height= "32px";
      playerElement.style.width= "32px";
      playerElement.style.top= "524px";
      playerElement.style.left= "1000px";

    }


    this.render = function(interactions,turnFromGame,frame,mapFromGame,playerBags){
      if(turnFromGame.playerTwo){
        map = mapFromGame;
        turn = turnFromGame;
        checkItemEffect(playerBags);
        move(interactions);
        if(moveSqr>100){
          moveSqr = 100;
        }
        if(settings.walls){
          wall();
        }
        if(settings.moveSqr){
          MoveSqr();
        }
        if(settings.mapWalls){
         avoidMapWall();
        }
        if(interactions.attack&&canAttack){
          attack(interactions);
        }

      }
    }

    init();
}
