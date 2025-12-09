/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 17.     	     김주민            최초 생성
 *
 * </pre>
 */

/**
 * 멤버별 기간 대비 진척도 차트 렌더링
 * 업무의 시간 경과율 vs 실제 진행률을 비교하여 진척 상황 시각화
 */
function renderMemberProgressChart(bizId) {
    const container = document.getElementById('member-productivity-chart');
    if (!container) {
        console.error('container를 찾을 수 없음');
        return;
    }

    // 기존 차트 제거
    d3.select(container).selectAll('*').remove();

    // 로딩 표시
    container.innerHTML = '<div class="text-center text-muted py-5"><div class="spinner-border spinner-border-sm"></div><p class="mt-2">데이터 로딩 중...</p></div>';

    // 업무 데이터 가져오기
    fetch(`/rest/task/list/${bizId}/all`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API 응답:', data);
            const tasks = data.mainTaskList || [];
            console.log('전체 업무 개수:', tasks.length);

            if (tasks.length === 0) {
                drawEmptyChart(container);
                return;
            }

            // 멤버별 진척도 데이터 생성
            const memberProgressData = processMemberProgressData(tasks);
            console.log('멤버별 진척도 데이터:', memberProgressData);

            if (memberProgressData.length === 0) {
                drawEmptyChart(container);
                return;
            }

            // 진척도 차트 그리기
            drawProgressComparisonChart(container, memberProgressData);
        })
        .catch(error => {
            console.error('멤버별 진척도 로드 실패:', error);
            container.innerHTML = '<div class="text-center text-danger py-4"><p>데이터를 불러올 수 없습니다.</p></div>';
        });
}

/**
 * 멤버별 진척도 데이터 처리
 * 각 업무의 시간 경과율과 실제 진행률을 계산
 */
function processMemberProgressData(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 멤버별로 그룹화
    const memberMap = new Map();

    tasks.forEach(task => {
        // 완료된 업무도 포함 (진척도 계산에 필요)
        // 날짜 필드가 없으면 스킵
        if (!task.strtTaskDt || !task.endTaskDt) {
            return;
        }

        const memberId = task.taskPicId || task.bizUserId;
        const memberName = task.taskPicNm || task.bizUserNm || memberId;

        const startDate = new Date(task.strtTaskDt);
        const endDate = new Date(task.endTaskDt);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // 전체 기간 (일)
        const totalDays = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));

        // 경과 일수
        let elapsedDays = (today - startDate) / (1000 * 60 * 60 * 24);
        elapsedDays = Math.max(0, Math.min(elapsedDays, totalDays));

        // 시간 경과율 (%)
        const timeProgress = Math.round((elapsedDays / totalDays) * 100);

        // 실제 진행률 - 완료된 업무는 100%로 처리
        const actualProgress = task.taskSttsCd === 'B404' ? 100 : (task.taskPrgrs || 0);

        // 진척 상태 판단
        let status;
        const gap = actualProgress - timeProgress;
        if (gap >= 10) {
            status = 'ahead';
        } else if (gap <= -10) {
            status = 'behind';
        } else {
            status = 'ontrack';
        }

        if (!memberMap.has(memberId)) {
            memberMap.set(memberId, {
                id: memberId,
                name: memberName,
                tasks: [],
                avgTimeProgress: 0,
                avgActualProgress: 0,
                ahead: 0,
                ontrack: 0,
                behind: 0,
                total: 0
            });
        }

        const member = memberMap.get(memberId);

        member.tasks.push({
            taskId: task.taskId,
            taskNm: task.taskNm,
            timeProgress: timeProgress,
            actualProgress: actualProgress,
            gap: gap,
            status: status,
            startDate: startDate,
            endDate: endDate
        });

        member.total++;
        member[status]++;
        member.avgTimeProgress += timeProgress;
        member.avgActualProgress += actualProgress;
    });

    // 평균 계산 및 배열로 변환
    const memberData = Array.from(memberMap.values()).map(member => {
        if (member.total > 0) {
            member.avgTimeProgress = Math.round(member.avgTimeProgress / member.total);
            member.avgActualProgress = Math.round(member.avgActualProgress / member.total);
        }
        return member;
    });

    // 업무가 있는 멤버만 필터링하고 평균 진행률 기준으로 정렬 (상위 5명)
    return memberData
        .filter(m => m.total > 0)
        .sort((a, b) => b.avgActualProgress - a.avgActualProgress)
        .slice(0, 5);
}

