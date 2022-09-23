import React, { useEffect, useRef } from 'react';
import {blurHashImgStyes as styles} from "cloudimage-responsive-utils";
import { blurhash } from 'cloudimage-responsive-utils';


function Canvas (props){
  const { loaded } = props;

  const canvasRef = useRef();

  useEffect(() => {
    const pixels = blurhash.decode(props.blurhash, 32, 32);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, 32, 32); 
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  });

  return (
    <canvas ref={canvasRef} width={32} height={32} style={styles.canvas({ loaded })} />
  );
}

export default Canvas;