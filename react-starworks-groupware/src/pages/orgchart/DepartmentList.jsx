import React, { useEffect, useState } from 'react'
import axiosInst from '../../api/apiClient' // axios 기반 공통 클라이언트
import './DepartmentList.css'               // 스타일 유지
import { showAlert, showToast } from '../../api/sweetAlert'

function DepartmentList() {
  const [departments, setDepartments] = useState([])
  const [newDept, setNewDept] = useState({ deptNm: '', upDeptId: '' })
  const [users, setUsers] = useState([])

  //수정
  const [editDeptId, setEditDeptId] = useState(null);
  const [editDeptNm, setEditDeptNm] = useState("");

  useEffect(() => {
    loadDepartments()
    loadUsers()
  }, [])

  // 부서 목록 로드
  const loadDepartments = () => {
    axiosInst
      .get('/comm-depart')
      .then((res) => {
        setDepartments(res.data)
      })
      .catch((err) => console.error('부서 조회 실패', err))
  }

  // 사용자 목록 로드 (부서별 인원 수 계산용)
  const loadUsers = () => {
    axiosInst
      .get('/comm-user')
      .then((res) => {
        console.log("ddddddddddd", res.data);
        setUsers(res.data)})
      .catch((err) => console.error('사용자 조회 실패', err))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewDept((prev) => ({ ...prev, [name]: value }))
  }

  // 부서 등록
  const handleAddDept = () => {
    const {deptNm} = newDept
    if(!deptNm.trim()){
      showAlert("warning", "부서명을 입력해주세요.")
      return
    }

    axiosInst
      .post('/comm-depart', newDept)
      .then((res) => {
        // 상태 코드 확인 (성공 가정: 200~299)
        if (!(res && res.status >= 200 && res.status < 300)) {
          throw new Error('등록실패')
        }

        //alert('부서가 등록되었습니다')
        showAlert("success", "부서가 등록되었습니다.");

        // 모달 닫기 (bootstrap 전역 안전 처리)
        const modalEl = document.getElementById('addDeptModal')
        const bs = window.bootstrap
        if (modalEl && bs && bs.Modal) {
          let modalInstance = bs.Modal.getInstance(modalEl)
          if (!modalInstance) modalInstance = new bs.Modal(modalEl)
          modalInstance.hide()
        }

        setNewDept({ deptNm: '', upDeptId: '' })
        loadDepartments()
      })
      .catch((err) => console.error('등록 실패', err))
  }

  // 부서 삭제
  const handleDeleteDept = async (deptId) => {
    //if (!window.confirm('부서를 삭제하시겠습니까?')) return
  const result = await showAlert("warning", "정말 이 부서를 삭제하시겠습니까?", true);
  if (!result.isConfirmed) return; // 취소 시 중단

    axiosInst
      .delete(`/comm-depart/${deptId}`)
      .then((res) => {
        const data = res.data
        if (data) {
        if (data.success) {
          showAlert("success", data.message || "부서가 정상적으로 삭제되었습니다.")
          loadDepartments()
        } else {
          showAlert("error", data.message || "부서를 삭제할 수 없습니다.")
        }
      } else {
        showAlert("error", "삭제 요청에 실패했습니다.")
      }
    })
    .catch((err) => {
      console.error('삭제 실패', err)
      showAlert("error", "서버 오류로 삭제에 실패했습니다.")
    })
  }

  //수정 버튼 클릭시
  const handleEditClick = (dept) => {
    setEditDeptId(dept.deptId);
    setEditDeptNm(dept.deptNm);
  }

  // 수정 저장
  const handleSaveEdit = (deptId) =>{
    if(!editDeptNm.trim()){
      showAlert("warning", "부서명을 입력해주세요.");
      return;
    }

  axiosInst
    .put(`/comm-depart/${deptId}`, {deptNm : editDeptNm})
    .then((res)=> {
      if(res.data === true){
        showAlert("success", "부서명이 수정되었습니다.");
        setEditDeptId(null);
        setEditDeptNm("");
        loadDepartments();
      }else{
        showAlert("error", "수정실패");
      }
    })
    .catch((err) => {
      console.error("수정실패", err);
      showAlert("error", "서버오류로 수정 실패");
      
    })
  }  

    //수정 취소
    const handleCancelEdit = ()=>{
      setEditDeptId(null);
      setEditDeptNm("");
    }

  // 부서별 인원 수
/*   const getEmpCount = (deptId) =>
    Array.isArray(users) ? users.filter(
        (u) =>
          u.deptId === deptId &&
          (u.rsgntnYn === undefined || u.rsgntnYn === null || u.rsgntnYn === 'N')
      ).length
    : 0 */
  const getEmpCount = (deptId) => {
  if (!Array.isArray(users)) return 0

  const filtered = users.filter((u) => {
    const userDept = (u.deptId || '').trim()
    const targetDept = (deptId || '').trim()
    const resignValue = (u.rsgntnYn || '').trim().toUpperCase()
    const isActive = resignValue === '' || resignValue === 'N' || resignValue === '0'
    const match = userDept === targetDept && isActive
    if (match) {
      console.log('match:', { deptId, userDept, userNm: u.userNm, rsgntnYn: u.rsgntnYn })
    }
    return match
  })

  console.log('➡️', deptId, '카운트:', filtered.length)
  return filtered.length
} 


  // 트리 구조 변환
  const buildTree = (list) => {
    const map = {}
    const roots = []

    list.forEach((dept) => {
      map[dept.deptId] = { ...dept, children: [] }
    })

    list.forEach((dept) => {
      if (dept.upDeptId && map[dept.upDeptId]) {
        map[dept.upDeptId].children.push(map[dept.deptId])
      } else {
        roots.push(map[dept.deptId])
      }
    })

    return roots
  }

  const treeData = buildTree(departments)

  // 재귀 렌더링
  const renderTree = (nodes) => (
    <ul className="tree">
      {nodes.map((node) => (
        <li key={node.deptId}>
          <div className="tree-node">
            <span className="tree-icon">🧩</span>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center w-100">
              <div className="flex-grow-1">
                {editDeptId === node.deptId ? (
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editDeptNm}
                      onChange={(e) => setEditDeptNm(e.target.value)}
                      style={{ width: "180px" }}
                    />
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleSaveEdit(node.deptId)}
                    >
                      저장
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="fw-semibold">{node.deptNm}</span>
                    <span className="text-muted small ms-2">
                      ({getEmpCount(node.deptId)}명)
                    </span>
                    <span className="text-secondary small ms-2">
                      [ID: {node.deptId}]
                    </span>
                    <span
                      className={`badge ms-2 ${
                        node.useYn === "Y" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {node.useYn === "Y" ? "사용중" : "삭제됨"}
                    </span>
                  </>
                )}
              </div>

              <div className="ms-sm-auto mt-1 mt-sm-0 d-flex gap-1">
                {editDeptId === node.deptId ? null : (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditClick(node)}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteDept(node.deptId)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>

          {node.children.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  )

  return (
     <div className="card department-container">
      
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title">부서 트리</h4>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addDeptModal">
          <i className="bi bi-plus-lg"></i> 부서 추가
        </button>
      </div>

      <div className="card-body">
        {departments.length === 0 ? <p>부서 정보가 없습니다.</p> : renderTree(treeData)}
      </div>

      {/* 부서 추가 모달 */}
      <div
        className="modal fade"
        id="addDeptModal"
        tabIndex={-1}
        aria-labelledby="addDeptModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">부서 추가</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>

            <div className="modal-body">
              {/* <label className="form-label">부서ID</label>
              <input
                name="deptId"
                value={newDept.deptId}
                onChange={handleChange}
                className="form-control mb-2"
              /> */}

              <label className="form-label">부서명 <span className="text-danger">*</span></label>
              <input
                name="deptNm"
                value={newDept.deptNm}
                onChange={handleChange}
                className="form-control mb-2"
              />

              <label className="form-label">상위부서 <span className="text-danger">*</span></label>
              <select
                name="upDeptId"
                value={newDept.upDeptId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">(없음)</option>
                {departments
                  .filter((d) => d.deptId.endsWith('000'))
                  .map((d) => (
                    <option key={d.deptId} value={d.deptId}>
                      {d.deptNm}
                    </option>
                  ))}
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                취소
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddDept}>
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentList
