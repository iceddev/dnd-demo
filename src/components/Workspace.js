import React, { Component } from 'react';

import { EventEmitter } from 'events';

import nodes from '../state/nodes';
import { map, forEach, keyBy } from 'lodash';
import Node from './Node';
import Path from './Path';

const me = new EventEmitter();
const styles = {
  svg: {
    border: '1px solid #ddd',
    width: '100%',
    height: '350px',
    // width: '400px',
  }
};

const HALF_HEIGHT = 20;



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes
    };
    this.move = this.move.bind(this);
  }
  move(n, x, y) {
    // console.log('move', n, x, y);
    const nodeMap = keyBy(this.state.nodes, 'id');
    if(nodeMap[n.id]) {
      nodeMap[n.id].x = x;
      nodeMap[n.id].y = y;
      this.setState({nodes: this.state.nodes});
    }
  }
  render() {
    // console.log('render', this.state);
    const nodeMap = {};
    const renderNodes = map(this.state.nodes, (n) => {
      let { wires } = n;
      let width = 100;
      wires = wires || [];
      let height = HALF_HEIGHT * 2;
      if(wires.length > 1) {
        height = height + (HALF_HEIGHT * (wires.length - 1));
      }
      const outputs = wires.length || 1;
      const id = n.id || Math.random + '_';
      const rNode = {
        x: n.x || 0,
        y: n.y || 0,
        width,
        height,
        outputs,
        wires, 
        node: n,
        id
      };
      nodeMap[id] = rNode;
      return rNode;
    });

    const paths = [];
    renderNodes.forEach((n) => {
      forEach(n.wires, (w) => {
        forEach(w, (wi, index) => {
          if(n.id !== wi && nodeMap[wi]) {
            const to = nodeMap[wi];
            paths.push({
              from: n,
              to,
              index,
              key: n.id + '_' + to.id,
              x: n.x + n.width,
              y: n.y + (index * HALF_HEIGHT) + HALF_HEIGHT,
              x2: n.x + n.width + 90,
              y2: n.y + (index * HALF_HEIGHT) + HALF_HEIGHT,
              x3: to.x - 90,
              y3: to.y + (to.height / 2),
              x4: to.x,
              y4: to.y + (to.height / 2),
            });
          }
        });
      });
    });


    return (
      <div>
      
        <svg style={styles.svg}>
          {map(paths, (p) => {
            return <Path key={p.key} p={p} />;
          })}
          {map(renderNodes, (n) => {
            return <Node {...n} key={n.id} move={this.move} />;
          })}
        </svg>
      
      </div>
    )
  }
}
//<path class="link_line link_path" d="M 354 126.5 C 450 166.5 302 30 377 25"></path>
export default App;