AFRAME.registerComponent("bowling-balls", {
    init: function () {
      this.throwBall();
    },
    throwBall: function () {
      window.addEventListener("keydown", (e) => {
        if (e.key === "z") {
          var  ball = document.createElement("a-entity");
  
          ball.setAttribute("gltf-model", "./models/bowling_ball/scene.gltf");
  
          ball.setAttribute("scale", { x: 3, y: 3,  z: 3});
  
          var cam = document.querySelector("#camera");
          pos = cam.getAttribute("position");
          ball.setAttribute("position", {
            x: pos.x,
            y: pos.y-1.2,
            z: pos.z,
          });
          var camera = document.querySelector("#camera").object3D;
  
          //get the camera direction as Three.js Vector
          var direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
  
          //set the velocity and it's direction
          ball.setAttribute("velocity", direction.multiplyScalar(-10));
          ball.setAttribute("dynamic-body",{mass:0})
          ball.addEventListener("collide",this.force)
          var scene = document.querySelector("#scene");
  
          scene.appendChild(ball);
        }
      });
    },
    force:function(e){
      //e.detail.target.el = original object(bullet)
      //e.detail.body.el = objwct which is hit(box)
      if(e.detail.body.el.id.includes("box")){
          // amount of force
          var impulse = new CANNON.Vec3(-2,1,1)
          //point of force to be applied
          var pos = new CANNON.Vec3().copy(e.detail.body.el.getAttribute("position"))
          e.detail.body.el.body.applyImpulse(impulse,pos)
          e.detail.target.el.removeEventListener("collide",this.fire)
          var scene=document.querySelector("#scene")
          scene.removeChild( e.detail.target.el)
      }
  },
  removeBall:function(e){
    var element = e.detail.target.el
    var elementHit = e.detail.body.el

    if(element.id.includes("pin")){
      var impulse = new CANNON.Vec3(0,1,-15)
      var worldPoint = new CANNON.Vec3().copy(
        elementHit.getAttribute("position")
      )
      elementHit.body.applyForce(impulse,worldPoint)
      element.removeEventListener("collide",this.removeBall)
      var scene = document.querySelector("#scene")
      scene.removeChild(element)
    }
  }
  });
  