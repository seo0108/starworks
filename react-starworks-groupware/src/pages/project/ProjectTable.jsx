import React, { useState } from 'react';
import axiosInst from '../../api/apiClient';

const ProjectTable = ({ projects, onReload }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchWord, setSearchWord] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState({ participants: [], viewers: [] });
  
  // 검색된 프로젝트를 저장할 state 추가
  const [searchedProjects, setSearchedProjects] = useState(null);
  
  const itemsPerPage = 10;

  // 프로젝트 상태 코드
  const getStatusText = (status) => {
    if (status === '승인 대기' || status === '진행' || status === '보류' || 
        status === '완료' || status === '취소') {
      return status;
    }
    
    const statusMap = {
      'B301': '승인 대기',
      'B302': '진행',
      'B303': '보류',
      'B304': '완료',
      'B305': '취소'
    };
    return statusMap[status] || status || '알 수 없음';
  };

  // 상태에 따른 배지 색상 클래스 반환
  const getStatusBadgeClass = (status) => {
    const textToClass = {
      '승인 대기': 'bg-warning',
      '진행': 'bg-primary',
      '보류': 'bg-secondary',
      '완료': 'bg-success',
      '취소': 'bg-danger'
    };
    
    const codeToClass = {
      'B301': 'bg-warning',
      'B302': 'bg-primary',
      'B303': 'bg-secondary',
      'B304': 'bg-success',
      'B305': 'bg-danger'
    };
    
    return textToClass[status] || codeToClass[status] || 'bg-secondary';
  };

  // 프로젝트 상세 클릭 시 멤버 조회
  const handleProjectDetail = (project) => {
    setSelectedProject(project);
    
    axiosInst.get(`/project/${project.bizId}/members`)
      .then((res) => {
        const participants = res.data
          .filter(m => m.bizAuthCd === 'B102')
          .map(m => ({
            userId: m.bizUserId,
            userNm: m.bizUserNm,      
            jbgdNm: m.bizUserJobNm,   
            deptNm: m.bizUserDeptNm,  
            authNm: m.bizAuthNm
          }));
        
        const viewers = res.data
          .filter(m => m.bizAuthCd === 'B103')
          .map(m => ({
            userId: m.bizUserId,
            userNm: m.bizUserNm,      
            jbgdNm: m.bizUserJobNm,   
            deptNm: m.bizUserDeptNm   
          }));
        
        setProjectMembers({ participants, viewers });

        // API 호출 성공 후 모달 열기
      const modalElement = document.getElementById('projectDetailModal');
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();

      })
      .catch((err) => console.error('멤버 조회 실패:', err));
  };

  // 복원 처리
  const handleRestoreProject = () => {
  Swal.fire({
    title: '프로젝트 복원',
    text: '프로젝트를 복원하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0d6efd',
    cancelButtonColor: '#6c757d',
    confirmButtonText: '복원',
    cancelButtonText: '취소'
  }).then((result) => {
    if (!result.isConfirmed) return;
    
    console.log('복원 요청 URL:', `/project/${selectedProject.bizId}/restore`);
    
    axiosInst.patch(`/project/${selectedProject.bizId}/restore`)
      .then((res) => {
        console.log('복원 성공 응답:', res.data);
        Swal.fire({
          title: '복원 성공!',
          text: '프로젝트가 복원되었습니다.',
          icon: 'success',
          confirmButtonColor: '#0d6efd',
        });
        setSelectedProject(null);
        const modalElement = document.getElementById('projectDetailModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
        onReload(); // 목록 갱신
      })
      .catch((err) => {
        console.error('복원 실패 상세:', err);
        console.error('에러 응답:', err.response);
        Swal.fire({
          title: '복원 실패',
          text: err.response?.data?.message || err.message || '복원에 실패했습니다.',
          icon: 'error',
          confirmButtonColor: '#dc3545',
        });
      });
  });
};

  // 취소 처리
  const handleCancelProject = () => {
  Swal.fire({
    title: '프로젝트 취소',
    text: '프로젝트를 취소하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: '취소 처리',
    cancelButtonText: '돌아가기'
  }).then((result) => {
    if (!result.isConfirmed) return;
    
    console.log('취소 요청 URL:', `/project/${selectedProject.bizId}/cancel`);
    
    axiosInst.post(`/project/${selectedProject.bizId}/cancel`)
      .then((res) => {
        console.log('취소 성공 응답:', res.data);
        Swal.fire({
          title: '취소 성공!',
          text: '프로젝트가 취소되었습니다.',
          icon: 'success',
          confirmButtonColor: '#0d6efd',
        });
        setSelectedProject(null);
        const modalElement = document.getElementById('projectDetailModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
        onReload(); // 목록 갱신
      })
      .catch((err) => {
        console.error('취소 실패 상세:', err);
        console.error('에러 응답:', err.response);
        Swal.fire({
          title: '취소 실패',
          text: err.response?.data?.message || err.message || '취소 처리에 실패했습니다.',
          icon: 'error',
          confirmButtonColor: '#dc3545',
        });
      });
  });
};

  // 예산 포맷팅
  const formatBudget = (amount) => {
  if (amount === undefined || amount === null) {
    return '금액 미정';
  }

  // 1억 (100,000,000)
  const HUNDRED_MILLION = 100000000; 
  
  // 1만원 (10,000)
  const TEN_THOUSAND = 10000;

  // 1억 미만: '만원' 단위로 표시 (예: 7,000만원)
  if (amount < HUNDRED_MILLION) {
    const value = (amount / TEN_THOUSAND).toLocaleString();
    return `${value}만원`;
  }

  // 1억 이상: '억' 단위로 표시 (예: 7억, 70억)
  else {
    // 100,000,000으로 나누어 '억' 단위로 변환
    const value = (amount / HUNDRED_MILLION).toLocaleString(undefined, {
        // 소수점 둘째 자리에서 반올림하여 첫째 자리까지 표시
        maximumFractionDigits: 1 
    });
    return `${value}억`;
  }
};

  // 검색 - 클라이언트 측 필터링
  const handleSearch = () => {
    // 검색 조건이 하나도 없으면 전체 목록 표시
    if (!searchWord && !startDate && !endDate) {
      setSearchedProjects(null);
      setCurrentPage(1);
      return;
    }

    // 클라이언트 측 필터링
    const filtered = projects.filter(p => {
      const matchName = !searchWord || p.bizNm.toLowerCase().includes(searchWord.toLowerCase());
      const matchStartDate = !startDate || new Date(p.strtBizDt) >= new Date(startDate);
      const matchEndDate = !endDate || new Date(p.endBizDt) <= new Date(endDate);
      return matchName && matchStartDate && matchEndDate;
    });

    setSearchedProjects(filtered);
    setCurrentPage(1);
    console.log('검색 결과:', filtered.length, '건');
  };

  // 검색 조건 초기화
  const handleResetSearch = () => {
    setSearchWord('');
    setStartDate('');
    setEndDate('');
    setSearchedProjects(null); // 검색 결과 초기화
    setCurrentPage(1);
  };

  // 표시할 프로젝트: 검색 결과가 있으면 검색 결과, 없으면 전체 목록
  const displayProjects = searchedProjects !== null ? searchedProjects : projects;

  // 페이징
  const totalPages = Math.ceil(displayProjects.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProjects = displayProjects.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title mb-0">전체 프로젝트 목록</h4>
        </div>
        <div className="card-body">
          {/* 검색 영역 */}
          <div className="row mb-3">
            <div className="col-md-4 mb-2">
              <label className="form-label small">프로젝트명</label>
              <input
                type="text"
                className="form-control"
                placeholder="프로젝트명으로 검색"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label small">시작일 (이후)</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label small">종료일 (이전)</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 mb-2 d-flex align-items-end gap-2">
              <button className="btn btn-primary flex-fill" onClick={handleSearch}>
                <i className="bi bi-search"></i> 검색
              </button>
              <button className="btn btn-outline-secondary" onClick={handleResetSearch} title="초기화">
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>

          {/* 검색 결과 표시 */}
          {searchedProjects !== null && (
            <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              <span>검색 결과: 총 <strong>{searchedProjects.length}</strong>개의 프로젝트</span>
            </div>
          )}

          {/* 테이블 */}
          <div className="dataTable-container">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>프로젝트ID</th>
                  <th>프로젝트명</th>
                  <th>시작일</th>
                  <th>종료일</th>
                  <th>진행률</th>
                  <th>예산</th>
                  <th>상태</th>
                  <th className="text-center">관리</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.length > 0 ? (
                  currentProjects.map((project) => (
                    <tr 
                      key={project.bizId}
                      style={{ 
                        backgroundColor: (project.bizSttsCd === '취소' || project.bizSttsCd === 'B305') ? '#f5f5f5' : 'white',
                        opacity: (project.bizSttsCd === '취소' || project.bizSttsCd === 'B305') ? 0.7 : 1
                      }}
                    >
                      <td>{project.bizId}</td>
                      <td style={{ fontWeight: '500' }}>{project.bizNm}</td>
                      <td>{project.strtBizDt.toLocaleDateString('ko-KR')}</td>
                      <td>{project.endBizDt.toLocaleDateString('ko-KR')}</td>
                      <td>
                        <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                          <div style={{ 
                            flex: 1, 
                            height: '8px', 
                            backgroundColor: '#e9ecef', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${project.bizPrgrs}%`, 
                              height: '100%', 
                              backgroundColor: project.bizPrgrs === 100 ? '#1cc88a' : '#4e73df',
                              transition: 'width 0.3s'
                            }}></div>
                          </div>
                          <span style={{ fontSize: '12px', minWidth: '40px' }}>{project.bizPrgrs}%</span>
                        </div>
                      </td>
                      <td>{formatBudget(project.bizBdgt)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(project.bizSttsCd)}`}>
                          {getStatusText(project.bizSttsCd)}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() => handleProjectDetail(project)}
                          title="상세보기"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      {searchedProjects !== null ? '검색 결과가 없습니다.' : '프로젝트 정보가 없습니다.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 0 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => setCurrentPage(i + 1)}
                      className="page-link"
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="dataTable-bottom text-center text-muted small">
            Showing {indexOfFirst + 1} to{' '}
            {Math.min(indexOfLast, displayProjects.length)} of {displayProjects.length} entries
          </div>
        </div>
      </div>

      {/* 프로젝트 상세 모달 */}
      {selectedProject && (
        <div
          className="modal fade"
          id="projectDetailModal"
          tabIndex="-1"
          aria-labelledby="projectDetailModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              {/* 헤더 */}
              <div className="modal-header" style={{ 
                background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
                color: 'black',
                padding: '20px 24px'
              }}>
                <div>
                  <h4 className="modal-title mb-1" id="projectDetailModalLabel" style={{ fontWeight: '600' }}>
                    {selectedProject.bizNm}
                  </h4>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '14px', opacity: '0.9' }}>
                      <i className="bi bi-hash"></i> {selectedProject.bizId}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(selectedProject.bizSttsCd)}`}>
                      {getStatusText(selectedProject.bizSttsCd)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body" style={{ padding: '24px' }}>
                <div className="row g-3">
                  {/* 기본 정보 */}
                  <div className="col-12">
                    <div className="card" style={{ border: '1px solid #e3e6f0' }}>
                      <div className="card-header" style={{ backgroundColor: '#f8f9fc', borderBottom: '1px solid #e3e6f0' }}>
                        <h6 className="mb-0" style={{ fontWeight: '600' }}>
                          <i className="bi bi-info-circle me-2"></i>기본 정보
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-6">
                            <label className="text-muted small mb-1">프로젝트 유형</label>
                            <p className="mb-0" style={{ fontWeight: '500', fontSize: '14px' }}>
                              {selectedProject.bizTypeNm || selectedProject.bizTypeCd || '-'}
                            </p>
                          </div>
                          <div className="col-6">
                            <label className="text-muted small mb-1">프로젝트 책임자</label>
                            <p className="mb-0" style={{ fontWeight: '500', fontSize: '14px' }}>
                              <i className="bi bi-person-badge me-1"></i>
                              {selectedProject.bizPicId}
                            </p>
                          </div>
                          <div className="col-6">
                            <label className="text-muted small mb-1">시작일</label>
                            <p className="mb-0" style={{ fontWeight: '500', fontSize: '14px' }}>
                              <i className="bi bi-calendar-check me-1"></i>
                              {selectedProject.strtBizDt.toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          <div className="col-6">
                            <label className="text-muted small mb-1">종료일</label>
                            <p className="mb-0" style={{ fontWeight: '500', fontSize: '14px' }}>
                              <i className="bi bi-calendar-x me-1"></i>
                              {selectedProject.endBizDt.toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          <div className="col-12">
                          <label className="text-muted small mb-1">예산</label>
                          <p className="mb-0" style={{ fontWeight: '600', fontSize: '16px', color: '#667eea' }}>
                              <i className="bi bi-currency-dollar me-1"></i>
                              {formatBudget(selectedProject.bizBdgt)}
                          </p>
                      </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 프로젝트 목표 */}
                  <div className="col-12">
                    <div className="card" style={{ border: '1px solid #e3e6f0' }}>
                      <div className="card-header" style={{ backgroundColor: '#f8f9fc', borderBottom: '1px solid #e3e6f0' }}>
                        <h6 className="mb-0" style={{ fontWeight: '600' }}>
                          <i className="bi bi-bullseye me-2"></i>프로젝트 목표
                        </h6>
                      </div>
                      <div className="card-body">
                        <p className="mb-0" style={{ 
                          fontSize: '14px',
                          padding: '10px',
                          backgroundColor: '#f8f9fc',
                          borderRadius: '6px',
                          minHeight: '50px'
                        }}>
                          {selectedProject.bizGoal || '목표가 설정되지 않았습니다.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 참여자 */}
                  <div className="col-6">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">
                          <i className="bi bi-people-fill me-1"></i>참여자
                        </h6>
                      </div>
                      <div className="card-body" style={{ maxHeight: '150px', overflowY: 'auto', padding: '12px' }}>
                        {projectMembers.participants.length > 0 ? (
                          projectMembers.participants.map((member, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-2 p-2" 
                                style={{ backgroundColor: '#f8f9fc', borderRadius: '4px' }}>
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" 
                                  style={{ width: '28px', height: '28px', fontSize: '12px', fontWeight: '600' }}>
                                {member.userNm ? member.userNm.charAt(0) : '?'}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '13px' }}>
                                  {member.userNm || '이름 없음'} {member.jbgdNm}
                                </div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                  {member.deptNm}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted text-center mb-0" style={{ fontSize: '12px' }}>
                            참여자가 없습니다.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 열람자 */}
                  <div className="col-6">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">
                          <i className="bi bi-eye-fill me-1"></i>열람자
                        </h6>
                      </div>
                      <div className="card-body" style={{ maxHeight: '150px', overflowY: 'auto', padding: '12px' }}>
                        {projectMembers.viewers.length > 0 ? (
                          projectMembers.viewers.map((member, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-2 p-2" 
                                style={{ backgroundColor: '#f8f9fc', borderRadius: '4px' }}>
                              <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center me-2" 
                                  style={{ width: '28px', height: '28px', fontSize: '12px', fontWeight: '600' }}>
                                {member.userNm ? member.userNm.charAt(0) : '?'}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '13px' }}>
                                  {member.userNm || '이름 없음'} {member.jbgdNm}
                                </div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                  {member.deptNm}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted text-center mb-0" style={{ fontSize: '12px' }}>
                            열람자가 없습니다.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 24px', backgroundColor: '#f8f9fc' }}>
                <button
                  type="button"
                  className="btn btn-light-secondary"
                  data-bs-dismiss="modal"
                >
                  <i className="bi bi-x-lg me-1"></i> 닫기
                </button>
                
                {/* 취소 상태 → 복원 버튼 */}
                {(selectedProject.bizSttsCd === '취소' || selectedProject.bizSttsCd === 'B305') && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleRestoreProject}
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i> 복원
                  </button>
                )}
                
                {/* 완료/취소 상태가 아닐 때만 → 취소 버튼 */}
                {selectedProject.bizSttsCd !== '완료' && 
                 selectedProject.bizSttsCd !== 'B304' && 
                 selectedProject.bizSttsCd !== '취소' && 
                 selectedProject.bizSttsCd !== 'B305' && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancelProject}
                  >
                    <i className="bi bi-x-circle me-1"></i> 취소 처리
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectTable;