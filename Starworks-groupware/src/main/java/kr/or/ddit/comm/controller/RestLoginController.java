package kr.or.ddit.comm.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.web.server.Cookie.SameSite;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.security.jwt.JwtProvider;
import kr.or.ddit.vo.RestLoginVO;
import lombok.RequiredArgsConstructor;

/**
 *
 * @author 홍현택
 * @since 2025. 10. 20.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 20.     	홍현택	          최초 생성
 *
 * </pre>
 */
@RestController
@RequiredArgsConstructor
public class RestLoginController {
	// JWT 발급. Authentication을 받아 토큰 문자열을 생성.
    private final JwtProvider provider;
    // 실제 인증을 실행하는 매니저
    private final AuthenticationManager authenticationManager;
    // SecurityContext 저장 공간  필터 체인과의 연계를 통해 요청/응답 생명주기에 맞춰 SecurityContext를 보존/복원
    private final SecurityContextRepository contextRepository;

    /**
     * 로그인 엔드포인트
     * - JSON Body(RestLoginVO)로 username/password를 입력받는다.
     * - 인증 성공 시:
     *   1) SecurityContextHolder에 Authentication을 설정하고 저장소에도 반영
     *   2) JWT를 생성하여 HttpOnly 쿠키로 내려보냄(Set-Cookie)
     *   3) 응답 바디에는 Authentication 객체를 그대로 담아 반환(주의: 정보 노출 가능성 고려 필요)
     * - 인증 실패 시: 401 상태 코드와 오류 코드를 JSON으로 응답.
     */
    @PostMapping("/common/auth")
    public ResponseEntity<?> restLogin(
            @RequestBody RestLoginVO restLoginVO,
            HttpServletRequest request,
            HttpServletResponse response) {

    	// 1) 사용자 입력 자격 증명으로 "미인증" 토큰 생성. 실제 인증은 AuthenticationManager가 수행.
        Authentication inputToken = UsernamePasswordAuthenticationToken
                .unauthenticated(restLoginVO.getUsername(), restLoginVO.getPassword());

        // 2) 인증 시도: UserDetailsService/PasswordEncoder 등을 경유하여 검증된다.
        try {
            Authentication authentication = authenticationManager.authenticate(inputToken);


            // 주석 추가.. Security
            // 3) 인증 성공 후, SecurityContext를 생성
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);
            // 4) SecurityContextRepository에도 저장.. HttpSession 사용하기 위해..
            contextRepository.saveContext(securityContext, request, response);

            // 5) 인증 정보를 기반으로 JWT 생성.
            String jwt = provider.generateJwt(authentication);


// 쿠키 객체를 직접 response.addCookie()로 넣는 방법에서 Spring Web의 ResponseEntity 헤더 기반 쿠키 전송 방식으로 바꿈.
            // JWT를 HttpOnly 쿠키에 담아 전송
//            Cookie jwtCookie = new Cookie("access_token", jwt);
//     		  jwtCookie.setHttpOnly(true);
//  		  jwtCookie.setPath("/"); // 모든 경로에서 접근 가능하도록 설정
//   		  jwtCookie.setSecure(true); // HTTP 환경에서 쿠키 전송을 위해 false로 설정 (개발용)
//   		  jwtCookie.setDomain("localhost"); // 명시적으로 도메인 설정
// 			  jwtCookie.setMaxAge(86400);
// 			  jwtCookie.setAttribute("SameSite", "Strict");
// 			  response.addCookie(jwtCookie);

            // 6) JWT를 HttpOnly 쿠키로 클라이언트에 전달
            ResponseCookie jwtCookie = ResponseCookie.from("access_token", jwt)
            		//- HttpOnly: JS에서 접근 불가
                    .httpOnly(true)
                    //- "/": 동일 도메인의 모든 경로
                    .path("/")
                    //secure=true: HTTPS에서만 전송 (개발땐 false!)
                    .secure(false)
                    //- domain="localhost": 동일 도메인 매칭 시 전송. 실제 배포 도메인으로 교체 필요!!
                    .domain("localhost") // 명시적으로 도메인 설정
                    //- maxAge=86400: 만료 시간 24시간 (1일)
                    .maxAge(86400)
                    //sameSite=Strict: 제3자 컨텍스트 전송 차단(CSRF 완화)
                    .sameSite(SameSite.STRICT.attributeValue())
                    .build();

         //return ResponseEntity.ok(authentication);
         // 7) 응답 구성: Set-Cookie 헤더로 토큰 전달, 바디에는 Authentication 반환.
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(authentication);

            //로그인 실패 요소 검증
        } catch (BadCredentialsException e) {
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("errorCode", "INVALID_CREDENTIALS");
            errorBody.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);

        } catch (AuthenticationException e) {
        	// 인증 기타 예외(계정 삭제)
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("errorCode", "LOGIN_FAILED");
            errorBody.put("message", "인증에 실패했습니다. 관리자에게 문의하세요.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
        }
    }

    /**
     * 로그아웃 엔드포인트
     * - 서버측 SecurityContext를 비우고 저장소에도 반영하여 서버 관점 인증 상태 제거.
     * - 클라이언트의 access_token 쿠키를 동일 속성(path/domain/samesite/secure)으로 maxAge=0 설정해 즉시 만료.
     */
    @RequestMapping("/common/auth/revoke")
	public ResponseEntity<?> revoke(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		// 1.SecurityContext 초기화
		SecurityContextHolder.clearContext();
		// 2) 저장소에서도 비어있는 컨텍스트로 저장
		contextRepository.saveContext(SecurityContextHolder.createEmptyContext(), request, response);

		// 2. 클라이언트 측 토큰 쿠키 만료
		String tokenCookie = ResponseCookie.from("access_token")
			.value("")
			.path("/")
			.httpOnly(true)
			.secure(true)
			.sameSite(SameSite.STRICT.attributeValue())
			// 즉시 만료
			.maxAge(0)
			.build()
			.toString();

		// 4) No Content로 본문 없이 응답.
		return ResponseEntity.noContent()
			.header(HttpHeaders.SET_COOKIE, tokenCookie)
			.build();
	}

}
