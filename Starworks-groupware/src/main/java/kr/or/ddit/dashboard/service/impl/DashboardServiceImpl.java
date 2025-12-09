package kr.or.ddit.dashboard.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import kr.or.ddit.dashboard.dto.CntCardDTO;
import kr.or.ddit.dashboard.dto.CurrentProjectDTO;
import kr.or.ddit.dashboard.dto.DepartStatusDTO;
import kr.or.ddit.dashboard.dto.RecentBoardDTO;
import kr.or.ddit.dashboard.dto.TodayScheduleDTO;
import kr.or.ddit.dashboard.service.DashboardService;
import kr.or.ddit.dto.FullCalendarDeptDTO;
import kr.or.ddit.mybatis.mapper.AuthorizationDocumentMapper;
import kr.or.ddit.mybatis.mapper.BoardMapper;
import kr.or.ddit.mybatis.mapper.DepartmentMapper;
import kr.or.ddit.mybatis.mapper.EmailBoxMapper;
import kr.or.ddit.mybatis.mapper.FullCalendarDeptMapper;
import kr.or.ddit.mybatis.mapper.JobGradeMapper;
import kr.or.ddit.mybatis.mapper.MainTaskMapper;
import kr.or.ddit.mybatis.mapper.ProjectMapper;
import kr.or.ddit.mybatis.mapper.TimeAndAttendanceMapper;
import kr.or.ddit.mybatis.mapper.UsersMapper;
import kr.or.ddit.security.CustomUserDetails;
import kr.or.ddit.vacation.controller.VacationRestController;
import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.vo.DepartmentVO;
import kr.or.ddit.vo.JobGradeVO;
import kr.or.ddit.vo.MainTaskVO;
import kr.or.ddit.vo.ProjectVO;
import kr.or.ddit.vo.TimeAndAttendanceVO;
import kr.or.ddit.vo.UsersVO;
import lombok.RequiredArgsConstructor;

