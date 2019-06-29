import React, { PureComponent } from 'react';

import { times } from 'lodash';

export default class Node extends PureComponent {
  constructor(props) {
    console.log('constructor', props)
    super(props);
  }

  componentWillUnmount () {
    console.log('umounting');
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }


  handleMouseDown = (e) => {
    console.log('mouse DOWN', e);
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
    this.props.setSelected(this.props.node, true);
  };
  
  handleMouseUp = (e) => {
    console.log('MOUSE UP', e);
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.coords = {};
    // // this.setState({fill: 'green'});
    this.props.setSelected(this.props.node, false);
  };

  handleTouchStart = (e) => {
    console.log('touch start', e.touches[0]);
    this.coords = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    }
    document.addEventListener('touchmove', this.handleTouchMove);
    this.props.setSelected(this.props.node, true);
  };
  
  handleTouchEnd = (e) => {
    console.log('Touch End', e);
    document.removeEventListener('touchmove', this.handleTouchMove);
    this.coords = {};
    this.props.setSelected(this.props.node, false);
  };
  
  handleTouchMove = (e) => {
    e.preventDefault(); // Let's stop this event.
    e.stopPropagation(); // Really this time.
    e = e.touches[0];
    
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = Math.round(e.pageX);
    this.coords.y = Math.round(e.pageY);
    
    const newX = this.props.x - xDiff;
    const newY = this.props.y - yDiff;
    
    this.props.move(this.props.node, newX, newY);
  };

  handleMouseMove = (e) => {
    e.preventDefault(); // Let's stop this event.
    e.stopPropagation(); // Really this time.

    // console.log('mouse move', e);    
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = Math.round(e.pageX);
    this.coords.y = Math.round(e.pageY);

    const newX = this.props.x - xDiff;
    const newY = this.props.y - yDiff;

    // this.props.move(this.props.node, newX, newY);
    this.props.move(this.props.node, newX, newY);
  };

  handleDoubleClick (e) {
    console.log('dbl clicked', e, this);
    // this.setState({x: this.state.x + 10, fill: 'red'});
  };

  render() {
    // const { fill } = this.state;

    return (
      <g transform={`translate(${this.props.x}, ${this.props.y})`}>
        <rect
          className={this.props.selected ? 'node_selected' : 'node'}
          width={this.props.width}
          height={this.props.height}
          rx="3" 
          ry="3"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onDoubleClick={this.handleDoubleClick.bind(this)}
          fill={'lightblue'}
        />
        <g>
          <polygon 
            className="port"
            points="0,-1 5,-1 14,2 14,8 5,11 0,11"
            fill="grey"
            transform={`translate(-9, ${this.props.height / 2 - 5})`}
          />
        </g>
        {times(this.props.outputs, (idx) => {
          return (
            <g key={idx}>
              <polygon 
                className="port"
                points="0,2 9,-1 14,0 14,10 9,11 0,8"
                fill="grey"
                transform={`translate(${this.props.width - 4}, ${(20 * idx) + 15})`}
              />
            </g>
          )
        })}

      </g>
    )
  }
}
