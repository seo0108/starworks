package kr.or.ddit.calendar.front.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.calendar.front.service.DepartmentScheduleService;
import kr.or.ddit.vo.DepartmentScheduleVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author 장어진
 * @since 2025. 9. 26.
 * @see
 *
 *      <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	장어진	          최초 생성
 *  2025. 9. 27.     	장어진	          Post, Put 생성
 *
 *      </pre>
 */
@Slf4j
@RestController
@RequestMapping("/rest/calendar-depart")
@RequiredArgsConstructor
public class DepartmentScheduleRestController {

	private final DepartmentScheduleService service;

	/**
	 * 부서 일정 목록 전체 조회
	 * 
	 * @return
	 */
	@GetMapping
	public List<DepartmentScheduleVO> readDepartmentScheduleList() {
		return service.readDepartmentScheduleList();
	}

	/**
	 * 부서 일정 단건 조회
	 * 
	 * @param deptSchdId
	 * @return
	 */
	@GetMapping("/{deptSchdId}")
	public DepartmentScheduleVO readDepartmentSchedule(@PathVariable String deptSchdId) {
		return service.readDepartmentSchedule(deptSchdId);
	};

	/**
	 * 부서 일정 추가
	 * @param vo : DepartmentScheduleVO 객체
	 * @return 
	 */
	@PostMapping
	public Map<String, Object> createDepartmentSchedule(@RequestBody DepartmentScheduleVO vo) {
		boolean success = service.createDepartmentSchedule(vo);
		Map<String, Object> result = new HashMap<>();
		result.put("success", success);
		return result;
	}
	
	/**
	 * 부서 일정 수정/삭제
	 * @param vo : DepartmentScheduleVO 객체
	 * @return
	 */
	@PutMapping
	public Map<String, Object> modifyDepartmentSchedule(@RequestBody DepartmentScheduleVO vo) {
		Map<String, Object> result = new HashMap<>();
		try {
			boolean success = service.modifyDepartmentSchedule(vo);
			result.put("success", success);
		} catch (Exception e) {
	        result.put("success", false);
	        result.put("error", e.getMessage());
		}
		return result;
	}
}
