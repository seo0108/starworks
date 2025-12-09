/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 13.     	     김주민            최초 생성
 * 2025. 10
 *
 * </pre>
 */
// 전역 변수
let currentPage = 1; // 현재 페이지

// 파일 아이콘 매핑
const fileIconMap = {
    'pdf': 'bi-file-earmark-pdf text-danger',
    'doc': 'bi-file-earmark-word text-primary',
    'docx': 'bi-file-earmark-word text-primary',
    'xls': 'bi-file-earmark-excel text-success',
    'xlsx': 'bi-file-earmark-excel text-success',
    'ppt': 'bi-file-earmark-ppt text-warning',
    'pptx': 'bi-file-earmark-ppt text-warning',
    'jpg': 'bi-file-earmark-image text-info',
    'jpeg': 'bi-file-earmark-image text-info',
    'png': 'bi-file-earmark-image text-info',
    'gif': 'bi-file-earmark-image text-info',
    'zip': 'bi-file-earmark-zip text-secondary',
    'txt': 'bi-file-earmark-text text-muted',
    'default': 'bi-file-earmark text-secondary'
};

// 파일 아이콘 가져오기
function getFileIcon(extension) {
    const ext = extension ? extension.toLowerCase().replace('.', '') : '';
    return fileIconMap[ext] || fileIconMap['default'];
}

// 출처별 배지 클래스 반환
function getSourceBadgeClass(source) {
    const badgeMap = {
        '프로젝트': 'bg-primary',
        '업무': 'bg-success',
        '게시글': 'bg-info'
    };

    return badgeMap[source] || 'bg-secondary';
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// 날짜 포맷팅
function formatDateForFiles(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 프로젝트 파일 목록 로드
function loadProjectFiles(page = 1) {
    const bizId = project.id;
    currentPage = page;

    $.ajax({
        url: `/rest/project-files/${bizId}/files`,
        method: 'GET',
        data: { page: page },
        success: function(response) {
            console.log('파일 목록 응답:', response);

            if (response.success) {
                const files = response.fileList || [];

                renderFilesList(files);

                // 페이징 HTML 렌더링
                $('#files-pagination-container').html(response.pagingHTML);

                // 통계 업데이트
                $('#total-files-count').text(response.totalRecord);
                $('#stat-total-files').text(response.totalRecord);
            } else {
                console.error('파일 목록 조회 실패:', response.message);
                showErrorMessage();
            }
        },
        error: function(xhr, status, error) {
            console.error('파일 목록 조회 실패:', error);
            showErrorMessage();
        }
    });
}

// 에러 메시지 표시
function showErrorMessage() {
    const tbody = $('#files-list-tbody');
    tbody.html(`
        <tr>
            <td colspan="7" class="text-center text-danger py-5">
                <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                <p class="mt-3 mb-0">파일 목록을 불러오는데 실패했습니다.</p>
            </td>
        </tr>
    `);
}

// 페이징 함수
function fnFilesPaging(page) {
    loadProjectFiles(page);
}

// 파일 목록 렌더링
function renderFilesList(files) {
    const tbody = $('#files-list-tbody');
    tbody.empty();

    if (!files || files.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="7" class="text-center text-muted py-5">
                    <i class="bi bi-folder2-open" style="font-size: 3rem;"></i>
                    <p class="mt-3 mb-0">등록된 파일이 없습니다.</p>
                </td>
            </tr>
        `);
        return;
    }

    files.forEach(file => {
        const iconClass = getFileIcon(file.extFile);
        const fileSize = formatFileSize(file.fileSize);
        const uploadDate = formatDateForFiles(file.uploadDate);

        // 출처를 배지로 표시
        const sourceBadge = file.fileSource
            ? `<span class="badge ${getSourceBadgeClass(file.fileSource)}">${file.fileSource}</span>`
            : '';

        const row = `
           <tr>
                <td class="text-center">
                    <i class="bi ${iconClass}" style="font-size: 1.5rem;"></i>
                </td>
                <td>
                    <strong>${file.orgnFileNm || '-'}</strong>
                    ${file.extFile ? `<br><small class="text-muted">${file.extFile}</small>` : ''}
                </td>
                <td class="text-end pe-5">${fileSize}</td>
                <td class="ps-5">
                    ${sourceBadge}
                    <small class="text-muted ms-1">${file.sourceName || '-'}</small>
                </td>
                <td class="text-center">${uploadDate}</td>
                <td class="text-center">${file.uploaderName || '-'}</td>
                <td class="text-center">
                    <a href="/file/download/${file.saveFileNm}"
                       class="btn btn-sm btn-outline-primary"
                       title="다운로드">
                        <i class="bi bi-download"></i>
                    </a>
                </td>
            </tr>
        `;

        tbody.append(row);
    });
}

// 파일 필터링 함수
function filterFiles() {
    const searchText = $('#file-search-input').val().toLowerCase().trim();
    const sourceFilter = $('#file-source-filter').val();

    const rows = $('#files-list-tbody tr');
    let visibleCount = 0;

    rows.each(function() {
        const row = $(this);

        // 빈 메시지 행은 건너뛰기
        if (row.find('td').attr('colspan')) {
            return;
        }

        const fileName = row.find('td:eq(1) strong').text().toLowerCase();
        const fileSource = row.find('td:eq(3) .badge').text().trim();

        let showRow = true;

        // 검색어 필터
        if (searchText && !fileName.includes(searchText)) {
            showRow = false;
        }

        // 출처 필터
        if (sourceFilter && fileSource !== sourceFilter) {
            showRow = false;
        }

        if (showRow) {
            row.show();
            visibleCount++;
        } else {
            row.hide();
        }
    });

    // 검색 결과가 없을 때 메시지 표시
    if (visibleCount === 0) {
        const tbody = $('#files-list-tbody');
        const existingMessage = tbody.find('.no-results-message');

        if (existingMessage.length === 0) {
            tbody.append(`
                <tr class="no-results-message">
                    <td colspan="7" class="text-center text-muted py-5">
                        <i class="bi bi-search" style="font-size: 3rem;"></i>
                        <p class="mt-3 mb-0">검색 결과가 없습니다.</p>
                        <button class="btn btn-sm btn-outline-secondary mt-2" onclick="resetFileFilters()">
                            필터 초기화
                        </button>
                    </td>
                </tr>
            `);
        }
    } else {
        // 검색 결과가 있으면 "결과 없음" 메시지 제거
        $('#files-list-tbody .no-results-message').remove();
    }

    // 표시되는 파일 개수 업데이트
    $('#total-files-count').text(visibleCount);
}

// 필터 초기화
function resetFileFilters() {
    $('#file-search-input').val('');
    $('#file-source-filter').val('');
    $('#files-list-tbody tr').show();
    $('#files-list-tbody .no-results-message').remove();

    // 전체 파일 개수로 복원
    const totalFiles = $('#files-list-tbody tr:not([colspan])').length;
    $('#total-files-count').text(totalFiles);
}

// 이벤트 바인딩
$(document).ready(function() {
    // 파일 탭 클릭 시 파일 목록 로드
    $('#files-tab').on('shown.bs.tab', function() {
        loadProjectFiles(1);
    });

    // 검색 버튼 클릭
    $('#file-search-btn').on('click', function() {
        filterFiles();
    });

    // 검색어 입력 후 엔터키
    $('#file-search-input').on('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterFiles();
        }
    });

    // 출처 필터 변경
    $('#file-source-filter').on('change', function() {
        filterFiles();
    });
});