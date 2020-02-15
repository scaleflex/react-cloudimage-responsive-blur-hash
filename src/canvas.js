import React, { Component } from 'react';
import styles from './img.styles';
import { blurhash } from 'cloudimage-responsive-utils';


class Canvas extends Component {
  componentDidMount() {
    const pixels = blurhash.decode(this.props.blurhash, 32, 32);
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, 32, 32);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  }

  render() {
    const { loaded } = this.props;

    return(
      <canvas ref="canvas" width={32} height={32} style={styles.canvas({ loaded })} />
    )
  }
}

export default Canvas;