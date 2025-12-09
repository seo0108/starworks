import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

const ApprovalChart = ({ data, windowSize = 6, height = 360 }) => {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  // ====== (A) 카테고리(템플릿) 정보 추출 ======
  const { categories, nameMap } = useMemo(() => {
    if (!data || !data.length) return { categories: [], nameMap: new Map() };
    const nameMap = new Map();
    const categorySet = new Set();
    data.forEach(d => {
      // 'category' 대신 'templateid'와 'templatename'을 사용합니다.
      if (d.templateid && d.templatename) {
        nameMap.set(d.templateid, d.templatename);
        categorySet.add(d.templateid);
      }
    });
    return { categories: Array.from(categorySet), nameMap };
  }, [data]);

  const displayName = (id) => nameMap.get(id) ?? id;

  // ====== (B) 재생/슬라이더 상태 ======
  const [play, setPlay] = useState(false);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  // ====== (C) 파싱: 월 ======
  const monthsAll = useMemo(() => {
    const months = Array.from(new Set((data || []).map(d => d.month))).sort();
    return months;
  }, [data]);

  // ====== (D) 보이는 월 창 ======
  const visibleMonths = useMemo(() => {
    if (!monthsAll.length) return [];
    const start = Math.min(idx, Math.max(0, monthsAll.length - windowSize));
    return monthsAll.slice(start, start + windowSize);
  }, [monthsAll, idx, windowSize]);

  // ====== (E) 피벗 rows: [{month, [cat1]:val, ...}] ======
  const rows = useMemo(() => {
    if (!data || !visibleMonths.length) return [];
    const map = d3.rollup(
      data.filter(d => visibleMonths.includes(d.month)),
      v => {
        const o = {};
        // 'category' 대신 'templateid'를 기준으로 집계합니다.
        v.forEach(x => { o[x.templateid] = (o[x.templateid] || 0) + (+x.count || 0); });
        return o;
      },
      d => d.month
    );
    return visibleMonths.map(m => ({ month: m, ...(map.get(m) || {}) }));
  }, [data, visibleMonths]);

  // ====== (F) 반응형 width ======
  const [width, setWidth] = useState(800);
  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setWidth(Math.max(520, e.contentRect.width));
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // ====== (G) 렌더 ======
  const [chartMode, setChartMode] = useState('grouped'); // 'grouped' | 'stacked'

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();

    if (!data || !data.length || !visibleMonths.length) {
      svgEl.attr('width', width).attr('height', height)
        .append('text')
        .attr('x', width / 2).attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .text('데이터가 없습니다.');
      return;
    }

    const margin = { top: 24, right: 140, bottom: 56, left: 60 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = svgEl
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 스케일
    const y0 = d3.scaleBand()
      .domain(visibleMonths)
      .range([0, innerH])
      .paddingInner(0.2);

    // x 도메인: (단순화) 누적 최댓값 기반
    const x = d3.scaleLinear()
      .domain([0, d3.max(rows, r => d3.sum(categories, c => +r[c] || 0)) || 0]).nice()
      .range([0, innerW]);

    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeTableau10);

    const fmt = d3.format(',');
    const parseYM = d3.timeParse('%Y-%m');

    // ===== Y축 (10월 강조) =====
    const yAxis = d3.axisLeft(y0)
      .tickFormat(m => d3.timeFormat('%-m월')(parseYM(m)));

    const gy = svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    gy.selectAll('.tick text')
      .style('font-size', '12px');
    gy.selectAll('.tick')
      .filter(d => {
        const dt = parseYM(d);
        return dt && dt.getMonth() === 9; // 10월 강조
      })
      .select('text')
      .style('font-size', '14px')
      .style('font-weight', '700')
      .attr('dx', '-0.5em');

    // X축
    svg.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .attr('class', 'x-axis')
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => fmt(d)));

    // 그리드
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisBottom(x).tickSize(-innerH).tickFormat(''))
      .selectAll('line').attr('stroke', '#e5e7eb');

    // 그룹 컨테이너
    const monthG = svg.selectAll('.month')
      .data(rows, d => d.month)
      .join(enter => enter.append('g').attr('class', 'month')
        .attr('transform', d => `translate(0,${y0(d.month)})`),
        update => update.attr('transform', d => `translate(0,${y0(d.month)})`)
      );

    if (chartMode === 'grouped') {
      // ====== 그룹형 막대 ======
      const y1 = d3.scaleBand()
        .domain(categories)
        .range([0, y0.bandwidth()])
        .padding(0.12);

      const rects = monthG.selectAll('rect.bar')
        .data(d => categories.map(c => ({ month: d.month, category: c, value: +d[c] || 0 })), d => d.category);

      rects.join(
        enter => enter.append('rect')
          .attr('class', 'bar')
          .attr('y', d => y1(d.category))
          .attr('x', x(0))
          .attr('height', y1.bandwidth())
          .attr('width', 0)
          .attr('fill', d => color(d.category))
          .transition().duration(600).ease(d3.easeCubicOut)
          .attr('x', x(0))
          .attr('width', d => x(d.value) - x(0)),
        update => update
          .transition().duration(600).ease(d3.easeCubicOut)
          .attr('y', d => y1(d.category))
          .attr('x', x(0))
          .attr('height', y1.bandwidth())
          .attr('width', d => x(d.value) - x(0))
      );

      // 값 라벨
      monthG.selectAll('text.label')
        .data(d => categories.map(c => ({ month: d.month, category: c, value: +d[c] || 0 })))
        .join(
          enter => enter.append('text')
            .attr('class', 'label')
            .attr('y', d => y1(d.category) + y1.bandwidth() / 2)
            .attr('x', d => x(d.value) + 6)
            .attr('dominant-baseline', 'middle')
            .attr('font-size', 11)
            .attr('text-anchor', 'start')
            .attr('fill', '#111827')
            .style('opacity', 0)
            .text(d => d.value ? fmt(d.value) : '')
            .transition().duration(300).style('opacity', 1),
          update => update
            .transition().duration(600)
            .attr('y', d => y1(d.category) + y1.bandwidth() / 2)
            .attr('x', d => x(d.value) + 6)
            .text(d => d.value ? fmt(d.value) : '')
        );
    } else {
      // ====== 누적형 막대 (수정 핵심) ======
      // 1) 스택 생성
      const stack = d3.stack().keys(categories);
      const stacked = stack(rows); // [series(category)][monthIndex] => [x0, x1] with data=rows[i]
      // 키 주입
      stacked.forEach(series => {
        series.forEach(seg => { seg.key = series.key; });
      });
      // 월 인덱스 맵
      const monthIndex = new Map(rows.map((r, i) => [r.month, i]));

      // 2) 각 월 그룹에 "그 월의 모든 세그먼트"를 바인딩
      const rects = monthG.selectAll('rect.bar')
        .data(d => {
          const i = monthIndex.get(d.month);
          return stacked.map(series => {
            const seg = series[i]; // [x0, x1] with seg.data = rows[i]
            return { ...seg, key: series.key, month: d.month };
          });
        }, d => `${d.month}__${d.key}`);

      rects.join(
        enter => enter.append('rect')
          .attr('class', 'bar')
          .attr('y', y0.bandwidth() / 4) // 막대 중앙
          .attr('x', d => x(d[0]))
          .attr('height', y0.bandwidth() / 2)
          .attr('width', 0)
          .attr('fill', d => color(d.key))
          .transition().duration(600).ease(d3.easeCubicOut)
          .attr('x', d => x(d[0]))
          .attr('width', d => x(d[1]) - x(d[0])),
        update => update
          .transition().duration(600).ease(d3.easeCubicOut)
          .attr('y', y0.bandwidth() / 4)
          .attr('x', d => x(d[0]))
          .attr('height', y0.bandwidth() / 2)
          .attr('width', d => x(d[1]) - x(d[0]))
      );

      // 3) 총합 라벨
      monthG.selectAll('text.label')
        .data(d => [{
          month: d.month,
          total: d3.sum(categories, c => +d[c] || 0),
          lastValueX: x(d3.sum(categories, c => +d[c] || 0))
        }])
        .join(
          enter => enter.append('text')
            .attr('class', 'label')
            .attr('y', y0.bandwidth() / 2)
            .attr('x', d => d.lastValueX + 6)
            .attr('dominant-baseline', 'middle')
            .attr('font-size', 11)
            .attr('text-anchor', 'start')
            .attr('fill', '#111827')
            .style('opacity', 0)
            .text(d => d.total ? fmt(d.total) : '')
            .transition().duration(300).style('opacity', 1),
          update => update
            .transition().duration(600)
            .attr('y', y0.bandwidth() / 2)
            .attr('x', d => d.lastValueX + 6)
            .text(d => d.total ? fmt(d.total) : '')
        );
    }

    // 툴팁
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

    svg.selectAll('rect.bar')
      .on('mousemove', (event, d) => {
        // d.month는 우리가 주입했음, seg.data.month도 존재
        const monthStr = d.month || (d.data && d.data.month);
        const date = parseYM(monthStr);
        const mm = date ? d3.timeFormat('%Y년 %-m월')(date) : monthStr;
        const category = d.category || d.key;
        const value = (typeof d.value === 'number') ? d.value : (d[1] - d[0]);

        tooltip
          .style('opacity', 1)
          .style('left', `${event.clientX}px`)
          .style('top', `${event.clientY - 18}px`)
          .html(`<strong>${mm}</strong><br/>양식: ${displayName(category)}<br/>사용건수: ${fmt(value)}`);
      })
      .on('mouseleave', () => tooltip.style('opacity', 0));

    // 범례
    const legend = svg.append('g').attr('transform', `translate(${innerW + 16}, 0)`);
    const leg = legend.selectAll('g.item')
      .data(categories)
      .join('g')
      .attr('class', 'item')
      .attr('transform', (_, i) => `translate(0, ${i * 20})`)
      .style('cursor', 'pointer');

    leg.append('rect')
      .attr('width', 14).attr('height', 14)
      .attr('fill', c => color(c))
      .attr('stroke', '#e5e7eb');

    leg.append('text')
      .attr('x', 18).attr('y', 10)
      .attr('font-size', 12)
      .text(c => displayName(c));
  }, [data, rows, visibleMonths, categories, width, height, chartMode]);

  // ====== (H) 재생 타이머 ======
  useEffect(() => {
    if (!play) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    if (!monthsAll.length) return;
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        const next = prev + 1;
        const maxStart = Math.max(0, monthsAll.length - windowSize);
        return next > maxStart ? 0 : next;
      });
    }, 1200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [play, monthsAll.length, windowSize]);

  const maxStart = Math.max(0, monthsAll.length - windowSize);
  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button
          type="button"
          className="btn btn-sm me-2"
          onClick={() => setChartMode('grouped')}
          style={{ backgroundColor: chartMode === 'grouped' ? '#007bff' : '#e9ecef', color: chartMode === 'grouped' ? 'white' : 'black' }}
        >
          그룹형
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setChartMode('stacked')}
          style={{ backgroundColor: chartMode === 'stacked' ? '#007bff' : '#e9ecef', color: chartMode === 'stacked' ? 'white' : 'black' }}
        >
          누적형
        </button>
      </div>
      <svg ref={svgRef} role="img" aria-label={`결재양식 월간 사용(${chartMode === 'grouped' ? '그룹' : '누적'})`} />
    </div>
  );
};

export default ApprovalChart;
