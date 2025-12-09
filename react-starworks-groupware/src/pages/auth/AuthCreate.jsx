import React, { useEffect, useState } from "react";
import { showAlert } from "../../api/sweetAlert";
import axiosInst from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import authData from "./hooks/authData";

function AuthCreate() {

  const navigate = useNavigate(); // navigate (다른 화면으로 이동)

  const { featureList, deptList, jbgdList, getData } = authData();
  const [remark, setRemark] = useState(""); // 권한 설명
  const [checkedDepts, setCheckedDepts] = useState([]); // 선택된 부서 리스트

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

  useEffect(() => {

  }, [])

  // 폼 제출 핸들러
  const policyFormHandler = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newPolicy = Object.fromEntries(formData.entries());
    
    newPolicy.deptList = checkedDepts;

    createPolicy(newPolicy);
  }

  // 폼 제출
  const createPolicy = async (newPolicy) => {
      const resp = await axiosInst.post("/comm-policies", newPolicy);
      const data = await resp.data;

      if(data.success) {
        showAlert("success", "등록되었습니다.");
        navigate("/admin/auth");
      } else {
        if(data.message != null) {
          showAlert("error", data.message);
        } else {
          showAlert("error", "등록에 실패하였습니다.");
        }
      }
  }

  // 초기화 핸들러
  const resetHandler = () => {
    console.log("클릭")
    setRemark("");
    setCheckedDepts([]);
  }

  return (
    <>
    <div className='content-wrapper container'>
        <div className="page-heading">
            <h3>권한 관리</h3>
            <p className="text-subtitle text-muted">생성된 정책들을 확인하고 관리합니다.</p>
        </div>
    <div className="page-content">
      <section id="policy-creation-form">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">신규 권한 정책 등록</h4>
          </div>
          <div className="card-body">
            <div className="alert alert-warning" style={{ display: "flex", alignItems: "center", borderRadius: "8px"}}>
                    <i className="bi-exclamation-triangle" style={{ marginRight: "0.8rem", flexShrink: 0 }}></i>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span>정책명과 권한 범위를 정확히 선택하세요.</span>
                    <span>등록 후 정책은 즉시 적용되며, 기존 사용자에게 영향이 있을 수 있습니다.</span>
                    </div>
                </div>

            <form className="form" onSubmit={policyFormHandler}>

              {/* 기능, 적용 부서, 적용 직급 */}
              <div className="row g-3">
                {/* 기능 선택 */}
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">기능 선택 <span class="text-danger">*</span></h5>
                    </div>
                    <div className="card-body">
                      <p className="text-subtitle text-muted">
                        권한을 적용할 기능을 선택하세요.
                      </p>
                      <select
                        className="form-select"
                        id="function-selection"
                        name="featureId"
                      >
                        {featureList.map((feature) => (
                          <option key={feature.featureId} value={feature.featureId}>
                            {feature.featureName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 적용 부서 */}
                <div className="col-md-4">
                  <div className="card mb-0">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">적용 부서 <span class="text-danger">*</span></h5>
                    </div>
                    <div className="card-body">
                      <p className="text-subtitle text-muted">
                        권한을 적용할 부서를 선택하세요.
                      </p>

                      {/* <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onClick={() => {
                            const checkboxes = document.querySelectorAll(
                              'input[name="deptList"]'
                            );
                            const allChecked = Array.from(checkboxes).every(
                              (chk) => chk.checked
                            );
                            checkboxes.forEach((chk) => (chk.checked = !allChecked));
                          }}
                        />
                          <label className="form-check-label">
                            전체 선택
                          </label>
                        </div> */}
                      
                      <div className="row row-cols-2 g-2">
                        {deptList
                          .filter((dept) => dept.upDeptId === 'DP000000')
                          .map((dept) => (
                            <div className="col" key={dept.deptId}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={dept.deptId}
                                  id={dept.deptId}
                                  name="deptList"
                                  onChange={deptCheckHandler}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={dept.deptId}
                                >
                                  {dept.deptNm}
                                </label>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 적용 직급 */}
                <div className="col-md-4">
                  <div className="card mb-0">
                    <div className="card-header">
                      <h5 className="card-title mb-0">적용 직급 <span class="text-danger">*</span></h5>
                    </div>
                    <div className="card-body">
                      <p className="text-subtitle text-muted">
                        권한을 적용할 최소 직급을 선택하세요.
                      </p>
                      <div className="d-flex flex-column gap-2">
                        {jbgdList
                          .filter((jbgd) => jbgd.jbgdCd !== 'JBGD01')
                          .map((jbgd) => (
                            <div className="form-check" key={jbgd.jbgdCd}>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="jbgdCd"
                                value={jbgd.jbgdCd}
                                id={jbgd.jbgdCd}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={jbgd.jbgdCd}
                              >
                                {jbgd.jbgdNm === '사원'
                                  ? `모든 직급`
                                  : `${jbgd.jbgdNm} 이상`}
                              </label>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 권한 설명 */}
                  <div className="card mb-0">
                    <div className="card-header pt-0">
                      <h5 className="card-title mb-0">권한 설명</h5>
                    </div>
                      <div className="card-body">
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="이 권한의 목적과 적용 범위를 입력하세요."
                          value={remark}
                          name="remark"
                          onChange={(e) => setRemark(e.target.value)}
                        ></textarea>
                      </div>
                  </div>

              {/* 버튼 */}
              <div className="row mt-4">
                <div className="col-12 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/auth")}
                  >
                    취소
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetHandler}
                  >
                    초기화
                  </button> */}
                  <button type="submit" className="btn btn-primary">
                    저장
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </section>
  </div>
  </div>
    </>
  );
}

export default AuthCreate;
