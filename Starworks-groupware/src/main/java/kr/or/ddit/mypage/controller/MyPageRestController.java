package kr.or.ddit.mypage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.security.CustomUserDetails;
import kr.or.ddit.users.service.UsersService;
import kr.or.ddit.vo.UsersVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rest/mypage")
@RequiredArgsConstructor
public class MyPageRestController {

	private final UsersService service;

	@GetMapping
	public UsersVO getMyInfo(@AuthenticationPrincipal CustomUserDetails user) {
		return service.readUser(user.getUsername());
	}


	/**
	 * 마이페이지 수정
	 * @param user
	 * @param vo
	 * @return
	 */
	@PutMapping
	public ResponseEntity<?> updateMyInfo(
		@AuthenticationPrincipal CustomUserDetails user
		, @ModelAttribute UsersVO vo
	){
		vo.setUserId(user.getUsername());

		// 사용자 정보 수정
		service.modifyUser(vo);

		return ResponseEntity.ok().build();
	}

}
