import { SVG } from '@svgdotjs/svg.js'


class Thread {
  constructor () {
    
  }

  init (name) {
    const canvas = document.querySelector(name);
    this.draw = SVG().addTo(canvas).size('100%', '100%');
    this.line = this.draw.line(0, 100, 100, 0).move(20, 20);
    this.line.stroke({ color: '#999', width: 2, linecap: 'round' });
  }

  update (pos) {
    this.line.plot(50, 200, pos.x, pos.y);
  }
}

export default Thread;
