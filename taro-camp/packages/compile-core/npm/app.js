class Component {
  constructor() {
    this.state = {};
  }
  // 修改setState的函数，使其调用小程序内置函数setData
  setState(state) {
    update(this.$scope.$component, state); 
  }

  _init(scope) {
    // $scope 作用域中包含小程序的一些常用方法及 $component
    // $component 即为react写出来的组件
    this.$scope = scope
  }
}

function update($component, state = {}) {
  $component.state = Object.assign($component.state, state);
  let data = $component.createData(state);
  data['$taroCompReady'] = true;
  $component.state = data;
  $component.$scope.setData(data);
}

/**
 * 通用转化函数
 * @param {*} ComponentClass 被转化的react组件
 * @return option 被转化完的小程序配置
 */
function createPage(ComponentClass) {
  const componentInstance = new ComponentClass()
  const initData = componentInstance.state
  const option = {
    data: initData,
    onLoad() {
      // 这里this指的是作用域$scope
      this.$component = new ComponentClass()
      this.$component._init(this)
    },
    onReady () {
      if (typeof this.$component.componentDidMount === 'function') {
        this.$component.componentDidMount();
      }
    }
  }
  // 将react组件自定义事件转化到小程序的option
  const events = ComponentClass['$$events'];
  if (events) {
    events.forEach(eventHandlerName => {
      if (option[eventHandlerName]) return;
      option[eventHandlerName] = function () {
        this.$component[eventHandlerName].call(this.$component);
      };
    });
  }
  
  return option;
}

export {
  Component,
  createPage
}