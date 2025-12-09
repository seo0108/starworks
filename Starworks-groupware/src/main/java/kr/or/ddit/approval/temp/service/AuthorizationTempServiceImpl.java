package kr.or.ddit.approval.temp.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import kr.or.ddit.comm.exception.EntityNotFoundException;
import kr.or.ddit.mybatis.mapper.AuthorizationTempMapper;
import kr.or.ddit.vo.AuthorizationTempVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorizationTempServiceImpl implements AuthorizationTempService{

	private final AuthorizationTempMapper mapper;
	
	@Override
	public List<AuthorizationTempVO> readAuthTempList() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String loginId = auth.getName();
		
		return mapper.selectAuthTempList(loginId);
	}

	@Override
	public AuthorizationTempVO readAuthTemp(String atrzTempSqn) {
		AuthorizationTempVO authTemp = mapper.selectAuthTemp(atrzTempSqn);
		if(authTemp == null) {
			throw new EntityNotFoundException(authTemp);
		}
		return authTemp;
	}

	@Override
	public boolean createAuthorizationTemp(AuthorizationTempVO authTemp) {
		
		int result = mapper.insertAuthorizationTemp(authTemp);
        log.info("임시저장 문서 insert 완료 => tempSqn={}", authTemp.getAtrzTempSqn());

        return result > 0;
    }

	@Override
	public int deleteAuthTemp(String atrzTempSqn) {
		return mapper.deleteAuthTemp(atrzTempSqn);
	}
	

}
