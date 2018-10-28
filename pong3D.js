let flag;

//The cookie is used to store the users preference, on if
//the game is in single player or double player mode
//However, this does NOT work on Chrome, but it works of Firefox
let cookie = document.cookie;
let boolean = cookie.replace("doublePlayerMode=","");
if (boolean === "true") {
  document.getElementById("toggle").checked = true;
  flag = true;
} else if (boolean === "false") {
  document.getElementById("toggle").checked = false;
  flag = false;
} else {
  flag = false;
}

const box = {
  width: 4,
  length:8,
  depth: 4
};

const racket = {
  width: box.width / 4,
  height: box.depth / 4,
  segments: 32,
  speed: 0.3
};

const sphere = {
  radius: 0.1,
  widthSegments: 16,
  heightSegments: 16,
  maxVelocityLengthOfBox: 0.05,
  minVelocityLengthOfBox: 0.01,
  maxVelocity: 0.02,
  minVelocity: 0.001,
  maxInitialPosition: 1,
  minInitialPosition: -1
};

const keyCodes = {
  A: 65,
  W: 87,
  Y: 89,
  D: 68,
  left: 37,
  right: 39,
  up: 38,
  down: 40
};

const width = window.innerWidth/2 - 50;
const height = window.innerHeight/2;

const maxRacketPositionY = box.depth/2 - racket.height/2;
const maxRacketPositionX = box.width/2 - racket.width/2;
const racketPositionZ = box.length/2;

const cameraPosition = 6.5;
const cameraRotateSpeed = 2;

let velocityX = Math.random() * (sphere.maxVelocity - sphere.minVelocity) + sphere.minVelocity;
let velocityY = Math.random() * (sphere.maxVelocity - sphere.minVelocity) + sphere.minVelocity;
let velocityZ = Math.random() * (sphere.maxVelocityLengthOfBox - sphere.minVelocityLengthOfBox) + sphere.minVelocityLengthOfBox;

let initialPositionX = Math.random() * (sphere.maxInitialPosition - sphere.minInitialPosition) + sphere.minInitialPosition;
let initialPositionY = Math.random() * (sphere.maxInitialPosition - sphere.minInitialPosition) + sphere.minInitialPosition;
let initialPositionZ = Math.random() * (sphere.maxInitialPosition - sphere.minInitialPosition) + sphere.minInitialPosition;

let doublePlayerCanvas;
let renderer2;
let controls2;
let camera2;

let canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(width, height);
renderer.setClearColor('rgb(0,0,0)');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraPosition;

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);

let geometry = new THREE.BoxBufferGeometry( box.width, box.depth , box.length);
let edges = new THREE.EdgesGeometry( geometry );
let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x11ee77 } ) );
scene.add( line );

let sphereGometry = new THREE.SphereGeometry( sphere.radius, sphere.widthSegments, sphere.heightSegments );
let sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
ball = new THREE.Mesh( sphereGometry, sphereMaterial );
ball.position.x = initialPositionX;
ball.position.y = initialPositionY;
ball.position.z = initialPositionZ;
scene.add( ball );

let planeGeometry = new THREE.PlaneBufferGeometry(racket.width, racket.height, racket.segments);
let planeEdges = new THREE.EdgesGeometry( planeGeometry );
let firstRacket = new THREE.LineSegments( planeEdges, new THREE.LineBasicMaterial({ color: 0xB22222 }));
firstRacket.position.z = box.length/2;
scene.add( firstRacket );

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
  let keyCode = event.which;

  if (keyCode == keyCodes.left) {
    if (firstRacket.position.x > - maxRacketPositionX) {
      firstRacket.position.x -= racket.speed;
    }
  } else if (keyCode == keyCodes.right) {
    if (firstRacket.position.x < maxRacketPositionX) {
      firstRacket.position.x += racket.speed;
    }
  } else if (keyCode == keyCodes.up) {
    if (firstRacket.position.y < maxRacketPositionY) {
      firstRacket.position.y += racket.speed;
    }
  } else if (keyCode == keyCodes.down) {
    if (firstRacket.position.y > - maxRacketPositionY) {
      firstRacket.position.y -= racket.speed;
    }
  }
}

