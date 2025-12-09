package kr.or.ddit.comm.conf;

import java.util.Map;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.JWSAlgorithm;

import jakarta.servlet.DispatcherType;
import kr.or.ddit.security.CustomJwtAuthenticationConverter;
import kr.or.ddit.security.handler.CustomAuthenticationSuccessHandler;

/**
 *
 * @author 홍현택
 * @since 2025. 9. 27.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------	   		------------- 	   ---------------------------
 *  2025. 9. 27.     		홍현택	      인메모리 로그인 설정 -> DB 정보 로그인 설정으로 수정, 평문 암호 형태로 설정.
 *  2025.10. 20.			홍현택			로그인 패스워드 암호화 설정.
 *  2025.10. 20.			홍현택			JWT 기반 REST API 보안 설정 .
 *  2025.10. 20.			홍현택			JwtCookieAuthenticationFilter 추가.
 *  2025.10. 21.			홍현택			로그아웃 토큰 만료 추가
 *
 * </pre>
 */
@Configuration
@EnableWebSecurity
public class SpringSecurityJavaConfig {

	@Autowired
	private CorsConfigurationSource corsConfigSource;

	private final String[] WHITELIST = {
//			"/",
			"/dist/**",
			"/css/**",
			"/js/**",
			"/html/**",
			"/error/**",
			"/images/**",
			"/swagger**",
			"/login",
			"/common/auth"
		};

		private final DispatcherType[] DISPATCHERTYPE_WHITELIST = {
			DispatcherType.FORWARD,
			DispatcherType.INCLUDE,
			DispatcherType.ERROR
		};

			@Autowired
			private CustomAuthenticationSuccessHandler successHandler;
			@Autowired
			private CustomJwtAuthenticationConverter customJwtAuthenticationConverter; // CustomJwtAuthenticationConverter 주입


			@Bean
			public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
				return authenticationConfiguration.getAuthenticationManager();
			}

			@Bean
			JwtDecoder jwtDecoder(@Value("${jwt.sign-key}") String secretKey) {
			byte[] keyBytes = secretKey.getBytes();
			SecretKeySpec key = new SecretKeySpec(keyBytes, JWSAlgorithm.HS256.getName());
			return NimbusJwtDecoder.withSecretKey(key)
											.macAlgorithm(MacAlgorithm.HS256)
											.build();
			}

//			@Bean
//			public JwtCookieAuthenticationFilter jwtCookieAuthenticationFilter(JwtDecoder jwtDecoder) {
//				return new JwtCookieAuthenticationFilter(jwtDecoder);
//			}

			@Bean
			public BearerTokenResolver cookieBearerTokenResolver() {
				return new kr.or.ddit.security.filter.CookieBearerTokenResolver("access_token");
			}

			@Bean
			@Order(1) // REST API 필터 체인을 먼저 적용
			public SecurityFilterChain restSecurityFilterChain(HttpSecurity http, BearerTokenResolver cookieBearerTokenResolver) throws Exception {
				http
					.securityMatcher("/rest/**") // /rest/** 경로에만 이 필터 체인 적용
					.csrf(csrf->csrf.disable())
					.cors(cors->cors.configurationSource(corsConfigSource))
					.authorizeHttpRequests(authorize->
						authorize
							.requestMatchers("/rest/auth").permitAll()
							.requestMatchers("/admin/*").hasRole("ADMIN")

							.anyRequest().authenticated()
					)

//					.sessionManagement(session->
//						session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//					)
                    .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(new org.springframework.security.web.authentication.HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED))
                    )
					.oauth2ResourceServer(oauth2->
						oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(customJwtAuthenticationConverter)) // CustomJwtAuthenticationConverter 적용, CustomUserDetails 사용하기 위해..
						.bearerTokenResolver(cookieBearerTokenResolver)
					)
					;
				return http.build();
			}

	@Bean
	public SecurityContextRepository contextRepository() {
		return new DelegatingSecurityContextRepository(
				new HttpSessionSecurityContextRepository(),
				new RequestAttributeSecurityContextRepository()
			);
	}


	@Bean
	@Order(2) // 웹 필터 체인을 나중에 적용
	public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
		http
		.securityMatchers(matcher->matcher.anyRequest())
		.cors(cors -> cors.configurationSource(corsConfigSource))
		.csrf(csrf->csrf.disable())
		//.addFilterBefore(jwtCookieAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // JWT 쿠키 인증 필터 추가
		        .authorizeHttpRequests(authorize ->
		            authorize
		                .dispatcherTypeMatchers(DISPATCHERTYPE_WHITELIST).permitAll()
		                .requestMatchers(WHITELIST).permitAll()
		                .requestMatchers("/starworks-groupware-websocket/**").permitAll() // websocket 허용 10.07 가영 추가
		                .requestMatchers("/admin/**").hasAuthority("ADMIN") // /admin/ 경로를 포함하는 URL은 ADMIN 권한만 접근 가능
		                .anyRequest().authenticated() // 그 외 모든 인증된 사용자는 접근 가능
		        )
		        .securityContext(sc -> sc.securityContextRepository(contextRepository()))
		        .formLogin(login ->
		            login
		            .loginPage("/login")
//		            .loginProcessingUrl("/login")
//		            .successHandler(successHandler)
//		            .failureUrl("/login?error")
		            .permitAll()
		        )
		        .exceptionHandling(exception -> exception.accessDeniedPage("/access-denied")) // 권한 없음 페이지 설정
		        .logout(logout ->
		            logout
		                .logoutUrl("/logout") // 로그아웃 처리 URL
		                .deleteCookies("access_token") // 로그아웃 시 access_token 쿠키 삭제
//		                .logoutSuccessUrl("/login") // 로그아웃 성공 후 리다이렉트될 URL
		                .logoutSuccessHandler((request, response, authentication) ->{
		                	String accept = request.getHeader("accept");
		                	if(accept.contains("json")) {
		                		new ObjectMapper().writeValue(response.getWriter(), Map.of("success", true));

		                	}else {
		                		response.sendRedirect("/login");		                	}
		                } )
		        		);

		        return http.build();	}

	// 패스워드 암호화
	@Bean
	public PasswordEncoder passwordEncoder() {
			return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

//	// 평문 암호로그인. 개발용.......
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//		return NoOpPasswordEncoder.getInstance();
//	}

	//인메모리 로그인용 설정
//	 @Bean
//	    public UserDetailsService userDetailsService() {
//	        UsersVO user1 = new UsersVO();
//	        user1.setUserId("a001");
//	        user1.setUserPswd(passwordEncoder().encode("asdf"));
//	        user1.setUserRole("ROLE_USER");
//
//	        UsersVO user2 = new UsersVO();
//	        user2.setUserId("c001");
//	        user2.setUserPswd(passwordEncoder().encode("asdf"));
//	        user2.setUserRole("ROLE_ADMIN");
//
//	        UserDetails user = new UserVOWrapper(user1);
//	        UserDetails admin = new UserVOWrapper(user2);
//
//	        return new InMemoryUserDetailsManager(user, admin);
//	    }

}