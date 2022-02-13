export default class Sky {
  constructor(gl) {
    this.gl = gl
    this.children = []
  }

  add(obj) {
    obj.gl = this.gl
    this.children.push(obj)
  }

  updateVertices(params) {
    this.children.forEach(e => {
      e.updateVertices(params)
    })
  }

  draw() {
    this.children.forEach(e => {

      e.init()
      e.draw()
    })
  }

}