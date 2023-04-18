import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import {blurHashImgStyes as styles} from "cloudimage-responsive-utils";
import LazyLoad from 'react-lazyload';
import Canvas from './canvas';


class Img extends Component {
  constructor(props) {
    super(props);

    this.server = isServer();
    this.state = {
      cloudimgURL: '',
      loaded: false,
      processed: false
    };
  }

  componentDidMount() {
    if (this.server) return;

    this.processImg();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.server) return;

    const { config: { innerWidth }, src } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processImg(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processImg();
    }
  }

  processImg = (update, windowScreenBecomesBigger) => {
    const imgNode = findDOMNode(this);
    const data = processReactNode(this.props, imgNode, update, windowScreenBecomesBigger, false);

    this.setState(data);
  }

  updateLoadedImageSize = image => {
    this.setState({
      loadedImageWidth: image.naturalWidth,
      loadedImageHeight: image.naturalHeight,
      loadedImageRatio: image.naturalWidth / image.naturalHeight
    })
  }

  onImgLoad = (event) => {
    this.updateLoadedImageSize(event.target)
    this.setState({ loaded: true });
  }

  render() {
    const { config = {}, blurhash } = this.props;
    const { lazyLoading: configLazyLoadingValue } = config;
    const { lazyLoading = configLazyLoadingValue } = this.props;
    const {
      height, ratio, cloudimgSRCSET, cloudimgURL, loaded, processed, previewLoaded, loadedImageRatio
    } = this.state;

    if (!processed) return <div/>;

    const {
      alt, className, lazyLoadConfig, preserveSize, imgNodeWidth, imgNodeHeight, doNotReplaceURL, ...otherProps
    } = getFilteredProps(this.props);

    const picture = (
      <div
        className={`${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim()}
        style={styles.picture({
          preserveSize, imgNodeWidth, imgNodeHeight, ratio: ratio || loadedImageRatio, previewLoaded, loaded
        })}
      >
        {blurhash && <Canvas blurhash={blurhash} loaded={loaded}/>}

        <img
          style={styles.img()}
          src={cloudimgURL}
          srcSet={cloudimgSRCSET.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ')}
          alt={alt}
          onLoad={this.onImgLoad}
          {...otherProps}
        />
      </div>
    );

    return lazyLoading ? (
      <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        {picture}
      </LazyLoad>
    ) : picture;
  }
}




export default Img;