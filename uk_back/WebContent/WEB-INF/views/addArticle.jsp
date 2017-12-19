<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
    <html>
    <head>
        <base href="<%= request.getContextPath() %>/">
        <%@include file="ukCommonHead.jsp"%>
        <title>新增编辑文章</title>
    </head>

    <body>
        <div data-role="page">
            <%@include file="ukHeader.jsp"%>
            <div role="main" class="uk-content ui-content">
                <h1>新增/编辑文章</h1>
                <form name="art-form" action="data/article/add.htmls" method="post" enctype="multipart/form-data" data-ajax="false">
                    <label for="title">标题</label>
                    <input type="text" name="title" id="art-title" placeholder="录入文章的标题">
                    <label for="title">关键词</label>
                    <input type="text" name="keywords" id="art-keywords" placeholder="请使用[;](分号)区分多个关键词">
                    <label for="main_image">主题图片</label>
                    <input type="file" name="mainImage" id="art-main-image" placeholder="选择主图图片">
                    <div class="ui-grid-b">
                        <div class="ui-block-a">
                            <label for="author">作者</label>
                            <input type="text" id="art-author" name="author">
                        </div>
                        <div class="ui-block-b">
                            <label for="artype">类别</label>
                            <select name="artype" id="art-type">
                                <option value="1">血糖</option>
                                <option value="2">血压</option>
                                <option value="3">心率</option>
                            </select>
                        </div>
                        <div class="ui-block-c">

                        </div>

                    </div>
                    <label for="content">正文</label>
                    <textarea name="content" id="art-content" class="uk-article-content-input" placeholder="录入文本"></textarea>
                    <input type="hidden" name="is_add" value="1">
                </form>
                <div class="ui-grid-a">
                    <div class="ui-block-a text-center button-cell">
                        <button id="btn-submit">提交</button>
                    </div>
                    <div class="ui-block-b text-center button-cell">
                        <button id="btn-reset">重置</button>
                    </div>
                </div>
            </div>
            <%@include file="ukMenu.jsp"%>
        </div>    
        <script type="text/javascript" src="js/libs/require.js" data-main="js/addArticle"></script>
    </body>

    </html>