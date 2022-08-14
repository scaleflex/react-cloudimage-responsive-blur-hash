import React from 'react';
import {blurHashImgStyes as styles} from "cloudimage-responsive-utils";
import { getFilteredProps } from './utils.js';
import Canvas from './canvas';


function BlurHash(props){
  const { blurhash, ratio = 1 } = props;
  const { className, preserveSize, imgNodeWidth, imgNodeHeight } = getFilteredProps(props);

  return(
    <div
        className={`${className} cloudimage-image`.trim()}
        style={styles.picture({ preserveSize, imgNodeWidth, imgNodeHeight, ratio })}
      >
        {blurhash && <Canvas blurhash={blurhash} />}
      </div>
  );
}

export default BlurHash;