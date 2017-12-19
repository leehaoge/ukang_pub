<%@page import="com.ukang.app.entity.Article"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<fmt:setLocale value="zh_CN" />
    <!DOCTYPE html>
    <html>

    <head>
        <base href="<%= request.getContextPath() %>/">
        <%@include file="ukCommonHead.jsp"%>
            <title>文章列表</title>
    </head>

    <body>
        
        <div data-role="page">
            <%@include file="ukHeader.jsp"%>
                <div role="main" class="uk-content ui-content">
                    <div class="uk-toolbar">
                    <div class="uk-tool-panel">
                        <a href="#" id="btn-add" class="ui-btn">新增</a>
                    </div>
                    </div>
				    <c:set var="listLen" value="${fn:length(artList)}" />
                    <table data-role="table" class="ui-responsive">
                        <thead>
                            <tr>
                                <th>类别</th>
                                <th>标题</th>
                                <th>作者</th>
                                <th>发布时间</th>
                            </tr>
                        </thead>
                        <tbody>
                        <c:choose>
                        	<c:when test="${listLen == 0}">
                            <tr>
                                <td colspan="4">暂无数据</td>
                            </tr>
                            </c:when>
                            <c:otherwise>
                            	<c:forEach items="${artList}" var="article">
                            <tr>
                                <td>${article.type.name}</td>
                                <td>${article.title }</td>
                                <td>${article.author }</td>
                                <td><fmt:formatDate pattern="yyyy-MM-dd HH:mm" value="${article.pubDate }" /></td>
                            </tr>
                            	</c:forEach>
                            </c:otherwise>
                        </c:choose>
                        </tbody>
                    </table>
                </div>
                <%@include file="ukMenu.jsp"%>
        </div>
        <script type="text/javascript" src="js/libs/require.js" data-main="js/articleList"></script>
    </body>

    </html>