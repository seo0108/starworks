/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 21.     	장어진            최초 생성
 *
 * </pre>
 */
/**
 * AI 챗봇 API 통신 모듈
 */
const AIChatbotAPI = {
    /**
     * 대화 히스토리 로드
     */
    loadHistory() {
        return fetch('/ai/chatbot/history')
            .then(response => response.json())
            .catch(error => {
                return { success: false, history: [] };
            });
    },

    /**
     * 대화 히스토리 초기화
     */
    clearHistory() {
        return fetch('/ai/chatbot/history/clear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .catch(error => {
            return { success: false };
        });
    },

    /**
     * 대화 저장 (선택적)
     */
    saveMessage(question, answer) {
        return fetch('/ai/chatbot/history/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, answer })
        })
        .then(response => response.json())
        .catch(error => {
            return { success: false };
        });
    }
};

// 전역 객체로 내보내기
window.AIChatbotAPI = AIChatbotAPI;
