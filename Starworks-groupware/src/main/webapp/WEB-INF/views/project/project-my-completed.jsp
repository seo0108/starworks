<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 16.     	김주민            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>진행한 프로젝트</title>
<link rel="stylesheet" href="/css/project.css">
</head>
<body>
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">진행한 프로젝트</div>
					<div class="outline-subtitle">완료된 프로젝트 목록을 확인하고, 과거 프로젝트 정보를 열람할 수 있습니다.</div>
				</div>


				<section class="section">
					<div class="card">
						<div class="card-header">
							<ul class="nav nav-tabs" id="myTab" role="tablist">
								<li class="nav-item" role="presentation">
									<button class="nav-link active" id="projects-tab"
										data-bs-toggle="tab" data-bs-target="#projects" type="button"
										role="tab" aria-controls="projects" aria-selected="true">완료된
										프로젝트</button>
								</li>
							</ul>
						</div>
						<div class="card-body">
							<div class="tab-content" id="myTabContent">

								<div class="tab-pane fade show active" id="projects"
									role="tabpanel" aria-labelledby="projects-tab">
									<div class="table-responsive">
										<table class="table table-hover table-lg" id="projects-table">
											<thead>
												<tr>
													<th>프로젝트명</th>
													<th>참여자</th>
													<th>기간</th>
													<th>상태</th>
													<th>진행률</th>
													<th>최근 코멘트</th>
												</tr>
											</thead>
											<tbody>
												<c:choose>
													<c:when test="${not empty projectList}">
														<c:forEach items="${projectList}" var="project">
															<tr
																class="${project.bizSttsCd eq '완료' ? 'project-completed' : ''}">
																<td><c:choose>
																		<c:when test="${project.bizSttsCd eq '승인 대기'}">
																			<span class="text-muted" style="cursor: not-allowed;"
																				data-bs-toggle="tooltip"
																				title="프로젝트 승인 후에 사용 가능합니다.">
																				${project.bizNm} <i class="bi bi-lock-fill ms-1"></i>
																			</span>
																		</c:when>
																		<c:otherwise>
																			<a href="/projects/${project.bizId}">
																				${project.bizNm} <c:if
																					test="${project.bizSttsCd eq '완료'}">
																					<i
																						class="bi bi-check-circle-fill text-success ms-1"
																						data-bs-toggle="tooltip" title="완료된 프로젝트 (읽기 전용)"></i>
																				</c:if>
																			</a>
																		</c:otherwise>
																	</c:choose></td>
																<td>
																	<div class="avatar-group">
																		<c:forEach items="${project.members}" var="member"
																			begin="0" end="2">
																			<div class="avatar avatar-md"
																				data-bs-toggle="tooltip" title="${member.bizUserNm}">
																				<c:choose>
																		            <c:when test="${not empty member.filePath}">
																		                <img src="${member.filePath}" alt="${member.bizUserNm}">
																		            </c:when>
																		            <c:otherwise>
																		                <img src="/images/faces/1.jpg" alt="${member.bizUserNm}">
																		            </c:otherwise>
																		        </c:choose>
																			</div>
																		</c:forEach>
																		<c:if test="${fn:length(project.members) > 3}">
																			<div class="avatar avatar-sm bg-secondary">
																				<span class="avatar-content">+${fn:length(project.members) - 3}</span>
																			</div>
																		</c:if>
																	</div>
																</td>
																<td>${fn:substringBefore(project.strtBizDt, 'T')}~
																	${fn:substringBefore(project.endBizDt, 'T')}</td>
																<td><c:choose>
																		<c:when test="${project.bizSttsCd eq '승인 대기'}">
																			<span class="badge bg-light-primary">승인대기</span>
																		</c:when>
																		<c:when test="${project.bizSttsCd eq '진행'}">
																			<span class="badge bg-primary">진행</span>
																		</c:when>
																		<c:when test="${project.bizSttsCd eq '보류'}">
																			<span class="badge bg-secondary">보류</span>
																		</c:when>
																		<c:when test="${project.bizSttsCd eq '완료'}">
																			<span class="badge bg-success">완료</span>
																		</c:when>
																		<c:when test="${project.bizSttsCd eq '취소'}">
																			<span class="badge bg-danger">취소</span>
																		</c:when>
																		<c:otherwise>
																			<span class="badge bg-light-secondary">${project.bizSttsCd}</span>
																		</c:otherwise>
																	</c:choose></td>
																<td>${project.bizPrgrs}%
																	<div class="progress progress-sm">
																		<div class="progress-bar bg-info" role="progressbar"
																			style="width: ${project.bizPrgrs}%"></div>
																	</div>
																</td>
																<td><span class="text-muted fst-italic">-</span></td>
															</tr>
														</c:forEach>
													</c:when>
													<c:otherwise>
														<tr>
															<td colspan="6" class="text-center py-5"><i
																class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
																<p class="text-muted fs-5 mt-3 mb-0">현재 완료된 프로젝트가 없습니다.</p></td>
														</tr>
													</c:otherwise>
												</c:choose>
											</tbody>
										</table>
									</div>
									<div id="pagination-container"
										class="d-flex justify-content-center mt-4">${pagingHTML}</div>
								</div>

							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

	<script src="/js/projects/project-myproject.js"></script>

	<script>
