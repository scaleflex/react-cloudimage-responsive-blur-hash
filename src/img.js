import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import styles from './img.styles';
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

  onImgLoad = () => {
    this.setState({ loaded: true });
  }

  render() {
    const { config, src, blurhash } = this.props;
    const { baseURL, lazyLoading: configLazyLoadingValue } = config;
    const { lazyLoading = configLazyLoadingValue } = this.props;
    const { height, ratio, cloudimgURL, loaded, processed, previewLoaded } = this.state;

    if (this.server) return <img src={baseURL + src}/>;
    if (!processed) return <div/>;

    const {
      alt, className, lazyLoadConfig, preserveSize, imgNodeWidth, imgNodeHeight, ...otherProps
    } = getFilteredProps(this.props);

    const picture = (
      <div
        className={`${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim()}
        style={styles.picture({ preserveSize, imgNodeWidth, imgNodeHeight, ratio, previewLoaded, loaded })}
      >
        {blurhash && <Canvas blurhash={blurhash} loaded={loaded}/>}

        <img
          style={styles.img()}
          src={cloudimgURL}
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