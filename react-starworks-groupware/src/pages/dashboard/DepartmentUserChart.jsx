import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

/**
 * 데이터 포맷:
 * [
 *   { division: '개발본부', team: '개발1팀', usercount: 42 },
 *   { division: '개발본부', team: '개발2팀', usercount: 26 },
 *   { division: '경영지원본부', team: '인사팀', usercount: 12 },
 *   ...
 * ]
 * 팀 없이 { department, usercount }만 오면 department를 team으로, division='전체'로 처리합니다.
 */
const DeptBarDrilldown = ({ data, width = 780, height = 520, styleVariant = 'flat' }) => {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  const [view, setView] = useState({ level: 'division', division: null });
  const [sortMode, setSortMode] = useState('value'); // 'value' | 'alpha'

  // ---- 데이터 정규화 ----
  const rows = useMemo(() => {
    const src = Array.isArray(data) ? data : [];
    return src.map(d => {
      const division = d.division ?? d.div ?? (d.department ? String(d.department).split(/[>/|:-]\s*/)[0] : '전체');
      const team     = d.team ?? d.dept ?? d.department ?? '미정';
      const count    = Number(d.usercount ?? d.count ?? d.users ?? 0);
      return { division, team, count };
    }).filter(d => d.count >= 0);
  }, [data]);

  const fmt = d3.format(',');

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();

    const margin = { top: 54, right: 150, bottom: 40, left: 160 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = svgEl
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(wrapRef.current)
      .selectAll('div.tooltip')
      .data([null])
      .join('div')
      .attr('class', 'tooltip')
      .style('position', 'fixed')
      .style('pointer-events', 'none')
      .style('background', '#111827')
      .style('color', '#fff')
      .style('padding', '8px 10px')
      .style('border-radius', '8px')
      .style('font-size', '12px')
      .style('opacity', 0);

    // 헤더(뒤로가기/정렬)
    const header = svg.append('g').attr('transform', `translate(${-margin.left}, -24)`);
    if (view.level === 'team' && view.division) {
      header.append('text')
        .attr('x', 0).attr('y', 0)
        .attr('fill', '#2563eb')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .style('cursor', 'pointer')
        .text('← 본부 목록으로')
        .on('click', () => setView({ level: 'division', division: null }));

      header.append('text')
        .attr('x', 120).attr('y', 0)
        .attr('fill', '#6b7280')
        .attr('font-size', 12)
        .text(`현재 본부: ${view.division}`);
    }

    // 정렬 토글
    header.append('text')
      .attr('x', width - margin.right)
      .attr('y', -14)
      .attr('text-anchor', 'end')
      .attr('fill', '#2563eb')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .style('cursor', 'pointer')
      .text(sortMode === 'value' ? '정렬: 인원순(클릭=가나다)' : '정렬: 가나다(클릭=인원순)')
      .on('click', () => setSortMode(m => (m === 'value' ? 'alpha' : 'value')));

    // 색상
    const divSet = Array.from(new Set(rows.map(r => r.division)));
    const teamSet = Array.from(new Set(rows.map(r => r.team)));
    const colorDiv = d3.scaleOrdinal().domain(divSet).range(d3.schemeTableau10);
    const colorTeam = d3.scaleOrdinal().domain(teamSet).range(d3.schemeTableau10);

    // ============= Division View =============
    if (view.level === 'division') {
      // 본부 합계
      const byDiv = Array.from(
        d3.group(rows, r => r.division),
        ([division, items]) => ({ division, sum: d3.sum(items, d => d.count) })
      );

      if (!byDiv.length) {
        svg.append('text')
          .attr('x', innerW / 2).attr('y', innerH / 2)
          .attr('text-anchor', 'middle')
          .text('표시할 데이터가 없습니다.');
        return;
      }

      // 정렬
      byDiv.sort((a, b) => {
        if (sortMode === 'alpha') return d3.ascending(a.division, b.division);
        return d3.descending(a.sum, b.sum);
      });

      const maxVal = d3.max(byDiv, d => d.sum) || 1;
      const toScore = v => (v / maxVal) * 100; // 최대값=100 스코어

      const x = d3.scaleBand()
        .domain(byDiv.map(d => d.division))
        .range([0, innerW])
        .padding(0.18);

      const y = d3.scaleLinear()
        .domain([0, maxVal]) // Y축 도메인을 실제 값으로 설정
        .range([innerH, 0]); // Y축 범위 조정

      // 축
      svg.append('g').attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d => d));
      svg.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `${fmt(d)}명`)); // Y축 라벨 변경
      svg.append('text')
        .attr('x', -margin.left + 10).attr('y', -10) // Y축 라벨 위치 조정
        .attr('text-anchor', 'start')
        .attr('fill', '#6b7280').attr('font-size', 12)
        .text('사용자 수 (명)');

      // 바
      const bars = svg.selectAll('rect.bar')
        .data(byDiv, d => d.division)
        .join(enter => enter.append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.division))
          .attr('y', innerH) // 초기 Y 위치를 아래로 설정
          .attr('width', x.bandwidth())
          .attr('height', 0) // 초기 높이를 0으로 설정
          .attr('rx', styleVariant === 'flat' ? 4 : 8)
          .attr('fill', d => colorDiv(d.division))
          .style('cursor', 'pointer')
          .on('mousemove', (event, d) => {
            tooltip.style('opacity', 1)
              .style('left', `${event.clientX}px`)
              .style('top', `${event.clientY - 16}px`)
              .html(
                `<strong>${d.division}</strong><br/>
                 인원 합계: ${fmt(d.sum)}명<br/>
                 스코어: ${toScore(d.sum).toFixed(1)} / 100<br/>
                 클릭: 팀 상세 보기`
              );
          })
          .on('mouseleave', () => tooltip.style('opacity', 0))
          .on('click', (_, d) => setView({ level: 'team', division: d.division }))
          .call(enter => enter.transition().duration(650).ease(d3.easeCubicOut)
            .attr('y', d => y(d.sum)) // 최종 Y 위치
            .attr('height', d => innerH - y(d.sum)) // 최종 높이
          ),
          update => update.transition().duration(400).ease(d3.easeCubicOut)
            .attr('x', d => x(d.division))
            .attr('y', d => y(d.sum))
            .attr('width', x.bandwidth())
            .attr('height', d => innerH - y(d.sum))
        );

      // 값 라벨 (막대 위)
      svg.selectAll('text.label')
        .data(byDiv, d => d.division)
        .join(enter => enter.append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.division) + x.bandwidth() / 2) // X 위치 조정
          .attr('y', d => y(d.sum) - 6) // Y 위치 조정
          .attr('text-anchor', 'middle')
          .attr('font-size', 12)
          .attr('fill', '#111827')
          .text(d => `${fmt(d.sum)}명`),
          update => update
            .transition().duration(400)
            .attr('x', d => x(d.division) + x.bandwidth() / 2)
            .attr('y', d => y(d.sum) - 6)
            .tween('text', function(d) {
              const self = d3.select(this);
              const target = `${fmt(d.sum)}명`;
              self.text(target);
            })
        );

      // 안내
      svg.append('text')
        .attr('x', innerW / 2).attr('y', -18) // 안내 텍스트 위치 조정
        .attr('text-anchor', 'middle')
        .attr('fill', '#6b7280').attr('font-size', 12)
        .text('본부별 사용자 수 — 막대를 클릭하면 팀 상세로 드릴다운');

      // 범례
      const legend = svg.append('g')
        .attr('transform', `translate(${innerW + 20}, 0)`);

      legend.append('text')
        .attr('y', 0)
        .attr('font-weight', 'bold')
        .attr('font-size', 13)
        .text('본부');

      const legendItems = legend.selectAll('.legend-item')
        .data(byDiv)
        .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20 + 20})`);

      legendItems.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 3)
        .attr('fill', d => colorDiv(d.division));

      legendItems.append('text')
        .attr('x', 16)
        .attr('y', 11)
        .attr('font-size', 12)
        .text(d => d.division);

      return;
    }

    // ============= Team View (선택 본부 내부에서 최대=100) =============
    if (view.level === 'team' && view.division) {
      const inDiv = rows.filter(r => r.division === view.division);
      if (!inDiv.length) {
        svg.append('text')
          .attr('x', innerW / 2).attr('y', innerH / 2)
          .attr('text-anchor', 'middle')
          .text('해당 본부에 팀 데이터가 없습니다.');
        return;
      }

      // 정렬
      inDiv.sort((a, b) => {
        if (sortMode === 'alpha') return d3.ascending(a.team, b.team);
        return d3.descending(a.count, b.count);
      });

      const maxVal = d3.max(inDiv, d => d.count) || 1;
      const toScore = v => (v / maxVal) * 100;

      const x = d3.scaleBand()
        .domain(inDiv.map(d => d.team))
        .range([0, innerW])
        .padding(0.18);

      const y = d3.scaleLinear()
        .domain([0, maxVal]) // Y축 도메인을 실제 값으로 설정
        .range([innerH, 0]); // Y축 범위 조정

      svg.append('g').attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
      svg.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `${fmt(d)}명`)); // Y축 라벨 변경
      svg.append('text')
        .attr('x', -margin.left + 10).attr('y', -10) // Y축 라벨 위치 조정
        .attr('text-anchor', 'start')
        .attr('fill', '#6b7280').attr('font-size', 12)
        .text('사용자 수 (명)');

      // 바
      svg.selectAll('rect.bar')
        .data(inDiv, d => d.team)
        .join(enter => enter.append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.team))
          .attr('y', innerH) // 초기 Y 위치를 아래로 설정
          .attr('width', x.bandwidth())
          .attr('height', 0) // 초기 높이를 0으로 설정
          .attr('rx', styleVariant === 'flat' ? 4 : 8)
          .attr('fill', d => colorTeam(d.team))
          .on('mousemove', (event, d) => {
            tooltip.style('opacity', 1)
              .style('left', `${event.clientX}px`)
              .style('top', `${event.clientY - 16}px`)
              .html(
                `<strong>${view.division}</strong><br/>
                 팀: ${d.team}<br/>
                 사용자: ${fmt(d.count)}명<br/>
                 스코어: ${toScore(d.count).toFixed(1)} / 100`
              );
          })
          .on('mouseleave', () => tooltip.style('opacity', 0))
          .call(enter => enter.transition().duration(650).ease(d3.easeCubicOut)
            .attr('y', d => y(d.count)) // 최종 Y 위치
            .attr('height', d => innerH - y(d.count)) // 최종 높이
          ),
          update => update.transition().duration(400).ease(d3.easeCubicOut)
            .attr('x', d => x(d.team))
            .attr('y', d => y(d.count))
            .attr('width', x.bandwidth())
            .attr('height', d => innerH - y(d.count))
        );

      // 값 라벨
      svg.selectAll('text.label')
        .data(inDiv, d => d.team)
        .join(enter => enter.append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.team) + x.bandwidth() / 2) // X 위치 조정
          .attr('y', d => y(d.count) - 6) // Y 위치 조정
          .attr('dominant-baseline', 'middle')
          .attr('font-size', 12)
          .attr('fill', '#111827')
          .text(d => `${fmt(d.count)}명`),
          update => update
            .transition().duration(400)
            .attr('x', d => x(d.team) + x.bandwidth() / 2)
            .attr('y', d => y(d.count) - 6)
            .tween('text', function(d) {
              const self = d3.select(this);
              const target = `${fmt(d.count)}명`;
              self.text(target);
            })
        );

      svg.append('text')
        .attr('x', innerW / 2).attr('y', -18) // 안내 텍스트 위치 조정
        .attr('text-anchor', 'middle')
        .attr('fill', '#6b7280').attr('font-size', 12)
        .text(`${view.division} — 팀별 사용자 수 (막대 길이: 본부 내 최대=100)`);

      // 범례
      const legend = svg.append('g')
        .attr('transform', `translate(${innerW + 20}, 0)`);

      legend.append('text')
        .attr('y', 0)
        .attr('font-weight', 'bold')
        .attr('font-size', 13)
        .text('팀');

      const legendItems = legend.selectAll('.legend-item')
        .data(inDiv)
        .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20 + 20})`);

      legendItems.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 3)
        .attr('fill', d => colorTeam(d.team));

      legendItems.append('text')
        .attr('x', 16)
        .attr('y', 11)
        .attr('font-size', 12)
        .text(d => d.team);
    }
  }, [rows, view, width, height, sortMode, styleVariant]);

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg ref={svgRef} role="img" aria-label="부서별 사용자 수 막대 드릴다운 (최대=100 정규화)" />
    </div>
  );
};

export default DeptBarDrilldown;