function fnPaging(page){
    console.log("페이지 이동:", page);

    // '진행한 프로젝트' 목록을 가져오는 엔드포인트 사용: /rest/project/my/completed로 변경
    fetch('/rest/project/my/completed?page=' + page)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                alert('로그인이 필요합니다.');
                return;
            }

            const tbody = document.querySelector('#projects-table tbody');
            let allRows = '';

            if(data.projectList && data.projectList.length > 0) {
                data.projectList.forEach(project => {
                    const startDate = project.strtBizDt ? project.strtBizDt.substring(0, 10) : '';
                    const endDate = project.endBizDt ? project.endBizDt.substring(0, 10) : '';
                    const progress = project.bizPrgrs || 0;

                 	// 프로젝트명
                    let projectNameHTML = '';
                    if(project.bizSttsCd === '승인 대기') {
                        // 완료 프로젝트 목록에는 승인 대기가 없어야 하지만, 로직 안전을 위해 유지
                        projectNameHTML = '<span class="text-muted" ' +
                                         'style="cursor: not-allowed;" ' +
                                         'data-bs-toggle="tooltip" ' +
                                         'title="프로젝트 승인 후에 사용 가능합니다.">' +
                                         project.bizNm +
                                         ' <i class="bi bi-lock-fill ms-1"></i></span>';
                    } else {
                        // 나머지는 링크 활성화
                        projectNameHTML = '<a href="/projects/' + project.bizId + '">' + project.bizNm;
                        if(project.bizSttsCd === '완료') {
                            projectNameHTML += ' <i class="bi bi-check-circle-fill text-success ms-1" ' +
                                              'data-bs-toggle="tooltip" ' +
                                              'title="완료된 프로젝트 (읽기 전용)"></i>';
                        }
                        projectNameHTML += '</a>';
                    }

                    // 멤버 HTML
                    let membersHTML = '<div class="avatar-group">';
					if(project.members && project.members.length > 0) {
					    project.members.slice(0, 3).forEach(member => {
					        membersHTML += '<div class="avatar avatar-sm" ' +
					                      'data-bs-toggle="tooltip" ' +
					                      'title="' + member.bizUserNm + '">' +
					                      '<img src="/images/faces/1.jpg"></div>';
					    });
					    if(project.members.length > 3) {
					        membersHTML += '<div class="avatar avatar-sm bg-secondary" ' +
					                      'data-bs-toggle="tooltip" ' +
					                      'title="외 ' + (project.members.length - 3) + '명">' +
					                      '<span class="avatar-content">+' + (project.members.length - 3) + '</span></div>';
					    }
					}
					membersHTML += '</div>';

                    // 상태 뱃지
                    let statusBadge = '';
                    if(project.bizSttsCd === '승인 대기') {
                        statusBadge = '<span class="badge bg-light-primary">승인대기</span>';
                    } else if(project.bizSttsCd === '진행') {
                        statusBadge = '<span class="badge bg-primary">진행</span>';
                    } else if(project.bizSttsCd === '보류') {
                        statusBadge = '<span class="badge bg-secondary">보류</span>';
                    } else if(project.bizSttsCd === '완료') {
                        statusBadge = '<span class="badge bg-success">완료</span>';
                    } else if(project.bizSttsCd === '취소') {
                        statusBadge = '<span class="badge bg-danger">취소</span>';
                    } else {
                        statusBadge = '<span class="badge bg-light-secondary">' + project.bizSttsCd + '</span>';
                    }

                    allRows += '<tr class="' + (project.bizSttsCd === '완료' ? 'project-completed' : '') + '">' +
                    	'<td>' + projectNameHTML + '</td>' +
                        '<td>' + membersHTML + '</td>' +
                        '<td>' + startDate + ' ~ ' + endDate + '</td>' +
                        '<td>' + statusBadge + '</td>' +
                        '<td>' + progress + '%' +
                            '<div class="progress progress-sm">' +
                                '<div class="progress-bar bg-info" style="width: ' + progress + '%"></div>' +
                            '</div>' +
                        '</td>' +
                        '<td><span class="text-muted fst-italic">-</span></td>' +
                    '</tr>';
                });
            } else {
                // 데이터가 없을 때 메시지 변경
                allRows = '<tr><td colspan="6" class="text-center py-5"><i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i><p class="text-muted fs-5 mt-3 mb-0">현재 완료된 프로젝트가 없습니다.</p></td></tr>';
            }

            tbody.innerHTML = allRows;
            document.getElementById('pagination-container').innerHTML = data.pagingHTML;

         	//  툴팁 재초기화
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                new bootstrap.Tooltip(el);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('데이터를 불러오는데 실패했습니다.');
        });
}
// 초기 로드 시 툴팁 재초기화
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
    });
});
</script>
</body>
</html>