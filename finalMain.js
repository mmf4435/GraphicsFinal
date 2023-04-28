  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // GLSL programs
  let balloonAnimalProgram;
  let backgroundProgram;

  // VAOs for the objects
  var shapes = [null, null, null, null, null, null, null, null, null, null, null];
  var joints = [[null,null,null,null], [null,null,null,null], [null,null,null,null]];
  var endPoints = [null, null, null, null, null, null, null, null];
  var nose = null;
  var floor = null;
  var backWall = null;
  
  // textures
  var floorTex = null;

  // rotation
 
//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
    for(let i = 0; i < shapes.length; i++){
        shapes[i] = new Cylinder(20, 20);
        shapes[i].VAO = bindVAO(shapes[i], balloonAnimalProgram);
    }

    for(let i = 0; i < joints.length; i++){
        for(let j = 0; j < 4; j++){
            joints[i][j] = new Sphere(20, 20);
            joints[i][j].VAO = bindVAO(joints[i][j], balloonAnimalProgram);
        }
    }

    for(let i = 0; i < endPoints.length; i++){
        endPoints[i] = new Sphere(20, 20);
        endPoints[i].VAO = bindVAO(endPoints[i], balloonAnimalProgram);
    }

    nose = new Cone(20, 20);
    nose.VAO = bindVAO(nose, balloonAnimalProgram);

    floor = new Cube(20, 20);
    floor.VAO = bindVAO(floor, balloonAnimalProgram);

    backWall = new Cube(20, 20);
    backWall.VAO = bindVAO(backWall, balloonAnimalProgram);
}


//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    
    gl.useProgram (program);
    
    // set up your projection
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projMatrix, 1, 1, 1, null);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);

    // set up your view
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [-13, -1, -14], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
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
    floorTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, floorTex);

    // load the actual image
    var worldImage = document.getElementById ('floor-texture')
    worldImage.crossOrigin = "";
        
    // bind the texture so we can perform operations on it
    gl.bindTexture (gl.TEXTURE_2D, floorTex);

    // load the texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, worldImage.width, worldImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, worldImage);

    // set texturing parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

function setUpPhong(program){
    gl.useProgram(program);

    gl.uniform3fv(program.ambientLight, [0.1, 0.1, 0.1]);

    gl.uniform3fv(program.lightPosition, [-2, 5, -5]);
    
    gl.uniform3fv(program.secondLightPosition, [-5, 10, 0]);

    gl.uniform3fv(program.lightColor, [1, 1, 1]);

    gl.uniform3fv(program.baseColor, [0.1, 0.25, 0.6]);

    gl.uniform3fv(program.specHighlightColor, [1, 1, 1]);

    gl.uniform1f(program.ka, 4.5);

    gl.uniform1f(program.kd, 1);

    gl.uniform1f(program.ks, 1);

    gl.uniform1f(program.ke, 5);
}

