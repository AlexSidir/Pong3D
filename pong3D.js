let flag = false;

const box = {
  width: 4,
  length:8,
  depth: 4
}

const racket = {
  width: box.width / 4,
  height: box.depth / 4,
  segments: 32
}

const sphereSize = {
  radius: 0.1,
  widthSegments: 16,
  heightSegments: 16
}

const WIDTH = window.innerWidth/2 - 50;
const HEIGHT = window.innerHeight/2;

const maxRacketPositionY = box.depth/2 - racket.height/2;
const maxRacketPositionX = box.width/2 - racket.width/2;
const racketPositionZ = box.length/2;

const maxVelocityLengthOfBox = 0.09;
const maxVelocity = 0.005;
const minVelocity = 0.001;

const maxInitialPosition = 1;
const minInitialPosition = -1;

const speedOfRacket = 0.3;

const cameraPosition = 6.5;

let vx = Math.random() * (maxVelocity - minVelocity) + minVelocity;
let vy = Math.random() * (maxVelocity - minVelocity) + minVelocity;
let vz = Math.random() * (maxVelocityLengthOfBox - minVelocity) + minVelocity;

let initialPositionX = Math.random() * (maxInitialPosition - minInitialPosition) + minInitialPosition;
let initialPositionY = Math.random() * (maxInitialPosition - minInitialPosition) + minInitialPosition;
let initialPositionZ = Math.random() * (maxInitialPosition - minInitialPosition ) + minInitialPosition;

let doublePlayerCanvas;
let renderer2;
let controls2;
let camera2;

let canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor('rgb(0,0,0)');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraPosition;

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);

//Outter Box
let geometry = new THREE.BoxBufferGeometry( box.width, box.depth , box.length);
let edges = new THREE.EdgesGeometry( geometry );
let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x11ee77 } ) );
scene.add( line );

//Sphere
let sphereGometry = new THREE.SphereGeometry( sphereSize.radius, sphereSize.widthSegments, sphereSize.heightSegments );
let sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
sphere = new THREE.Mesh( sphereGometry, sphereMaterial );
sphere.position.x = initialPositionX;
sphere.position.y = initialPositionY;
sphere.position.z = initialPositionZ;
scene.add( sphere );

//Racket Single Player
let planeGeometry = new THREE.PlaneBufferGeometry(racket.width, racket.height, racket.segments);
let planeEdges = new THREE.EdgesGeometry( planeGeometry );
let firstRacket = new THREE.LineSegments( planeEdges, new THREE.LineBasicMaterial({ color: 0xB22222 }));
firstRacket.position.z = box.length/2;
scene.add(firstRacket);

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
  //event.preventDefault();
  let keyCode = event.which;

  if (keyCode == 37) {
    if (firstRacket.position.x > - maxRacketPositionX) {
      firstRacket.position.x -= speedOfRacket;
    }
  } else if (keyCode == 39) {
    if (firstRacket.position.x < maxRacketPositionX) {
      firstRacket.position.x += speedOfRacket;
    }
  } else if (keyCode == 38) {
    if (firstRacket.position.y < maxRacketPositionY) {
      firstRacket.position.y += speedOfRacket;
    }
  } else if (keyCode == 40) {
    if (firstRacket.position.y > - maxRacketPositionY) {
      firstRacket.position.y -= speedOfRacket;
    }
  }
};

const controls = new THREE.TrackballControls( camera, canvas );
controls.rotateSpeed = 2;


function changeFlag() {
  flag = !flag;
  if (flag) {
    enableDoublePlayerMode();
  } else if (!flag) {
    enableSinglePlayerMode();
  }
}
function enableDoublePlayerMode() {

  doublePlayerCanvas = document.getElementById("doublePlayerCanvas");
  doublePlayerCanvas.style.display="";
  renderer2 = new THREE.WebGLRenderer({canvas:doublePlayerCanvas});
  renderer2.setSize(WIDTH, HEIGHT);
  renderer2.setClearColor('rgb(0,0,0)');

  camera2 = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera2.position.z = - cameraPosition;

  controls2 = new THREE.TrackballControls( camera2, doublePlayerCanvas );
  controls2.rotateSpeed = 2;

  let secondRacketGeometry = new THREE.PlaneBufferGeometry(racket.width, racket.height, racket.segments);
  let secondRacketEdges = new THREE.EdgesGeometry( secondRacketGeometry );
  secondRacket = new THREE.LineSegments( secondRacketEdges, new THREE.LineBasicMaterial({ color: 0x00FFFF }));
  secondRacket.position.z = - box.length/2;
  scene.add(secondRacket);

  document.addEventListener("keydown", onDocumentKeyDown, false);

  function onDocumentKeyDown(event) {
    //event.preventDefault();
    let keyCode = event.which;

    if (keyCode == 87) { //W
      if (secondRacket.position.y < maxRacketPositionY) {
        secondRacket.position.y += speedOfRacket;
      }
    } else if (keyCode == 89) {//Y
      if (secondRacket.position.y > - maxRacketPositionY) {
        secondRacket.position.y -= speedOfRacket;
      }
    } else if (keyCode == 65) {//A
      if (secondRacket.position.x < maxRacketPositionX) {
        secondRacket.position.x += speedOfRacket;
      }
    } else if (keyCode == 68) {//D
      if (secondRacket.position.x > - maxRacketPositionX) {
        secondRacket.position.x -= speedOfRacket;
      }
    }
  };
}

function enableSinglePlayerMode() {
  if(doublePlayerCanvas != null) {
    doublePlayerCanvas.style.display="none";
  }
  if(secondRacket != null) {
    scene.remove(secondRacket);
  }
}

// Render loop
function render() {
  requestAnimationFrame(render);

  if ( sphere.position.x > box.width/2 || sphere.position.x < -box.width/2 ) { vx = -vx; }
  if ( sphere.position.y > box.depth/2 || sphere.position.y < -box.depth/2 ) { vy = -vy; }


  if ( sphere.position.z > box.length/2 ) {
    if( firstRacket.position.x + racket.width/2 > sphere.position.x && firstRacket.position.x - racket.width/2 < sphere.position.x
      && firstRacket.position.y + racket.height/2 > sphere.position.y && firstRacket.position.y - racket.height/2 < sphere.position.y ) {
        vz = -vz;
      } else if (flag) {
        var r = confirm("Player 2 wins!");
        if (r == true) {
          location.reload();
        }
      } else {
        var r = confirm("Game Over!");
        if (r == true) {
          location.reload();
        }
      }
    }
    if ( sphere.position.z < -box.length/2 ) {
      if (flag) {
        if( secondRacket.position.x + racket.width/2 > sphere.position.x && secondRacket.position.x - racket.width/2 < sphere.position.x
          && secondRacket.position.y + racket.height/2 > sphere.position.y && secondRacket.position.y - racket.height/2 < sphere.position.y ) {
            vz = -vz;
          } else {
            var r = confirm("Player 1 wins!");
            if (r == true) {
              location.reload();
            }
          }
        } else {
          vz = -vz;
        }
      }

      sphere.position.y += vy;
      sphere.position.z += vz;
      sphere.position.x += vx;

      controls.update();
      renderer.render(scene, camera);
      if (flag) {
        controls2.update();
        renderer2.render(scene, camera2);
      }
    }

    render();
