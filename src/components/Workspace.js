import React, { Component } from 'react';


import nodes from '../state/nodes';
import { map, forEach, assign } from 'lodash';
import Node from './Node';
import Wire from './Wire';

const styles = {
  svg: {
    border: '1px solid #ddd',
    width: '100%',
    height: '350px',
    // width: '400px',
  }
};

const HALF_HEIGHT = 20;


function initialize() {
  const nodeMap = {};
  const wireMap = {};

  const renderNodes = map(nodes, (n) => {
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
      id,
      inWires: []
    };
    nodeMap[id] = rNode;
    return rNode;
  });
  
  renderNodes.forEach((n) => {
    forEach(n.wires, (w, index) => {
      forEach(w, (wi) => {
        if(n.id !== wi && nodeMap[wi]) {
          const to = nodeMap[wi];
          wireMap[n.id + '_' + to.id] = assign({
            from: n,
            to,
            index,
            id: n.id + '_' + to.id,
            selected: false
          }, calcWire(n, to, index));
          to.inWires.push({id: n.id, index});
        }
      });
    });
  });
  
  return {
    nodeMap,
    wireMap
  }
}

function calcWire(from, to, index) {
  // const w = wireMap[from.id + '_' + to.id];
  return {
    x : from.x + from.width,
    y : from.y + (index * HALF_HEIGHT) + HALF_HEIGHT,
    x2 : from.x + from.width + 90,
    y2 : from.y + (index * HALF_HEIGHT) + HALF_HEIGHT,
    x3 : to.x - 90,
    y3 : to.y + (to.height / 2),
    x4 : to.x,
    y4 : to.y + (to.height / 2),
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialize();
    this.move = this.move.bind(this);
    this.setWireSelected = this.setWireSelected.bind(this);
    this.setNodeSelected = this.setNodeSelected.bind(this);
  }
  move(mn, x, y) {
    const { nodeMap, wireMap } = this.state;
    if(nodeMap[mn.id]) {
      const from = nodeMap[mn.id];
      from.x = x;
      from.y = y;
      // recalc outbound wires
      forEach(from.wires, (wirePort, index) => {
        forEach(wirePort, (wi) => {  
          const to = nodeMap[wi];
          const wireName = mn.id + '_' + wi;
          const oldWire = wireMap[wireName];
          const newW = assign({}, oldWire, calcWire(from, to, index));
          wireMap[wireName] = newW;
        });
      });
      // recalc inbound wires
      forEach(from.inWires, (wi) => {
        const fromFrom = nodeMap[wi.id];
        const wireName = wi.id + '_' + from.id;
        const oldWire = wireMap[wireName];
        const newW = assign({}, oldWire, calcWire(fromFrom, from, wi.index));
        wireMap[wireName] = newW;
      });
      this.setState({nodeMap, wireMap});
    }
  }
  setWireSelected(id, selected) {
    const { wireMap } = this.state;
    wireMap[id].selected = selected;
    this.setState({wireMap});
  }
  setNodeSelected(n, selected) {
    const { nodeMap } = this.state;
    nodeMap[n.id].selected = selected;
    this.setState({nodeMap});
  }
  render() {

    const { nodeMap, wireMap } = this.state;

    return (
      <div>
        <svg style={styles.svg}>
          {map(wireMap, (w) => {
            return <Wire {...w} key={w.id} setSelected={this.setWireSelected} />;
          })}
          {map(nodeMap, (n) => {
            return <Node {...n} key={n.id} move={this.move} setSelected={this.setNodeSelected} />;
          })}
        </svg>
      </div>
    )
  }
}

export default App;