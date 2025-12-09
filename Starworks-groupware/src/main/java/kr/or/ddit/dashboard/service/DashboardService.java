package kr.or.ddit.dashboard.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.dashboard.dto.CntCardDTO;
import kr.or.ddit.dashboard.dto.CurrentProjectDTO;
import kr.or.ddit.dashboard.dto.DepartStatusDTO;
import kr.or.ddit.dashboard.dto.RecentBoardDTO;
import kr.or.ddit.dashboard.dto.TodayScheduleDTO;

/**
 * 대시보드 정보를 가져오는 서비스
 * @author 임가영
 * @since 2025. 10. 15.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 15.     		임가영           최초 생성
 *
 * </pre>
 */
public interface DashboardService {

	/**
	 * 출근 기록 + 근무시간 기록
	 * @return
	 */
	public Map<String, Object> getAttendanceRecord();

	/**
	 * 메인 화면 카드에 카운트를 넣기 위한 DTO
	 * (진행 중인 업무 수, 처리 대기 중인 결재 수, 이번 주 일정, 읽지 않은 메일 수)
	 * @return
	 */
	public CntCardDTO getCntCard();

	/**
	 * 오늘 일정 3개
	 * @return
	 */
	public List<TodayScheduleDTO> getTodayScheDuleList();

	/**
	 * 진행 중인 프로젝트 3개
	 * @return
	 */
	public List<CurrentProjectDTO> getCurrentProjectList();

	/**
	 * 최근 공지사항 5개
	 * @return
	 */
	public List<RecentBoardDTO> getRecentBoardList();

	/**
	 * 자기부서의 전체/근무중/휴가,외근 수
	 * @return
	 */
	public DepartStatusDTO getDepartStatusCnt();

}
