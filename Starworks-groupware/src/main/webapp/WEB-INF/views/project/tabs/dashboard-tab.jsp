<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 17.     	김주민            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!-- 대시보드 탭 Start -->
				<div class="tab-pane fade" id="dashboard-pane" role="tabpanel" aria-labelledby="dashboard-tab">
				    <section class="row mt-3">
				        <div class="col-12">

				            <!-- 1. 프로젝트 진행 현황 -->
				            <div class="card mb-3">
				                <div class="card-header d-flex align-items-center">
				                    <h5 class="card-title mb-0">
				                        <i class="bi bi-calendar-range me-2"></i>프로젝트 진행 현황
				                    </h5>
				                    <!-- 툴팁 추가  -->
				                    <i class="bi bi-question-circle ms-2 text-muted"
				                       style="font-size: 0.9rem; cursor: help;"
				                       data-bs-toggle="tooltip"
				                       data-bs-placement="top"
				                       title="프로젝트의 업무 완료율과 기간 경과율을 비교하여 일정 준수 여부를 확인할 수 있습니다"></i>
				                </div>
				                <div class="card-body">
				                    <!-- 기간 정보 -->
				                    <div class="d-flex justify-content-between align-items-center mb-3">
				                        <div class="text-muted">
				                            <i class="bi bi-calendar3"></i>
				                            <span>${fn:substringBefore(project.strtBizDt, 'T')}</span>
				                            ~
				                            <span>${fn:substringBefore(project.endBizDt, 'T')}</span>
				                        </div>
				                        <span class="badge bg-primary" id="dashboard-days-remaining">
				                            <i class="bi bi-clock"></i> 계산 중...
				                        </span>
				                    </div>

				                    <!-- 두 개의 진행률 표시 -->
				                    <div class="row g-3">
				                        <!-- 업무 진행률 -->
				                        <div class="col-md-6">
				                            <div class="border rounded p-3">
				                                <div class="d-flex justify-content-between align-items-center mb-2">
				                                    <small class="text-muted fw-semibold d-flex align-items-center">
				                                        <i class="bi bi-list-check text-primary"></i>
				                                        <span class="ms-1">업무 진행률</span>
				                                        <!-- ⭐ 업무 진행률 툴팁 ⭐ -->
				                                        <i class="bi bi-info-circle ms-1"
				                                           style="font-size: 0.85rem; cursor: help;"
				                                           data-bs-toggle="tooltip"
				                                           data-bs-placement="top"
				                                           title="완료된 업무 / 전체 업무로 계산됩니다. 실제 작업이 얼마나 완료되었는지 보여줍니다"></i>
				                                    </small>
				                                    <span class="badge bg-primary" id="task-progress-percent">0%</span>
				                                </div>
				                                <div class="progress" style="height: 8px;">
				                                    <div class="progress-bar bg-primary" id="task-progress-bar" style="width: 0%"></div>
				                                </div>
				                                <small class="text-muted d-block mt-1">
				                                    완료 <strong id="completed-count">0</strong> / 전체 <strong id="total-count">0</strong>개
				                                </small>
				                            </div>
				                        </div>

				                        <!-- 기간 경과율 -->
				                        <div class="col-md-6">
				                            <div class="border rounded p-3">
				                                <div class="d-flex justify-content-between align-items-center mb-2">
				                                    <small class="text-muted fw-semibold d-flex align-items-center">
				                                        <i class="bi bi-clock-history text-info"></i>
				                                        <span class="ms-1">기간 경과율</span>
				                                        <!-- 기간 경과율 툴팁 -->
				                                        <i class="bi bi-info-circle ms-1"
				                                           style="font-size: 0.85rem; cursor: help;"
				                                           data-bs-toggle="tooltip"
				                                           data-bs-placement="top"
				                                           title="경과 일수 / 전체 기간으로 계산됩니다. 프로젝트 기간이 얼마나 지났는지 보여줍니다"></i>
				                                    </small>
				                                    <span class="badge bg-info" id="time-progress-percent">0%</span>
				                                </div>
				                                <div class="progress" style="height: 8px;">
				                                    <div class="progress-bar bg-info" id="time-progress-bar" style="width: 0%"></div>
				                                </div>
				                                <small class="text-muted d-block mt-1">
				                                    경과 <strong id="elapsed-days">0</strong> / 전체 <strong id="total-days">0</strong>일
				                                </small>
				                            </div>
				                        </div>
				                    </div>

				                </div>
				            </div>

				            <!-- 2. 업무 진행 현황 (상태별) -->
				            <div class="card mb-3">
				                <div class="card-header d-flex align-items-center">
				                    <h5 class="card-title mb-0">
				                        <i class="bi bi-kanban me-2"></i>업무 진행 현황
				                    </h5>
				                    <!--  툴팁 -->
				                    <i class="bi bi-question-circle ms-2 text-muted"
				                       style="font-size: 0.9rem; cursor: help;"
				                       data-bs-toggle="tooltip"
				                       data-bs-placement="top"
				                       title="전체 업무를 상태별(완료/진행중/미시작/보류)로 분류하여 업무 분포를 한눈에 확인할 수 있습니다"></i>
				                </div>
				                <div class="card-body">
				                    <div class="d-flex justify-content-between align-items-center mb-2">
				                        <small class="text-muted fw-semibold">상태별 업무 분포</small>
				                        <small class="text-muted">총 <span id="dashboard-total-tasks">0</span>건</small>
				                    </div>
				                    <div class="task-status-progress">
				                        <div class="task-status-bar task-status-done"
				                             id="task-status-done-bar"
				                             style="width: 0%;"
				                             data-bs-toggle="tooltip"
				                             title="완료">
				                        </div>
				                        <div class="task-status-bar task-status-doing"
				                             id="task-status-doing-bar"
				                             style="width: 0%;"
				                             data-bs-toggle="tooltip"
				                             title="진행중">
				                        </div>
				                        <div class="task-status-bar task-status-todo"
				                             id="task-status-todo-bar"
				                             style="width: 0%;"
				                             data-bs-toggle="tooltip"
				                             title="미시작">
				                        </div>
				                        <div class="task-status-bar task-status-hold"
				                             id="task-status-hold-bar"
				                             style="width: 0%;"
				                             data-bs-toggle="tooltip"
				                             title="보류">
				                        </div>
				                    </div>
				                    <div class="task-status-legend mt-2">
				                        <span class="task-status-legend-item">
				                            <span class="task-status-legend-color bg-success"></span>
				                            완료 <strong id="task-status-done-count">0</strong>
				                        </span>
				                        <span class="task-status-legend-item">
				                            <span class="task-status-legend-color bg-primary"></span>
				                            진행중 <strong id="task-status-doing-count">0</strong>
				                        </span>
				                        <span class="task-status-legend-item">
				                            <span class="task-status-legend-color bg-secondary"></span>
				                            미시작 <strong id="task-status-todo-count">0</strong>
				                        </span>
				                        <span class="task-status-legend-item">
				                            <span class="task-status-legend-color bg-warning"></span>
				                            보류 <strong id="task-status-hold-count">0</strong>
				                        </span>
				                    </div>
				                </div>
				            </div>

				            <!-- 3. 멤버별 업무 현황 & 진척도 (통합) -->
				            <div class="card mb-3">
				                <div class="card-header d-flex align-items-center">
				                    <h5 class="card-title mb-0">
				                        <i class="bi bi-people me-2"></i>멤버별 업무 현황 & 진척도
				                    </h5>
				                    <!-- 툴팁 -->
				                    <i class="bi bi-question-circle ms-2 text-muted"
				                       style="font-size: 0.9rem; cursor: help;"
				                       data-bs-toggle="tooltip"
				                       data-bs-placement="top"
				                       title="각 멤버가 담당한 업무의 완료율과 상태를 확인할 수 있습니다. 업무 분배 현황을 한눈에 파악하세요"></i>
				                </div>
				                <div class="card-body">
				                    <div class="row">
				                        <!-- 왼쪽: 멤버별 업무 현황 -->
				                        <div class="col-lg-6" id="member-tasks-section">
				                            <h6 class="text-muted mb-3 fw-semibold d-flex align-items-center">
				                                <i class="bi bi-list-check text-primary"></i>
				                                <span class="ms-2">업무 현황</span>
				                                <!-- 서브 툴팁 -->
				                                <i class="bi bi-info-circle ms-1"
				                                   style="font-size: 0.8rem; cursor: help;"
				                                   data-bs-toggle="tooltip"
				                                   data-bs-placement="top"
				                                   title="멤버별 완료/진행/총 업무 개수와 진행률을 보여줍니다"></i>
				                            </h6>
				                            <div id="member-tasks-container">
				                                <!-- JavaScript로 채움 -->
				                                <div class="text-center text-muted py-4">
				                                    <div class="spinner-border spinner-border-sm" role="status">
				                                        <span class="visually-hidden">로딩 중...</span>
				                                    </div>
				                                    <p class="mt-2 mb-0">데이터를 불러오는 중...</p>
				                                </div>
				                            </div>
				                        </div>

				                        <!-- 오른쪽: 멤버별 진척사항 차트 -->
										<div class="col-lg-6" id="member-chart-section">
										    <h6 class="text-muted mb-3 fw-semibold d-flex align-items-center">
										        <i class="bi bi-graph-up-arrow text-success"></i>
										        <span class="ms-2">기간 대비 진척도</span>
										        <i class="bi bi-info-circle ms-1"
										           style="font-size: 0.8rem; cursor: help;"
										           data-bs-toggle="tooltip"
										           data-bs-placement="top"
										           title="각 멤버의 시간 경과율과 실제 진행률을 비교합니다. 실제 진행률이 시간 경과율보다 10% 이상 높으면 '앞서감', 10% 이상 낮으면 '지연', 그 사이면 '정상'으로 표시됩니다"></i>
										    </h6>
										    <div id="member-productivity-chart" class="chart-container">
										        <!-- D3.js 차트 -->
										    </div>
										</div>
				                    </div>
				                </div>
				            </div>

				        </div>
				    </section>
				</div>
				<!-- 대시보드 탭 END -->