/**
 *
 * @author 임가영
 * @since 2025. 10. 15.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 15.     	임가영           최초 생성
 *
 * </pre>
 */
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

	private final TimeAndAttendanceMapper tAndAMapper;
	private final MainTaskMapper mainTaskMapper;
	private final AuthorizationDocumentMapper approvalMapper;
	private final FullCalendarDeptMapper calendarDeptMapper;
	private final EmailBoxMapper emailBoxMapper;
	private final BoardMapper boardMapper;
	private final ProjectMapper projectMapper;
	private final UsersMapper userMapper;

	/**
	 * 출근 기록 + 근무시간 기록
	 */
	@Override
	public Map<String, Object> getAttendanceRecord() {
		Map<String, Object> attendanceRecordMap = new HashMap<>();

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();

		LocalDate now = LocalDate.now();
		TimeAndAttendanceVO tAndAVO = tAndAMapper.selectTimeAndAttendance(username, now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));

		// 출근 시각, 퇴근 시각 가져오기
		if (tAndAVO != null) {
			String workStartTime = (tAndAVO.getWorkBgngDt() != null) ? tAndAVO.getWorkBgngDt().toString() : null;
			String workEndTime = (tAndAVO.getWorkEndDt() != null) ? tAndAVO.getWorkEndDt().toString() : null;

			String workinghours = (tAndAVO.getWorkHr() != null) ? tAndAVO.getWorkHr().toString() : null;

			attendanceRecordMap.put("workStartTime", (workStartTime != null) ? workStartTime.substring(workStartTime.indexOf("T") + 1) : null);
			attendanceRecordMap.put("workEndTime", (workEndTime != null) ? workStartTime.substring(workStartTime.indexOf("T") + 1) : null);
			attendanceRecordMap.put("workinghours", workinghours);
		}

		return attendanceRecordMap;
	}

	/**
	 * 메인화면 카드 카운트
	 * (진행 중인 업무 수, 처리 대기 중인 결재 수, 이번 주 일정, 읽지 않은 메일 수)
	 */
	@Override
	public CntCardDTO getCntCard() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		UsersVO userVO = userDetails.getRealUser();
		String userDeptId = userVO.getDeptId();

		CntCardDTO cntCardDTO = new CntCardDTO();

		Integer mainTaskCnt = 0; // 업무 수
		Integer waitApprovalCnt = 0; // 대기 결재 수
		Integer weekScheduleCnt = 0; // 이번 주 일정 수
		Integer unreadMailCnt = 0; // 읽지않은 메일 수

		// ******* 진행 중인 업무 수
		// 프로젝트가 진행 중이면서 / 업무의 진행 코드가 B402(진행중)인 컬럼 조회
		List<MainTaskVO> mainTaskList = mainTaskMapper.selectMyTaskListNonPaging(username);

		for(MainTaskVO mainTask : mainTaskList) {
			if(mainTask.getTaskSttsCd().equals("B402")) {
				mainTaskCnt++;
			}
		}

		// ******* 확인 해야하는? 처리 대기 중인? 결재 수
		// countMyInboxCombined -> 나에게 온 결재문서 개수
		waitApprovalCnt = approvalMapper.countMyInboxCombined(Map.of("userId", username));


		// ******* 오늘의 일정
		// 개인일정 + 부서일정 가져오기
		FullCalendarDeptDTO deptDTO = new FullCalendarDeptDTO();
		deptDTO.setUserId(username);
		deptDTO.setDeptId(userDeptId);
		List<FullCalendarDeptDTO> deptScheduleList = calendarDeptMapper.selectFullCalendarDeptList(deptDTO);

		// 이번 주 시작과 끝을 계산
		LocalDate today = LocalDate.now();
		WeekFields weekFields = WeekFields.of(Locale.getDefault());
		LocalDate weekStart = today.with(weekFields.dayOfWeek(), 1); // 월요일
		LocalDate weekEnd = today.with(weekFields.dayOfWeek(), 7); // 일요일

		for(FullCalendarDeptDTO deptSchedule : deptScheduleList) {
			LocalDate startDt = deptSchedule.getStartDt().toLocalDate();
			LocalDate endDt = deptSchedule.getEndDt().toLocalDate();

			// 일정이 이번 주와 겹치는지 확인
			boolean overlapsThisWeek = !endDt.isBefore(weekStart) && !startDt.isAfter(weekEnd);
			if(overlapsThisWeek) {
				weekScheduleCnt++;
			}
		}

		// ******* 읽지 않은 메일 수
		// selectUnreadEmailCount -> 읽지 않은 메일 개수 조회
		unreadMailCnt = emailBoxMapper.selectUnreadEmailCount(username, "G101"); // G101 (수신함)

		cntCardDTO.setMainTaskCnt(mainTaskCnt);
		cntCardDTO.setWaitApprovalCnt(waitApprovalCnt);
		cntCardDTO.setWeekScheduleCnt(weekScheduleCnt);
		cntCardDTO.setUnreadMailCnt(unreadMailCnt);

		return cntCardDTO;
	}

	/**
	 * 오늘 일정
	 */
	@Override
	public List<TodayScheduleDTO> getTodayScheDuleList() {

		List<TodayScheduleDTO> todayScheduleList = new ArrayList<>();

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
		UsersVO userVO = userDetail.getRealUser();

		// 개인일정 + 부서일정
		FullCalendarDeptDTO deptDTO = new FullCalendarDeptDTO();
		deptDTO.setUserId(username);
		deptDTO.setDeptId(userVO.getDeptId());
		List<FullCalendarDeptDTO> deptScheduleList = calendarDeptMapper.selectFullCalendarDeptList(deptDTO);

		LocalDate today = LocalDate.now();
		for(FullCalendarDeptDTO deptSchedule : deptScheduleList) {
			LocalDate startDt = deptSchedule.getStartDt().toLocalDate();
			LocalDate endDt = deptSchedule.getEndDt().toLocalDate();

			boolean isAfterNow = today.isAfter(startDt);
			boolean isBeforeNow = today.isBefore(endDt);

			if(isAfterNow && isBeforeNow) {
				// 일정 기간 중일 때
				String pk = deptSchedule.getEventId(); // 일정 Id
				String scheduleNm = deptSchedule.getTitle(); // 일정명
				LocalDateTime startTime = null; // 시작 시각
				LocalDateTime endTime = null; // 종료 시각
				String scheduleType = deptSchedule.getEventType(); // personal / dept
				String userNm = deptSchedule.getUserNm(); // 등록자명
				String description = deptSchedule.getDescription(); // 일정 설명

				UsersVO tempUserVO = userMapper.selectUser(deptSchedule.getUserId());
				String jbgdNm = tempUserVO.getJbgdNm(); // 직급명
				String deptNm = tempUserVO.getDeptNm(); // 부서명

				TodayScheduleDTO todayScheduleDTO = new TodayScheduleDTO(pk, startTime, endTime, scheduleNm, scheduleType, userNm, jbgdNm, deptNm, description);

				todayScheduleList.add(todayScheduleDTO);
			} else {
				// 해당 날짜일 때
				if(startDt.isEqual(today) || endDt.isEqual(today)) {

					String pk = deptSchedule.getEventId(); // 일정 Id
					String scheduleNm = deptSchedule.getTitle(); // 일정명
					LocalDateTime startTime = null; // 시작 시각
					LocalDateTime endTime = null; // 종료 시각
					String scheduleType = deptSchedule.getEventType(); // personal / dept
					String userNm = deptSchedule.getUserNm(); // 등록자명
					String description = deptSchedule.getDescription(); // 일정 설명

					if(deptSchedule.getAllday().equals("Y")) {
						startTime = null; // 시작시간 : 하루종일
					} else {
						startTime = deptSchedule.getStartDt(); // 시작시각 : 일정 시각
						endTime = deptSchedule.getEndDt(); // 종료 시각
					}

					UsersVO tempUserVO = userMapper.selectUser(deptSchedule.getUserId());
					String jbgdNm = tempUserVO.getJbgdNm(); // 직급명
					String deptNm = tempUserVO.getDeptNm(); // 부서명

					TodayScheduleDTO todayScheduleDTO = new TodayScheduleDTO(pk, startTime, endTime, scheduleNm, scheduleType, userNm, jbgdNm, deptNm, description);

					todayScheduleList.add(todayScheduleDTO);
				}
			}
		}

		return todayScheduleList;
	}

	/**
	 * 진행 중인 프로젝트 3개
	 */
	@Override
	public List<CurrentProjectDTO> getCurrentProjectList() {
		List<CurrentProjectDTO> currentProjectList = new ArrayList<>();

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();

		int dashboardCnt = 3;

		List<ProjectVO> myProjectList = projectMapper.selectMyProjectListNonPaging(username);
		for(ProjectVO myProject : myProjectList) {

			if(myProject.getBizSttsCd().equals("진행")) {
				CurrentProjectDTO currentProject = new CurrentProjectDTO();
				currentProject.setPk(myProject.getBizId());
				currentProject.setProjectNm(myProject.getBizNm());
				currentProject.setStartDate(myProject.getStrtBizDt());
				currentProject.setEndDate(myProject.getEndBizDt());
				currentProject.setProgress(myProject.getBizPrgrs());

				currentProjectList.add(currentProject);
			}

			if(currentProjectList.size() == dashboardCnt) {
				break;
			}
		}

		return currentProjectList;
	}

	/**
	 * 최근 공지사항 5개
	 */
	@Override
	public List<RecentBoardDTO> getRecentBoardList() {
		List<RecentBoardDTO> recentBoardList = new ArrayList<>();

		List<BoardVO> boardList = boardMapper.selectNoticeListNonPaging();
		int dashboardCnt = 5;

		for(BoardVO boardVO : boardList) {

			RecentBoardDTO boardDTO = new RecentBoardDTO();
			boardDTO.setPk(boardVO.getPstId());
			boardDTO.setBoardTitle(boardVO.getPstTtl());
			boardDTO.setCrtUserVO(boardVO.getUsers()); // 작성자 모든 정보
			boardDTO.setCrtDt(boardVO.getFrstCrtDt());

			recentBoardList.add(boardDTO);

			if(recentBoardList.size() == dashboardCnt) {
				break;
			}
		}

		return recentBoardList;
	}

	/**
	 * 자기부서의 전체/근무중/휴가,외근 수
	 */
	@Override
	public DepartStatusDTO getDepartStatusCnt() {

		DepartStatusDTO departStatusDTO = new DepartStatusDTO();
		int departCnt = 0; // 전체 팀원 수
		int workingUserCnt = 0; // 현재 근무 중인 팀원 수
		int vacationUserCnt = 0; // 휴가 팀원 수
		int businessTripCnt = 0; // 외근 팀원 수

		// 사용자 정보를 가져온다
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetail = (CustomUserDetails) authentication.getPrincipal();
		UsersVO userVO = userDetail.getRealUser();
		String username = authentication.getName();

		// 사용자 부서를 가져온다
		String deptId = userVO.getDeptId();

		// USERS 테이블에서 내 부서와 하위 부서 정보를 가져온다
		List<UsersVO> departStatusList = userMapper.selectUsersByDept(deptId);

		for(UsersVO departStatus : departStatusList) {
			departCnt++;
			String workStatusCd = departStatus.getWorkSttsCd();
			if (workStatusCd.equals("C101")) { // 근무 중
				workingUserCnt++;
			} else {
				// 휴가, 출장/외근 도 가져와야함

			}
		}

		departStatusDTO.setDepartCnt(departCnt);
		departStatusDTO.setWorkingUserCnt(workingUserCnt);
		departStatusDTO.setVacationUserCnt(vacationUserCnt);
		departStatusDTO.setBusinessTripCnt(businessTripCnt);

		return departStatusDTO;
	}


}
