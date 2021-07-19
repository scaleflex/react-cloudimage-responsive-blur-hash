import React, { Component } from 'react';
import {blurHashImgStyes as styles} from "cloudimage-responsive-utils";
import { getFilteredProps } from './utils.js';
import Canvas from './canvas';

class BlurHash extends Component {
  render() {
    const { blurhash, ratio = 1 } = this.props;
    const { className, preserveSize, imgNodeWidth, imgNodeHeight } = getFilteredProps(this.props);

    return (
      <div
        className={`${className} cloudimage-image`.trim()}
        style={styles.picture({ preserveSize, imgNodeWidth, imgNodeHeight, ratio })}
      >
        {blurhash && <Canvas blurhash={blurhash} />}
      </div>
    )
  }
}

export default BlurHash;