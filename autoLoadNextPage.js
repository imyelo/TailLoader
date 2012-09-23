/** 
 * autoLoadNextPage 滚屏自动加载下一页 
 * @param  {string} url  返回JSON数据的地址
 * @param  {string} ul   容器的选择器关键字
 * @param  {string} more '更多'按钮的选择器关键字
 * 2012.09.22 @yelo
 * e.g. : 
 *      javascript (main) : 
 *          var autoLoad = new autoLoadNextPage({:U('w3g/Message/load')}&type={$_REQUEST['type']}&{:C('VAR_PAGE')}=, "ul#msgUl", "nav#more").updateList().bindBottom(); 
 *          $(dataMore).live('click',function(){autoLoad.updateList()});    // 为'更多'按钮绑定动作
 *      html (main) :
 *      	...<ul id="msgUl"></ul><nav id="more"><a href="#">更多</a></nav>...
 *      JSON :
 *      	{html: "<li>...</li>...<li>....</li>", nextpage: 2}
 *      
 */
function autoLoadNextPage(url, ul, more){
    this.__url = url;
    this.__ul = ul;
    this.__more = more;
    this.__nextpage = 1;
    this.__running = false;  //防止在未返回结果时重复ajax

    // 默认以jqm的PageLoadingMsg提示正在加载
    this.__beforeUpdate =function(){
        $.mobile.showPageLoadingMsg();
    }
    this.__afterUpdate = function(){
        $.mobile.hidePageLoadingMsg();
    }

    /**
     * 设置加载内容前的动作
     * @param {function}beforeUpdate
     */
    this.setBeforeUpdate = function(beforeUpdate){
        this.__beforeUpdate = beforeUpdate;
        return this;
    }
    /**
     * 设置加载内容后的动作
     * @param {function}beforeUpdate
     */
    this.setAfterUpdate = function(afterUpdate){
        this.__afterUpdate = afterUpdate;
        return this;
    }

    /**
     * updateList 加载数据
     * @param  {int} p 页码,置空时自动取nextpage
     */
    this.updateList = function(p){
        obj = this;
        p = p ? p : obj.__nextpage;
        if(p){
            obj.__beforeUpdate();
            if(!obj.__running){
                $.get( obj.__url + p, function(data){
                    $(obj.__ul).append( data.html );
                    if(data.nextpage==0){
                        $(obj.__more).remove();
                    }
                    obj.__nextpage = data.nextpage;
                    obj.__running = false;
                    obj.__afterUpdate();
                }, "json");
            }
            obj.__running = true;
        }
        return this;
    }

    /**
     * 滚至底部时触发加载动作
     */
    this.bindBottom = function(){
        pointer = this;
        $(window).bind("scroll", function(){
            if( $(document).scrollTop() + $(window).height() > $(document).height() - 10 ) {
                pointer.updateList();
            }
        });
        $.mobile.ajaxEnabled=false; //强制chrome重置页面
        return this;
    }
}