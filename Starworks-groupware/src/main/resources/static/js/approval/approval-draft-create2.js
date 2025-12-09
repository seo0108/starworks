/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 1.     	윤서현            최초 생성
 * 2025. 10. 6.			임가영			코드 리팩토링 (모달창 여러 번 잘 열리게 수정)
 * 2025. 10. 17.        홍현택        alert/confirm → Toast/Confirm 모달로 교체 (비동기/동기 흐름 유지)
 * </pre>
 */

(function () {
  function ensureToastContainer() {
    let wrap = document.getElementById('toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-wrap';
      wrap.className = 'position-fixed top-0 end-0 p-3';
      wrap.style.zIndex = 1080; // 모달보다 위
      document.body.appendChild(wrap);
    }
    return wrap;
  }

  // type: success | info | warning | danger
  window.showToast = function (type = 'info', message = '', opts = {}) {
    const wrap = ensureToastContainer();
    const id = 't_' + Date.now();
    const autohide = opts.autohide !== false;
    const delay = Number.isFinite(opts.delay) ? opts.delay : 2500;

    const bgClass = {
      success: 'bg-success text-white',
      info: 'bg-primary text-white',
      warning: 'bg-warning text-dark',
      danger: 'bg-danger text-white',
    }[type] || 'bg-secondary text-white';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center`;
    toastEl.id = id;
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';
    toastEl.dataset.bsAutohide = autohide ? 'true' : 'false';
    toastEl.dataset.bsDelay = delay;

    toastEl.innerHTML = `
      <div class="toast-header ${bgClass} border-0">
        <strong class="me-auto">${({
          success: '성공',
          info: '알림',
          warning: '확인',
          danger: '오류',
        }[type] || '알림')}</strong>
        <button type="button" class="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${message || ''}</div>
    `;
    wrap.appendChild(toastEl);

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    toast.show();

    return {
      hide: () => toast.hide(),
      el: toastEl,
    };
  };

  window.confirmAsync = function (message, options = {}) {
    return new Promise((resolve) => {
      const modalId = 'confirm_' + Date.now();
      const modalHtml = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-6">${options.title || '확인'}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="닫기"></button>
              </div>
              <div class="modal-body">${message}</div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${options.cancelText || '취소'}</button>
                <button type="button" class="btn btn-primary" id="${modalId}_ok">${options.okText || '확인'}</button>
              </div>
            </div>
          </div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const modalEl = document.getElementById(modalId);
      const okBtn = document.getElementById(`${modalId}_ok`);
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

      okBtn.addEventListener('click', () => {
        resolve(true);
        modal.hide();
      });

      modalEl.addEventListener('hidden.bs.modal', () => {
        resolve(false); // 확인 안 누르면 취소
        modalEl.remove();
      });

      modal.show();
    });
  };
})();

// 페이지의 HTML이 모두 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 첨부파일 설정
  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.create(document.querySelector('.multiple-files-filepond'));

  const approvalLineModal = document.getElementById('approvalLineModal'); // 결재선 설정 모달
  const favoriteLineModal = document.getElementById('favoriteLineModal'); // 즐겨찾기 모달
  const approvalModal = bootstrap.Modal.getOrCreateInstance(approvalLineModal); // 결재선 설정 모달 객체
  const favoriteModal = bootstrap.Modal.getOrCreateInstance(favoriteLineModal); // 즐겨찾기 모달 객체

  document.getElementById('openApprovalModalBtn').addEventListener('click', () => {
    approvalModal.show();
  });

  document.getElementById('openFavModalBtn').addEventListener('click', () => {
    favoriteModal.show();
  });

  // 도장칸 오늘 날짜 삽입
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  document.getElementById('approverSignDate').textContent = `${year}/${month}/${day}`;

  // 조직도 데이터 로딩
  let treeData = [];
  fetch("/rest/comm-user")
    .then(res => res.json())
    .then(data => {
      console.log("서버에서 받은 데이터:", data);
      treeData = data;

      renderApprovalList(treeData, document.getElementById("org-tree"));
      renderApprovalList(treeData, document.getElementById("fav-org-tree"));
    })
    .catch(err => console.error("조직도 데이터 로드 실패:", err));

  // localStorage key
  const favoritesKey = 'approvalLineFavorites';

  function saveFavorites(favorites) {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }

  // 조직도 → 결재선 리스트 렌더링
  function renderApprovalList(data, parentElement) {
	if (!data || data.length === 0) return;
    parentElement.innerHTML = "";

    const deptMap = {};
    const rootDepartments = [];

    data.forEach(user => {
      if (!user.deptId) return;

      if (!deptMap[user.deptId]) {
        deptMap[user.deptId] = {
          deptId: user.deptId,
          deptNm: user.deptNm,
          upDeptId: user.upDeptId,
          employees: [],
          subDepartments: []
        };
      }

      if (user.userNm) {
        deptMap[user.deptId].employees.push(user);
      }
    });

    Object.values(deptMap).forEach(dept => {
      if (dept.deptId === "DP000000" || !dept.upDeptId || dept.upDeptId === dept.deptId) {
        rootDepartments.push(dept);
      } else if (deptMap[dept.upDeptId]) {
        deptMap[dept.upDeptId].subDepartments.push(dept);
      }
    });

    rootDepartments.sort((a, b) => {
      if (a.deptId === "DP000000") return -1;
      if (b.deptId === "DP000000") return 1;
      return a.deptNm.localeCompare(b.deptNm, "ko");
    });

    function createDeptNode(dept) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="dept-label">
          <i class="bi bi-folder-fill text-primary"></i> ${dept.deptNm}
      </span>`;

      const ul = document.createElement("ul");
      ul.classList.add("ps-3");

      dept.employees.forEach(emp => {
        const empLi = document.createElement("li");
        empLi.innerHTML = `
          <a href="#" class="employee-link text-muted"
              data-id="${emp.userId}"
              data-name="${emp.userNm}"
              data-team="${emp.deptNm}"
              data-position="${emp.jbgdNm}">
              <i class="bi bi-person-fill text-secondary"></i>
              ${emp.userNm}
              <span class="badge bg-light text-dark">${emp.jbgdNm}</span>
          </a>`;
        ul.appendChild(empLi);
      });

      dept.subDepartments.forEach(subDept => {
        ul.appendChild(createDeptNode(subDept));
      });

      if (ul.children.length > 0) li.appendChild(ul);
      return li;
    }

    const treeRoot = document.createElement("ul");
    treeRoot.classList.add("org-tree", "list-unstyled", "ps-1");

    rootDepartments.forEach(root => {
      treeRoot.appendChild(createDeptNode(root));
    });

    parentElement.appendChild(treeRoot);
  }

  // 결재선 생성 함수
  function createApprovalLineItem(user, role) {
    const roleSelect = document.getElementById('approval-role-select');
    const roleText = Array.from(roleSelect.options).find(opt => opt.value === role).text;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.dataset.name = user.userNm;
    li.dataset.team = user.deptNm;
    li.dataset.position = user.jbgdNm;
    li.dataset.id = user.userId;
    li.dataset.role = role;
    li.innerHTML = "<span>[" + roleText + "] " + user.userNm + " (" + user.jbgdNm + ")</span>" +
      "<button type='button' class='btn-close btn-sm'></button>";
    return li;
  }

  // 결재선 모달 요소
  const orgTree = document.getElementById('org-tree');
  const orgSearch = document.getElementById('org-search');
  const addBtn = document.getElementById('add-to-line-btn');
  const roleSelect = document.getElementById('approval-role-select');
  const finalList = document.getElementById('approval-line-final-list');
  let selectedUser = null;

  // 결재선 검색
  orgSearch.addEventListener('keyup', (e) => {
    const keyword = e.target.value.trim();
    if (keyword === "") {
      renderApprovalList(treeData, orgTree);
    } else {
      const filtered = treeData.filter(u =>
        (u.userNm && u.userNm.includes(keyword)) ||
        (u.deptNm && u.deptNm.includes(keyword)) ||
        (u.jbgdNm && u.jbgdNm.includes(keyword))
      );
      renderApprovalList(filtered, orgTree);
    }
  });

  // 조직도 클릭
  orgTree.addEventListener('click', (e) => {
    const target = e.target.closest('.employee-link');
    if (target) {
      document.querySelectorAll('#org-tree .employee-link')
        .forEach(node => node.classList.remove('selected-user'));

      target.classList.add('selected-user');
      selectedUser = {
        userId: target.dataset.id,
        userNm: target.dataset.name,
        deptNm: target.dataset.team,
        jbgdNm: target.dataset.position
      };
    }
  });

  // 선택 사용자 결재선에 추가
  addBtn.addEventListener('click', () => {
    if (!selectedUser) {
      showToast('warning', '조직도에서 사용자를 먼저 선택하세요.');
      return;
    }
    const role = roleSelect.value;

    const alreadyExists = finalList.querySelector(`li[data-name='${selectedUser.userNm}']`);
    if (alreadyExists) {
      showToast('info', '이미 추가된 사용자입니다.');
      return;
    }
    finalList.appendChild(createApprovalLineItem(selectedUser, role));
  });

  // 결재선에서 X 클릭 → 삭제
  finalList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-close')) {
      e.target.closest('li').remove();
    }
  });

  // 결재선 설정 모달창에서 '확인'
  document.getElementById('confirm-approval-line').addEventListener('click', function() {
    const roles = { approver: [] };

    Array.from(finalList.children).forEach(item => {
      const role = item.dataset.role;
      if (roles[role]) {
        roles[role].push({
          userId: item.dataset.id,
          userNm: item.dataset.name,
          deptNm: item.dataset.team,
          jbgdNm: item.dataset.position
        });
      }
    });

    function updateLineDisplay(role, displayId, rowId, roleName) {
      const display = document.getElementById(displayId);
      const signRow1 = document.querySelector(".sgin-row-1");
      const signRow2 = document.querySelector(".sgin-row-2");
      const signRow3 = document.querySelector(".sgin-row-3");

      if (!display) {
        console.warn("displayId 못 찾음:", displayId);
        return;
      }
      const row = rowId ? document.getElementById(rowId) : null;
      display.innerHTML = "";
      signRow1.innerHTML = `<th rowspan="3" class="header-cell" style="border: 1px solid black; background-color: #f0f0f0; width:20px; vertical-align: middle; text-align: center;">
                  <p style="text-align: center; margin: 0; padding: 2px 0;">결재</p>
                </th>`;
      signRow2.innerHTML = "";
      signRow3.innerHTML = "";

      if (roles[role].length === 0) {
        if (row) row.style.display = 'none';
        else display.innerHTML = `<p class="fst-italic">${roleName}를 설정해주세요.</p>`;
        return;
      }

      if (row) row.style.display = '';
      roles[role].forEach((u) => {
        display.innerHTML += `
          <div class="d-flex align-items-center mb-2">
            <div class="avatar avatar-sm me-2">
              <span class="avatar-content bg-secondary rounded-circle">
                ${u.userNm.charAt(0)}
              </span>
            </div>
            <div>
              <p class="mb-0 fw-bold" data-id=${u.userId}>${u.userNm}</p>
              <p class="mb-0 text-sm">${u.deptNm} / ${u.jbgdNm}</p>
            </div>
          </div>`;

        signRow1.innerHTML += `<td style="border: 1px solid black;vertical-align: middle;height:23px"><p style="text-align: center; margin: 0; padding: 2px 0">${u.jbgdNm}</p></td>`;
        signRow2.innerHTML += `<td class="stamp-area" data-id=${u.userId} style="border: 1px solid black;vertical-align: middle;height:70px">
                                  <div id="approverSignDiv-${u.userId}" style="text-align: center;"></div>
                                  <div><p style="text-align: center; margin: 0; padding: 2px 0;">${u.userNm}</p></div>
                               </td>`;
        signRow3.innerHTML += `<td style="border: 1px solid black;vertical-align: middle;width: 70px;height:23px"><p id="approverSignDate-${u.userId}" style="text-align: center; margin: 0; padding: 2px 0;"></p></td>`;
      });
    }

    updateLineDisplay('approver', 'approval-line-display', null, '결재자');

    approvalModal.hide();

    // 확인 후 초기화
    finalList.innerHTML = '';
    selectedUser = null;
  });

  // 즐겨찾기 로딩
  function getFavorites() {
    return JSON.parse(localStorage.getItem(favoritesKey)) || [];
  }

  function loadFavorites() {
    const currentUserId = loginUserId;
    fetch(`/rest/approval-customline?userId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(vo => {
          if (!grouped[vo.cstmLineBmNm]) grouped[vo.cstmLineBmNm] = [];
          grouped[vo.cstmLineBmNm].push(vo);
        });

        const select = document.getElementById('favorite-lines-select');
        select.innerHTML = '<option selected>저장된 즐겨찾기 선택...</option>';
        Object.keys(grouped).forEach(name => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          select.appendChild(option);
        });

        select.onchange = function() {
          const selectedName = this.value;
          if (!grouped[selectedName]) return;

          finalList.innerHTML = "";
          grouped[selectedName]
            .sort((a, b) => a.atrzLineSeq - b.atrzLineSeq)
            .forEach(vo => {
              finalList.appendChild(createApprovalLineItem({
                userId: vo.atrzApprId,
                userNm: vo.userNm || vo.atrzApprId,
                deptNm: vo.deptNm || "",
                jbgdNm: vo.jbgdNm || ""
              }, "approver"));
            });
        };
      })
      .catch(err => console.error("즐겨찾기 불러오기 실패:", err));
  }

  function populateFavoritesDropdown() {
    const favorites = getFavorites();
    const select = document.getElementById('favorite-lines-select');
    select.innerHTML = '<option selected>저장된 즐겨찾기 선택...</option>';
    favorites.forEach(fav => {
      const option = document.createElement('option');
      option.value = fav.name;
      option.textContent = fav.name;
      select.appendChild(option);
    });
  }

  approvalLineModal.addEventListener('shown.bs.modal', () => {
    loadFavorites();
    // populateFavoritesDropdown(); // 서버 기반 사용 중이므로 주석 유지
  });

  document.getElementById('favorite-lines-select').addEventListener('change', function() {
    const selectedName = this.value;
    if (!selectedName || selectedName === '저장된 즐겨찾기 선택...') return;

    const favorites = getFavorites();
    const selectedFav = favorites.find(fav => fav.name === selectedName);

    if (selectedFav) {
      finalList.innerHTML = '';
      selectedFav.line.forEach(user => {
        finalList.appendChild(createApprovalLineItem(user, user.role));
      });
    }
  });

  // 즐겨찾기 삭제 버튼
  document.getElementById('delete-favorite-line-btn').addEventListener('click', async () => {
    const select = document.getElementById('favorite-lines-select');
    const selectedName = select.value;

    if (!selectedName || selectedName === '저장된 즐겨찾기 선택...') {
      showToast('warning', '삭제할 즐겨찾기를 선택해주세요.');
      return;
    }

    const ok = await confirmAsync(`'${selectedName}' 즐겨찾기를 삭제하시겠습니까?`, {
      title: '즐겨찾기 삭제',
      okText: '삭제',
      cancelText: '취소',
    });
    if (!ok) return;

    fetch("/rest/approval-customline/" + encodeURIComponent(selectedName), {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("삭제 실패");
        showToast('success', '삭제되었습니다.');
        loadFavorites();
        finalList.innerHTML = "";
      })
      .catch(err => {
        console.error("삭제 오류:", err);
        showToast('danger', '삭제 중 오류가 발생했습니다.');
      });
  });

  // 즐겨찾기 모달 요소
  const favOrgTree = document.getElementById('fav-org-tree');
  const favOrgSearch = document.getElementById('fav-org-search');
  const favAddBtn = document.getElementById('fav-add-to-line-btn');
  const favRoleSelect = document.getElementById('fav-approval-role-select');
  const favFinalList = document.getElementById('fav-approval-line-final-list');
  let favSelectedUser = null;

  dragula([favFinalList]);
  dragula([finalList]);

  // 즐겨찾기 검색
  favOrgSearch.addEventListener('keyup', (e) => {
    const keyword = e.target.value.trim();
    if (keyword === "") {
      renderApprovalList(treeData, favOrgTree);
    } else {
      const filtered = treeData.filter(u =>
        (u.userNm && u.userNm.includes(keyword)) ||
        (u.deptNm && u.deptNm.includes(keyword)) ||
        (u.jbgdNm && u.jbgdNm.includes(keyword))
      );
      renderApprovalList(filtered, favOrgTree);
    }
  });

  // 즐겨찾기 모달 조직도 클릭
  favOrgTree.addEventListener('click', (e) => {
    const target = e.target.closest('.employee-link');
    if (target) {
      document.querySelectorAll('#fav-org-tree .employee-link')
        .forEach(node => node.classList.remove('selected-user'));

      target.classList.add('selected-user');

      favSelectedUser = {
        userId: target.dataset.id,
        userNm: target.dataset.name,
        deptNm: target.dataset.team,
        jbgdNm: target.dataset.position
      };
    }
  });

  // 즐겨찾기 사용자 추가
  favAddBtn.addEventListener('click', () => {
    if (!favSelectedUser) {
      showToast('warning', '조직도에서 사용자를 먼저 선택하세요.');
      return;
    }
    const role = favRoleSelect.value;

    const alreadyExists = favFinalList.querySelector(`li[data-name='${favSelectedUser.userNm}']`);
    if (alreadyExists) {
      showToast('info', '이미 추가된 사용자입니다.');
      return;
    }
    favFinalList.appendChild(createApprovalLineItem(favSelectedUser, role));
  });

  // 즐겨찾기 리스트에서 X → 삭제
  favFinalList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-close')) {
      e.target.closest('li').remove();
    }
  });

  // 즐겨찾기 저장
  document.getElementById('save-favorite-line-btn').addEventListener('click', () => {
    const name = document.getElementById('favorite-line-name').value;
    if (!name) {
      showToast('warning', '즐겨찾기 이름을 입력해주세요.');
      return;
    }
    if (favFinalList.children.length === 0) {
      showToast('warning', '결재선을 구성해주세요.');
      return;
    }

    const voList = Array.from(favFinalList.children).map((item, idx) => ({
      cstmLineBmNm: name,
      userId: loginUserId,
      atrzLineSeq: idx + 1,
      atrzApprId: item.dataset.id,
      apprAtrzYn: "N"
    }));

    fetch("/rest/approval-customline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voList)
    })
      .then(res => {
        if (!res.ok) throw new Error("저장 실패");
        return res.json();
      })
      .then(() => {
        showToast("success", "결재선이 즐겨찾기에 저장되었습니다.");
        favoriteModal.hide();

        document.getElementById('favorite-line-name').value = '';
        finalList.innerHTML = '';
        selectedUser = null;

        document.getElementById('favorite-line-name').value = '';
        favFinalList.innerHTML = '';
        favSelectedUser = null;

        loadFavorites();
      })
      .catch(err => {
        console.error("저장 오류:", err);
        showToast('danger', '저장 중 오류가 발생했습니다.');
      });
  });

  /* =========================
     결재 요청 버튼 관련
     ========================= */
  const approvalConfirmModal = new bootstrap.Modal(document.getElementById('approvalConfirmModal'));

  btnRequest.addEventListener("click", () => {
    const approvers = document.querySelectorAll("#approval-line-display .fw-bold");
    if (approvers.length === 0) {
      showToast('warning', '결재선을 먼저 설정해주세요.');
      return;
    }
    approvalConfirmModal.show();
  });

  document.getElementById("confirmApprovalBtn").addEventListener("click", async () => {
    const approvers = document.querySelectorAll("#approval-line-display .fw-bold");
    const approvalLinesDiv = document.getElementById("approvalLinesDiv");
    approvalLinesDiv.innerHTML = "";
    approvers.forEach((el, idx) => {
      approvalLinesDiv.innerHTML += `<input type="hidden" name="approvalLines[${idx}].atrzApprUserId" value="${el.dataset.id}" />`;
    });

    const resp = await fetch("/rest/getNextDocId");
    const atrzDocId = await resp.text();
    docId.innerText = atrzDocId;
    const atrzDocIdInput = document.getElementsByName("atrzDocId");
    atrzDocIdInput[0].value = atrzDocId;

    const htmlDataDiv = document.querySelector("#htmlDataDiv");
    const clone = htmlDataDiv.cloneNode(true);

    clone.querySelectorAll("input, textarea, select").forEach(el => {
      const span = document.createElement("span");
      if (el.tagName === "SELECT") {
        span.textContent = el.options[el.selectedIndex]?.text || "";
      } else {
        span.textContent = el.value;
      }
      span.classList.add("changeInput");
      el.replaceWith(span);
    });

    const htmlContent = clone.innerHTML;
    draftFormArea.querySelector("[name='htmlData']").value = htmlContent;

    approvalConfirmModal.hide();
    draftFormArea.requestSubmit();
  });

  // INPUT/TEXTAREA의 현재 값을 HTML 속성으로 반영
  function persistInputValues() {
    const inputs = document.querySelectorAll('#draftContentArea input, #draftContentArea textarea');
    inputs.forEach(input => {
      if (input.tagName === 'TEXTAREA') {
        input.textContent = input.value || '';
      } else if (input.type === 'text' || input.type === 'password' || input.type === 'date' || input.type === 'number') {
        input.setAttribute('value', input.value || '');
      } else if (input.type === 'radio' || input.type === 'checkbox') {
        if (input.checked) {
          input.setAttribute('checked', 'checked');
        } else {
          input.removeAttribute('checked');
        }
      }
    });
  }

  // 임시저장 데이터 준비 및 전송 함수
  function prepareAndSubmitTemp() {
    persistInputValues();

    const documentHtml = document.getElementById('draftContentArea').innerHTML;

    document.querySelector('input[name="htmlData"]').value = documentHtml;

    return documentHtml;
  }

  // 임시저장 버튼 클릭
  document.getElementById('btnConfirmTempSave').addEventListener('click', function() {
    const form = document.getElementById('draftFormArea');
    if (!form) {
      showToast('danger', '폼을 찾을 수 없습니다.');
      return;
    }

    prepareAndSubmitTemp();

    const approvers = document.querySelectorAll("#approval-line-display .fw-bold");
    const approvalLinesDiv = document.getElementById("approvalLinesDiv");
    approvalLinesDiv.innerHTML = "";

    approvers.forEach((el, idx) => {
      const userId = el.getAttribute("data-id");
      if (userId) {
        approvalLinesDiv.innerHTML += `
          <input type="hidden" name="approvalLines[${idx}].atrzApprUserId" value="${userId}" />
        `;
      }
    });

    const formData = new FormData(form);

    fetch('/approval/tempSave', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('임시저장 실패');
        }
        return response.text();
      })
      .then(result => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('saveDraftModal'));
        modal.hide();
        showToast('success', '임시저장 완료!');
        window.location.href = "/approval/drafts";
      })
      .catch(err => {
        console.error(err);
        showToast('danger', '임시저장 중 오류가 발생했습니다.');
      });
  });

  // 과거 임시 코드 보관
  // document.getElementById('btnTempSave') ...
});
