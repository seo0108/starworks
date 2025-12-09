import axiosInst from '../../api/apiClient';
import { showToast } from "../../api/sweetAlert";
import { showAlert } from "../../api/sweetAlert";
import authData from './hooks/authData';
import React, { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'

import './Auth.css'

function Auth() {

    const [policiesList, setPoliciesList] = useState([]); // 정책 목록
    
    const [deleteTarget, setDeleteTarget] = useState(); // 삭제할 대상

    const [editTarget, setEditTarget] = useState(null); // 수정할 대상
    const [checkedDepts, setCheckedDepts] = useState([]); // 선택된 부서 리스트
    const [selectedJbgd, setSelectedJbgd] = useState(''); // 선택된 직급
    const [remark, setRemark] = useState(''); // 설명

    const { featureList, deptList, jbgdList, getData } = authData(); // 기능 목록, 부서 목록, 직급 목록
    
    // 페이징
    const [currentPage, setCurrentPage] = useState(1);   // 현재 페이지 번호
    const itemsPerPage = 10;                             // 페이지당 표시할 개수

    // 모달 초기화
    useEffect(() => {
        const modalEl = document.getElementById("editPolicyModal");
        if(modalEl) {
            new bootstrap.Modal(modalEl);
        }

        getPoliciesList();
        
    }, []);

    // 부서 체크박스 핸들러
    const deptCheckHandler = (e) => {
        const dept = e.target.value;

        if(e.target.checked) {
            // checked 상태일 경우 setSelectedDepts 업데이트
            setCheckedDepts((prev) => [...prev, dept]);
        } else {
            // checked 상태가 아닐 경우 filter를 이용해서 해당 아이템을 삭제
            setCheckedDepts((prev) => prev.filter((v) => v !== dept));
        }
   }

    // 수정 폼 제출 핸들러
    const editFormHandler = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const editPolicy = Object.fromEntries(formData.entries());

        editPolicy.deptList = checkedDepts;

        modifyPolicy(editPolicy);
    }

    // 폼 제출
    const modifyPolicy = async (editPolicy) => {
        const resp = await axiosInst.put("/comm-policies", editPolicy);
        const data = await resp.data;

        console.log(data)

        if(data.rowcnt > 0) {
            showAlert("success", "수정되었습니다.");
            getPoliciesList();

            // 모달 닫기
            const modalEl = document.getElementById("editPolicyModal");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
        } else {
            if(data.message != null) {
                showAlert("error",  data.message);
            } else {
                showAlert("error", "수정에 실패하였습니다.");
            }
        }
    }

    // 삭제 모달에서 '확인' 클릭 이벤트
    const removeConfirmHandler = async () => {
        if (!deleteTarget) return;

        const resp = await axiosInst.delete(`/comm-policies/${deleteTarget}`);
        const data = await resp.data;

        if(data.success) {
            getPoliciesList();
            showToast('trash', '삭제되었습니다.');
        } else {
            showToast('error', '삭제에 실패했습니다.');
        }

        // 모달 닫기
        const modalEl = document.getElementById("removeConfirmModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
    }

    // 권한 목록 가져오기
    const getPoliciesList = () => {
        axiosInst.get("/comm-policies")
        .then(({data}) => {
            setPoliciesList(data)
            console.log(data)
        })
        .catch(err => {
            console.log(err);
            setPoliciesList([]);
        })
    }
    
    // 페이지네이션 계산
    const totalPages = Math.max(1, Math.ceil(policiesList.length / itemsPerPage));
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentPolicies = policiesList.slice(indexOfFirst, indexOfLast);

  return (
    <>
    <div className="content-wrapper container">

      <div className="page-heading">
        <h3>권한 관리</h3>
        <p className="text-subtitle text-muted">
          생성된 정책들을 확인하고 관리합니다. 부서와 직급에 따라 특정 기능 접근을 제한 가능합니다. 
        </p>
      </div>

      <div className="page-content">

        <section className="section">
          <div className="card authCard">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title float-start">등록된 권한 정책 목록</h4>
                <Link to={"create"} className="btn btn-primary float-end">+ 신규 정책 등록</Link>
                {/* <h4 className="card-title">등록된 권한 목록</h4> */}
            </div>
              <div className="card-body">
                <div className="alert alert-secondary" style={{ display: "flex", alignItems: "center",borderRadius: "8px" }}>
                    <i className="bi-exclamation-circle" style={{ marginRight: "0.8rem", flexShrink: 0 }}></i>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span>권한 변경 시 다른 사용자의 이용 범위에 영향을 주며, 변경 사항은 즉시 적용됩니다.</span>
                    <span>다른 정책과 충돌하지 않도록 확인하세요.</span>
                    </div>
                </div>

                  <div className="table-responsive">
                      <table className="table table-sm table-lg table-hover" id="table1">
                      <thead style={{ borderTop: "2px solid #dee2e6" }}>
                          <tr>
                              <th className='text-center' style={{width: '5%'}}>No</th>
                              <th className='text-center' style={{width: '18%'}}>기능명</th>
                              <th className='text-center' style={{width: '20%'}}>적용 부서</th>
                              <th className='text-center' style={{width: '10%'}}>적용 직급</th>
                              <th className='text-center'>설명</th>
                              <th className='text-center' style={{width: '10%'}}>권한 생성일</th>
                              <th className='text-center' style={{width: '10%'}}>최종 수정일</th>
                              <th colSpan={2} className="text-center" style={{width: '10%'}}>작업</th>
                          </tr>
                      </thead>
                      <tbody>
                        {currentPolicies.map((policies, i) => (
                            <tr key={i}>
                              <td className='text-center'>{i+1}</td>
                              <td ><b>{policies.featureName} ({policies.featureId})</b></td>
                              <td>
                                <b>{policies.policiesDetailList.map((detail) => (
                                    detail.deptNm
                                )).join(", ")}</b>
                              </td>
                              <td className='text-center'>
                                <b>{policies.policiesDetailList[0].jbgdNm == '사원' ? '모든 직급' : policies.policiesDetailList[0].jbgdNm + ' 이상'} </b>
                              </td>
                              <td>{policies.remark}</td>
                              <td className='text-center'>{policies.crtDt}</td>
                              <td className='text-center'>{policies.modDt ?? '-'}</td>
                              <td className="text-center">
                                  <a 
                                    href="#" 
                                    className="btn btn-sm btn-outline-primary" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#editPolicyModal"
                                    onClick={() => {
                                        setEditTarget(policies);
                                        setCheckedDepts(policies.policiesDetailList.map(d => d.deptId));
                                        setSelectedJbgd(policies.policiesDetailList[0].jbgdCd);
                                        setRemark(policies.remark);
                                    }}
                                    >
                                    수정
                                    </a>
                              </td>
                              <td className="text-center">
                                <a href="#" className="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#removeConfirmModal" onClick={() => setDeleteTarget(policies.featureId)}>삭제</a>
                              </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* 페이지네이션 */}
                <nav className="mt-3">
                    <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                        key={i + 1}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            {i + 1}
                        </button>
                        </li>
                    ))}
                    </ul>
                </nav>
                
                <div className="dataTable-bottom text-center text-muted small">
  Showing {policiesList.length === 0 ? 0 : indexOfFirst + 1} to{" "}
  {Math.min(indexOfLast, policiesList.length)} of {policiesList.length} entries
</div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>

    {/* 수정 모달 */}
    <div className="modal fade" id="editPolicyModal" tabIndex="-1" aria-labelledby="editPolicyModalLabel" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="editPolicyModalLabel">정책 수정</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                    <form id="editPolicyForm" onSubmit={editFormHandler}>
                        <div className="mb-3">
                            <label htmlFor="editFeatureName" className="form-label">기능명</label>
                            <p id="editFeatureName" className="form-control-plaintext">{editTarget?.featureName}</p>
                            <input type="hidden" name="featureId" value={editTarget?.featureId} />
                        </div>

                        {/* 적용 부서 설정 */}
                        <div className="mb-3">
                            <label className="form-label">적용 부서 <span className="text-danger">*</span></label>
                            <div id="editAppliedDepts">
                                
                                {deptList
                                    .filter((dept) => dept.upDeptId == 'DP000000')
                                    .map((dept) => (
                                    
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={dept.deptId}
                                            id={dept.deptId}
                                            checked={checkedDepts.includes(dept.deptId)}
                                            name="deptList"
                                            onChange={deptCheckHandler}
                                        />
                                        <label  className="form-check-label"
                                        htmlFor="dept-product-planning">
                                        {dept.deptNm}
                                        </label>
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editAppliedRanks" className="form-label">적용 직급 <span className="text-danger">*</span></label>
                            <select className="form-select" value={selectedJbgd} name="jbgdCd" onChange={(e) => setSelectedJbgd(e.target.value)}>

                                {jbgdList
                                    .filter((jbgd) => jbgd.jbgdCd != 'JBGD01')
                                    .map((jbgd) => (
                                        <option value={jbgd.jbgdCd}>
                                            {jbgd.jbgdNm === '사원' ? 
                                                '모든 직급' : `${jbgd.jbgdNm} 이상`}
                                        </option>
                                    ))
                                }
                                
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editDescription" className="form-label">설명</label>
                            <textarea className="form-control" id="editDescription" name="remark" rows="3" value={remark} onChange={(e) => setRemark(e.target.value)}></textarea>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                            <button type="submit" className="btn btn-primary">저장</button>
                        </div>
                    </form>
                </div>  
            </div>
        </div>
    </div>

    {/* 권한 삭제 확인 모달 */}
    <div className="modal fade" id="removeConfirmModal" tabIndex="-1" aria-labelledby="removeConfirmModal" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="removeConfirmModal">권한 삭제</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>권한을 삭제하시겠습니까?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" className="btn btn-primary" onClick={removeConfirmHandler}>확인</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Auth