/**
 * 기간 대비 진척도 비교 차트 그리기
 */
function drawProgressComparisonChart(container, memberData) {
    console.log('=== drawProgressComparisonChart 시작 ===');

    // 기존 내용 완전히 제거
    d3.select(container).selectAll('*').remove();

    // SVG 크기 설정 - 하단 범례 공간 확보
    const margin = { top: 40, right: 80, bottom: 100, left: 120 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = Math.max(300, memberData.length * 100) - margin.top - margin.bottom;

    // SVG 생성
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Y축 스케일 (멤버)
    const y = d3.scaleBand()
        .domain(memberData.map(m => m.name))
        .range([0, height])
        .padding(0.4);

    // X축 스케일 (진행률 %)
    const x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    // 툴팁
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('opacity', 0);

    // 그리드 라인
    svg.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(x.ticks(10))
        .enter()
        .append('line')
        .attr('x1', d => x(d))
        .attr('x2', d => x(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#e9ecef')
        .attr('stroke-width', 1);

    // 각 멤버별 그룹
    const memberGroups = svg.selectAll('.member-group')
        .data(memberData)
        .enter()
        .append('g')
        .attr('class', 'member-group')
        .attr('transform', d => `translate(0, ${y(d.name)})`);

    const barHeight = y.bandwidth() / 2 - 5;

    // 상태별 색상 함수
    function getStatusColor(gap) {
        if (gap >= 10) return '#198754'; // 초록 - 앞서감
        if (gap <= -10) return '#dc3545'; // 빨강 - 지연
        return '#435ebe'; // 파랑 - 정상
    }

    // 시간 경과율 바 (반투명, 배경)
    memberGroups.append('rect')
        .attr('class', 'time-progress-bar')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', barHeight)
        .attr('fill', '#adb5bd')
        .attr('opacity', 0.3)
        .attr('rx', 4)
        .transition()
        .duration(1000)
        .attr('width', d => x(d.avgTimeProgress));

    // 실제 진행률 바
    memberGroups.append('rect')
        .attr('class', 'actual-progress-bar')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', barHeight)
        .attr('fill', d => getStatusColor(d.avgActualProgress - d.avgTimeProgress))
        .attr('rx', 4)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 0.8);

            const gap = d.avgActualProgress - d.avgTimeProgress;
            let statusText, statusColor;
            if (gap >= 10) {
                statusText = '앞서감 ⬆';
                statusColor = '#198754';
            } else if (gap <= -10) {
                statusText = '지연됨 ⬇';
                statusColor = '#dc3545';
            } else {
                statusText = '정상 진행 ✓';
                statusColor = '#435ebe';
            }

            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`
                <strong>${d.name}</strong><br/>
                시간 경과율: ${d.avgTimeProgress}%<br/>
                실제 진행률: ${d.avgActualProgress}%<br/>
                <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span><br/>
                <small>앞서감 ${d.ahead} / 정상 ${d.ontrack} / 지연 ${d.behind}</small>
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.transition().duration(200).style('opacity', 0);
        })
        .transition()
        .duration(1000)
        .delay(200)
        .attr('width', d => x(d.avgActualProgress));

    // 시간 경과율 레이블
    memberGroups.append('text')
        .attr('x', d => x(d.avgTimeProgress) + 5)
        .attr('y', barHeight / 2 + 4)
        .attr('font-size', '0.7rem')
        .attr('fill', '#6c757d')
        .style('opacity', 0)
        .text(d => `시간 ${d.avgTimeProgress}%`)
        .transition()
        .duration(1000)
        .style('opacity', 1);

    // 실제 진행률 레이블
    memberGroups.append('text')
        .attr('x', d => x(d.avgActualProgress) + 5)
        .attr('y', barHeight + 15)
        .attr('font-size', '0.75rem')
        .attr('font-weight', '600')
        .attr('fill', d => getStatusColor(d.avgActualProgress - d.avgTimeProgress))
        .style('opacity', 0)
        .text(d => `${d.avgActualProgress}%`)
        .transition()
        .duration(1000)
        .delay(200)
        .style('opacity', 1);

    // 상태 아이콘
    memberGroups.append('text')
        .attr('x', width + 5)
        .attr('y', barHeight / 2 + 15)
        .attr('font-size', '1.2rem')
        .style('opacity', 0)
        .text(d => {
            const gap = d.avgActualProgress - d.avgTimeProgress;
            if (gap >= 10) return '⬆';
            if (gap <= -10) return '⬇';
            return '✓';
        })
        .transition()
        .duration(500)
        .delay(1200)
        .style('opacity', 1);

    // Y축 (멤버 이름)
    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .attr('font-size', '0.85rem')
        .attr('fill', '#333');

    // X축
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(10))
        .selectAll('text')
        .attr('font-size', '0.75rem')
        .attr('fill', '#6c757d');

    // X축 레이블
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.85rem')
        .attr('fill', '#6c757d')
        .text('진행률 (%)');

    // 차트 제목
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.95rem')
        .attr('font-weight', '600')
        .attr('fill', '#333')
        .text('멤버별 기간 대비 실제 진척도');

    // 범례 - X축 아래에 배치 (2줄 구조)
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width / 2 - 220}, ${height + 60})`);

    // 첫 번째 줄: 바 색상 범례
    const legendData = [
        { label: '시간 경과율', color: '#adb5bd', opacity: 0.3 },
        { label: '앞서감', color: '#198754', opacity: 1 },
        { label: '정상', color: '#435ebe', opacity: 1 },
        { label: '지연', color: '#dc3545', opacity: 1 }
    ];

    legendData.forEach((item, i) => {
        const legendItem = legend.append('g')
            .attr('transform', `translate(${i * 110}, 0)`);

        legendItem.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', item.color)
            .attr('opacity', item.opacity)
            .attr('rx', 2);

        legendItem.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .attr('font-size', '0.7rem')
            .attr('fill', '#6c757d')
            .text(item.label);
    });

    // 두 번째 줄: 상태 아이콘 설명
    const iconLegend = svg.append('g')
        .attr('class', 'icon-legend')
        .attr('transform', `translate(${width / 2 - 150}, ${height + 85})`);

    const iconData = [
        { icon: '⬆', label: '앞서감', color: '#198754' },
        { icon: '✓', label: '정상 진행', color: '#435ebe' },
        { icon: '⬇', label: '지연됨', color: '#dc3545' }
    ];

    iconData.forEach((item, i) => {
        const iconItem = iconLegend.append('g')
            .attr('transform', `translate(${i * 120}, 0)`);

        iconItem.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('font-size', '1rem')
            .attr('fill', item.color)
            .text(item.icon);

        iconItem.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .attr('font-size', '0.7rem')
            .attr('fill', '#6c757d')
            .text(item.label);
    });

}

/**
 * 빈 차트 그리기
 */
function drawEmptyChart(container) {
    // 기존 내용 제거
    d3.select(container).selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 50, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2 - 60)
        .attr('text-anchor', 'middle')
        .attr('font-size', '3rem')
        .attr('fill', '#dee2e6')
        .text('📊');

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '1rem')
        .attr('fill', '#6c757d')
        .text('진행 중인 업무가 없습니다');

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2 + 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.85rem')
        .attr('fill', '#adb5bd')
        .text('업무가 등록되면 진척도가 표시됩니다');
}
