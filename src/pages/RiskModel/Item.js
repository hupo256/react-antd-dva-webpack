import React from 'react';
import styles from './style.less';

const defaultDiseases = [
  '',
  '医疗事故',
  '康复',
  '美容整形',
  '眼科',
  '齿科',
  '精神病',
  '先天遗传',
  '意外伤害',
  '生育等',
  '毒品',
  '酗酒',
  '斗殴',
  '溺水',
  '跌落',
  '自杀',
  '艾滋病',
];

export default class Item extends React.Component {
  state = { checked: true };

  componentWillMount() {
    const { group, name } = this.props;
    if (group) {
      const checked = group.indexOf(defaultDiseases.indexOf(name)) > -1;
      this.setState({ checked });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { name } = this.props;
    const { checked: schecked } = this.state;
    const checked = nextProps.group.indexOf(defaultDiseases.indexOf(name)) > -1;
    if (checked !== schecked) {
      this.setState({ checked });
    }
  }

  handleChange = checked => {
    this.setState({ checked });
  };

  render() {
    const { name, onChange, index } = this.props;
    const { checked } = this.state;
    return (
      <div
        className={checked ? styles.checkedItem : styles.uncheckedItem}
        onClick={() => onChange(index)}
      >
        {name}
      </div>
    );
  }
}
