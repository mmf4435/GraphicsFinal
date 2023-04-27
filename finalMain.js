  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // GLSL programs
  let balloonAnimalProgram;

  // VAOs for the objects
  var backleft = null;
  var backright = null;
  var frontleft = null;
  var frontright = null;
  var torso = null;
  var neck = null;
  var tailbig = null;
  var tailsmall = null;
  var leftear = null;
  var rightear = null;
  var snout = null;
  var nose = null;

  // textures

  // rotation
 
//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes(shapes) {
    for(let i = 0; i < shapes.length; i++){
        shapes[i] = new sphere(20, 20);
        shapes[i].VAO = bindVAO(shapes[i], balloonAnimalProgram);
    }
    //backleft = new sphere(20, 20);
    //backleft.VAO = bindVAO(backleft, balloonAnimalProgram);

    //backright = new sphere(20, 20);
    //backright.VAO = bindVAO(backright, balloonAnimalProgram);

    //frontleft = new sphere(20, 20);
    //frontleft.VAO = bindVAO(frontleft, balloonAnimalProgram);

    //frontright = new sphere(20, 20);
    //frontright.VAO = bindVAO(frontright, balloonAnimalProgram);

    //torso = new sphere(20, 20);
    //torso.VAO = bindVAO(torso, balloonAnimalProgram);

    //neck = new sphere(20, 20);
    //neck.VAO = bindVAO(neck, balloonAnimalProgram);

    //tailbig = new sphere(20, 20);
    //tailbig.VAO = bindVAO(tailbig, balloonAnimalProgram);

    //tailsmall = new sphere(20, 20);
    //tailsmall.VAO = bindVAO(tailsmall, balloonAnimalProgram);

    //leftear = new sphere(20, 20);
    //leftear.VAO = bindVAO(leftear, balloonAnimalProgram);

    //rightear = new sphere(20, 20);
    //rightear.VAO = bindVAO(rightear, balloonAnimalProgram);

    //snout = new sphere(20, 20);
    //snout.VAO = bindVAO(snout, balloonAnimalProgram);

    //nose = new sphere(20, 20);
    //nose.VAO = bindVAO(nose, balloonAnimalProgram);
}


//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    
    gl.useProgram (balloonAnimalProgram);
    
    // set up your projection
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projMatrix, 1.4, 1, 4, null);
    gl.uniformMatrix4fv (balloonAnimalProgram.uProjT, false, projMatrix);

    // set up your view
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0, 2, -6], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (balloonAnimalProgram.uViewT, false, viewMatrix);
}


//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures(){
    
    // flip Y for WebGL
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // get some texture space from the gpu
    
    // load the actual image
    var worldImage = document.getElementById ('')
    worldImage.crossOrigin = "";
        
    // bind the texture so we can perform operations on it
        
    // load the texture data
        
    // set texturing parameters
}

//
//  This function draws all of the shapes required for your scene
//
    function drawShapes(shapes) {
        var translations = [[-4, -2, 1],[-4, -2, -1],[4, -2, 1],[4, -2, -1],
                            [0,0,0],[3, 2, 0],
                            [-3, 2, 0],[-4, 4, 0],
                            [3, 4, 1],[3, 4, -1],
                            [5, 3, 0],[7, 3.5, 0]];

        for(let i = 0; i < shapes.length; i++){
            // create model matrix
            let modelMatrix = glMatrix.mat4.create();

            // create scale vector
            let scaleVec = glMatrix.vec3.create();
            if(i == 7){
                glMatrix.vec3.set(scaleVec, -2, -3, -3);
            }
            else if(i == 11){
                glMatrix.vec3.set(scaleVec, -5, -3, -3);
            }
            else{
                glMatrix.vec3.set(scaleVec, 3, 1, 1);
            }

            // create translation vector
            let translationVec = glMatrix.vec3.create();
            glMatrix.vec3.set(translationVec, translations[i][0], translations[i][1], translations[i][2]);

            // apply transformations to model matrix
            glMatrix.mat4.translate(modelMatrix, modelMatrix, translationVec);
            glMatrix.mat4.scale(modelMatrix, modelMatrix, scaleVec);

            // send model matrix to shader and draw
            gl.UniformMatrix4fv(balloonAnimalProgram.uModelT, false, modelMatrix);
            gl.bindVertexArray(shapes[i].VAO);
            gl.drawElements(gl.TRIANGLES, shapes[i].indices.length, gl.UNSIGNED_SHORT, 0);
        }
    }


  //
  // Use this function to create all the programs that you need
  // You can make use of the auxillary function initProgram
  // which takes the name of a vertex shader and fragment shader
  //
  // Note that after successfully obtaining a program using the initProgram
  // function, you will beed to assign locations of attribute and unifirm variable
  // based on the in variables to the shaders.   This will vary from program
  // to program.
  //
  function initPrograms() {
      balloonAnimalProgram = initProgram('wireframe-V', 'wireframe-F');



  }


  // creates a VAO and returns its ID
  function bindVAO (shape, balloonAnimalProgram) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(balloonAnimalProgram.aVertexPosition);
      gl.vertexAttribPointer(balloonAnimalProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      
      // add code for any additional vertex attribute
      let myNormalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(balloonAnimalProgram.aNormal);
      gl.vertexAttribPointer(balloonAnimalProgram.aNormal, 3, gl.FLOAT, false, 0, 0);
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
  }


/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);

    // Create a program
    let balloonAnimalProgram = gl.createProgram();
      
    // Attach the shaders to this program
    gl.attachShader(balloonAnimalProgram, vertexShader);
    gl.attachShader(balloonAnimalProgram, fragmentShader);
    gl.linkProgram(balloonAnimalProgram);

    if (!gl.getProgramParameter(balloonAnimalProgram, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }

    gl.useProgram(balloonAnimalProgram);

    balloonAnimalProgram.uProjT = gl.getUniformLocation(balloonAnimalProgram, 'projT');
    balloonAnimalProgram.uViewT = gl.getUniformLocation(balloonAnimalProgram, 'viewT');
    balloonAnimalProgram.uModelT = gl.getUniformLocation(balloonAnimalProgram, 'modelT');
    balloonAnimalProgram.aVertexPosition = gl.getAttribLocation(balloonAnimalProgram, 'aVertexPosition');
    balloonAnimalProgram.aNormal = gl.getAttribLocation(balloonAnimalProgram, 'aNormal');

    return balloonAnimalProgram;
  }


  //
  // We call draw to render to our canvas
  //
  function draw(shapes) {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes(shapes);

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    balloonAnimalprogram = initProgram('wireframe-V', 'wireframe-F');

    var shapes = [backleft, backright, frontleft, frontright, torso, neck, tailbig, tailsmall, leftear, righear, snout, nose];
    
    // create and bind your current object
    createShapes(shapes);
    
    // do a draw
    draw(shapes);
  }
