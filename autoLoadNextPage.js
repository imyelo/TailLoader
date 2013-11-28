define(function (require, exports, module) {
  // helper
  var helper = {};
  helper.nop = function () {};
  helper.origin = function () {};

  /**
   * 页尾自动加载下一页
   */
  var TailLoader = function (url, container, button, render, dataParser) {
    this._url = url;
    this._container = container;
    this._button = button;
    this._nextPage = 2;
    this._totalPages = 0;
    this._flag = {
      requesting: false, //防止在未返回结果时重复ajax
      noMore: false, // 结束标记
    };
    this._render = render || helper.origin;
    this._dataParser = dataParser || helper.origin;
    this._beforeUpdate = helper.nop;
    this._afterUpdate = helper.nop;
    this._afterRender = helper.nop;
    return this;
  };

  /**
   * 设置加载内容前的动作
   * @param {function}beforeUpdate
   */
  TailLoader.prototype.setBeforeUpdate = function (beforeUpdate) {
    this._beforeUpdate = beforeUpdate;
    return this;
  };
  /**
   * 设置加载内容后的动作
   * @param {function}beforeUpdate
   */
  TailLoader.prototype.setAfterUpdate = function (afterUpdate) {
    this._afterUpdate = afterUpdate;
    return this;
  };
  /**
   * 设置解析模板后的动作
   * @param {function}beforeUpdate
   */
  TailLoader.prototype.setAfterRender = function (afterRender) {
    this._afterRender = afterRender;
    return this;
  };

  /**
   * update 加载数据
   * @param  {int} p 页码,置空时自动取nextPage
   */
  TailLoader.prototype.update = function (page) {
    var self = this;
    var url;
    page = typeof page === 'undefined' ? self._nextPage : page;
    if (typeof self._url === 'string') {
      url = self._url + page;
    } else if (typeof self._url === 'function') {
      url = self._url(page);
    } else {
      throw new Error('base url must be a function or a string');
    }
    if (!self._flag.noMore) {
      self._beforeUpdate();
      if (!self._flag.requesting) {
        $.ajax({
          type: 'get',
          url: url,
          success: function (data) {
            var $row;
            var i, len;
            data = self._dataParser(data);
            if (data.data) {
              for (i = 0, len = data.data.length; i < len; i++) {
                $row = $(self._render(data.data[i])).appendTo(self._container);
                self._afterRender.apply($row);
              }
            }
            self._totalPages = data.totalPages;
            if (self._totalPages <= self._nextPage) {
              $(self._button).hide();
              self._flag.noMore = true;
            } else {
              self._nextPage++;
            }
            self._flag.requesting = false;
            self._afterUpdate();
          },
          error: function (err) {
            throw err;
          },
          dataType: "json"
        });
      }
      self._flag.requesting = true;
    }
    return this;
  };

  /**
   * 滚至底部时触发加载动作
   */
  TailLoader.prototype.bindBottom = function () {
    var self = this;
    $(window).bind("scroll", function() {
      if ($(document).scrollTop() + $(window).height() > $(document).height() - 800) {
        self.update();
      }
    });
  };

  module.exports = TailLoader;

});