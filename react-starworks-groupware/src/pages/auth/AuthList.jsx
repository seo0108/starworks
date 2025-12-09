import React, { useState } from 'react'
import authData from './hooks/authData';
import axiosInst from '../../api/apiClient';
import { showAlert, showToast } from '../../api/sweetAlert';

function AuthList({ policiesList, getPoliciesList}) {

    const [deleteTarget, setDeleteTarget] = useState(); // 삭제할 대상
    
    const [editTarget, setEditTarget] = useState(null); // 수정할 대상
    const [checkedDepts, setCheckedDepts] = useState([]); // 선택된 부서 리스트
    const [selectedJbgd, setSelectedJbgd] = useState(''); // 선택된 직급
    const [remark, setRemark] = useState(''); // 설명

    const { featureList, deptList, jbgdList, getData } = authData(); // 기능 목록, 부서 목록, 직급 목록

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

        if(data.rowcnt > 0) {
            showAlert("success", "수정되었습니다.");
            getPoliciesList();
            
            // 모달 닫기
            const modalEl = document.getElementById("editPolicyModal");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
        } else {
            showAlert("error", "수정에 실패하였습니다.");
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

  return (
    <>
    <section className="section">
          <div className="card">
            <div className="card-header">
                {/* <Link to={"create"} className="btn btn-primary">신규 정책 등록</Link> */}
                <h4 className="card-title">등록된 권한 목록</h4>
            </div>
              <div className="card-body">
                  <div className="table-responsive">
                      <table className="table" id="table1">
                      <thead>
                          <tr>
                              <th>기능명</th>
                              <th>적용 부서</th>
                              <th>적용 직급</th>
                              <th>설명</th>
                              <th colSpan={2}>작업</th>
                          </tr>
                      </thead>
                      <tbody>
                        {policiesList.map((policies, i) => (
                            <tr key={i}>
                              <td>{policies.featureName} ({policies.featureId})</td>
                              <td>
                                {policies.policiesDetailList.map((detail) => (
                                    detail.deptNm
                                )).join(", ")}
                              </td>
                              <td>
                                {policies.policiesDetailList[0].jbgdNm} 이상
                              </td>
                              <td>{policies.remark}</td>
                              <td>
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
                              <td>
                                <a href="#" className="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#removeConfirmModal" onClick={() => setDeleteTarget(policies.featureId)}>삭제</a>
                              </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
    </section>

    {/* 수정 모달 */}
    <div className="modal fade" id="editPolicyModal" tabindex="-1" aria-labelledby="editPolicyModalLabel" aria-modal="true" role="dialog">
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
                            <p id="editFeatureName" className="form-control-plaintext">{editTarget?.featureName} ({editTarget?.featureId})</p>
                            <input type="hidden" name="featureId" value={editTarget?.featureId} />
                        </div>

                        {/* 적용 부서 설정 */}
                        <div className="mb-3">
                            <label className="form-label">적용 부서</label>
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
                                        for="dept-product-planning">
                                        {dept.deptNm}
                                        </label>
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editAppliedRanks" className="form-label">적용 직급</label>
                            <select className="form-select" value={selectedJbgd} name="jbgdCd" onChange={(e) => setSelectedJbgd(e.target.value)}>

                                {jbgdList
                                    .filter((jbgd) => jbgd.jbgdCd != 'JBGD01')
                                    .map((jbgd) => (
                                        <option value={jbgd.jbgdCd}>
                                            {jbgd.jbgdNm == '사원' ? 
                                                `모든 직급` : `${jbgd.jbgdNm} 이상`}
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
    <div class="modal fade" id="removeConfirmModal" tabindex="-1" aria-labelledby="removeConfirmModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="removeConfirmModal">권한 삭제</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>권한을 삭제하시겠습니까?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" class="btn btn-primary" onClick={removeConfirmHandler}>확인</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default AuthList