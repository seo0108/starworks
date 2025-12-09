import React, { useEffect, useState } from 'react'
import axiosInst from '../../api/apiClient'
import { showToast } from '../../api/sweetAlert';
import './Approval.css'

function Approval() {

  const [activeTab, setActiveTab] = useState("active"); // "active" = 현재 사용 중, "inactive" = 보관됨
  
  const [templateList, setTemplateList] = useState([]);
  const [htmlContents, setHtmlContents] = useState(""); // html -> 문자열로 변환된 데이터

  const [editTarget, setEditTarget] = useState(""); // 수정할 대상
  const [previewHtmlContents, setpreviewHtmlContents] = useState(""); // 미리보기 대상 htmlContents
  const [atrzNm, setAtrzNm] = useState(""); // 타이틀
  const [secureLvl, setSecureLvl] = useState(""); // 보안 등급
  const [saveYear, setSaveYer] = useState(""); // 보존 연한
  const [category, setCategory] = useState(""); // 카테고리
  const [description, setDescription] = useState(""); // 상세설명

  const [checkedTmpl, setCheckedTmpl] = useState([]); // 선택된 템플릿 리스트


  //페이징처리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 10개씩


  useEffect(() => {
    getApprovalTemplate();

  }, []);

  const fillFormWithoutFile = () => {
  const preset = {
    atrzDocTmplNm: "매출 보고서",
    atrzDescription: "매출 현황과 분석 내용을 보고하고 결재 받기 위한 문서",
    atrzCategory: "finance",
    atrzSecureLvl: 2,
    atrzSaveYear: 3,
  };

  // DOM 기반으로 값 할당
  document.querySelector("input[name='atrzDocTmplNm']").value = preset.atrzDocTmplNm;
  document.querySelector("textarea[name='atrzDescription']").value = preset.atrzDescription;
  document.querySelector("select[name='atrzCategory']").value = preset.atrzCategory;
  document.querySelector("select[name='atrzSecureLvl']").value = preset.atrzSecureLvl;
  document.querySelector("input[name='atrzSaveYear']").value = preset.atrzSaveYear;
}

  // 체크박스 핸들러
  const templateCheckHandler = (e) => {
    const template = e.target.value;

    if(e.target.checked) {
      setCheckedTmpl((prev) => [...prev, template]);
    } else {
      setCheckedTmpl((prev) => prev.filter((v) => v !== template));
    }
  }

  // 삭제 핸들러
  const removeConfirmHandler = async (e) => {
    if(!checkedTmpl) return;

    let delYn = "";
    if(activeTab === "active") {
      delYn = "Y"
    } else {
      delYn = "N"
    }

    const jsonData = {
        "checkedTmpl" : checkedTmpl,
        "delYn" : delYn
      };

    const resp = await axiosInst.delete("/approval-template", {
                                          data: jsonData,
                                          headers: { "Content-Type": "application/json" },
                                        });
    const data = await resp.data;

    if (data.success) {
      {activeTab === "active" ? showToast("trash", "비활성화 되었습니다") : showToast("success", "활성화 되었습니다")}
      getApprovalTemplate();
      setCheckedTmpl([]);
    } else {
      showToast("error", "처리에 실패하였습니다.");
    }

    // 모달 닫기
      const modalEl = document.getElementById("removeConfirmModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
  }

  // 수정폼 제출 핸들러
  const editFormHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const editTemplate = Object.fromEntries(formData.entries());
    
    modifyTemplate(editTemplate);
    
  }

  // 수정 폼 제출
  const modifyTemplate = async (editTemplate) => {
    const resp = await axiosInst.put("/approval-template", editTemplate);
    const data = await resp.data;


    if(data.success) {
        showToast("success", "수정에 성공하였습니다.");
        getApprovalTemplate();

        // 모달 닫기
        const modalEl = document.getElementById("editTemplateModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();

      } else {
        if(data.message != null) {
          showToast("info", "필수 값을 입력하세요.");
        } else {
          showToast("error", "수정에 실패하였습니다.");
        }
      }
  }
  
  // 등록폼 제출 핸들러
  const templateFormHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newTemplate = Object.fromEntries(formData.entries());
    
    newTemplate.htmlContents = htmlContents;
    createTemplate(newTemplate, e);
  }

  const createTemplate = async (newTemplate, e) =>  {
      const resp = await axiosInst.post("/approval-template", newTemplate);
      const data = await resp.data;

      if(data.success) {
        showToast("success", "등록에 성공하였습니다.");
        getApprovalTemplate();
        setActiveTab("active");
        e.target.reset();
      } else {
        if(data.message != null) {
          showToast("info", "필수 값을 입력하세요.");
        } else {
          showToast("error", "등록에 실패하였습니다.");
        }
      }
  }

  // 템플릿 리스트 가져오기
  const getApprovalTemplate = async () => {
    const resp = await axiosInst.get("/approval-template");
    const data = await resp.data;

    setTemplateList(data);

    console.log(data)
  }

  // html -> 텍스트 데이터로
  const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const htmlContent = e.target.result; // 여기에 HTML 코드가 문자열로 들어옴

          setHtmlContents(htmlContent);
        };
        reader.readAsText(file, "UTF-8");
      };

    // 필터 먼저 (active/inactive)
    const filteredTemplates = templateList.filter(template =>
      activeTab === "active" ? template.delYn === 'N' : template.delYn === 'Y'
    );

    // slice 계산은 filteredTemplates 기준으로!
    const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentTemplates = filteredTemplates.slice(indexOfFirst, indexOfLast);

  return (
    <>
     <div className='content-wrapper container'>
        <div className="page-heading">
            <h3>결재품의서 관리</h3>
            <p className="text-subtitle text-muted">전자결재 품의서를 생성하고 수정하며 관리합니다.</p>
        </div>
        <div className="page-content">

          {/* 양식 생성 폼 */}
          <form id="templateCreateForm" onSubmit={templateFormHandler}>
            <section className="section">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title" style={{ cursor: "default" }} onClick={fillFormWithoutFile}>신규 품의서 등록</h4>
                </div>
                <div className="card-body">
                  {/* 양식명 + 보존연한 한 줄 배치 */}
                  <div className="row mb-3">
                    <div className="col-md-5">
                      <label htmlFor="formName" className="form-label">품의서명 <span className="text-danger">*</span></label>
                      <input type="text" name="atrzDocTmplNm" className="form-control" id="formName" placeholder="양식명을 입력하세요" />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="formCategory" className="form-label">카테고리</label>
                      <select name="atrzCategory" className="form-select">
                        <option value="">문서 카테고리 선택</option>
                        <option value="hr">인사</option>
                        <option value="finance">재무/회계</option>
                        <option value="sales">영업/마케팅</option>
                        <option value="it">개발/IT</option>
                        <option value="pro">신제품/프로젝트</option>
                        <option value="logistics">물류</option>
                        <option value="trip">출장/외근</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="formCategory" className="form-label">보안등급</label>
                      <select name="atrzSecureLvl" className="form-select">
                        <option value="">보안등급 선택</option>
                        <option value="1">낮음 (외부 공유 가능)</option>
                        <option value="2">보통 (사내 직원만 열람 가능)</option>
                        <option value="3">높음 (기안자와 결재자만 열람 가능)</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="formRetention" className="form-label">보존연한 (년)</label>
                      <input type="number" name="atrzSaveYear" className="form-control" id="formRetention" placeholder="보존 연한" />
                    </div>
                  </div>

                  {/* 설명 */}
                  <div className="mb-3">
                    <label htmlFor="formDescription" className="form-label">설명</label>
                    <textarea name="atrzDescription" className="form-control" id="formDescription" rows={3} placeholder="양식에 대한 설명을 입력하세요"></textarea>
                  </div>

                  {/* 파일 업로드 */}
                  <label htmlFor="formDescription" className="form-label">품의서 html 파일 <span className="text-danger">*</span></label>
                  <div className="input-group mb-3">
                    <input type="file" name="htmlData" className="form-control" id="formFile" accept=".html" onChange={handleFileChange}/>
                    <button className="btn btn-primary" type="submit" id="registerBtn" >등록</button>
                  </div>

                  <p className="text-muted">HTML 파일을 선택하고 '등록' 버튼을 클릭하세요.</p>
                </div>
              </div>
            </section>
          </form>

            <section className="section">
                  <div className="card">
                      <div className="card-header">
                          <h4 className="card-title">등록된 품의서 목록</h4>
                      </div>

                      <div className="card-body">

                          <ul className="nav nav-tabs mb-3">
                            <li className="nav-item"><button className={`nav-link ${activeTab === "active" ? "active" : ""}`} onClick={() => setActiveTab("active")}>현재 사용 중</button></li>
                            <li className="nav-item"><button className={`nav-link ${activeTab === "inactive" ? "active" : ""}`} onClick={() => setActiveTab("inactive")}>보관됨 / 사용 중지됨</button></li>
                          </ul>

                          <table className="table table-hover" id="formTable">
                              <thead style={{ borderTop: "2px solid #dee2e6" }}>
                                  <tr>
                                      <th>
                                        {/* <input className="form-check-input" type="checkbox" id="selectAllCheck" 
                                          onClick={() => {
                                            const checkboxes = document.querySelectorAll(
                                              'input[name="template"]'
                                            );
                                            const allChecked = Array.from(checkboxes).every(
                                              (chk) => chk.checked
                                            )
                                            checkboxes.forEach((chk) => (chk.checked = !allChecked));
                                          }}
                                          /> */}
                                      </th>
                                       <th className="id-col text-center">템플릿 ID</th>
                                        <th className="category-col">카테고리</th>
                                        <th className="name-col">양식명</th>
                                        <th className="text-center">설명</th>
                                        <th className="secure-col text-center">보안등급</th>
                                        <th className="save-col text-center">보존연한</th>
                                        <th className="date-col text-center">등록일</th>
                                        <th className="preview-col text-center">미리보기</th>
                                        <th className="action-col text-center">작업</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {currentTemplates.map((template)=>
                                  /* .filter(template => activeTab === "active" ? template.delYn === 'N' : template.delYn === 'Y')
                                  .map((template) => */ (
                                  <tr key={template.atrzDocTmplId}>
                                    <td><input className="form-check-input" type="checkbox" name="template" value={template.atrzDocTmplId} onChange={templateCheckHandler} checked={checkedTmpl.includes(template.atrzDocTmplId)}/></td>
                                    <td>{template.atrzDocTmplId}</td>
                                    <td>
                                        {{
                                            hr: '👤 인사',
                                            finance: '💵 재무/회계',
                                            sales: '📈 영업/마케팅',
                                            it: '🖥️ 개발/IT',
                                            pro: '📑 신제품/프로젝트',
                                            logistics: '📦 물류',
                                            trip: '🚗 출장/외근',
                                          }[template.atrzCategory] || '기타'}
                                    </td>
                                    <td>{template.atrzDocTmplNm}</td>
                                    <td>{template.atrzDescription}</td>
                                    <td className="text-center">
                                      {template.atrzSecureLvl == '1' ? '낮음' : null}
                                      {template.atrzSecureLvl == '2' ? '보통' : null}
                                      {template.atrzSecureLvl == '3' ? '높음' : null}

                                    </td>
                                    <td className="text-center">{template.atrzSaveYear}년</td>
                                    <td className="text-center">{template.crtDt.split('T')[0]}</td>
                                    <td className="text-center">
                                      <button className="btn btn-sm btn-outline-info preview-btn" 
                                         data-form-name={template.atrzDocTmplNm} 
                                         onClick={() => {
                                          setAtrzNm(template.atrzDocTmplNm);
                                          setpreviewHtmlContents(template.htmlContents)}}
                                         data-bs-toggle="modal" 
                                         data-bs-target="#htmlContentsModal">
                                        미리보기
                                      </button>
                                    </td>
                                    <td className="text-center">
                                      <button className="btn btn-sm btn-outline-primary" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#editTemplateModal"
                                        onClick={() => {
                                          setEditTarget(template.atrzDocTmplId);
                                          setAtrzNm(template.atrzDocTmplNm);
                                          setCategory(template.atrzCategory);
                                          setSecureLvl(template.atrzSecureLvl);
                                          setSaveYer(template.atrzSaveYear);
                                          setDescription(template.atrzDescription);
                                        }}
                                        >
                                        수정</button>
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
                                    onClick={() => setCurrentPage(i + 1)}
                                    className="page-link"
                                  >
                                    {i + 1}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </nav>

                          <div className="dataTable-bottom text-center text-muted small">
                            Showing {indexOfFirst + 1} to{" "}
                            {Math.min(indexOfLast, filteredTemplates.length)} of {filteredTemplates.length} entries
                          </div>
                          
                          <button 
                            className={`btn ${activeTab === "active" ? "btn-danger"  : "btn-primary"}`} 
                            id="deleteBtn"
                            data-bs-toggle="modal" 
                            data-bs-target="#removeConfirmModal"
                          >{activeTab === "active" ? `선택 항목 비활성화` : `선택 항목 활성화`}</button>
                      </div>
                  </div>
              </section>

        </div>
    </div>

    <div className="modal fade modal-lg" id="htmlContentsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" >
        <div className="modal-dialog modal-dialog-centered modal-dialog-centered modal-dialog-scrollable" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalCenterTitle">{atrzNm}
                    </h5>
                </div>
                <div className="modal-body">
                    {/* dangerouslySetInnerHTML={{ __html: previewHtmlContents }} */}
                    <div id="previewHtmlContents" dangerouslySetInnerHTML={{ __html: previewHtmlContents }} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary ms-1 w-100" data-bs-dismiss="modal">
                        <i className="bx bx-check d-block d-sm-none"></i>
                        <span className="d-none d-sm-block ">닫기</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    {/* 수정 모달 */}
    <div className="modal fade" id="editTemplateModal" tabIndex="-1" aria-labelledby="editTemplateModalLabel" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="editTemplateModalLabel">결재양식 수정</h5>
                </div>
                <div className="modal-body">

                  <form id="editTemplateForm" onSubmit={editFormHandler}>
                    <input type="hidden" name="atrzDocTmplId" value={editTarget} />
                    <div className="col-md-12 mb-3">
                      <label htmlFor="formName" className="form-label">양식명 <span className="text-danger">*</span></label>
                      <input type="text" name="atrzDocTmplNm" value={atrzNm} className="form-control" id="formName" placeholder="양식명을 입력하세요" onChange={(e) => setAtrzNm(e.target.value)}/>
                    </div>
                      <div className="col-md-12 mb-3">
                        <label htmlFor="formCategory" className="form-label">카테고리</label>
                        <select name="atrzCategory" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                          <option value="">문서 카테고리 선택</option>
                          <option value="hr">인사</option>
                          <option value="finance">재무/회계</option>
                          <option value="sales">영업/마케팅</option>
                          <option value="it">개발/IT</option>
                          <option value="pro">신제품/프로젝트</option>
                          <option value="logistics">물류</option>
                          <option value="trip">출장/외근</option>
                        </select>
                      </div>
                    <div className="row mb-12 mb-3">
                      <div className="col-md-7">
                        <label htmlFor="formCategory" className="form-label">보안등급</label>
                        <select name="atrzSecureLvl" className="form-select" value={secureLvl} onChange={(e) => setSecureLvl(e.target.value)}>
                          <option value="" >보안등급 선택</option>
                          <option value="1">낮음 (외부 공유 가능)</option>
                          <option value="2">보통 (사내 직원만 열람 가능)</option>
                          <option value="3">높음 (기안자와 결재자만 열람 가능)</option>
                        </select>
                      </div>
                      <div className="col-md-5">
                        <label htmlFor="formRetention" className="form-label">보존연한 (년)</label>
                        <input type="number" name="atrzSaveYear" value={saveYear} className="form-control" id="formRetention" placeholder="보존 연한" onChange={(e) => setSaveYer(e.target.value)} />
                      </div>
                    </div>

                    {/* 설명 */}
                    <div className="mb-3">
                      <label htmlFor="formDescription" className="form-label" >설명</label>
                      <textarea name="atrzDescription" value={description} className="form-control" id="formDescription" rows={3} placeholder="양식에 대한 설명을 입력하세요" onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                      <button className="btn btn-primary" type="submit">저장</button>
                    </div>
                </form>
              </div>
            </div>
          </div>  
        </div>

      {/* 템플릿 삭제 확인 모달 */}
      <div className="modal fade" id="removeConfirmModal" tabIndex="-1" aria-labelledby="removeConfirmModal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className={`modal-header ${activeTab === 'active' ? 'bg-warning' : 'bg-primary'}`}>
              <h5 className="modal-title white" id="removeConfirmModal">{activeTab === "active" ? `결재양식 비활성화` : `결재양식 활성화`}</h5>
            </div>
            <div className="modal-body">
              <p>{activeTab === "active" ? `선택한 결재양식을 비활성화 하시겠습니까?` : `선택한 결재양식을 활성화 하시겠습니까?`}</p>
              
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
              <button type="button" className={`btn ${activeTab === "active" ? "btn-warning ms-1" : "btn-primary ms-1"}`} onClick={removeConfirmHandler}>확인</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Approval