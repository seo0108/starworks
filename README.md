# 📖 BookDam
> <b>도서 검색, 구매, 관리</b> 기능을 제공하는 웹 서비스. <b>도서판매 시스템</b>
<p align="center">
<img width="1901" height="1705" alt="Image" src="https://github.com/user-attachments/assets/9a63ea70-e327-434c-a263-e54a599b59f0" />
<img width="1901" height="875" alt="Image" src="https://github.com/user-attachments/assets/a6166eec-c8dc-4005-ba08-4f9094386562" />
</p>

</br>

## 01. 프로젝트 개요
* <b>개발 기간</b> : 2025.06. ~ 2025.07. (1개월) 
* <b>개발 인원</b> : 5명
* <b>핵심 목표</b> : 1. 수업내용을 연계한 CRUD 기능 실습 2. 도서 검색, 구매, 관리 기능을 제공하는 웹사이트 개발

<br />

## 02. 팀원 및 역할
* <b>임가영</b> : 장바구니, 결제, 환불, 마이페이지, 작가와의 채팅 구현 등
* <b>김수현</b> : 도서 검색, 도서 상세 조회, 리뷰 시스템, 작가와의 채팅 구현 등
* <b>김주희</b> : 관리자 도서 정보 및 재고 관리, 주문 내역 관리 구현 등
* <b>신혜진</b> : 로그인 및 회원가입, 회원정보 수정, 관리자 회원 정보 관리 구현 등
* <b>윤서현</b> : 베스트 셀러, 1:1 고객센터, 문화/행사 게시판 구현 등

<br />

## 03. 기술 스택
<table>
  <tr>
    <td>개발언어</td>
    <td>Java, JavaScript, HTML5, CSS3</td>
  </tr>
   <tr>
    <td>프레임워크</td>
    <td> mybatis</td>
  <tr>
    <td>라이브러리 및 API</td>
    <td>jQuery, log4j, websocket, 알라딘 도서정보, 도서나루 API, 카카오페이 API</td>
  </tr>
   <tr>
    <td>협업 툴</td>
    <td>SVN, Redmine</td>
  </tr>
   <tr>
    <td>개발 툴</td>
    <td>Eclipse</td>
  </tr>
   <tr>
    <td>DB</td>
    <td>SQL Developer, Oracle DB</td>
</table>
  <br />

## 04. 시스템 구조 및 설계 전략

### 개발 전략
* 프로세스: Waterfall 모델 기반의 단계별 공정 준수 (기획 → 설계 → 구현 → 테스트)
* 협업 관리: Redmine을 통한 이슈 트래킹 및 마일스톤 관리

### 서비스 아키텍처
Controller → Service → DAO → Service → Controller → JSP 흐름으로 서버 사이드 렌더링 제공.

<table>
  <tr>
    <th>액터</th>
    <th>주요 기능</th>
  </tr>
  <tr>
    <td><b>회원용 서비스</b></td>
    <td>로그인, 회원가입, 마이페이지, 장바구니, 결제, 환불</td>
  </tr>
  <tr>
    <td><b>비회원용 서비스</b></td>
    <td>도서 검색, 도서 상세 조회, 베스트셀러 확인</td>
  </tr>
  <tr>
    <td><b>관리자용 서비스</b></td>
    <td>도서 정보 관리, 재고 관리, 주문 내역 관리, 회원 관리</td>
  </tr>
</table>

### 데이터베이스
<p align="left">
  <img src="https://github.com/user-attachments/assets/86f8dbca-418f-4674-b77b-8f04ab1f1baf" width="1000"/>
</p>

### UI 설계
[🔗 Figma 에서 상세보기](https://www.figma.com/design/NEFjK1jRgeTG1Be6ZiJkB2/html.to.design-%E2%80%94-by-%E2%80%B9div%E2%80%BARIOTS-%E2%80%94-Import-websites-to-Figma-designs--web-html-css---Community-?node-id=0-1&t=h0iGliLnmuvYfLLr-1)
<br/><img width="800" alt="Image" src="https://github.com/user-attachments/assets/1d28b045-4691-480e-98ab-e60a7fbc1ec8" />

<br />

## 05. 주요 기능

### 🔎 도서 검색 및 리뷰
사용자가 원하는 도서를 쉽게 찾고, 리뷰 확인 가능

* 키워드, 카테고리, 작가 등 다양한 조건으로 도서 검색
* 도서 상세 정보 및 리뷰 확인
* 사용자 리뷰 작성 및 평점 제공

<br/>
  <img src="https://github.com/user-attachments/assets/83657531-3804-4d80-b6f7-8e2f28eba8b6" width="700" />
  <br>[도서 검색 - 판매인기순, 리뷰순, 최신순 정렬 가능]<br><br>
  <img src="https://github.com/user-attachments/assets/16946422-4bbe-42ac-b633-645f9f6f8c64" width="700" />
  <br>[도서 리뷰 - 구매자/전체 리뷰 분기 및 스포일러 방지 기능]<br><br>
<hr />

### 💵 도서 구매
사용자가 편리하게 도서를 구매할 수 있도록 지원

* 장바구니 담기, 결제, 주문 내역 확인 기능 제공
* 결제 완료 후 자동 주문 처리 및 재고 반영
* 결제 상태 및 배송 현황 실시간 확인

<br/>
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/b1939c35-c898-4f46-af8b-aa34d66ce2c8" />
<br>[장바구니]<br><br>
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/afd2374d-6f18-47c4-bd6b-d39076ecc17e" />
<img width="220" alt="Image" src="https://github.com/user-attachments/assets/e6871da6-b9c0-4cda-8be6-fbbdd17c44d3" />
<br>[카카오페이 API 활용한 도서 구매]<br><br>
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/89892c8e-3125-421e-ac63-d7dcf2cb04d3" />
<br>[주문내역 확인 - 비회원]<br><br>

<hr />

### 📙 도서 관리
관리자가 도서를 효율적으로 관리할 수 있는 기능 제공

* 도서 정보 등록, 수정, 삭제
* 재고 관리 및 주문 내역 확인

<br/>
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/cc0d21e1-777d-42a6-be51-3f13fccd369e" />
<br>[관리자 도서 정보 수정]<br><br>
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/98f0152f-b505-4552-96f1-d61326d078cc" />
<br>[관리자 주문 정보 관리 - 검색 및 배송 상태 변경]<br><br>


<br/>

## 06. 프로젝트 완료 후 소감
각 기능을 구현한 담당자가 느낀 점
<img width="1200" alt="Image" src="https://github.com/user-attachments/assets/ada253b7-7c3b-4357-bdda-e3e05d16ab42" />
