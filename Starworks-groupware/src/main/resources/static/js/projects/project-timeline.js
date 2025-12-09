// 프로젝트 타임라인 뷰
const ProjectTimeline = {
    // 설정
    config: {
        monthsToShow: 3,
        projectHeight: 50,  // 프로젝트 바 기본 높이
        projectGap: 15,     // 프로젝트 바 간격
        minDate: null,
        maxDate: null
    },

    // 초기화
    init: function(projects) {
        if (!projects || projects.length === 0) {
            this.renderEmptyState();
            return;
        }

        // 날짜 범위 계산
        this.calculateDateRange(projects);

        // 타임라인 렌더링
        this.renderHeader();
        this.renderGridLines();
        this.renderTodayMarker();
        this.renderProjects(projects);
        this.renderLegend();

        // 툴팁 초기화
        this.initTooltips();
    },

    // 날짜 범위 계산
    calculateDateRange: function(projects) {
        const dates = projects.flatMap(p => [
            new Date(p.strtBizDt),
            new Date(p.endBizDt)
        ]);

        this.config.minDate = new Date(Math.min(...dates));
        this.config.maxDate = new Date(Math.max(...dates));

        // 월 시작/끝으로 조정
        this.config.minDate.setDate(1);
        this.config.maxDate.setMonth(this.config.maxDate.getMonth() + 1);
        this.config.maxDate.setDate(0);
    },

    // 월 차이 계산
    getMonthDiff: function(start, end) {
        return (end.getFullYear() - start.getFullYear()) * 12 +
               (end.getMonth() - start.getMonth());
    },

    // 날짜 위치 계산 (%)
    getDatePosition: function(date) {
        const totalDays = (this.config.maxDate - this.config.minDate) / (1000 * 60 * 60 * 24);
        const daysSinceStart = (date - this.config.minDate) / (1000 * 60 * 60 * 24);
        return (daysSinceStart / totalDays) * 100;
    },

    // 헤더 렌더링
    renderHeader: function() {
        const header = document.getElementById('timeline-header');
        if (!header) return;

        header.innerHTML = '';
        const monthDiff = this.getMonthDiff(this.config.minDate, this.config.maxDate);

        for (let i = 0; i <= monthDiff; i++) {
            const date = new Date(this.config.minDate);
            date.setMonth(date.getMonth() + i);

            const monthDiv = document.createElement('div');
            monthDiv.className = 'timeline-month';
            monthDiv.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
            header.appendChild(monthDiv);
        }
    },

    // 그리드 라인 생성
    renderGridLines: function() {
        const gridLines = document.getElementById('timeline-grid-lines');
        if (!gridLines) return;

        gridLines.innerHTML = '';
        const monthDiff = this.getMonthDiff(this.config.minDate, this.config.maxDate);

        for (let i = 1; i <= monthDiff; i++) {
            const line = document.createElement('div');
            line.className = 'timeline-grid-line';
            line.style.left = `${(i / (monthDiff + 1)) * 100}%`;
            gridLines.appendChild(line);
        }
    },

    // 오늘 마커 표시
    renderTodayMarker: function() {
        const grid = document.getElementById('timeline-grid');
        if (!grid) return;

        const today = new Date(); //날짜객체 생성
        today.setHours(0, 0, 0, 0); //시,분,초 모두 0으로 설정하여 날짜만 비교하도록 정규화

        if (today < this.config.minDate || today > this.config.maxDate) {
            return;
        }

        const position = this.getDatePosition(today); //날짜 위치 계산 함수 호출
        const marker = document.createElement('div');
        marker.className = 'today-marker';
        marker.style.left = `${position}%`;
        grid.appendChild(marker);
    },

    // 프로젝트 바 렌더링
    renderProjects: function(projects) {
        const grid = document.getElementById('timeline-grid');
        if (!grid) return;

        // 프로젝트들의 Y 위치 계산 (겹침 방지)
        const projectsWithPosition = this.calculateProjectPositions(projects);

        // 각 프로젝트 바 생성
        projectsWithPosition.forEach(project => {
            const bar = this.createProjectBar(project);
            grid.appendChild(bar);
        });

        // 핵심: 그리드 높이 자동 조정
        this.adjustGridHeight(projectsWithPosition);
    },

    //타임라인 그리드 높이 자동 조정
    adjustGridHeight: function(projects) {
        const grid = document.getElementById('timeline-grid');
        if (!grid || projects.length === 0) return;

        // 가장 아래에 있는 프로젝트의 위치 찾기
        const maxYPosition = Math.max(...projects.map(p => p.yPosition));

        // 필요한 높이 = 최대 Y 위치 + 프로젝트 높이 + 여유 공간
        const requiredHeight = maxYPosition + this.config.projectHeight + 250; // timeline-grid 높이조절

        // 최소 높이(150px)보다 크면 높이 설정
        if (requiredHeight > 150) {
            grid.style.minHeight = `${requiredHeight}px`;
        }
    },

    // 프로젝트 위치 계산 (겹침 방지)
    calculateProjectPositions: function(projects) {
        const sortedProjects = [...projects].sort((a, b) => {
            return new Date(a.strtBizDt) - new Date(b.strtBizDt);
        });

        const lanes = [];  // 각 레인(가로줄)의 마지막 종료일 저장

        return sortedProjects.map(project => {
            const startDate = new Date(project.strtBizDt);

            // 빈 레인 찾기
            let laneIndex = 0;
            for (let i = 0; i < lanes.length; i++) {
                if (lanes[i] < startDate) {
                    laneIndex = i;
                    break;
                }
                laneIndex = i + 1;
            }

            // 레인 업데이트
            lanes[laneIndex] = new Date(project.endBizDt);

            return {
                ...project,
                yPosition: laneIndex * (this.config.projectHeight + this.config.projectGap),
                laneIndex: laneIndex  // 디버깅용
            };
        });
    },

    // 프로젝트 바 생성
    createProjectBar: function(project) {
        const bar = document.createElement('div');
        bar.className = 'project-bar';

        // 상태별 클래스 추가
        const statusClass = this.getStatusClass(project.bizSttsCd);
        bar.classList.add(`status-${statusClass}`);

        // 진행률 100%이면 초록색 클래스 추가
	    if (parseInt(project.bizPrgrs) === 100) {
	        bar.classList.add('progress-complete');
	    }


        // 위치 및 크기 설정
        const startPos = this.getDatePosition(new Date(project.strtBizDt));
        const endPos = this.getDatePosition(new Date(project.endBizDt));
        let width = endPos - startPos;

        // 최소 너비 적용
        const minWidthPercent = 15;
        if (width < minWidthPercent) {
            width = minWidthPercent;
        }

        bar.style.left = `${startPos}%`;
        bar.style.width = `${width}%`;
        bar.style.top = `${project.yPosition}px`;

        // D-day 계산
        const dday = this.calculateDday(project.endBizDt);

        // 툴팁 설정
        const startDate = project.strtBizDt.substring(0, 10);
        const endDate = project.endBizDt.substring(0, 10);
        bar.setAttribute('data-bs-toggle', 'tooltip');
        bar.setAttribute('data-bs-placement', 'top');
        bar.setAttribute('data-bs-html', 'true');
        bar.setAttribute('title', `
            <div style="text-align: left;">
                <strong>${project.bizNm}</strong><br>
                <small>${startDate} ~ ${endDate}</small>
            </div>
        `);

        // 내용 구성
        bar.innerHTML = `
            <div class="project-info">
                <div class="project-name">
		            ${project.bizNm}
		            ${project.bizSttsCd === '승인 대기' ? '<i class="bi bi-lock-fill"></i>' : ''}
		            ${parseInt(project.bizPrgrs) === 100 ? '<i class="bi bi-check-circle-fill" style="color: #a8e063;"></i>' : ''}
		        </div>
                <div class="project-progress">${project.bizPrgrs}%</div>
            </div>
            <div class="project-meta">
                <span class="status-badge">${this.getStatusLabel(project.bizSttsCd)}</span>
                ${dday !== null ? `<span class="dday-badge ${dday <= 3 ? 'urgent' : ''}">
                    ${dday === 0 ? '오늘' : dday < 0 ? `+${Math.abs(dday)}` : `D-${dday}`}
                </span>` : ''}
            </div>
        `;

        // 클릭 이벤트
        if (project.bizSttsCd !== '승인 대기') {
            bar.style.cursor = 'pointer';
            bar.addEventListener('click', () => {
                window.location.href = `/projects/${project.bizId}`;
            });
        } else {
            bar.style.cursor = 'not-allowed';
        }

        return bar;
    },

    // 상태 클래스 반환
    getStatusClass: function(statusCode) {
        const statusMap = {
            '승인 대기': 'pending',
            '진행': 'progress',
            '보류': 'hold',
            '완료': 'done',
            '취소': 'locked'
        };
        return statusMap[statusCode] || 'locked';
    },

    // 상태 라벨 반환
    getStatusLabel: function(statusCode) {
        const labelMap = {
            '승인 대기': '승인대기',
            '진행': '진행',
            '보류': '보류',
            '완료': '완료',
            '취소': '취소'
        };
        return labelMap[statusCode] || statusCode;
    },

    // D-day 계산
    calculateDday: function(endDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    },

    // 아바타 렌더링 (타임라인용은 사용 안 함)
    renderAvatars: function(members) {
        return '';  // 빈 문자열 반환
    },

    // 범례 렌더링
    renderLegend: function() {
        const legend = document.getElementById('timeline-legend');
        if (!legend) return;

        //현재 날짜 가져오기 및 포맷팅
        const today = new Date();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const todayLabel = `오늘 (${month}월 ${date}일)` ; //예: 오늘 (10월 29일)

        const items = [
            { label: '승인대기', color: 'linear-gradient(135deg, #ffd89b 0%, #ff9a56 100%)' },
            { label: '진행중', color: 'linear-gradient(135deg, #00b4ff 0%, #0045d5 100%)' },
            { label: '완료 대기', color: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' },
            { label: '보류', color: 'linear-gradient(135deg, #a8a8a8 0%, #6c757d 100%)' },
            { label: todayLabel, color: '#dc3545', isMarker: true }
        ];

        legend.innerHTML = items.map(item => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${item.color}; ${item.isMarker ? 'width: 3px; height: 30px;' : ''}"></div>
                <span>${item.label}</span>
            </div>
        `).join('');
    },

    // 빈 상태 렌더링
    renderEmptyState: function() {
        const grid = document.getElementById('timeline-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="timeline-empty">
                    <i class="bi bi-calendar-x"></i>
                    <p>현재 진행 중인 프로젝트가 없습니다.</p>
                </div>
            `;
        }
    },

    // 툴팁 초기화
    initTooltips: function() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: 'hover',
                html: true
            });
        });
    },

    // ==========================================
    // 카드 그리드 뷰 관련 함수들
    // ==========================================

    // 카드 그리드 렌더링
    renderCardGrid: function(projects) {
        const container = document.getElementById('card-grid');
        if (!container) return;

        container.innerHTML = '';

        if (!projects || projects.length === 0) {
            container.innerHTML = `
                <div class="timeline-empty">
                    <i class="bi bi-calendar-x"></i>
                    <p>현재 진행 중인 프로젝트가 없습니다.</p>
                </div>
            `;
            return;
        }

        projects.forEach(project => {
            const card = this.createProjectCard(project);
            container.appendChild(card);
        });
    },

    // 프로젝트 카드 생성
    createProjectCard: function(project) {
        const card = document.createElement('div');
        card.className = 'project-card';

        const statusClass = this.getStatusClass(project.bizSttsCd);
        card.classList.add(`status-${statusClass}`);

		// 진행률 100%면 초록색으로 변하도록...
        const borderStyle = (parseInt(project.bizPrgrs) === 100)
            ? 'border-left: 5px solid #56ab2f !important;' // 100%이면서 '완료' 상태가 아닐 때 초록색 강제 적용
            : '';
        if (borderStyle) {
             card.style.setProperty('border-left', '5px solid #56ab2f', 'important');
        }

        const dday = this.calculateDday(project.endBizDt);
        const startDate = project.strtBizDt.substring(0, 10);
        const endDate = project.endBizDt.substring(0, 10);

        // 승인대기 상태일 때 툴팁 추가
	    if (project.bizSttsCd === '승인 대기') {
	        card.setAttribute('data-bs-toggle', 'tooltip');
	        card.setAttribute('data-bs-placement', 'top');
	        card.setAttribute('data-bs-html', 'true');
	        card.setAttribute('title', `
	            <div style="text-align: center;">
	                <i class="bi bi-info-circle-fill"></i><br>
	                프로젝트 승인 대기 중입니다. 승인 완료 후 접근 가능합니다.
	            </div>
	        `);
	    } else if (parseInt(project.bizPrgrs) === 100) {
	    // 진행률 100%일 때 툴팁
	    card.setAttribute('data-bs-toggle', 'tooltip');
	    card.setAttribute('data-bs-placement', 'top');
	    card.setAttribute('data-bs-html', 'true');
	    card.setAttribute('data-complete', 'true'); // CSS용 속성
	    card.setAttribute('title', `
	        <div style="text-align: center;">
	            <i class="bi bi-check-circle-fill"></i><br>
	            모든 업무가 완료되었습니다!<br>
	            <strong>완료 처리</strong>를 해주세요.
	        </div>
	    `);
	}

        card.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-card-title">
                    ${project.bizNm}
                    ${project.bizSttsCd === '승인 대기' ? '<i class="bi bi-lock-fill project-card-icon"></i>' : ''}
                    ${project.bizSttsCd === '완료' ? '<i class="bi bi-check-circle-fill text-success project-card-icon"></i>' : ''}
                </h3>
                <div class="project-card-status">
                    ${this.getStatusBadgeHTML(project.bizSttsCd)}
                </div>
            </div>

            <div class="project-card-progress">
                <div class="project-card-progress-label">
                    <span>진행률</span>
                    <span class="project-card-progress-value">${project.bizPrgrs}%</span>
                </div>
                <div class="project-card-progress-bar">
		            <div class="project-card-progress-fill status-${statusClass}"
		                 style="width: ${project.bizPrgrs}%;
		                 ${parseInt(project.bizPrgrs) === 100
		                    ? 'background: linear-gradient(90deg, #56ab2f 0%, #a8e063 100%) !important;'
		                    : ''}"></div>
		        </div>
            </div>

            <div class="project-card-dates">
                <i class="bi bi-calendar3"></i>
                <span>${startDate} ~ ${endDate}</span>
            </div>

            <div class="project-card-footer">
                <div class="project-card-members">
                    ${this.renderCardAvatars(project.members)}
                </div>
                ${dday !== null ? `
                    <div class="project-card-dday ${dday <= 3 ? 'urgent' : ''}">
                        ${dday === 0 ? '오늘 마감!' : dday < 0 ? `${Math.abs(dday)}일 지연` : `D-${dday}`}
                    </div>
                ` : ''}
            </div>
        `;

        // 클릭 이벤트
        if (project.bizSttsCd !== '승인 대기') {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = `/projects/${project.bizId}`;
            });
        } else {
            card.style.cursor = 'not-allowed';
        }

        return card;
    },

    // 카드용 아바타 렌더링
    renderCardAvatars: function(members) {
        if (!members || members.length === 0) return '';

        let html = '';
        const maxShow = 4;

        members.slice(0, maxShow).forEach(member => {
            const imgSrc = member.filePath || '/images/faces/1.jpg';
            html += `
                <div class="project-card-avatar" data-bs-toggle="tooltip" title="${member.bizUserNm}">
                    <img src="${imgSrc}" alt="${member.bizUserNm}">
                </div>
            `;
        });

        if (members.length > maxShow) {
            html += `
                <div class="project-card-avatar"
                     style="background: #6c757d; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;"
                     data-bs-toggle="tooltip"
                     title="외 ${members.length - maxShow}명">
                    +${members.length - maxShow}
                </div>
            `;
        }

        return html;
    },

    // 상태 뱃지 HTML
    getStatusBadgeHTML: function(statusCode) {
        const badgeMap = {
            '승인 대기': '<span class="badge bg-light-primary">승인대기</span>',
            '진행': '<span class="badge bg-primary">진행</span>',
            '보류': '<span class="badge bg-secondary">보류</span>',
            '완료': '<span class="badge bg-success">완료</span>',
            '취소': '<span class="badge bg-danger">취소</span>'
        };
        return badgeMap[statusCode] || `<span class="badge bg-light-secondary">${statusCode}</span>`;
    }
};

// 페이징 함수
function fnPaging(page) {
    console.log("페이지 이동:", page);

    // 로딩 표시
    const timelineGrid = document.getElementById('timeline-grid');
    const cardGrid = document.getElementById('card-grid');

    if (timelineGrid) {
        timelineGrid.innerHTML = '<div class="timeline-loading"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    }

    if (cardGrid) {
        cardGrid.innerHTML = '<div class="timeline-loading"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    }

    fetch('/rest/project/my/progress?page=' + page)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('로그인이 필요합니다.');
                return;
            }

            if (data.projectList && data.projectList.length > 0) {
                // 타임라인 재렌더링
                document.getElementById('timeline-header').innerHTML = '';
                document.getElementById('timeline-grid').innerHTML = '<div class="timeline-grid-lines" id="timeline-grid-lines"></div>';
                ProjectTimeline.init(data.projectList);

                // 카드 그리드 재렌더링
                ProjectTimeline.renderCardGrid(data.projectList);
                ProjectTimeline.initTooltips();
            } else {
                // 빈 상태 표시
                ProjectTimeline.renderEmptyState();
                document.getElementById('card-grid').innerHTML = `
                    <div class="timeline-empty">
                        <i class="bi bi-calendar-x"></i>
                        <p>현재 진행 중인 프로젝트가 없습니다.</p>
                    </div>
                `;
            }

            // 페이지네이션 업데이트
            document.getElementById('pagination-container').innerHTML = data.pagingHTML;

            console.log('업데이트 완료');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('데이터를 불러오는데 실패했습니다.');
        });
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 서버에서 전달받은 프로젝트 데이터
    const projectList = window.serverProjectData || [];

    console.log('=== 타임라인 초기화 시작 ===');
    console.log('프로젝트 수:', projectList.length);

    // 타임라인 초기화
    ProjectTimeline.init(projectList);

    // 카드 그리드 초기화
    ProjectTimeline.renderCardGrid(projectList);

    // 툴팁 초기화
    setTimeout(() => {
        ProjectTimeline.initTooltips();
    }, 100);

    console.log('=== 타임라인 초기화 완료 ===');
});