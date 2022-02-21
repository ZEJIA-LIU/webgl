const defArrtr = () => ({
  gl: null,
  source: [],
  sourceSize: 0,
  elementBytes: 4,
  categorySize: 0,
  count: 0,
  types: ['POINTS'],
  uniforms: {},
  attributes: {}
})

export default class Poly {
  constructor(attr) {
    Object.assign(this, defArrtr(), attr)
    this.init()
  }


  init() {
    this.calculateSize()
    this.updateAttributes()
    this.updateUniform()
  }

  calculateSize() {
    const { attributes, elementBytes, source } = this
    let categorySize = 0
    Object.values(attributes).forEach(ele => {
      const { size, index } = ele
      categorySize += size
      ele.byteIndex = index * elementBytes
    })
    this.categorySize = categorySize
    this.categoryByte = categorySize * elementBytes
    this.sourceSize = source.length / categorySize
  }

  updateAttributes() {
    const { gl, source, attributes, categoryByte } = this
    //生成缓冲区 
    const sourceBuffer = gl.createBuffer()
    //绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer)
    //写入数据
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source), gl.STATIC_DRAW)

    for (let [key, { size, byteIndex }] of Object.entries(attributes)) {
      const attr = gl.getAttribLocation(gl.program, key)
      gl.vertexAttribPointer(
        attr,
        size,
        gl.FLOAT,
        false,
        categoryByte,
        byteIndex
      )
      gl.enableVertexAttribArray(attr)
    }
  }

  updateUniform() {
    const { gl, uniforms } = this
    for (const [key, val] of Object.entries(uniforms)) {
      const { type, value } = val
      const u = gl.getUniformLocation(gl.program, key)

      if (type.includes('Matrix')) {
        gl[type](u, false, value)
      } else {
        gl[type](u, value)
      }
    }
  }
  updateBuffer() {
    const { gl, source } = this
    this.calculateSize()
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source), gl.STATIC_DRAW)
  }

  updateCount() {
    this.count = this.vertices.length / this.size
  }

  addVertices(...params) {
    this.vertices.push(...params)
    this.updateBuffer()
  }

  popVertices() {
    const { vertices, size } = this
    const len = vertices.length
    vertices.splice(len - size, len)
    this.updateCount()
  }

  setVertice(ind, ...params) {
    const { vertices, size } = this
    const i = ind * size
    params.forEach((param, paramInd) => {
      vertices[i + paramInd] = param
    })
  }

  updateVertices(params) {
    const { geoData } = this
    const vertices = []
    geoData.forEach(data => {
      params.forEach(key => {
        vertices.push(data[key])
      })
    })
    this.vertices = vertices
  }

  draw(types = this.types) {
    const { gl, sourceSize } = this
    for (let type of types) {
      gl.drawArrays(gl[type], 0, sourceSize)
    }
  }
}
