let poseNet;
let canvas;
let ctx;
let selectedImage; // 사용자가 선택한 이미지를 저장할 변수

function preload() {
  // preload 함수 내에서는 이미지를 미리 로드합니다. 이번에는 이미지를 미리 로드하지 않습니다.
}

function setup() {
  canvas = createCanvas(640, 360);
  ctx = canvas.getContext('2d');
  // 파일 선택 input 요소에 change 이벤트 리스너를 추가합니다.
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);
  // ml5.poseNet을 초기화합니다.
  poseNet = ml5.poseNet(modelReady);
}

function modelReady() {
  console.log('모델 로딩완료!');
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    selectedImage = loadImage(event.target.result, function() {
      canvas.width = selectedImage.width;
      canvas.height = selectedImage.height;
      ctx.drawImage(selectedImage, 0, 0);
      poseNet.singlePose(canvas);
    });
  };
  reader.readAsDataURL(file);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints(poses) {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255);
        stroke(20);
        strokeWeight(4);
        ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton(poses) {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255);
      strokeWeight(1);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