const controls = new THREE.TrackballControls( camera, canvas );
controls.rotateSpeed = cameraRotateSpeed;

function changeFlag() {
  flag = !flag;
  if (flag) {
    enableDoublePlayerMode();
  } else if (!flag) {
    enableSinglePlayerMode();
  }
}

function enableDoublePlayerMode() {
  document.cookie = "doublePlayerMode=true";

  doublePlayerCanvas = document.getElementById("doublePlayerCanvas");
  doublePlayerCanvas.style.display="";
  renderer2 = new THREE.WebGLRenderer({canvas:doublePlayerCanvas});
  renderer2.setSize(width, height);
  renderer2.setClearColor('rgb(0,0,0)');

  camera2 = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera2.position.z = - cameraPosition;

  controls2 = new THREE.TrackballControls( camera2, doublePlayerCanvas );
  controls2.rotateSpeed = cameraRotateSpeed;

  let secondRacketGeometry = new THREE.PlaneBufferGeometry(racket.width, racket.height, racket.segments);
  let secondRacketEdges = new THREE.EdgesGeometry( secondRacketGeometry );
  secondRacket = new THREE.LineSegments( secondRacketEdges, new THREE.LineBasicMaterial({ color: 0x00FFFF }));
  secondRacket.position.z = - box.length/2;
  scene.add(secondRacket);

  document.addEventListener("keydown", onDocumentKeyDown, false);

  function onDocumentKeyDown(event) {

    let keyCode = event.which;

    if (keyCode == keyCodes.W) {
      if (secondRacket.position.y < maxRacketPositionY) {
        secondRacket.position.y += racket.speed;
      }
    } else if (keyCode == keyCodes.Y) {
      if (secondRacket.position.y > - maxRacketPositionY) {
        secondRacket.position.y -= racket.speed;
      }
    } else if (keyCode == keyCodes.A) {
      if (secondRacket.position.x < maxRacketPositionX) {
        secondRacket.position.x += racket.speed;
      }
    } else if (keyCode == keyCodes.D) {
      if (secondRacket.position.x > - maxRacketPositionX) {
        secondRacket.position.x -= racket.speed;
      }
    }
  }
}

function enableSinglePlayerMode() {
  document.cookie = "doublePlayerMode=false";

  if(doublePlayerCanvas != null) {
    doublePlayerCanvas.style.display="none";
  }
  if(secondRacket != null) {
    scene.remove(secondRacket);
  }
}

if (flag === true) {
  enableDoublePlayerMode();
}

function render() {
  requestAnimationFrame(render);

  if ( ball.position.x > box.width/2 || ball.position.x < -box.width/2 ) { velocityX = -velocityX; }
  if ( ball.position.y > box.depth/2 || ball.position.y < -box.depth/2 ) { velocityY = -velocityY; }

  if ( ball.position.z > box.length/2 ) {
    if( firstRacket.position.x + racket.width/2 > ball.position.x && firstRacket.position.x - racket.width/2 < ball.position.x && firstRacket.position.y + racket.height/2 > ball.position.y && firstRacket.position.y - racket.height/2 < ball.position.y ) {
      velocityZ = -velocityZ;
    } else if (flag) {
      let r = confirm("Player 2 wins!");
      if (r == true) {
        location.reload();
      }
    } else {
      let r = confirm("Game Over!");
      if (r == true) {
        location.reload();
      }
    }
  }
  if ( ball.position.z < -box.length/2 ) {
    if (flag) {
      if( secondRacket.position.x + racket.width/2 > ball.position.x && secondRacket.position.x - racket.width/2 < ball.position.x && secondRacket.position.y + racket.height/2 > ball.position.y && secondRacket.position.y - racket.height/2 < ball.position.y ) {
        velocityZ = -velocityZ;
      } else {
        let r = confirm("Player 1 wins!");
        if (r == true) {
          location.reload();
        }
      }
    } else {
      velocityZ = -velocityZ;
    }
  }

  ball.position.y += velocityY;
  ball.position.z += velocityZ;
  ball.position.x += velocityX;

  controls.update();
  renderer.render(scene, camera);
  if (flag) {
    controls2.update();
    renderer2.render(scene, camera2);
  }
}

render();
