TailLoader
============

>  页尾自动加载

## 示例
### 最简实现页尾自动加载下一页
```
define(['TailLoader'], function (TailLoader) {
  var tailLoader = TailLoader({
    // 参数与$.ajax一致
    url: 'http://foobar.com/api',
    data: {
      page: 1
    },
    // success方法的作用域为tailLoader实例，相同的还有complete和error方法
    success: function (data) {
      // 向DOM加载新数据
      CONTAINER.append(RENDER(date));
      // 页数加一
      this.inc('page');
      if (this.data('page') < TOTAL) {
        // 还存在下一页时为tailLoader解锁，使其可以继续获取数据
        this.unlock();
      }
      // 否则tailLoader将被锁住不再响应页尾事件
    }
  });
  // 手动绑定页尾事件
  tailLoader.bindBottom();
});
```

### 推荐配置(页尾自动加载下一页)
```
define(['TailLoader'], function (TailLoader) {
  TailLoader({
    // 参数与$.ajax一致
    url: 'http://foobar.com/api',
    data: {
      page: 1
    },
    method: 'get',
    beforeSend: function () {
      // 显示加载状态提示
      LOADER.show();
    },
    // complete, error, success的上下文(this)为tailLoader
    complete: function () {
      // 隐藏加载状态提示
      LOADER.hide();
    },
    error: function (xml, status, err) {
      // 向用户告知错误信息
      ALERT(status);
      // 为tailLoader解锁，使其可以继续获取数据
      this.unlock();
    },
    success: function (data) {
      // 向DOM加载新数据
      CONTAINER.append(RENDER(date));
      // 页数加一
      this.inc('page');
      if (this.data('page') < TOTAL) {
        // 还存在下一页时为tailLoader解锁，使其可以继续获取数据
        this.unlock();
      } else {
        // 向用户告知已经是最后一页
        ALERT('this is the last page');
      }
    }
  }).bindBottom(); // 链式手动绑定页尾事件
});
```

## jQuery
你同样可以通过jQuery.tailLoader调用TailLoader。
*注： 通过jQuery.tailLoader方法实现的尾加载将自动调用bindBottom方法。*
```
define(['TailLoader'], function (TailLoader) {
  // $.tailLoader默认自动绑定页尾事件
  $.tailLoader({
    url: 'http://foobar.com/api',
    data: {
      page: 1
    },
    method: 'get',
    beforeSend: function () {
      LOADER.show();
    },
    complete: function () {
      LOADER.hide();
    },
    error: function (xml, status, err) {
      ALERT(status);
      this.unlock();
    },
    success: function (data) {
      CONTAINER.append(RENDER(date));
      this.inc('page');
      if (this.data('page') < TOTAL) {
        this.unlock();
      } else {
        ALERT('this is the last page');
      }
    }
  });
});
```

## API
```
  /**
   * 尾加载
   * @class TailLoader
   * @author yelo
   * @constructor
   * @param {object} options 与$.ajax参数一致，但其中complete, error, success的上下文为TailLoader实例
   * @chainable
   */
  /**
   * 获取数据(可手动执行)
   * @method fetch
   * @for TailLoader
   * @chainable
   */
  /**
   * 获取某项data(发送到服务器的数据)
   * @method data
   * @for TailLoader
   * @param  {string} key   键名
   * @return 对应值
   */
  /**
   * 设置某项data(发送到服务器的数据)
   * @method data
   * @for TailLoader
   * @chainable
   * @param  {string} key   键名
   * @param {object} value 值
   * @return this
   */
  /**
   * 使data中某一值自增
   * @method inc
   * @for TailLoader
   * @param  {string} key  键名
   * @param  {number} [step=1] 增量
   * @return 自增后的值
   */
  /**
   * 使data中某一值自减
   * @method dec
   * @for TailLoader
   * @param  {string} key  键名
   * @param  {number} [step=1] 减量
   * @return 自减后的值
   */
  /**
   * 解锁
   * @method unlock
   * @for TailLoader
   * @chainable
   * @return this}
   */
  /**
   * 绑定页尾事件(如不经jQuery.tailLoader生成则需要手动执行)
   * @method bindBottom
   * @for TailLoader
   * @chainable
   */
  /**
   * 响应页面滚动事件的方法，通过bindBottom方法自动生成
   * @method onscroll
   * @for TailLoader
   * @private
   */
  /**
   * 解绑页尾事件
   * @method unbind
   * @for TailLoader
   * @chainbale
   */
```

## License 
MIT
