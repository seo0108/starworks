/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일          수정자           수정내용
 *  -----------    -------------     ---------------------------
 *  2025. 10. 14.   홍현택            최초 생성
 *  2025. 10. 17.   HT Hong           보내기/임시저장 시 SweetAlert2 확인 모달 추가
 *
 * </pre>
 */
document.addEventListener('DOMContentLoaded', function () {

  // 폼 및 주요 요소 참조
  const form = document.getElementById('forwardForm');                   // 메일 전송/임시저장 폼
  const emailToInput = document.getElementById('emailTo');               // 수신자 입력 (자동완성 대상)
  const suggestionsDiv = document.getElementById('autocomplete-suggestions'); // 자동완성 컨테이너
  const sendBtn = document.getElementById('sendBtn');                    // 보내기 버튼
  const saveDraftBtn = document.getElementById('saveDraftBtn');          // 임시저장 버튼
  const cancelBtn = document.getElementById('cancel-compose-btn');       // 취소 버튼
  const editorTextarea = document.querySelector('#forwardEditor');       // 본문 textarea (CKEditor 동기화 대상)
  const emailSubject = document.getElementById('emailSubject');          // 제목 입력

  // 오류 메시지 영역
  const emailToError = document.getElementById('emailToError');
  const emailSubjectError = document.getElementById('emailSubjectError');
  const forwardEditorError = document.getElementById('forwardEditorError');

  // 에디터 및 자동완성 상태
  let editor5 = window.forwardEditor;    // CKEditor5 인스턴스 (외부에서 주입될 수 있음)
  let selectedRecipients = [];           // 선택된 수신자 목록
  let acTimeout = null;                  // 자동완성 디바운싱 타이머 id

  // 수신자 hidden 필드 제거
  function removeHiddenRecipients() {
    if (!form) return;
    form.querySelectorAll('input[name="recipients"]').forEach(i => i.remove());
  }

  // selectedRecipients → hidden inputs 변환
  function addHiddenRecipientsFromSelected() {
    removeHiddenRecipients();
    if (!form) return;

    if (selectedRecipients.length === 0) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'recipients';
      input.value = '';
      form.appendChild(input);
    } else {
      selectedRecipients.forEach(r => {
        if (!r.userId) return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'recipients';
        input.value = r.userId;
        form.appendChild(input);
      });
    }
  }

  // 에디터 내용 → textarea 동기화 (CKEditor5 우선, CKEditor4 폴백)
  function updateEditorContentToTextarea() {
    if (editor5 && editorTextarea) {
      editorTextarea.value = editor5.getData();
    }
    if (typeof CKEDITOR !== 'undefined' &&
        CKEDITOR.instances &&
        CKEDITOR.instances.editor) {
      CKEDITOR.instances.editor.updateElement();
    }
  }

  // 클라이언트 유효성 검사
  function validateForm() {
    let isValid = true;

    // 받는 사람 검사
    if (selectedRecipients.length === 0) {
      if (emailToError) {
        emailToError.textContent = '받는 사람을 입력해주세요.';
        emailToError.style.display = 'block';
      }
      isValid = false;
    } else if (emailToError) {
      emailToError.style.display = 'none';
    }

    // 제목 검사
    if (!emailSubject || emailSubject.value.trim() === '') {
      if (emailSubjectError) {
        emailSubjectError.textContent = '제목을 입력해주세요.';
        emailSubjectError.style.display = 'block';
      }
      isValid = false;
    } else if (emailSubjectError) {
      emailSubjectError.style.display = 'none';
    }

    // 본문 검사 (CKEditor5는 빈 값에 <p></p> 가능)
    const editorContent = editor5 ? editor5.getData().trim() : '';
    if (editorContent === '' || editorContent === '<p></p>') {
      if (forwardEditorError) {
        forwardEditorError.textContent = '내용을 입력해주세요.';
        forwardEditorError.style.display = 'block';
      }
      isValid = false;
    } else if (forwardEditorError) {
      forwardEditorError.style.display = 'none';
    }

    return isValid;
  }

  // 제출 공통 함수: action 경로만 달리 사용
  function submitWithAction(actionPath, isDraft = false) {
    addHiddenRecipientsFromSelected();
    updateEditorContentToTextarea();

    // 보내기인 경우에만 유효성 검사 강제
    if (!isDraft && !validateForm()) {
      // SweetAlert2 사용 시 오류 안내
      if (window.Swal && typeof window.Swal.fire === 'function') {
        window.Swal.fire({
          icon: 'error',
          title: '유효성 검사 실패',
          text: '받는 사람, 제목, 내용을 확인해주세요.'
        });
      }
      return;
    }

    if (!form) return;
    form.action = actionPath;
    form.submit();
  }

  // SweetAlert2 확인 모달 래퍼 (없으면 기본 confirm 사용)
  function confirmAsync(message, options = {}) {
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
    return Promise.resolve(window.confirm(message || '진행하시겠습니까?'));
  }

  // 보내기: 유효성 검사 후 확인 모달 → 제출
  if (sendBtn) {
    sendBtn.addEventListener('click', async function (e) {
      e.preventDefault();

      addHiddenRecipientsFromSelected();
      updateEditorContentToTextarea();

      if (!validateForm()) {
        if (window.Swal && typeof window.Swal.fire === 'function') {
          window.Swal.fire({
            icon: 'error',
            title: '유효성 검사 실패',
            text: '받는 사람, 제목, 내용을 확인해주세요.'
          });
        }
        return;
      }

      const ok = await confirmAsync('메일을 보내시겠습니까??', {
        title: '보내기',
        confirmButtonText: '보내기',
        cancelButtonText: '취소',
        icon: 'question'
      });
      if (!ok) return;

      submitWithAction((window.contextPath || '') + '/mail/forward', false);
    });
  }

  // 임시저장: 확인 모달 → 제출 (유효성 검사는 강제하지 않음)
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', async function (e) {
      e.preventDefault();

      const ok = await confirmAsync('현재 내용을 임시저장 하시겠습니까?', {
        title: '임시저장',
        confirmButtonText: '임시저장',
        cancelButtonText: '취소',
        icon: 'question'
      });
      if (!ok) return;

      submitWithAction((window.contextPath || '') + '/mail/saveDraft', true);
    });
  }

  // 취소: 확인 없이 뒤로가기
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      window.history.back();
    });
  }

  // 입력 변경 시 오류 메시지 초기화
  emailToInput?.addEventListener('input', () => {
    if (emailToError) emailToError.style.display = 'none';
  });
  emailSubject?.addEventListener('input', () => {
    if (emailSubjectError) emailSubjectError.style.display = 'none';
  });
  if (editor5) {
    editor5.model.document.on('change:data', () => {
      if (forwardEditorError) forwardEditorError.style.display = 'none';
    });
  }

  // 자동완성 처리
  emailToInput?.addEventListener('input', function () {
    clearTimeout(acTimeout);

    const fullText = this.value || '';
    const lastComma = fullText.lastIndexOf(',');
    const term = (lastComma === -1 ? fullText : fullText.slice(lastComma + 1)).trim();

    if (!term) {
      if (suggestionsDiv) suggestionsDiv.style.display = 'none';
      return;
    }

    acTimeout = setTimeout(() => {
      fetch((window.contextPath || '') + '/rest/comm-user/autocomplete?term=' + encodeURIComponent(term))
        .then(res => res.json())
        .then(users => {
          if (!suggestionsDiv) return;
          suggestionsDiv.innerHTML = '';
          if (!Array.isArray(users) || users.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
          }

          users.forEach(user => {
            // 이미 선택된 userId를 숨기고 싶다면 아래 주석 해제
            // if (selectedRecipients.some(r => r.userId === String(user.userId))) return;

            const a = document.createElement('a');
            a.href = '#';
            a.className = 'list-group-item list-group-item-action';
            a.textContent = `${user.userNm}(${user.deptNm})<${user.userEmail}>`;

            a.addEventListener('click', e => {
              e.preventDefault();

              const displayText = `${user.userNm}(${user.deptNm})<${user.userEmail}>`;
              selectedRecipients.push({
                userId: String(user.userId),
                userNm: user.userNm,
                displayText
              });

              if (emailToInput) {
                emailToInput.value = selectedRecipients.map(r => r.displayText).join(', ') + ', ';
                emailToInput.focus();
              }

              if (suggestionsDiv) suggestionsDiv.style.display = 'none';
            });

            suggestionsDiv.appendChild(a);
          });

          suggestionsDiv.style.display = suggestionsDiv.childElementCount > 0 ? 'block' : 'none';
        })
        .catch(err => {
          console.error('자동완성 오류:', err);
          if (suggestionsDiv) suggestionsDiv.style.display = 'none';
        });
    }, 300);
  });

  // 입력 외 영역 클릭 시 자동완성 닫기
  document.addEventListener('click', function (e) {
    if (!emailToInput || !suggestionsDiv) return;
    if (!emailToInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
      suggestionsDiv.style.display = 'none';
    }
  });

}); // DOMContentLoaded 종료
