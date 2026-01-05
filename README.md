# 🖥️ StarWorks
> <b>전자결재, 프로젝트 관리, AI 기반 업무지원</b>을 하나의 흐름으로 연결한 통합 스마트 <b>그룹웨어</b>
<p align="center">
<img width="1891" height="910" alt="Image" src="https://github.com/user-attachments/assets/96bcc997-0fbd-485b-bce2-afdaec53b7be" />
<img width="1903" height="900" alt="Image" src="https://github.com/user-attachments/assets/10629b0d-163e-470d-a415-074d6df021f9" />
</p>

</br>

## 01. 프로젝트 개요
* <b>개발 기간</b> : 2025.09. ~ 2025.11. (2개월) 
* <b>개발 인원</b> : 5명
* <b>핵심 목표</b> : 1. 결재 프로세스 자동화로 업무 효율성 증대 2. 프로젝트 중심의 실시간 협업 환경 구축 3. AI 어시스턴트를 활용한 스마트한 업무 환경 제공

<br />

## 02. 팀원 및 역할
* <b>임가영</b> (PL) : 실시간 알림 발송, 회의실 관리, 자료실, 관리자(결재양식, 권한관리) 기능 구현 등
* <b>김주민</b> (UA) : 프로젝트 등록·관리, 프로젝트 통계, 실시간 채팅, 상품 관리 기능 구현 등
* <b>윤서현</b> (BA) : 기안서 작성 및 결재 요청 로직, 사용자 조직도 조회, 관리자(조직관리, 인사관리) 기능 구현 등
* <b>장어진</b> (TA, DA) : AI 챗봇, 일정 관리, 근태 현황 구현 등
* <b>홍현택</b> (AA) : 로그인 및 인증 처리, 전자결재 처리 로직, 전자메일, 관리자 메인화면 통계 구현 등

<br />

## 03. 기술 스택
<table>
  <tr>
    <td>개발언어</td>
    <td>Java, JavaScript, HTML5, CSS3</td>
  </tr>
   <tr>
    <td>프레임워크</td>
    <td>Spring(Boot, Security, MVC, AI), MyBatis, React (Admin Only)</td>
  <tr>
    <td>라이브러리 및 API</td>
    <td>Spring AI (Vertex AI), OAuth2, Google OTP, WebSocket (STOMP), Apache POI, iText, D3.js, Quartz, SweetAlert2</td>
  </tr>
   <tr>
    <td>협업 툴</td>
    <td>SVN, Redmine</td>
  </tr>
   <tr>
    <td>개발 툴</td>
    <td>Eclipse, Maven, Vscode</td>
  </tr>
   <tr>
    <td>DB</td>
    <td>SQL Developer, Oracle DB, AWS S3</td>
</table>
  <br />

## 04. 시스템 구조 및 설계 전략

### 개발 전략
* 프로세스: Waterfall 모델 기반의 단계별 공정 준수 (기획 → 설계 → 구현 → 테스트)
* 협업 관리: Redmine을 통한 이슈 트래킹 및 마일스톤 관리
* 소통: 매일 15분 데일리 스크럼을 통한 이슈 공유 및 피드백

### 서비스 아키텍처
<table>
  <tr>
    <td>구분</td>
    <td>기술 스택</td>
    <td>주요 특징</td>
  </tr>
  <tr>
    <td>사용자 페이지</td>
    <td>Spring MVC (JSP)</td>
    <td>SSR 기반의 안정적인 화면 렌더링 및 보안(Security) 강화</td>
   </tr>
  <tr>
    <td>관리자 페이지</td>
    <td>React (SPA)</td>
    <td>React 학습 목적으로 별도 제작. Axios를 활용한 비동기 데이터 처리</td>
  </tr>
  <tr>
    <td>공통 백엔드</td>
    <td>Spring Boot</td>
    <td>REST API 설계 및 MyBatis를 이용한 데이터 관리</td>
  </tr>
</table>

### 데이터베이스
[🔗 ERD Cloud에서 상세보기](https://www.miricanvas.com/v2/design2/8d74d3c4-5f53-4e46-afff-a747f5ef9b19)
<p align="left">
  <img src="https://github.com/user-attachments/assets/e44c4984-2fe7-4c2f-8d07-85e69465eb83" width="600"/>
</p>

<br />

## 05. 주요 기능

### 🗂️ 프로젝트 관리
다양한 부서가 함께하는 프로젝트

* 프로젝트 등록 시, 다양한 부서의 사람들 초대
* 업무 및 진행률 실시간 확인
* 프로젝트 전 단계(등록–진행–완료) 관리
<br/>
  <img src="https://github.com/user-attachments/assets/8b99faae-5ced-403f-94c8-cd09adcb1e3d" width="400" />
  <br>[프로젝트 등록 시 다양한 부서원 초대 가능]<br><br>
  <img src="https://github.com/user-attachments/assets/4a390bfd-3b3e-4008-8387-1a057f11a30b" width="700" />
  <br>[진행 중인 프로젝트 목록]<br><br>
  <img src="https://github.com/user-attachments/assets/c0eff935-012e-402b-a705-1467f36a8934" width="700" />
  <br>[업무 처리 화면]<br><br>

<hr />

### 🖋️전자결재 
결재 업무 효율화 및 자동 처리

* 전자 문서 생성, 결재 요청 및 승인 프로세스 제공
* 결재 단계 및 진행 상태 실시간 확인
* 결재 완료 시 자동으로 업무에 반영
* 승인 알림 및 문서 보관 자동화
<br/>
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/d1f1e4fe-d0b8-4e7d-9da6-be192d06fbff" />
<br>[전자결재 홈]<br><br>
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/b39c9498-990e-4bf0-b6f1-565a756c9a4f" />
<br>[기안서 작성 페이지]<br><br>
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/aac846cc-a60f-4952-b1a8-6a6815c5ad8e" />
<br>['신메뉴 기안서' 최종 승인 시, 해당 화면에 바로 반영되어 별도 관리 가능]<br><br>

<hr />

### 🤖 AI 챗봇
업무 어시스턴스

* 회사 규정·구성원 정보 검색 지원
* 자동 기안서 작성 - 휴가 신청서, 신메뉴 등록 기안서
* 회의실 예약 등 반복 업무 자동 처리
<br/>
<table>
  <tr>
    <td align="center">
      <img width="309" alt="Image" src="https://github.com/user-attachments/assets/65b1469d-404d-4546-89ef-0929841ac103" /><br>
      [회의실 자동 예약]
    </td>
    <td align="center">
      <img width="299" alt="Image" src="https://github.com/user-attachments/assets/1e0082ec-d27e-4fd7-a9eb-7062d38e4744" /><br>
      [구성원 검색]
    </td>
  </tr>
</table>


