import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ProjectChart = ({ projects, timeView, setTimeView }) => {
  // DOM 요소 참조
  const chartRef = useRef(null); //차트를 그릴 영역
  const tooltipRef = useRef(null); //마우스 오버 시 표시할 클립
  
  // 필터 상태
  const [selectedYear, setSelectedYear] = React.useState('all'); // 특정 연도 선택
  const [selectedQuarter, setSelectedQuarter] = React.useState('all'); // 특정 분기 선택
  const [selectedMonth, setSelectedMonth] = React.useState('all'); // 특정 월 선택
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState(null); // 특정 상태만 보기
  const [yearRange, setYearRange] = React.useState(5); // 연도별은 최근 N년
  const [monthRange, setMonthRange] = React.useState(24); // 월별은 최근 N개월
  const [weekRange, setWeekRange] = React.useState(24); // 주별은 최근 N주

  useEffect(() => {
    // 데이터가 없으면 중단
    if (projects.length === 0 || !chartRef.current) return;

    // 프로젝트 상태 목록 (차트 레이어 순서)
    const allKeys = ['승인대기', '진행중', '보류', '완료', '취소'];

    // 기존 차트 제거 (재렌더링 시 차트 중복 방지)
    d3.select(chartRef.current) //div 선택
      .selectAll('*') // 그 안의 모든 요소 선택
      .remove(); // 제거

    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const containerWidth = chartRef.current.offsetWidth; // 컨테이너의 실제 너비
    const width = containerWidth - margin.left - margin.right; // 차트 영역 너비
    const height = 400 - margin.top - margin.bottom; // 차트 영역 높이

    // SVG 캔버스 생성
    const svg = d3.select(chartRef.current)
      .append('svg') // <svg></svg> 가 추가됨
      .attr('width', containerWidth) // SVG 전체 너비
      .attr('height', 400) // SVG 전체 높이
      .append('g') // <g></g> 그룹 요소 추가
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 툴팁 생성
    const tooltip = d3.select(tooltipRef.current);

    // 시간 단위별 데이터 집계
    const aggregateData = () => {
      // Map 자료구조로 데이터 저장 (키: 날짜, 값: 상태별 카운트)
      const dataMap = new Map();

      // 각 프로젝트를 순회하며 데이터 집계
      projects.forEach(project => {
        // 날짜와 상태 추출
        const start = new Date(project.strtBizDt);
        const end = new Date(project.endBizDt);
        const status = getStatusText(project.bizSttsCd); // 상태 코드를 텍스트로 변환
        
        // 시작일부터 종료일까지 반복
        let current = new Date(start);
        while (current <= end) {
          let key; // 시간 단위에 따라 키 생성
          
          switch(timeView) {
            case 'year':
              key = current.getFullYear().toString();
              break;
            case 'quarter':
              const quarter = Math.floor(current.getMonth() / 3) + 1;
              key = `${current.getFullYear()}-Q${quarter}`;
              break;
            case 'month':
              key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
              if (timeView === 'month');
              break;
            case 'week':
              const weekNum = Math.ceil((current.getDate() + 6 - current.getDay()) / 7);
              key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-W${weekNum}`;
              break;
          }
          
          // 해당 키가 Map에 없으면 초기화 (모든 상태 0으로)
          if (!dataMap.has(key)) {
            dataMap.set(key, { date: key, 진행중: 0, 승인대기: 0, 보류: 0, 완료: 0, 취소: 0 });
          }
          
          // 상태에 따라 해당 카운트 1 증가
          if (status === '진행' || status === '진행중') {
            dataMap.get(key)['진행중']++;
          } else if (status === '승인 대기' || status === '승인대기') {
            dataMap.get(key)['승인대기']++;
          } else if (status === '보류') {
            dataMap.get(key)['보류']++;
          } else if (status === '완료') {
            dataMap.get(key)['완료']++;
          } else if (status === '취소') {
            dataMap.get(key)['취소']++;
          }
          
          // 다음 기간으로 이동 (연도별은 1년, 월별은 1개월...)
          switch(timeView) {
            case 'year':
              current.setFullYear(current.getFullYear() + 1);
              break;
            case 'quarter':
              current.setMonth(current.getMonth() + 3);
              break;
            case 'month':
              current.setMonth(current.getMonth() + 1);
              break;
            case 'week':
              current.setDate(current.getDate() + 7);
              break;
          }
        }
      });
      
      // Map을 배열로 변환하고 날짜순으로 정렬
      let sortedData = Array.from(dataMap.values())
                            .sort((a, b) => a.date.localeCompare(b.date));

      // 연도별 뷰 필터
      if (timeView === 'year') {
        if (selectedYear !== 'all') {
          // 특정 연도만 선택
          console.log('년도 필터 적용:', selectedYear);
          sortedData = sortedData.filter(d => d.date === selectedYear);
        } else if (yearRange !== 0) { 
          // 최근 N년
          console.log('최근 N년 필터 적용:', yearRange);
          const currentYear = new Date().getFullYear();
          sortedData = sortedData.filter(d => {
            const year = parseInt(d.date); // '2024' → 2024
            return year >= currentYear - yearRange + 1 && year <= currentYear;
          });
        }
        // 분기별 뷰 필터
      } else if (timeView === 'quarter' && selectedQuarter !== 'all') {
        console.log('분기 필터 적용:', selectedQuarter);
        sortedData = sortedData.filter(d => d.date === selectedQuarter);
        // 월별 뷰 필터
      } else if (timeView === 'month') { 
        if (selectedMonth !== 'all') {
          console.log('월 필터 적용:', selectedMonth);
          // 특정 월만 선택
          sortedData = sortedData.filter(d => d.date === selectedMonth);
        } else if (monthRange !== 0) { 
          // 최근 N개월
          console.log('최근 N개월 필터 적용:', monthRange);
          const currentDate = new Date();
          sortedData = sortedData.filter(d => {
            const [year, month] = d.date.split('-').map(Number);
            const itemDate = new Date(year, month - 1, 1); 
            const monthRangeAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthRange, 1);
            return itemDate >= monthRangeAgo && itemDate <= currentDate;
          });
        }
      }
      
      // 주별 뷰 필터
      if (timeView === 'week') {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간 초기화

        // 현재 또는 과거 데이터만
        sortedData = sortedData.filter(d => {
          const [itemYear, itemMonth] = d.date.split('-').map(Number);
          const itemDate = new Date(itemYear, itemMonth - 1, 1);

          return itemDate.getFullYear() < today.getFullYear() ||
                 (itemDate.getFullYear() === today.getFullYear() && itemDate.getMonth() <= today.getMonth());
        });

        // 최근 N주만 (너무 많으면 뒤에서 N개만 자르기)
        if (sortedData.length > weekRange) {
          sortedData = sortedData.slice(-weekRange);
        }
      }
      // 집계된 데이터 가져오기
      return sortedData;
    };

    const data = aggregateData();
    
    // 데이터가 없으면 안내 메시지 표시
    if (data.length === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', '#999')
        .text('선택한 기간에 데이터가 없습니다.');
      return;
    }
    // 스택할 키 결정 (상태 필터가 있으면 해당 상태만, 없으면 전체)
    const keysToStack = selectedStatusFilter ? [selectedStatusFilter] : allKeys;
    // D3 스택 레이아웃 적용 (여러 상태를 누적 형태로 변환)
    const stackedData = d3.stack().keys(keysToStack)(data);

    // 스케일 설정
    // scaleBand : 카테고리형 데이터를 균등하게 나누는 스케일
    const x = d3.scaleBand()
      .domain(data.map(d => d.date))    // 입력 범위: ['2024-01', '2024-02', ...]
      .range([0, width])                // 출력 범위: 0 ~ width 픽셀
      .padding(0.2);                    // 막대 사이 간격 20%

      // Y축 최대값 계산
    const maxValue = d3.max(stackedData[stackedData.length - 1], d => d[1]) || 1;
    // Y축 스케일: 프로젝트 수 → 세로 위치(픽셀)
    const y = d3.scaleLinear()
      .domain([0, maxValue])            // 입력 범위: 0 ~ 최대값
      .nice()                           // 깔끔한 숫자로 반올림 (13 → 15)
      .range([height, 0]);              // 출력 범위: height ~ 0 (SVG는 위가 0이라 거꾸로)

    // 색상 스케일
    const color = d3.scaleOrdinal()
      .domain(allKeys)  // 입력: ['승인대기', '진행중', ...]
      .range(['#B5A8D5', '#8C00FF', '#BDBDBD', '#211C84', '#FF3F7F']);



    // X축 그리기
    svg.append('g')
      .attr('transform', `translate(0,${height})`)  // 차트 아래쪽으로 이동
      .call(d3.axisBottom(x))                       // X축 생성 (아래쪽 눈금)
      .selectAll('text')                            // 모든 레이블 선택
      .attr('transform', 'rotate(-45)')             // -45도 회전
      .style('text-anchor', 'end')                  // 오른쪽 정렬
      .style('font-size', '11px');

    // Y축 그리기
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5)) // Y축 생성, 눈금 약 5개
      .style('font-size', '12px');

    // Y축 레이블
    svg.append('text')
      .attr('transform', 'rotate(-90)')       // 90도 회전 (세로로)
      .attr('y', -50)                         // 왼쪽으로 50px
      .attr('x', -height / 2)                 // 차트 중앙
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .text('누적 프로젝트 수');

    // 차트 제목
    svg.append('text')
      .attr('x', width / 2)               //가로 중앙
      .attr('y', -20)                     // 위쪽에
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(`${getTimeViewLabel()} 프로젝트 현황`);


    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 툴팁 함수
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // 툴팁 표시 함수
    const showTooltip = (event, d, key) => {
      const count = d.data[key]; // 해당 상태의 개수
      const total = allKeys.reduce((sum, k) => sum + (d.data[k] || 0), 0);
      
      tooltip
        .style('opacity', 1)                        // 보이게
        .style('left', `${event.pageX + 10}px`)     // 마우스 오른쪽
        .style('top', `${event.pageY - 10}px`)      // 마우스 위쪽
        .html(`
          <div style="font-weight: 600; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
            ${d.data.date}
          </div>
          <div style="margin-bottom: 3px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: ${color(key)}; margin-right: 5px; border-radius: 2px;"></span>
            <strong>${key}:</strong> ${count}개
          </div>
          <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">
            전체: ${total}개
          </div>
        `);
    };

    // 툴팁 숨김
    const hideTooltip = () => {
      tooltip.style('opacity', 0);
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 차트 그리기 (시간 단위별로 다른 차트 타입)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // 연도별, 분기별 → 스택 막대 그래프
    if (timeView === 'year' || timeView === 'quarter') {
      // 막대 그래프
      svg.selectAll('.bar-layer')
        .data(stackedData)                    // 스택 데이터 바인딩
        .join('g')                            // 각 상태별로 그룹 생성
        .attr('class', 'bar-layer')           
        .attr('fill', d => color(d.key))      // 상태별 색상
        .selectAll('rect')                    // 각 그룹 안에 사각형들
        .data(d => d)                         // 날짜별 데이터
        .join('rect')                         // 사각형 생성
        .attr('x', d => x(d.data.date))       // x 좌표
        .attr('y', d => y(d[1]))              // y 좌표 (상단)
        .attr('height', d => y(d[0]) - y(d[1])) // 높이 (하단 - 상단)
        .attr('width', x.bandwidth())         // 너비 (막대 폭)
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        // 마우스 오버 시 불투명도 증가 + 툴팁 표시
        .on('mouseover', function(event, d) {
          d3.select(this).style('opacity', 1);
          const key = d3.select(this.parentNode).datum().key;
          showTooltip(event, d, key);
        })
        .on('mousemove', function(event, d) {
          const key = d3.select(this.parentNode).datum().key;
          showTooltip(event, d, key);
        })
        .on('mouseout', function() {
          d3.select(this).style('opacity', 0.8);
          hideTooltip();
        });

    // 월별 → 영역 차트 (단, 데이터 1개면 막대)    
    } else if (timeView === 'month') {
      // 데이터가 1개면 막대 그래프, 2개 이상이면 영역 차트
      if (data.length === 1) {
        // 막대 그래프로 표시
        svg.selectAll('.bar-layer')
          .data(stackedData)
          .join('g')
          .attr('class', 'bar-layer')
          .attr('fill', d => color(d.key))
          .selectAll('rect')
          .data(d => d)
          .join('rect')
          .attr('x', d => x(d.data.date))
          .attr('y', d => y(d[1]))
          .attr('height', d => y(d[0]) - y(d[1]))
          .attr('width', x.bandwidth())
          .style('opacity', 0.8)
          .style('cursor', 'pointer')
          .on('mouseover', function(event, d) {
            d3.select(this).style('opacity', 1);
            const key = d3.select(this.parentNode).datum().key;
            showTooltip(event, d, key);
          })
          .on('mousemove', function(event, d) {
            const key = d3.select(this.parentNode).datum().key;
            showTooltip(event, d, key);
          })
          .on('mouseout', function() {
            d3.select(this).style('opacity', 0.8);
            hideTooltip();
          });
      } else {
        // 데이터 2개 이상 → 스택 영역 차트
        const area = d3.area()
          .x(d => x(d.data.date) + x.bandwidth() / 2)   // x: 막대 중앙
          .y0(d => y(d[0]))                             // 아래 경계선
          .y1(d => y(d[1]))                             // 위 경계선
          .curve(d3.curveMonotoneX);                    // 부드러운 곡선

        // 영역 그리기
        svg.selectAll('.area-layer')
          .data(stackedData)
          .join('path')                         // path 요소로 (면적)
          .attr('class', 'area-layer')
          .attr('fill', d => color(d.key))
          .attr('d', area)                      // area 함수로 경로 생성
          .style('opacity', 0.7)
          .style('cursor', 'pointer');

        // 영역 위에 투명한 사각형 오버레이 (마우스 이벤트 감지용)
        svg.selectAll('.overlay')
          .data(data) 
          .join('rect')
          .attr('class', 'overlay')
          .attr('x', d => x(d.date))
          .attr('y', 0)
          .attr('width', x.bandwidth())
          .attr('height', height)
          .style('fill', 'none')               // 투명
          .style('pointer-events', 'all')      // 마우스 이벤트는 받음
          .on('mouseover', function(event, d) {
            // 모든 상태의 데이터를 툴팁에 표시
            let tooltipHtml = `<div style="font-weight: 600; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">${d.date}</div>`;
            let total = 0;
            allKeys.forEach(key => {
              const count = d[key] || 0;
              total += count;
              tooltipHtml += `
                <div style="margin-bottom: 3px;">
                  <span style="display: inline-block; width: 12px; height: 12px; background: ${color(key)}; margin-right: 5px; border-radius: 2px;"></span>
                  <strong>${key}:</strong> ${count}개
                </div>
              `;
            });
            tooltipHtml += `<div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">전체: ${total}개</div>`;

            tooltip
              .style('opacity', 1)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 10}px`)
              .html(tooltipHtml);
          })
          .on('mouseout', hideTooltip);
        // 영역 차트의 포인트 레이어 제거 (필요 없음)  
        svg.selectAll('.area-point-layer').remove();
      }
    // 주별 → 선 그래프  
    } else if (timeView === 'week') {
      // 선 생성기
      const line = d3.line()
        .x(d => x(d.data.date) + x.bandwidth() / 2) // x: 막대 중앙
        .y(d => y(d[1]))                            // y: 누적 상단값
        .curve(d3.curveMonotoneX);                  // 부드러운 곡선

      // 선 그리기
      svg.selectAll('.line-layer')
        .data(stackedData)
        .join('path')
        .attr('class', 'line-layer')
        .attr('fill', 'none')                 // 채우기 없음 (선만)
        .attr('stroke', d => color(d.key))    // 선 색상
        .attr('stroke-width', 2.5)            // 선 두께
        .attr('d', line)                      // line 함수로 경로 생성
        .style('opacity', 0.8)
        .on('mouseover', function() {
          d3.select(this)
            .style('opacity', 1)
            .attr('stroke-width', 3.5);       // 두꺼워짐
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('opacity', 0.8)
            .attr('stroke-width', 2.5);       // 원래대로
          hideTooltip();
        });

      // 선 그래프의 각 포인트에 점 추가
      svg.selectAll('.dot-layer')
        .data(stackedData)
        .join('g')
        .attr('class', 'dot-layer')
        .attr('fill', d => color(d.key))
        .selectAll('circle')
        .data(d => d.map(point => ({ ...point, key: d.key }))) // 각 점에 상태(key) 정보 추가
        .join('circle')
        .attr('cx', d => x(d.data.date) + x.bandwidth() / 2)   // 원 중심 x
        .attr('cy', d => y(d[1]))                              // 원 중심 y
        .attr('r', 4)                                          // 반지름
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 6).style('opacity', 1);
          showTooltip(event, d, d.key);
        })
        .on('mousemove', function(event, d) {
          showTooltip(event, d, d.key);
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 4).style('opacity', 0.8);
          hideTooltip();
        });
    }
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 범례 (우측 상단)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`); // 차트 오른쪽

    allKeys.forEach((key, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`) // 세로로 25px씩 간격
        .style('cursor', 'pointer') 
        .on('click', () => { 
          // 범례 클릭 시 해당 상태만 필터링 (토글)
          setSelectedStatusFilter(selectedStatusFilter === key ? null : key);
        });

      // 색상 사각형
      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(key))
        .style('opacity', 0.7);

      // 상태명 텍스트
      legendRow.append('text')
        .attr('x', 20)  // 사각형 오른쪽
        .attr('y', 12)  // 세로 중앙
        .style('font-size', '13px')
        .text(key);
    });

  }, [projects, timeView, selectedYear, selectedQuarter, selectedMonth, weekRange, selectedStatusFilter, yearRange, monthRange]);
  // ↑ 이 값들 중 하나라도 바뀌면 useEffect 재실행 (차트 다시 그림)

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 헬퍼 함수들 (JSX에서 사용)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 사용 가능한 연도 목록 (중복 제거, 최신순)
  const getAvailableYears = () => {
    const years = new Set();
    projects.forEach(project => {
      const start = new Date(project.strtBizDt);
      const end = new Date(project.endBizDt);
      years.add(start.getFullYear());
      years.add(end.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a); // 최신 년도부터 (내림차순)
  };

  // 사용 가능한 분기 목록
  const getAvailableQuarters = () => {
    const quarters = new Set();
    projects.forEach(project => {
      const start = new Date(project.strtBizDt);
      const end = new Date(project.endBizDt);
      
      let current = new Date(start);
      while (current <= end) {
        const quarter = Math.floor(current.getMonth() / 3) + 1;
        quarters.add(`${current.getFullYear()}-Q${quarter}`);
        current.setMonth(current.getMonth() + 3);
      }
    });
    return Array.from(quarters).sort((a, b) => b.localeCompare(a)); // 최신부터
  };

  // 사용 가능한 월 목록
  const getAvailableMonths = () => {
    const months = new Set();
    projects.forEach(project => {
      const start = new Date(project.strtBizDt);
      const end = new Date(project.endBizDt);
      
      let current = new Date(start);
      while (current <= end) {
        const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
        months.add(key);
        current.setMonth(current.getMonth() + 1);
      }
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a)); // 최신부터
  };

  const getTimeViewLabel = () => {
    const labels = {
      year: '연도별',
      quarter: '분기별',
      month: '월별',
      week: '주별'
    };
    return labels[timeView] || '';
  };

  // 상태 코드를 한글 텍스트로 변환
  const getStatusText = (status) => {
    // 이미 텍스트면 그대로 반환
    if (status === '승인 대기' || status === '진행' || status === '보류' || 
        status === '완료' || status === '취소') {
      return status;
    }
    
    // 코드면 매핑
    const statusMap = {
      'B301': '승인 대기',
      'B302': '진행',
      'B303': '보류',
      'B304': '완료',
      'B305': '취소',
      'STTS01': '진행중',
      'STTS02': '완료',
      'STTS03': '취소'
    };
    return statusMap[status] || status || '알 수 없음';
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // JSX 렌더링 (UI)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  

  return (
    <div className="card mb-4">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title mb-0">프로젝트 통계</h4>
          <div className="d-flex gap-2">
            <button 
              className={`btn btn-sm ${timeView === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => {
                setTimeView('year');      // 부모의 timeView 변경
                setSelectedYear('all');   // 필터 초기화
              }}
            >
              연도별
            </button>
            <button 
              className={`btn btn-sm ${timeView === 'quarter' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => {
                setTimeView('quarter');
                setSelectedQuarter('all');
              }}
            >
              분기별
            </button>
            <button 
              className={`btn btn-sm ${timeView === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => {
                setTimeView('month');
                setSelectedMonth('all');
              }}
            >
              월별
            </button>
            <button 
              className={`btn btn-sm ${timeView === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTimeView('week')}
            >
              주별
            </button>
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="d-flex gap-2 align-items-center flex-wrap">
          {timeView === 'year' && (
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0 text-muted small">년도 선택:</label>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="all">전체</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>

              <label className="mb-0 text-muted small">표시 기간:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={yearRange}
                onChange={(e) => setYearRange(Number(e.target.value))}
              >
                <option value={5}>최근 5년</option>
                <option value={10}>최근 10년</option>
                <option value={0}>전체</option> 
              </select>
            </div>
          )}

          {timeView === 'quarter' && (
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0 text-muted small">분기 선택:</label>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
              >
                <option value="all">전체</option>
                {getAvailableQuarters().slice(0, 20).map(quarter => (
                  <option key={quarter} value={quarter}>{quarter}</option>
                ))}
              </select>
              <span className="badge bg-info text-white">최근 20개 분기</span>
            </div>
          )}

          {timeView === 'month' && (
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0 text-muted small">월 선택:</label>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">전체</option>
                {getAvailableMonths().slice(0, 24).map(month => ( 
                  <option key={month} value={month}>
                    {month.split('-')[0]}년 {month.split('-')[1]}월
                  </option>
                ))}
              </select>

              <label className="mb-0 text-muted small">표시 기간:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={monthRange}
                onChange={(e) => setMonthRange(Number(e.target.value))}
              >
                <option value={12}>최근 12개월</option>
                <option value={24}>최근 24개월</option>
                <option value={36}>최근 36개월</option>
                <option value={0}>전체</option> 
              </select>
            </div>
          )}

          {timeView === 'week' && (
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0 text-muted small">표시 기간:</label>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={weekRange}
                onChange={(e) => setWeekRange(Number(e.target.value))}
              >
                <option value={8}>최근 8주</option>
                <option value={12}>최근 12주 (3개월)</option>
                <option value={24}>최근 24주 (6개월)</option>
                <option value={52}>최근 52주 (1년)</option>
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="card-body" style={{ position: 'relative' }}>
        <div ref={chartRef} style={{ width: '100%', minHeight: '400px' }}></div>
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            opacity: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            pointerEvents: 'none',
            fontSize: '13px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            transition: 'opacity 0.2s'
          }}
        />
      </div>
    </div>
  );
};

export default ProjectChart;