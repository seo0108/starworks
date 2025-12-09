package kr.or.ddit.project.mngt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.comm.paging.PaginationInfo;
import kr.or.ddit.comm.paging.renderer.MazerPaginationRenderer;
import kr.or.ddit.comm.paging.renderer.PaginationRenderer;
import kr.or.ddit.mybatis.mapper.ProjectMemberMapper;
import kr.or.ddit.project.mngt.service.projectService;
import kr.or.ddit.security.CustomUserDetails;
import kr.or.ddit.task.main.service.MainTaskService;
import kr.or.ddit.vo.MainTaskVO;
import kr.or.ddit.vo.ProjectMemberVO;
import kr.or.ddit.vo.ProjectVO;
import lombok.RequiredArgsConstructor;


/**
 *
 * @author 김주민
 * @since 2025. 9. 26.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	김주민	          최초 생성
 *  2025. 10. 11.		김주민			  completeProject 추가
 *  2025. 10. 16. 		김주민			  내 프로젝트 컨트롤러 분리
 *
 * </pre>
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/project")
public class ProjectRestController {

	private final projectService service;
	private final ProjectMemberMapper projectMemberMapper;
	private final MainTaskService mainTaskService;

	/**
	 * 프로젝트 멤버 조회
	 */
	@GetMapping("/{bizId}/members")
	public List<ProjectMemberVO> getProjectMembers(@PathVariable String bizId) {
	    return projectMemberMapper.selectProjectMemberByProject(bizId);
	}

	/**
     * 프로젝트 취소 처리 (상태: B305)
     * JavaScript의 handleProjectCancel 함수와 연결됩니다.
     * @param bizId 프로젝트 ID
     * @return 성공 여부
     */
    @PostMapping("/{bizId}/cancel")
    public Map<String, Object> cancelProject(@PathVariable String bizId) {
        try {
            // Service 레이어 호출
            boolean success = service.removeProject(bizId);

            if (success) {
                return Map.of("success", true, "message", "프로젝트가 성공적으로 취소되었습니다.");
            } else {
                return Map.of("success", false, "message", "취소 처리에 실패했습니다. 프로젝트 ID를 확인하세요.");
            }

        } catch (Exception e) {
            // 예외 발생 시 500 상태 코드 대신 Map으로 실패 메시지 반환
            return Map.of("success", false, "message", "오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 프로젝트 복원 처리 (취소된 프로젝트를 진행 중으로 복원: B302)
     * @param bizId 프로젝트 ID
     * @return 성공 여부
     */
    @PatchMapping("/{bizId}/restore")
    public Map<String, Object> restoreProject(@PathVariable String bizId) {
        try {
            // Service 레이어 호출 - 상태를 B302(진행)로 변경
            boolean success = service.restoreProject(bizId);

            if (success) {
                return Map.of("success", true, "message", "프로젝트가 성공적으로 복원되었습니다.");
            } else {
                return Map.of("success", false, "message", "복원 처리에 실패했습니다. 프로젝트 ID를 확인하세요.");
            }

        } catch (Exception e) {
            return Map.of("success", false, "message", "오류가 발생했습니다: " + e.getMessage());
        }
    }

	/**
	 * 프로젝트 완료 처리
	 * @param bizId 프로젝트 ID
	 * @return 성공 여부
	 */
	@PostMapping("/{bizId}/complete")
	public Map<String, Object> completeProject(@PathVariable String bizId) {
		try {
	        boolean success = service.completeProject(bizId);

	        if (success) {
	            return Map.of("success", true, "message", "프로젝트가 완료 처리되었습니다.");
	        } else {
	            return Map.of("success", false, "message", "완료 처리에 실패했습니다.");
	        }

	    } catch (Exception e) {
	        return Map.of("success", false, "message", "오류가 발생했습니다: " + e.getMessage());
	    }
	}

	/**
	 * 전체 프로젝트 목록 확인 RestController
	 * @return 조회 결과 없으면 list.size() == 0
	 */
	@GetMapping
	public List<ProjectVO> readProjectListNonPaging(){
		return service.readProjectListNonPaging();
	}

	/**
	 * 프로젝트 단건 상세 조회 RestController
	 * @param bizId
	 * @return 조회 결과가 없으면 0 으로 false
	 */
	@GetMapping("/{bizId}")
	public ProjectVO readProject(@PathVariable String bizId) {
		return service.readProject(bizId);
	}

	/**
	 * 내 프로젝트 목록 페이징 조회 (AJAX용)
	 * @param page 페이지 번호
	 * @param userDetails 로그인 사용자 정보
	 * @return 프로젝트 목록 + 페이징 정보
	 */
	@GetMapping("/my")
	public Map<String, Object> readMyProjectList(
			@RequestParam(required = false, defaultValue = "1") int page,
			@AuthenticationPrincipal CustomUserDetails userDetails) {

		if (userDetails == null) {
			return Map.of("error", "unauthorized");
		}

		String userId = userDetails.getUsername();
		PaginationInfo<ProjectVO> paging = new PaginationInfo<>(6, 5);
		paging.setCurrentPage(page);

		List<ProjectVO> projectList = service.readMyProjectList(userId, paging);

		// 각 프로젝트의 참여자 목록 추가
		for (ProjectVO project : projectList) {
			List<ProjectMemberVO> members = projectMemberMapper.selectProjectMemberByProject(project.getBizId());
			project.setMembers(members);
		}

		PaginationRenderer renderer = new MazerPaginationRenderer();
		String pagingHTML = renderer.renderPagination(paging, "fnProjectPaging");  // fnPaging -> fnProjectPaging 변경

		return Map.of(
			"projectList", projectList,
			"pagingHTML", pagingHTML,
			"totalCount", paging.getTotalRecord()
		);
	}

	/**
	 * 내 업무 목록 페이징 조회 - 상태별 필터링 추가
	 */
	@GetMapping("/my/tasks")
	public Map<String, Object> readMyTaskList(
	        @RequestParam(required = false, defaultValue = "1") int page,
	        @RequestParam(required = false) String status, // 상태 필터 추가
	        @AuthenticationPrincipal CustomUserDetails userDetails) {

	    if (userDetails == null) {
	        return Map.of("error", "unauthorized");
	    }

	    String userId = userDetails.getUsername();
	    PaginationInfo<MainTaskVO> taskPaging = new PaginationInfo<>(6, 5);
	    taskPaging.setCurrentPage(page);

	    List<MainTaskVO> myTaskList;

	    // 상태 필터가 있으면 해당 상태의 업무만 조회
	    if (status != null && !status.equals("all")) {
	        myTaskList = mainTaskService.readMyTaskListByStatus(userId, status, taskPaging);
	    } else {
	        myTaskList = mainTaskService.readMyTaskList(userId, taskPaging);
	    }

	    PaginationRenderer renderer = new MazerPaginationRenderer();
	    String pagingHTML = renderer.renderPagination(taskPaging, "fnTaskPaging");

	    return Map.of(
	        "myTaskList", myTaskList,
	        "pagingHTML", pagingHTML,
	        "totalCount", taskPaging.getTotalRecord()
	    );
	}


	/**
	 * 내 프로젝트 목록 페이징 조회 (AJAX용) - 진행 중인 프로젝트 (B301, B302, B303)
	 * @param page 페이지 번호
	 * @param userDetails 로그인 사용자 정보
	 * @return 프로젝트 목록 + 페이징 정보
	 */
	@GetMapping("/my/progress")
	public Map<String, Object> readMyInProgressProjectListRest(
			@RequestParam(required = false, defaultValue = "1") int page,
			@AuthenticationPrincipal CustomUserDetails userDetails) {

		if (userDetails == null) {
			return Map.of("error", "unauthorized");
		}

		String userId = userDetails.getUsername();
		PaginationInfo<ProjectVO> paging = new PaginationInfo<>(6, 5);
		paging.setCurrentPage(page);

		// 진행 중 프로젝트 목록 조회 메서드 호출
		List<ProjectVO> projectList = service.readMyProjectList(userId, paging);

		// 각 프로젝트의 참여자 목록 추가
		for (ProjectVO project : projectList) {
			List<ProjectMemberVO> members = projectMemberMapper.selectProjectMemberByProject(project.getBizId());
			project.setMembers(members);
		}

		PaginationRenderer renderer = new MazerPaginationRenderer();
		String pagingHTML = renderer.renderPagination(paging, "fnPaging");


		return Map.of(
			"projectList", projectList,
			"pagingHTML", pagingHTML,
			"totalCount", paging.getTotalRecord()
		);
	}

	/**
	 * 내 프로젝트 목록 페이징 조회 (AJAX용) - 참여한 프로젝트 (B304: 완료)
	 * @param page 페이지 번호
	 * @param userDetails 로그인 사용자 정보
	 * @return 프로젝트 목록 + 페이징 정보
	 */
	@GetMapping("/my/completed")
	public Map<String, Object> readMyCompletedProjectListRest(
	        @RequestParam(required = false, defaultValue = "1") int page,
	        @AuthenticationPrincipal CustomUserDetails userDetails) {

	    if (userDetails == null) {
	        return Map.of("error", "unauthorized");
	    }

	    String userId = userDetails.getUsername();
	    PaginationInfo<ProjectVO> paging = new PaginationInfo<>(6, 5);
	    paging.setCurrentPage(page);

	    // 완료 프로젝트 목록 조회 메서드 호출
	    List<ProjectVO> projectList = service.readMyCompletedProjectList(userId, paging);

	    // 각 프로젝트의 참여자 목록 추가
	    for (ProjectVO project : projectList) {
	        List<ProjectMemberVO> members = projectMemberMapper.selectProjectMemberByProject(project.getBizId());
	        project.setMembers(members);
	    }

	    PaginationRenderer renderer = new MazerPaginationRenderer();
	    String pagingHTML = renderer.renderPagination(paging, "fnPaging");


	    return Map.of(
	        "projectList", projectList,
	        "pagingHTML", pagingHTML,
	        "totalCount", paging.getTotalRecord()
	    );
	}


}
