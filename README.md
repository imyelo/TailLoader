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
  });
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
### $.tailLoader(options, \[bindBottom\])
尾加载 for jQuery


**Parameters**

**options**:  *object*,  


**[bindBottom]**:  *boolean*,  自动绑定尾部事件

**Returns**

*TailLoader*,  loader

### class TailLoader
**Methods**

#### TailLoader.fetch()
获取数据(可手动执行)


#### TailLoader.data(key)
获取某项data(发送到服务器的数据)


**Parameters**

**key**:  *string*,  键名

**Returns**

对应值

#### TailLoader.data(key, value)
设置某项data(发送到服务器的数据)


**Parameters**

**key**:  *string*,  键名

**value**:  *object*,  值

**Returns**

this

#### TailLoader.inc(key, \[step=1\])
使data中某一值自增


**Parameters**

**key**:  *string*,  键名

**[step=1]**:  *number*,  增量

**Returns**

自增后的值

#### TailLoader.dec(key, \[step=1\])
使data中某一值自减


**Parameters**

**key**:  *string*,  键名

**[step=1]**:  *number*,  减量

**Returns**

自减后的值

#### TailLoader.unlock()
解锁


#### TailLoader.bindBottom()
绑定页尾事件(如不经jQuery.tailLoader生成则需要手动执行)


#### TailLoader.onscroll()
响应页面滚动事件的方法，通过bindBottom方法自动生成


#### TailLoader.unbind()
解绑页尾事件


## License 
MIT
