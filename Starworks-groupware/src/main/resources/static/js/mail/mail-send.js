/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일          수정자           수정내용
 *  -----------    -------------     ---------------------------
 *  2025. 10. 14.   홍현택            최초 생성
 *  2025. 10. 17.  홍현택           보내기/임시저장 시 SweetAlert2 확인 모달 추가
 *
 * </pre>
 */

// 파일 중복 로딩 방지 (reply.js와 동일 패턴)
if (!window.__MAIL_SEND_JS_LOADED__) {
  window.__MAIL_SEND_JS_LOADED__ = true;

  document.addEventListener('DOMContentLoaded', function () {

    /* ==========================
     * 1. DOM 요소 참조
     * ========================== */
    const form = document.getElementById('sendForm');                           // 메일 작성 폼
    const emailToInput = document.getElementById('emailTo');                    // 수신자 입력란 (자동완성 대상)
    const suggestionsDiv = document.getElementById('autocomplete-suggestions'); // 자동완성 목록 영역
    const sendBtn = document.getElementById('sendBtn');                         // [보내기] 버튼
    const saveDraftBtn = document.getElementById('saveDraftBtn');               // [임시저장] 버튼
    const cancelBtn = document.getElementById('cancel-compose-btn');            // [취소] 버튼
    const editorTextarea = document.querySelector('#composeEditor');            // CKEditor5와 연동되는 textarea
    const emailSubject = document.getElementById('emailSubject');               // 제목 입력란 (유효성 검사에 필요)

    const emailToError = document.getElementById('emailToError');
    const emailSubjectError = document.getElementById('emailSubjectError');
    const composeEditorError = document.getElementById('composeEditorError');

    const ctx = window.contextPath || '';                                       // contextPath (폼 action 구성용)
    window.selectedRecipients = window.selectedRecipients || [];                // 선택된 수신자 배열 (JSP에서 초기 주입될 수 있음)

    /* ==========================
     * 2. 수신자 Hidden 필드 처리
     * ========================== */
    function removeHiddenRecipients() {
      // 기존 hidden 제거 (중복 전송 방지)
      form.querySelectorAll('input[name="recipients"]').forEach(i => i.remove());
    }

    function addHiddenRecipientsFromSelected() {
      // selectedRecipients → hidden input 변환
      removeHiddenRecipients();
      const list = Array.isArray(window.selectedRecipients) ? window.selectedRecipients : [];

      if (list.length === 0) {
        // 수신자가 없는 경우에도 필드를 유지 (서버 측 유효성 검사용)
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'recipients';
        hidden.value = '';
        form.appendChild(hidden);
      } else {
        // 각 userId마다 하나의 hidden input 생성
        list.forEach(r => {
          if (!r.userId) return;
          const hidden = document.createElement('input');
          hidden.type = 'hidden';
          hidden.name = 'recipients';
          hidden.value = r.userId;
          form.appendChild(hidden);
        });
      }
    }

    /* ==========================
     * 3. CKEditor5 내용 동기화
     * ========================== */
    function updateEditorContentToTextarea() {
      // 에디터의 데이터(HTML)를 textarea.value로 주입 → 서버에서 name="content"로 수신 가능
      if (window.editor5 && editorTextarea) {
        editorTextarea.value = window.editor5.getData();
      }
    }

    /* ==========================
     * 4. 유효성 검사
     * ========================== */
    function validateForm() {
      let isValid = true;

      // 받는 사람 유효성 검사
      if (!Array.isArray(window.selectedRecipients) || window.selectedRecipients.length === 0) {
        if (emailToError) {
          emailToError.textContent = '받는 사람을 입력해주세요.';
          emailToError.style.display = 'block';
        }
        isValid = false;
      } else if (emailToError) {
        emailToError.style.display = 'none';
      }

      // 제목 유효성 검사
      const subjectVal = emailSubject ? emailSubject.value.trim() : '';
      if (subjectVal === '') {
        if (emailSubjectError) {
          emailSubjectError.textContent = '제목을 입력해주세요.';
          emailSubjectError.style.display = 'block';
        }
        isValid = false;
      } else if (emailSubjectError) {
        emailSubjectError.style.display = 'none';
      }

      // 내용 유효성 검사 (CKEditor5는 빈 내용일 때 <p></p>를 반환할 수 있음)
      const editorContent = window.editor5 ? window.editor5.getData().trim() : '';
      if (editorContent === '' || editorContent === '<p></p>') {
        if (composeEditorError) {
          composeEditorError.textContent = '내용을 입력해주세요.';
          composeEditorError.style.display = 'block';
        }
        isValid = false;
      } else if (composeEditorError) {
        composeEditorError.style.display = 'none';
      }

      return isValid;
    }

    /* ==========================
     * 5. 제출 함수 (전송/임시저장)
     * ========================== */
    function submitWithAction(actionPath, isDraft = false) {
      // 수신자 hidden 처리, 에디터 데이터 반영
      addHiddenRecipientsFromSelected();
      updateEditorContentToTextarea();

      // 보내기인 경우에만 유효성 검사 강제
      if (!isDraft && !validateForm()) {
        // SweetAlert2가 있으면 오류 모달 안내, 없으면 조용히 반환
        if (window.Swal && typeof window.Swal.fire === 'function') {
          window.Swal.fire({
            icon: 'error',
            title: '입력 사항 누락',
            text: '받는 사람, 제목, 내용을 확인해주세요.'
          });
        }
        return;
      }

      // 실제 제출
      form.action = actionPath;
      form.submit();
    }

    /* ==========================
     * 6. 확인 모달(SweetAlert2) 래퍼
     *    - SweetAlert2가 없으면 기본 confirm() 사용
     * ========================== */
    function confirmAsync(message, options = {}) {
      // SweetAlert2 가용 시
      if (window.Swal && typeof window.Swal.fire === 'function') {
        return window.Swal.fire({
          title: options.title || '확인',
          text: message || '',
          icon: options.icon || 'question',
          showCancelButton: true,
          confirmButtonText: options.confirmButtonText || '확인',
          cancelButtonText: options.cancelButtonText || '취소',
          reverseButtons: options.reverseButtons !== false
        }).then(res => !!res.isConfirmed);
      }
      // 폴백: 브라우저 기본 confirm
      return Promise.resolve(window.confirm(message || '진행하시겠습니까?'));
    }

    /* ==========================
     * 7. 버튼 바인딩 (보내기/임시저장/취소)
     * ========================== */

    // 보내기: 확인 후 제출
    sendBtn?.addEventListener('click', async (e) => {
      e.preventDefault();

      // 보내기는 유효성 검사를 먼저 통과한 뒤 확인 모달을 띄우는 편이 사용자 경험상 자연스럽다
      addHiddenRecipientsFromSelected();
      updateEditorContentToTextarea();
      if (!validateForm()) {
        if (window.Swal && typeof window.Swal.fire === 'function') {
          window.Swal.fire({
            icon: 'error',
            title: '입력 사항 누락',
            text: '받는 사람, 제목, 내용을 확인해주세요.'
          });
        }
        return;
      }

      const ok = await confirmAsync('메일을 보내시겠습니까?', {
        title: '보내기',
        confirmButtonText: '보내기',
        cancelButtonText: '취소',
        icon: 'question'
      });
      if (!ok) return;

      submitWithAction(ctx + '/mail/send', false);
    });

    // 임시저장: 확인 후 제출 (유효성 검사는 선택적으로 수행하지 않음)
    saveDraftBtn?.addEventListener('click', async (e) => {
      e.preventDefault();

      const ok = await confirmAsync('현재 내용을 임시저장 하시겠습니까?', {
        title: '임시저장',
        confirmButtonText: '임시저장',
        cancelButtonText: '취소',
        icon: 'question'
      });
      if (!ok) return;

      submitWithAction(ctx + '/mail/saveDraft', true);
    });

    // 취소: 확인 없이 이전 페이지로
    cancelBtn?.addEventListener('click', () => window.history.back());

    /* ==========================
     * 8. 입력 필드 변경 시 오류 메시지 초기화
     * ========================== */
    emailToInput?.addEventListener('input', () => {
      if (emailToError) emailToError.style.display = 'none';
    });
    emailSubject?.addEventListener('input', () => {
      if (emailSubjectError) emailSubjectError.style.display = 'none';
    });
    if (window.editor5) {
      window.editor5.model.document.on('change:data', () => {
        if (composeEditorError) composeEditorError.style.display = 'none';
      });
    }

    /* ==========================
     * 9. 자동완성 (수신자 검색)
     * ========================== */
    let acTimeout = null;

    function closeSuggestions() {
      if (suggestionsDiv) suggestionsDiv.style.display = 'none';
    }
    function openSuggestions() {
      if (!suggestionsDiv) return;
      suggestionsDiv.style.display = suggestionsDiv.childElementCount > 0 ? 'block' : 'none';
    }

    emailToInput?.addEventListener('input', function () {
      clearTimeout(acTimeout);

      // 마지막 콤마 기준으로 검색어 분리
      const full = this.value;
      const lastComma = full.lastIndexOf(',');
      const term = (lastComma === -1 ? full : full.slice(lastComma + 1)).trim();

      if (!term) {
        closeSuggestions();
        return;
      }

      // 디바운싱 처리 (300ms 후 자동완성 요청)
      acTimeout = setTimeout(() => {
        fetch(ctx + '/rest/comm-user/autocomplete?term=' + encodeURIComponent(term))
          .then(r => r.json())
          .then(users => {
            if (!suggestionsDiv) return;
            suggestionsDiv.innerHTML = '';
            if (!Array.isArray(users) || users.length === 0) {
              closeSuggestions();
              return;
            }

            users.forEach(user => {
              // 이미 선택된 userId라면 표시하지 않음
              if (Array.isArray(window.selectedRecipients) &&
                  window.selectedRecipients.some(r => r.userId === String(user.userId))) return;

              // 사용자 후보 항목 생성
              const a = document.createElement('a');
              a.href = '#';
              a.className = 'list-group-item list-group-item-action';
              const displayText = `${user.userNm}(${user.deptNm})<${user.userEmail}>`;
              a.textContent = displayText;

              // 후보 클릭 시 → selectedRecipients에 추가 + 인풋 UI 반영
              a.addEventListener('click', e => {
                e.preventDefault();
                window.selectedRecipients.push({
                  userId: String(user.userId),
                  userNm: user.userNm,
                  displayText
                });
                if (emailToInput) {
                  emailToInput.value = window.selectedRecipients.map(r => r.displayText).join(', ') + ', ';
                  emailToInput.focus();
                }
                closeSuggestions();
              });

              suggestionsDiv.appendChild(a);
            });

            openSuggestions();
          })
          .catch(() => closeSuggestions());
      }, 300);
    });

    // 입력 외 영역 클릭 시 자동완성 닫기
    document.addEventListener('click', e => {
      if (!emailToInput || !suggestionsDiv) return;
      if (!emailToInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        closeSuggestions();
      }
    });
  });
}
