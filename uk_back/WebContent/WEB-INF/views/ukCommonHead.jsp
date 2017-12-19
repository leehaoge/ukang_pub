<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<meta charset="utf-8">
<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
<meta http-equiv="pragma" content="no-cache"> 
<meta http-equiv="cache-control" content="no-cache"> 
<meta http-equiv="expires" content="0">   
<link rel="stylesheet" type="text/css" href="css/jquery.mobile-1.4.5.css">
<link rel="stylesheet" type="text/css" href="css/ukang-back.css">
<script type="text/javascript" src="js/libs/jquery.js"></script>
<script type="text/javascript" src="js/libs/underscore.js"></script>
<script type="text/javascript" src="js/libs/jquery.mobile-1.4.5.js"></script>
<script type="text/javascript">
window.onload = function() {
    window.app = {
        contextPath: '<%=request.getContextPath() %>/'
    };
}
</script>