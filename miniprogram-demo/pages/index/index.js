var { Component, createPage } = require("../../npm/app.js")

class Index extends Component {
  constructor() {
    super();
    this.state = {
      count: 0
    }
  }
  componentDidMount() {
    console.log('执行componentDidMount');
    this.setState({
      count: 1
    })
  }
  onAddClick() {
    this.setState({
      count: this.state.count + 1
    })
  }

  onReduceClick() {
    this.setState({
      count: this.state.count - 1
    })
  }

  createData() {
    this.__state = arguments[0];
    const text = this.state.count % 2 === 0 ? '偶数' : '奇数';
    Object.assign(this.__state, {
      text: text
    });
    return this.__state;
  }
}
// 加入静态方法
Index.$$events = ['onAddClick','onReduceClick']

export default Page(createPage(Index))