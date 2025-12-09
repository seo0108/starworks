/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 20.     	임가영            최초 생성
 *
 * </pre>
 */

 document.addEventListener('DOMContentLoaded', function () {
	// ===== 전자결재 양식: 모달에서 목록 불러오기/선택/확인 =====
  const API_URL      = '/rest/approval-template?filter=user';
  const CREATE_PREFIX= '/approval/create?formId=';

  const modalEl    = document.getElementById('selectFormModal');
  const listEl     = document.getElementById('form-list');
  const confirmEl  = document.getElementById('confirm-form-selection');
  const catWrap    = document.getElementById('form-categories'); // 좌측 카테고리
  const searchEl   = document.getElementById('form-search-input');
  const detailsEl  = document.getElementById('form-details');

  let formsData = [];          // 서버에서 받은 전체 템플릿
  let viewCat   = 'all';       // 현재 선택된 카테고리 (data-category 값)
  let keyword   = '';          // 검색어 (소문자 비교)
  let selectedForm = null;

  // 간단 escape
  const escapeHtml = (s='') => String(s)
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");

  // 상세 패널 렌더
  function renderDetails(form) {
    if (!detailsEl) return;
    if (!form) {
      detailsEl.innerHTML = `
        <div class="card-body text-center text-muted pt-5">
          <i class="bi bi-card-list" style="font-size: 4rem;"></i>
          <p class="mt-3">목록에서 양식을 선택하세요.</p>
        </div>`;
      return;
    }
    detailsEl.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h6 class="card-title mb-2">${escapeHtml(form.name)}</h6>
          <p class="text-muted mb-2">내용: ${escapeHtml(form.catName || form.catCode || '전체')}</p>
          <div class="small text-muted">보존 연환: ${escapeHtml(form.catYear)}</div>
        </div>
      </div>`;
  }

  // 양식 목록 렌더 (카테고리+검색어 필터)
  function renderList() {
    if (!listEl) return;

    listEl.innerHTML = '';

    const visible = formsData.filter(f => {
      const catOk = (viewCat === 'all') || ((f.catCode || '').toLowerCase() === viewCat);
      const kwOk  = !keyword || (f.name || '').toLowerCase().includes(keyword);
      return catOk && kwOk;
    });

    if (!visible.length) {
      listEl.innerHTML = '<p class="text-center mt-3">조건에 맞는 양식이 없습니다.</p>';
      selectedForm = null;
      if (confirmEl) confirmEl.disabled = true;
      renderDetails(null);
      return;
    }

    for (const f of visible) {
      const a = document.createElement('a');
      a.href = '#';
      a.className = 'list-group-item list-group-item-action';
      a.dataset.id = String(f.id);
      a.textContent = f.name;
      listEl.appendChild(a);
    }

    // 필터 변경 시 선택 초기화
    selectedForm = null;
    if (confirmEl) confirmEl.disabled = true;
    renderDetails(null);
  }

  // 서버에서 양식 목록 로드
  function loadForms() {
    if (!listEl || !confirmEl) return;

    confirmEl.disabled = true;
    selectedForm = null;
    listEl.innerHTML = '<p class="text-center mt-3">불러오는 중...</p>';
    renderDetails(null);

    fetch(API_URL, { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        // 서버 필드명 매핑
        formsData = (Array.isArray(data) ? data : []).map(f => ({
          id:      f.atrzDocTmplId,
          name:    f.atrzDocTmplNm,
          href:    CREATE_PREFIX + f.atrzDocTmplId,
          catCode: (f.atrzCategory || f.atrzCategory || 'all')?.toString().toLowerCase(),
          catName: f.atrzDescription || f.atrzDescription || null,
          catYear: f.atrzSaveYear,
        }));

        // 초기화
        viewCat = 'all';
        keyword = '';
        if (searchEl) searchEl.value = '';

        if (catWrap) {
          catWrap.querySelectorAll('[data-category]').forEach(a => a.classList.remove('active'));
          const allBtn = catWrap.querySelector('[data-category="all"]');
          allBtn && allBtn.classList.add('active');
        }

        renderList();
      })
      .catch(err => {
        console.error('양식 목록 조회 실패:', err);
        formsData = [];
        listEl.innerHTML = '<p class="text-center text-danger mt-3">양식 목록을 불러오지 못했습니다.</p>';
        renderDetails(null);
      });
  }

  // 목록에서 템플릿 선택
  if (listEl) {
    listEl.addEventListener('click', (e) => {
      const item = e.target.closest('.list-group-item');
      if (!item) return;
      e.preventDefault();

      const id = item.dataset.id;
      const visible = formsData.filter(f => {
        const catOk = (viewCat === 'all') || ((f.catCode || '').toLowerCase() === viewCat);
        const kwOk  = !keyword || (f.name || '').toLowerCase().includes(keyword);
        return catOk && kwOk;
      });

      selectedForm = visible.find(f => String(f.id) === String(id)) || null;

      listEl.querySelectorAll('.list-group-item').forEach(x => x.classList.remove('active'));
      item.classList.add('active');

      if (confirmEl) confirmEl.disabled = !selectedForm;
      renderDetails(selectedForm);
    });
  }

  // 확인 버튼
  if (confirmEl) {
    confirmEl.addEventListener('click', () => {
      if (selectedForm?.href) location.href = selectedForm.href;
    });
  }

  // 모달 열릴 때마다 재로딩 & 초기화
  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', () => {
      viewCat = 'all';
      keyword = '';
      loadForms();
    });
  }

  // 좌측 카테고리 클릭
  if (catWrap) {
    catWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category]');
      if (!btn || !catWrap.contains(btn)) return;
      e.preventDefault();

      catWrap.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      viewCat = (btn.dataset.category || 'all').toLowerCase();
      renderList();
    });
  }

  // 검색어 입력 필터
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      keyword = (e.target.value || '').trim().toLowerCase();
      renderList();
    });
  }
});
