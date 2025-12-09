package kr.or.ddit.calendar.users.controller;

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

import kr.or.ddit.calendar.users.service.UserScheduleService;
import kr.or.ddit.vo.UserScheduleVO;
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
 *  2025. 9. 27.     	장어진	          Post, Put 
 *
 *      </pre>
 */
@Slf4j
@RestController
@RequestMapping("/rest/calendar-user")
@RequiredArgsConstructor
public class UserScheduleRestController {

	private final UserScheduleService service;
	
	/**
	 * 개인 일정 목록 조회
	 * @return null일 시, list.size() == 0
	 */
	@GetMapping
	public List<UserScheduleVO> readUserScheduleList() {
		return service.readUserScheduleList();
	}

	/**
	 * 개인 일정 상세 조회
	 * @param userSchdId
	 * @return
	 */
	@GetMapping("/{userSchdId}")
	public UserScheduleVO readUserSchedule(@PathVariable String userSchdId) {
		return service.readUserSchedule(userSchdId);
	}

	/**
	 * 개인 일정 추가
	 * @param vo : UserScheduleVO 객체
	 * @return
	 */
	@PostMapping
	public Map<String, Object> createUserSchedule(@RequestBody UserScheduleVO vo) {
		log.info("========> VO : {}", vo);
		boolean success = service.createUserSchedule(vo);
		Map<String, Object> result = new HashMap<>();
		result.put("success", success);
		return result;
	}
	
	/**
	 * 개인 일정 수정/삭제
	 * @param vo : UserScheduleVO 객체
	 * @return
	 */
	@PutMapping
	public Map<String, Object> modifyUserSchedule(@RequestBody UserScheduleVO vo) {
		log.info("========> VO : {}", vo);
		Map<String, Object> result = new HashMap<>();

		try {
			boolean success = service.modifyUserSchedule(vo);
			result.put("success", success);
			log.info("========> 서비스 호출 성공, 결과 : {}", success);
		} catch (Exception e) {
	        log.error("!!!!!!!!! modifyUserSchedule 처리 중 예외 발생 !!!!!!!!!", e);
	        result.put("success", false);
	        result.put("error", e.getMessage());
		}
		
		return result;
	}	
}
