export default class ShapeGeo {
  constructor(pathData = []) {
    this.pathData = pathData
    this.geoData = []
    this.triangles = []
    this.vertices = []
    this.parsePath()
    this.update()
  }

  update() {
    this.vertices = []
    this.triangles = []
    this.findTriangle(0)
    this.updateVertices()
  }

  parsePath() {
    this.geoDate = []
    const { pathData, geoData } = this
    for (let i = 0; i < pathData.length; i += 2) {
      geoData.push({ x: pathData[i], y: pathData[i + 1] })
    }
  }

  findTriangle(i) {
    const { geoData, triangles } = this
    const len = geoData.length
    if (len <= 3) {
      triangles.push([...geoData])
    } else {
      const [i0, i1, i2] = [
        i % len,
        (i + 1) % len,
        (i + 2) % len
      ]
      const triangle = [
        geoData[i0],
        geoData[i1],
        geoData[i2]
      ]
      if (this.cross([triangle[0], triangle[1], triangle[2]]) && !this.includePoint(triangle)) {
        triangles.push(triangle)
        geoData.splice(i1, 1)
      }

      this.findTriangle(i1)
    }
  }

  includePoint(triangle) {
    for (let ele of this.geoData) {
      if (!triangle.includes(ele)) {
        if (this.inTriangle(ele, triangle)) {
          return true
        }
      }
    }
    return false
  }

  inTriangle(p0, triangle) {
    //假设三角型三个顶点逆时针顺序为abca，那么ap0在ab的左侧 bp0在bc的左侧 cp0在ca的左侧，就在三角形内
    for (let i = 0; i < 3; i++) {
      const commonPointIndex = i
      const referPointIndex = (i + 1) < 3 ? (i + 1) : 0
      const isLeft = this.cross([triangle[commonPointIndex], triangle[referPointIndex], p0])
      if (!isLeft) return false
    }
    return true
  }

  //p0为公共顶点，p1位参考线另一端点 p2为被判断线的另一端点
  cross([p0, p1, p2]) {

    //参考向量
    const refVec = { x: p1.x - p0.x, y: p1.y - p0.y }
    //被判断的向量
    const judgeVec = { x: p2.x - p0.x, y: p2.y - p0.y }

    const result = (refVec.x * judgeVec.y - refVec.y * judgeVec.x) > 0
    return result
  }

  updateVertices() {
    const res = []
    this.triangles.forEach(triangle => {
      for (let { x, y } of triangle) {
        res.push(x, y)
      }
    })
    this.vertices = res
  }
}

