import React, { PureComponent } from 'react';
import classNames from 'classnames';
import G2 from 'g2';
import Cloud from 'g-cloud';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import styles from './style.less';

/* eslint no-underscore-dangle: 0 */
/* eslint no-param-reassign: 0 */

const imgUrl = 'https://gw.alipayobjects.com/zos/rmsportal/gWyeGLCdFFRavBGIDzWk.png';

class TagCloud extends PureComponent {
  componentDidMount() {
    this.initTagCloud();
    this.renderChart();

    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      this.renderChart(nextProps.data);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.renderChart.cancel();
  }

  resize = () => {
    this.renderChart();
  };

  initTagCloud = () => {
    const { Util, Shape } = G2;

    function getTextAttrs(cfg) {
      const textAttrs = Util.mix(
        true,
        {},
        {
          fillOpacity: cfg.opacity,
          fontSize: cfg.size,
          rotate: cfg.origin._origin.rotate,
          // rotate: cfg.origin._origin.rotate,
          text: cfg.origin._origin.text,
          textAlign: 'center',
          fill: cfg.color,
          textBaseline: 'Alphabetic',
        },
        cfg.style
      );
      return textAttrs;
    }

    // 给point注册一个词云的shape
    Shape.registShape('point', 'cloud', {
      drawShape(cfg, container) {
        cfg.points = this.parsePoints(cfg.points);
        const attrs = getTextAttrs(cfg);
        const shape = container.addShape('text', {
          attrs: Util.mix(attrs, {
            x: cfg.points[0].x,
            y: cfg.points[0].y,
          }),
        });
        return shape;
      },
    });
  };

  saveRootRef = node => {
    this.root = node;
  };

  saveNodeRef = node => {
    this.node = node;
  };

  @Bind()
  @Debounce(500)
  renderChart(newData) {
    const { data: propsdata, height: propsheight } = this.props;
    const data = newData || propsdata;
    if (!data || data.length < 1) {
      return;
    }

    const colors = [
      '#53CAC6',
      '#8AE6DC',
      '#4291EB',
      '#FACD14',
      '#FACD14',
      '#FFDF3C',
      '#6DB2F7',
      '#6DB2F7',
      '#F66472',
      '#FF8F96',
    ];

    const height = propsheight * 4;
    let width = 0;
    if (this.root) {
      width = this.root.offsetWidth * 4;
    }

    data.sort((a, b) => b.value - a.value);

    const max = data[0].value + 1;
    const min = data[data.length - 1].value;

    // 构造一个词云布局对象
    const layout = new Cloud({
      words: data,
      width,
      height,

      rotate: () => 0,

      // 设定文字大小配置函数(默认为12-24px的随机大小)
      size: words => ((words.value - min) / (max - min)) * 50 + 80,

      // 设定文字内容
      text: words => words.name,
    });

    layout.image(imgUrl, imageCloud => {
      // clean
      if (this.node) {
        this.node.innerHTML = '';
      }

      // 执行词云布局函数，并在回调函数中调用G2对结果进行绘制
      imageCloud.exec(texts => {
        const chart = new G2.Chart({
          container: this.node,
          width,
          height,
          plotCfg: {
            margin: 0,
          },
        });

        chart.legend(false);
        chart.axis(false);
        chart.tooltip(false);

        chart.source(texts);

        // 将词云坐标系调整为G2的坐标系
        chart.coord().reflect();

        chart
          .point()
          .position('x*y')
          .color('text', colors)
          .size('size', size => size)
          .shape('cloud')
          .style({
            fontStyle: 'bold',
            // fontFamily: texts[0].font,
            fontWeight: texts[0].weight,
          });

        chart.render();
      });
    });
  }

  render() {
    const { className, height } = this.props;
    return (
      <div
        className={classNames(styles.tagCloud, className)}
        ref={this.saveRootRef}
        style={{ width: '100%' }}
      >
        <div ref={this.saveNodeRef} style={{ height }} />
      </div>
    );
  }
}

export default TagCloud;
