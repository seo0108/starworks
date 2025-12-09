/**
* <pre>
* << 개정이력(Modification Information) >>
*
* 수정일 수정자 수정내용
* 	-------------- 		---------------- 		---------------------------
* 	2025. 10. 27. 			김주민 					최초 생성
*
* 범용 좌측 메뉴 활성화 스크립트
* - 프로젝트, 전자결재, 게시판 모두 지원
* - 상위 메뉴와 하위 메뉴 구분
* - 쿼리 파라미터 지원 (filter, category 등)
*
* </pre>
*/
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname; // "/board/community"
    const currentSearch = window.location.search; // "?category=F102"
    const currentFullUrl = currentPath + currentSearch; // "/board/community?category=F102"

    // URL 파라미터 파싱
    const currentParams = new URLSearchParams(currentSearch);

    // 하위 메뉴 선택 (ul li 안의 a 태그)
    const childMenuLinks = document.querySelectorAll('.approval-menu ul li a');
    // 상위 메뉴 선택 (ul 밖의 직계 a 태그)
    const parentMenuLinks = document.querySelectorAll('.approval-menu .menu-group > a');

    // 하위 메뉴 활성화 처리
    childMenuLinks.forEach(link => {
        const href = link.getAttribute('href');

        // 클릭할 수 없는 링크는 건너뛰기
        if (!href || href === '#' || href === 'javascript:void(0)') return;

        // 정확한 URL 매칭
        if (href === currentFullUrl) {
            link.classList.add('active');
            // 부모 메뉴에 parent-active 클래스 추가
            markParentActive(link);
        }
        // 쿼리 파라미터 없는 경로 매칭
        else if (href === currentPath && !currentSearch) {
            link.classList.add('active'); //하위 메뉴 강조
            markParentActive(link);
        }
    });

    // 상위 메뉴 활성화 처리 (하위 메뉴가 없는 경우)
    parentMenuLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (!href || href === '#' || href === 'javascript:void(0)') return;

        // 하위 메뉴가 있는지 확인
        const hasChildren = link.closest('.menu-group').querySelector('ul');

        // 하위 메뉴가 없는 경우만 상위 메뉴 활성화
        if (!hasChildren) {
            if (href === currentFullUrl || href === currentPath) {
                link.classList.add('active');
            }
        }
    });

    // 부모 메뉴에 parent-active 표시
    function markParentActive(childLink) {
        const parentLink = childLink.closest('.menu-group').querySelector(':scope > a');
        if (parentLink) {
            parentLink.classList.add('parent-active'); // 상위 메뉴 살짝 강조
        }
    }
});