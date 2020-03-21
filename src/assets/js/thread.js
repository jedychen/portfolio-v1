import { SVG } from '@svgdotjs/svg.js'

// Thread Data Structure

// knots: Array, Each group is a key
//        Stores all the knot objects' information.
// - groupId: Object, group info
//   items: Array
//       id: String, name
//       posL: Object {x: Int, y: Int}
//       posR: Object {x: Int, y: Int}
// - ...

// knotLines: Object, Each group is a key
//            Lines connecting knot objects.
// - group-name-1: Object, group info
//     items: Array
//       id: String, id of object at the line end
//       line: SVG.line
// - ...


// Stitch
// 
class Thread {
  constructor () {
    this.knots = [];
    this.knotLines = [];
    this.stitches = [];
    this.group = 'coverCards';
  }

  init (name) {
    const canvas = document.querySelector(name);
    this.draw = SVG().addTo(canvas).size('100%', '100%');
    this.createKnotlines();
  }

  createKnotlines() {
    const group = this.group;
    let knots = document.querySelectorAll('.thread__knot-top');
    let self = this;
    knots.forEach(function(item, index, array) {
      // Add knots group.
      if (!(group in self.knots)) {
        let groupData = {
            items: [],
          }
        self.knots[group] = groupData;
        console.log("Knot Group Added - Group Name:" + group + "/ ID:"+item.id);
      }
      // Add lines and src objects.
      let data = {
        src: item,
        line: null,
      };
      if (index > 0) {
        // Bind line to the src object connecting to its end.
        const startItem = self.knots[group].items[index-1].src.getBoundingClientRect();
        const endItem = item.getBoundingClientRect();
        const start = {x: startItem.right, y: startItem.top};
        const end = {x: endItem.left, y: endItem.top};
        let line = self.draw.line(start.x, start.y, end.x, end.y);
        line.stroke({ color: '#999', width: 2, linecap: 'round' });
        data['line'] = line;
        console.log("Knot line Created - Group Name:" + group + "/ ID:"+item.id);
      }
      self.knots[group].items.push(data);
      console.log(self.knots[group]);
    });
  }

  update (pos) {
    this.updateKnots();
  }

  updateKnots() {
    const group = this.group;
    let self = this;
    for (const property in this.knots) {
      this.knots[property].items.forEach(function(item, index, array) {
        if(index > 0) {
          const startItem = self.knots[property].items[index-1].src.getBoundingClientRect();
          const endItem = self.knots[property].items[index].src.getBoundingClientRect();
          const start = {x: startItem.right, y: startItem.top};
          const end = {x: endItem.left, y: endItem.top};
          self.knots[property].items[index].line.plot(start.x, start.y, end.x, end.y);
        }
      })
    }
  }

  /* Add knot based on the emit data sent from card objects.
  Argument:
    group: String, group name in Knots
    id: String, card/knot id
    rect: Object, {left: Int, right: Int, top: Int, bottom: Int}
  */
  // addKnot (group, id, rect) {
  //   const posL = {x: rect.left, y: rect.top};
  //   const posR = {x: rect.right, y: rect.top};
  //   if (!(group in this.knots)) {
  //     let groupData = {
  //         items: [],
  //       }
  //     this.knots[group] = groupData;
  //     console.log("Knot / Group Added - Group Name:" + group + "");
  //   }

  //   // Check if the knot is in the list.
  //   let knotExist = false;
  //   let self = this;
  //   this.knots[group].items.forEach(function(item, index, array){
  //     const knotId = item.id;
  //     if (knotId == id) {
  //       knotExist = true;
  //       item.posL = {x: posL.x, y: posL.y};
  //       item.posR = {x: posR.x, y: posR.y};
  //       if (index > 0)
  //         self.addKnotLineWrapper(group, id, 
  //             self.knots[group].items[index-1], item);
  //       //console.log("Knot Updated - ID:" + id +" / Group:" + group);
  //     }
  //   });

  //   // Add knot if it isn't exist
  //   if (knotExist == false) {
  //     const data = {
  //       'id': id,
  //       'posL': {x: posL.x, y: posL.y},
  //       'posR': {x: posR.x, y: posR.y},
  //     };
  //     this.knots[group].items.push(data);
  //     console.log("Knot / Item Added - ID:" + id +" / Group:" + group);
  //     const itemLength = this.knots[group].items.length
  //     if (itemLength > 1) {
  //       this.addKnotLineWrapper(group, id, 
  //           this.knots[group].items[itemLength-2], data);
  //     }
  //   }
  // }

  // addKnotLineWrapper(group, id, startItem, endItem) {
  //   let startPos = {x: startItem.posR.x, y: startItem.posR.y};
  //   let endPos = {x: endItem.posL.x, y: endItem.posR.y};
  //   this.addKnotLine(group, id, startPos, endPos);
  // }

  // addKnotLine(group, id, startPos, endPos) {
  //   const start = {x: startPos.x, y: startPos.y};
  //   const end = {x: endPos.x, y: endPos.y};
  //   if (!(group in this.knots)) {
  //     console.log("KnotLine / Warning - knots data corruption!");
  //     return;
  //   }
  //   if (!(group in this.knotLines)) {
  //     let groupData = {
  //         items: [],
  //       }
  //     this.knotLines[group] = groupData;
  //     console.log("KnotLine / Group Added - Group Name:" + group + "");
  //   }

  //   let knotLineExist = false;
  //   let self = this;
  //   this.knotLines[group].items.forEach(function(item, index, array){
  //     const knotId = item.id;
  //     if (knotId == id) {
  //       knotLineExist = true;
  //       item.line.plot(start.x, start.y, end.x, end.y);
  //       console.log("KnotLine / Updated - ID:" + id +" / Group:" + group);
  //       console.log("                     Start: " + start.x +", " + start.y);
  //       console.log("                     End:   " + end.x +", " + end.y);
  //     }
  //   });

  //   let lineData = {
  //     'id': id,
  //     'start': {x: startPos.x, y: startPos.y},
  //     'end': {x: endPos.x, y: endPos.y},
  //   }

  //   if (knotLineExist == false) {
  //     let data = {
  //       'id': id,
  //       'line': this.draw.line(start.x, start.y, end.x, end.y).move(10, 10),
  //     };
  //     data.line.stroke({ color: '#999', width: 2, linecap: 'round' });
  //     this.knotLines[group].items.push(data);
  //     console.log("KnotLine / Item Added - ID:" + id +" / Group:" + group);
  //     console.log(this.knotLines[group]);
  //   }
  // }

  // addStitch(group, id, isLeft, isTop, pos) {
  // }
}

export default Thread;
