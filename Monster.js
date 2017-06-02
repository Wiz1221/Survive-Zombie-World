var Monster = function (settings){

      // Settings

      function avoidMapWall(Int, coord, map, e){
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
            e.style.left= map.getX(col)+ Int.Width+ "px";
          }

          if (northEast&&southEast){
            col = map.getCol(coord.x_left - map.startLeft);
            e.style.left= map.getX(col)+ "px";
          }

          if (northEast&&northWest){
            row = map.getRow(coord.y_top - map.startTop);
            e.style.top= map.getY(row)+ Int.Height+ "px";
          }

          if (southEast&&southWest){
            row = map.getRow(coord.y_top - map.startTop);
            e.style.top= map.getY(row)+ "px";
          }
      }

      function wall(map) {

        monsterArr.forEach(function(e,i,a){
          var Int = {};
          Int.YTop = parseInt(e.style.top);
          Int.XLeft = parseInt(e.style.left);
          Int.Width = parseInt(e.style.width);
          Int.Height = parseInt(e.style.height);

          var coord = {}

          coord.x_right = Int.XLeft  + Int.Width;
          coord.x_left = Int.XLeft;
          coord.y_top = Int.YTop;
          coord.y_bottom = Int.YTop + Int.Height;

            if(coord.y_bottom > 544){
              e.style.top = (544-Int.Height) + 'px';
            }

            if(coord.y_top < 32){
              e.style.top = '32px';
            }

            if(coord.x_right > 1032){
              e.style.left = (1032-Int.Width) + 'px';
            }

            if(coord.x_left < 200){
              e.style.left = '200px';
            }

            if(settings.mapWalls){
             avoidMapWall(Int, coord, map, e);
            }
        });
      }

      // var movedFinished = false;
      var moveTrigger = [];
      var monsterArr = [];

      // Move zombies randomly
      this.movement = function(map){

        for (var i = 0; i < monsterArr.length; i++) {
          moveTrigger[i]=true;

          if(moveTrigger[i]){
            var direction = Math.round(Math.random()*7);
            switch (direction){
              case 0:
                //go north
                monsterArr[i].style.top = parseInt(monsterArr[i].style.top)- settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              case 1:
                //go north-east
                monsterArr[i].style.top = parseInt(monsterArr[i].style.top) - settings.monsterOneSpeed+"px";
                monsterArr[i].style.left = parseInt(monsterArr[i].style.left) + settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              case 2:
                //go east
                monsterArr[i].style.left = parseInt(monsterArr[i].style.left) + settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              case 3:
                //go south-east
                monsterArr[i].style.top = parseInt(monsterArr[i].style.top) + settings.monsterOneSpeed+"px";
                monsterArr[i].style.left = parseInt(monsterArr[i].style.left) + settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              case 4:
                //go south
                monsterArr[i].style.top = parseInt(monsterArr[i].style.top) + settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              case 5:
                //go south-west
                monsterArr[i].style.top = parseInt(monsterArr[i].style.top) + settings.monsterOneSpeed+"px";
                monsterArr[i].style.left = parseInt(monsterArr[i].style.left) - settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              case 6:
                //go west
                monsterArr[i].style.left = parseInt(monsterArr[i].style.left) - settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              case 7:
                //go north-west
                monsterArr[i].style.top = parseInt(monsterArr[i].style.top) - settings.monsterOneSpeed+"px";
                monsterArr[i].style.left = parseInt(monsterArr[i].style.left) - settings.monsterOneSpeed+"px";
                moveTrigger[i] = false;
                break;
              default:
                moveTrigger[i] = false;
                break;
              }
              // movedFinished = true;
          }

        if(settings.walls){
          wall(map);
        }
        }
      }

      function spawnMonster(){
        var newMonster = document.createElement("div");

        newMonster.className = "monster";
        newMonster.style.top =  Math.floor(Math.random()* 480 + 32) + "px";
        newMonster.style.left =  Math.floor(Math.random()* 800 + 200) + "px";
        newMonster.style.height =  32 + "px";
        newMonster.style.width =  32 + "px";
        newMonster.style.position = "absolute";
        newMonster.style.display = "inline";
        monsterArr.push(newMonster);
        document.getElementById("container").appendChild(newMonster);
      }

      function create(frame) {

          if((frame % (settings.monsterSpawnRate*60))==0){
            spawnMonster();
          }
      }

      this.render = function(interactions,turn,frame){
          create(frame);
      }

}
