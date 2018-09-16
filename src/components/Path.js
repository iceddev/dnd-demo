import React, { Component } from 'react';


export default class Path extends Component {
  constructor(props) {
    console.log('constructor', props)
    super(props);
    this.state = {
      selected: false
    };

  }

  componentWillUnmount () {
    console.log('umounting');
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }


  handleMouseDown = (e) => {
    console.log('mouse DOWN', e);

    document.addEventListener('mousemove', this.handleMouseMove);
    this.setState({selected: true});
  };
  
  handleMouseUp = (e) => {
    console.log('MOUSE UP', e);
    document.removeEventListener('mousemove', this.handleMouseMove);

    this.setState({selected: false});
  };

  handleTouchStart = (e) => {

  };
  
  handleTouchEnd = (e) => {

  };
  
  handleTouchMove = (e) => {

  };

  handleMouseMove = (e) => {
    
    //console.log('mouse move', e);    

  };

  handleDoubleClick (e) {
    console.log('dbl clicked', e, this);
    this.setState({x: this.state.x + 10, fill: 'red'});
  };

  render() {
    const { p } = this.props;
    return (
      <g>
        <path 
          className="link_line"
          d={`M ${p.x} ${p.y} C ${p.x2} ${p.y2} ${p.x3} ${p.y3} ${p.x4} ${p.y4}`} 
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
        />
        <path 
          className={this.state.selected ? 'link_inner_selected' : 'link_inner'} 
          d={`M ${p.x} ${p.y} C ${p.x2} ${p.y2} ${p.x3} ${p.y3} ${p.x4} ${p.y4}`} 
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
        />
      </g>
    )
  }
}
