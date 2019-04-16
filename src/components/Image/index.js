import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getThumbUrl } from '../../utils/utils';

import styles from './index.less';
export default class Image extends PureComponent {
    static propTypes = {
        src: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        style: PropTypes.object,
        isCascade:PropTypes.bool
    };

    static defaultProps = {
        src: '',
        width: 0,
        height: 0,
        style: {},
        isCascade:false,
    };
    render() {
        const { src, width, height, style, isCascade,...rest } = this.props;
        let imageStyle = { ...style };
        if (width) {
            imageStyle['width'] = width + 'px';
        }
        if (height) {
            imageStyle['height'] = height + 'px';
        }
        const newSrc = getThumbUrl({
            imgurl: src,
            width,
            height,
            m: 'fill'
        });
        imageStyle['position'] = 'relative';
        let backDivStyle = { ...imageStyle };
        const delta = isCascade?2:0;
        backDivStyle['position'] = 'absolute';
        backDivStyle['display'] = isCascade?'block':'none';
        backDivStyle['left'] = delta;
        backDivStyle['top'] = delta;
        return (
            <div className={styles.netImage} style={{ position: 'relative', height: height + delta, width: width +delta }}>
                <div className={styles.container} style={backDivStyle}>&nbsp;</div>
                <img className={styles.img} src={newSrc} style={imageStyle} {...rest} />
            </div>
        )
    }
}