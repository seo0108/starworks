<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 21.     			장어진            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI 챗봇</title>
<link rel="stylesheet" href="/css/aiChatbot.css">
</head>
<body>
	<!-- AI 챗봇 FAB 버튼 -->
	<button class="ai-chat-fab" id="aiChatFab">
		<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.9,12.7C30.8,12.3,30.4,12,30,12h-9.3l-3.8-9.7C16.8,2,16.4,1.7,16,1.7S15.2,2,15.1,2.3L11.3,12H2  c-0.4,0-0.8,0.3-0.9,0.7c-0.1,0.4,0,0.9,0.3,1.1L9,19.5l-2.6,9.2c-0.1,0.4,0,0.8,0.4,1.1c0.3,0.2,0.8,0.3,1.1,0l8.1-5.3l8.1,5.3  c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.5-0.7,0.4-1.1L23,19.5l7.6-5.7C30.9,13.5,31.1,13.1,30.9,12.7z M15,18  c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z M19,18c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z  "/>
        </svg>
	</button>

	<!-- AI 챗봇 컨테이너 -->
	<div class="ai-chat-container" id="aiChatContainer">
		<!-- JavaScript에서 동적으로 렌더링 -->
	</div>

	<!-- WebSocket 라이브러리 -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>

	<!-- AI 챗봇 모듈 -->
	<script src="/js/ai/aiChatbotAPI.js"></script>
	<script src="/js/ai/aiChatbotUI.js"></script>
	<script src="/js/ai/aiChatbot.js"></script>
</body>
</html>