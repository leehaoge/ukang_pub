<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
    <div data-role="panel" class="uk-navmenu-panel ui-panel ui-panel-position-left ui-panel-display-overlay ui-body-a ui-panel-animate ui-panel-open"
        data-position="left" data-display="overlay" data-theme="a">
        <div class="ui-panel-inner">
            <ul class="jqm-list ui-alt-icon ui-nodisc-icon ui-listview">
                <li data-filtertext="首页" data-icon="home" class="ui-first-child">
                    <a href="<%= request.getContextPath() %>/" class="ui-btn ui-btn-icon-right ui-icon-home">首页</a>
                </li>
                <li data-filtertext="文章管理">
                    <a href="<%= request.getContextPath() %>/app/article/list.htmls" data-ajax="false" class="ui-btn ui-btn-icon-right ui-icon-carat-r">文章管理</a>
                </li>
                <li data-filtertext="buttons button markup buttonmarkup method anchor link button element">
                    <a href="button-markup/" data-ajax="false" class="ui-btn ui-btn-icon-right ui-icon-carat-r">Buttons</a>
                </li>
                <li data-filtertext="form button widget input button submit reset">
                    <a href="button/" data-ajax="false" class="ui-btn ui-btn-icon-right ui-icon-carat-r">Button widget</a>
                </li>
            </ul>
        </div>
    </div>