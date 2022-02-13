function initShaders(gl, vsSource, fsSource) {
  //创建程序对象
  const program = gl.createProgram();
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  //启动程序对象
  gl.useProgram(program);
  //将程序对象挂到上下文对象上
  gl.program = program;
  return true;
}

function loadShader(gl, type, source) {
  //根据着色类型，建立着色器对象
  const shader = gl.createShader(type);
  //将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source);
  //编译着色器对象
  gl.compileShader(shader);
  //返回着色器对象
  return shader;
}

function getPositionByMouse(e, canvas) {
  //获取当前鼠标的clientX和clientY
  const { clientX, clientY } = e;

  //获取当前canvas元素的位置边界值
  const { left, top, width, height } = canvas.getBoundingClientRect();

  //获取当前点位在canvas元素中的x和y坐标
  const [cssX, cssY] = [clientX - left, clientY - top];

  //原点的css坐标
  const [halfWidth, halfHeight] = [width / 2, height / 2];

  //当前点和原点在css坐标上的差值
  const [xBaseCenter, yBaseCenter] = [cssX - halfWidth, cssY - halfHeight];
  const yBaseCenterTop = - yBaseCenter;

  //差值除以单位比例 就是webgl坐标值
  const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight];

  return [x, y]
}

function glToCssPos({ x, y }, { width, height }) {
  const unitHeight = height / 2
  const unitWidth = width / 2

  return [x * unitWidth, -y * unitHeight]
}

//线性比例尺
function ScaleLinear(ax, ay, bx, by) {
  const delta = {
    x: bx - ax,
    y: by - ay,
  };
  const k = delta.y / delta.x;
  const b = ay - ax * k;
  return function (x) {
    return k * x + b;
  };
}


export { initShaders, getPositionByMouse, glToCssPos, ScaleLinear };
