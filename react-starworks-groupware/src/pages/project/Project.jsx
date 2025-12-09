import React, { useEffect, useState } from 'react';
import ProjectChart from './ProjectChart';
import ProjectTable from './ProjectTable';
import axiosInst from '../../api/apiClient';

const ProjectStatistics = () => {
  const [projects, setProjects] = useState([]);
  const [timeView, setTimeView] = useState('month');

  // 프로젝트 목록 조회
  useEffect(() => {
    loadProjects();
  }, []);

  // 프로젝트 목록 조회 : 서버에서 프로젝트 목록을 가져옴
  const loadProjects = () => {
    axiosInst.get("/project") //api 호출
    .then((res) => { // 성공 시 (데이터 변환)
      // 날짜 문자열 → Date 객체 변환
      const projectsWithDates = res.data.map(project => ({ 
        ...project, // 기존 필드 복사
        strtBizDt: new Date(project.strtBizDt),
        endBizDt: new Date(project.endBizDt)
      }));

      setProjects(projectsWithDates); // 상태 업데이트
    })
    // 실패 시 (에러 처리)
    .catch((err) => console.error("프로젝트 목록 조회 실패:", err));
  };

  return (
    <div className="content-wrapper container">
      <div className="page-heading">
        <h3>프로젝트 관리</h3>
        <p className="text-muted">연도별/분기별/월별/주별 통계와 전체 프로젝트 목록을 확인할 수 있습니다.</p>
      </div>
      <div className="page-content">
        {/* 차트 컴포넌트 */}
        <ProjectChart 
          projects={projects} 
          timeView={timeView}
          setTimeView={setTimeView}
        />

        {/* 테이블 컴포넌트 */}
        <ProjectTable 
          projects={projects}
          onReload={loadProjects}
        />
      </div>
    </div>
  );
};

export default ProjectStatistics;