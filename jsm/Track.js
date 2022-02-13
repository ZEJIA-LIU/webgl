export default class Tarck {
  constructor(target) {
    this.target = target
    this.parent = null
    this.start = 0
    this.timeLen = 5
    this.loop = false
    this.keyMap = new Map()
  }

  update(t) {
    const { keyMap, timeLen, loop, target, start } = this

    //本地时间 
    let time = t - start

    if (loop) {
      time = time % timeLen
    }

    for (const [key, fms] of keyMap) {
      const last = fms.length - 1
      if (time < fms[0][0]) {
        target[key] = fms[0][1]
      } else if (time > fms[last][0]) {
        target[key] = fms[last][1]
      } else {
        target[key] = getValBetweenFms(time, fms, last)
      }
    }
  }
}

function getValBetweenFms(time, fms, last) {
  for (let i = 0; i < last; i++) {
    const fm1 = fms[i]
    const fm2 = fms[i + 1]
    if (time >= fm1[0] && time <= fm2[0]) {
      //线性关系 y = ax + b
      //b = fm1[1] - fm1[0]*k
      //x =time
      //a = y2-y1 /  x2-x1
      const detal = {
        x: fm2[0] - fm1[0],
        y: fm2[1] - fm1[1]
      }
      const a = detal.y / detal.x
      const b = fm1[1] - fm1[0] * a
      return a * time + b
    }
  }
}