//
//  This function draws all of the shapes required for your scene
//
    function drawShapes() {
        gl.useProgram(balloonAnimalProgram);

        var shapeTranslations = [[3.73, -2.27, 0.75],[3.73, -2.27, -0.75],[-3.73, -2.27, 0.75],[-3.73, -2.27, -0.75], //backleft, backright, frontleft, frontright
                            [0,0,0],[-2.95, 1.76, 0], //torso, neck
                            [2.95, 1.76, 0],[4.3, 4.3, 0], //tailbig, tailsmall
                            [-3.17, 5.25, 0.75],[-3.17, 5.25, -0.75], //leftear, rightear
                            [-5.5, 3.6, 0]]; //snout
        var shapeScales = [[2,3,3],[2,3,3],[2,3,3],[2,3,3], //backleft, backright, frontleft, frontright
                      [2.5, 3, 2],[2, 2, 2], //torso, neck
                      [2, 2, 2],[0.5, 2, 0.5], //tailbig, tailsmall
                      [2, 2, 3],[2, 2, 3], //leftear, rightear
                      [2, 2, 2]]; //snout
        var shapeRotations = [radians(30),radians(30),radians(-30),radians(-30), //backleft, backright, frontleft, frontright
            radians(90),radians(30), //torso, neck
            radians(-30), radians(-30), //tailbig, tailsmall
            radians(-5), radians(-5), //leftear, rightear
            radians(85)]; //snout

        for(let i = 0; i < shapes.length; i++){
            // create model matrix
            let modelMatrix = glMatrix.mat4.create();

            // create scale vector
            let scaleVec = glMatrix.vec3.create();
            glMatrix.vec3.set(scaleVec, shapeScales[i][0], shapeScales[i][1], shapeScales[i][2]);

            // create translation vector
            let translationVec = glMatrix.vec3.create();
            glMatrix.vec3.set(translationVec, shapeTranslations[i][0], shapeTranslations[i][1], shapeTranslations[i][2]);

            // apply transformations to model matrix
            glMatrix.mat4.translate(modelMatrix, modelMatrix, translationVec);
            glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, shapeRotations[i]);
            glMatrix.mat4.scale(modelMatrix, modelMatrix, scaleVec);

            // send model matrix to shader and draw
            gl.uniform1i(balloonAnimalProgram.isTextured, 0);
            gl.uniformMatrix4fv(balloonAnimalProgram.uModelT, false, modelMatrix);
            gl.bindVertexArray(shapes[i].VAO);
            gl.drawElements(gl.TRIANGLES, shapes[i].indices.length, gl.UNSIGNED_SHORT, 0);
        }

        var jointTranslations = [ [[3,-1,0.75],[3,-1,-0.75],[1.5,0,0],[2.35,0.75,0]] , // back
            [[-3,-1,0.75],[-3,-1,-0.75],[-1.5,0,0],[-2.35,0.75,0]] , // front
            [[-3.25,4.25,0.75],[-3.25,4.25,-0.75],[-3.52,2.75,0],[-4.5,3.5,0]] ]; // neck
        var jointScales = [ [[2,2,3],[2,2,3],[2,2.5,2],[2,2,2]] , // back
            [[2,2,3],[2,2,3],[2,2.5,2],[2,2,2]] , // front
            [[2,3,3],[2,3,3],[2,2,2],[2,2,2]] ]; // neck

        // draw joints
        for(let i = 0; i < joints.length; i++){
            // draw each component of the joint
            for(let j = 0; j < joints[i].length; j++ ){
                let modelMatrix = glMatrix.mat4.create();

                let scaleVec = glMatrix.vec3.create();
                glMatrix.vec3.set(scaleVec, jointScales[i][j][0], jointScales[i][j][1], jointScales[i][j][2]);

                let translationVec = glMatrix.vec3.create();
                glMatrix.vec3.set(translationVec, jointTranslations[i][j][0], jointTranslations[i][j][1], jointTranslations[i][j][2]);

                glMatrix.mat4.translate(modelMatrix, modelMatrix, translationVec);
                glMatrix.mat4.scale(modelMatrix, modelMatrix, scaleVec);

                gl.uniform1i(balloonAnimalProgram.isTextured, 0);
                gl.uniformMatrix4fv(balloonAnimalProgram.uModelT, false, modelMatrix);
                gl.bindVertexArray(joints[i][j].VAO);
                gl.drawElements(gl.TRIANGLES, joints[i][j].indices.length, gl.UNSIGNED_SHORT, 0);
            }
        }

        var endPointTranslations = [[4.5,-3.62,0.75],[4.5,-3.62,-0.75],[-4.5,-3.62,0.75],[-4.5,-3.62,-0.75], // leftback, rightback, leftfront, rightfront
            [3.52,2.75,0],[-6.65,3.7,0],[-3.07,6.25,0.75],[-3.07,6.25,-0.75]]; // tail, nose, leftear, rightear

        var endPointScales = [[2,2,3],[2,2,3],[2,2,3],[2,2,3], // leftback, rightback, leftfront, rightfront
            [2,2,2],[2,2,2],[2,3,3],[2,3,3]]; // tail, nose, leftear, rightear

        var endPointRotations = [radians(0), radians(0), radians(0), radians(0), // leftback, rightback, leftfront, rightfront
            radians(0), radians(0), radians(-5), radians(-5)]; // tail, nose, leftear, rightear

        // draw endpoints
        for(let i = 0; i < endPoints.length; i++){
            let modelMatrix = glMatrix.mat4.create();

            let scaleVec = glMatrix.vec3.create();
            glMatrix.vec3.set(scaleVec, endPointScales[i][0], endPointScales[i][1], endPointScales[i][2]);

            let translationVec = glMatrix.vec3.create();
            glMatrix.vec3.set(translationVec, endPointTranslations[i][0], endPointTranslations[i][1], endPointTranslations[i][2]);

            glMatrix.mat4.translate(modelMatrix, modelMatrix, translationVec);
            glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, endPointRotations[i]);
            glMatrix.mat4.scale(modelMatrix, modelMatrix, scaleVec);

            gl.uniform1i(balloonAnimalProgram.isTextured, 0);
            gl.uniformMatrix4fv(balloonAnimalProgram.uModelT, false, modelMatrix);
            gl.bindVertexArray(endPoints[i].VAO);
            gl.drawElements(gl.TRIANGLES, endPoints[i].indices.length, gl.UNSIGNED_SHORT, 0);
        }

        // draw nose cone
        let modelMatrix = glMatrix.mat4.create();

        let scaleVec = glMatrix.vec3.create();
        glMatrix.vec3.set(scaleVec, 0.5, 0.5, 0.5);

        let translationVec = glMatrix.vec3.create();
        glMatrix.vec3.set(translationVec, -7.75, 3.8, 0);

        glMatrix.mat4.translate(modelMatrix, modelMatrix, translationVec);
        glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, radians(-90));
        glMatrix.mat4.scale(modelMatrix, modelMatrix, scaleVec);

        gl.uniform1i(balloonAnimalProgram.isTextured, 0);
        gl.uniformMatrix4fv(balloonAnimalProgram.uModelT, false, modelMatrix);
        gl.bindVertexArray(nose.VAO);
        gl.drawElements(gl.TRIANGLES, nose.indices.length, gl.UNSIGNED_SHORT, 0);

        // draw background
        //gl.useProgram(backgroundProgram);

        let backgroundModelMatrix = glMatrix.mat4.create();

        scaleVec = glMatrix.vec3.create();
        glMatrix.vec3.set(scaleVec, 50, 0.1, 20);

        translationVec = glMatrix.vec3.create();
        glMatrix.vec3.set(translationVec, 0, -4.6, -4);

        glMatrix.mat4.translate(backgroundModelMatrix, backgroundModelMatrix, translationVec);
        glMatrix.mat4.scale(backgroundModelMatrix, backgroundModelMatrix, scaleVec);

        gl.uniform1i(balloonAnimalProgram.isTextured, 1);
        gl.uniformMatrix4fv(balloonAnimalProgram.uModelT, false, backgroundModelMatrix);
        gl.bindVertexArray(floor.VAO);
        gl.drawElements(gl.TRIANGLES, floor.indices.length, gl.UNSIGNED_SHORT, 0);

        backgroundModelMatrix = glMatrix.mat4.create();

        scaleVec = glMatrix.vec3.create();
        glMatrix.vec3.set(scaleVec, 50, 20, 0.1);

        translationVec = glMatrix.vec3.create();
        glMatrix.vec3.set(translationVec, 0, -4.6, -4);

        glMatrix.mat4.translate(backgroundModelMatrix, backgroundModelMatrix, translationVec);
        glMatrix.mat4.scale(backgroundModelMatrix, backgroundModelMatrix, scaleVec);

        gl.uniform1i(balloonAnimalProgram.isTextured, 1);
        gl.uniformMatrix4fv(balloonAnimalProgram.uModelT, false, backgroundModelMatrix);
        gl.bindVertexArray(backWall.VAO);
        gl.drawElements(gl.TRIANGLES, backWall.indices.length, gl.UNSIGNED_SHORT, 0);
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
    // create shader program
    balloonAnimalProgram = initProgram('phong-per-vertex-V', 'phong-per-vertex-F');
      gl.useProgram(balloonAnimalProgram);

      balloonAnimalProgram.aVertexPosition = gl.getAttribLocation(balloonAnimalProgram, 'aVertexPosition');
      balloonAnimalProgram.aNormal = gl.getAttribLocation(balloonAnimalProgram, 'aNormal');
      balloonAnimalProgram.uProjT = gl.getUniformLocation(balloonAnimalProgram, 'projT');
      balloonAnimalProgram.uViewT = gl.getUniformLocation(balloonAnimalProgram, 'viewT');
      balloonAnimalProgram.uModelT = gl.getUniformLocation(balloonAnimalProgram, 'modelT');

      //set up phong attributes
      balloonAnimalProgram.ambientLight = gl.getUniformLocation (balloonAnimalProgram, 'ambientLight');
      balloonAnimalProgram.lightPosition = gl.getUniformLocation (balloonAnimalProgram, 'lightPosition');
      balloonAnimalProgram.secondLightPosition = gl.getUniformLocation (balloonAnimalProgram, 'secondLightPosition');
      balloonAnimalProgram.lightColor = gl.getUniformLocation (balloonAnimalProgram, 'lightColor');
      balloonAnimalProgram.baseColor = gl.getUniformLocation (balloonAnimalProgram, 'baseColor');
      balloonAnimalProgram.specHighlightColor = gl.getUniformLocation (balloonAnimalProgram, 'specHighlightColor');
      balloonAnimalProgram.ka = gl.getUniformLocation (balloonAnimalProgram, 'ka');
      balloonAnimalProgram.kd = gl.getUniformLocation (balloonAnimalProgram, 'kd');
      balloonAnimalProgram.ks = gl.getUniformLocation (balloonAnimalProgram, 'ks');
      balloonAnimalProgram.ke = gl.getUniformLocation (balloonAnimalProgram, 'ke');

      //set up texture attributes
      balloonAnimalProgram.aUV = gl.getAttribLocation(balloonAnimalProgram, "aUV");
      balloonAnimalProgram.uTheTexture = gl.getUniformLocation(balloonAnimalProgram, "theTexture");
      balloonAnimalProgram.isTextured = gl.getUniformLocation(balloonAnimalProgram, "isTextured");

      // create texture program
      //backgroundProgram = initProgram("wireframe-V", "wireframe-F");
      //gl.useProgram(backgroundProgram);

      //backgroundProgram.aVertexPosition = gl.getAttribLocation(backgroundProgram, "aVertexPosition");
      //backgroundProgram.uProjT = gl.getUniformLocation(backgroundProgram, "projT");
      //backgroundProgram.uViewT = gl.getUniformLocation(backgroundProgram, "viewT");
      //backgroundProgram.uModelT = gl.getUniformLocation(backgroundProgram, "modelT");

      // set up texture attributes
      //backgroundProgram.aUV = gl.getAttribLocation(backgroundProgram, "aUV");
      //backgroundProgram.uTheTexture = gl.getUniformLocation(backgroundProgram, "theTexture");
      //backgroundProgram.uTheta = gl.getUniformLocation(backgroundProgram, "theta");

      setUpCamera(balloonAnimalProgram);
      //setUpCamera(backgroundProgram);

      setUpPhong(balloonAnimalProgram);
  }


  // creates a VAO and returns its ID
  function bindVAO (shape, program) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // add code for any additional vertex attribute
      let myNormalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aNormal);
      gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
      
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
    let program = gl.createProgram();
      
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }

    return program;
  }


  //
  // We call draw to render to our canvas
  //
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

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
    initPrograms();
    
    // create and bind your current object
    createShapes();

    setUpTextures();
    
    // do a draw
    draw();
  }
