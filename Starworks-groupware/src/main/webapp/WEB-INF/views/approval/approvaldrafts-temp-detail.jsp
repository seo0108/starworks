<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>기안서 작성-임시저장</title>
<link rel="stylesheet" href="/path/to/bootstrap.css"/>
</head>
<body>
<div id="main-content">

  <div class="page-heading">
    <div class="page-title">
      <div class="row">
        <div class="col-12 col-md-6 order-md-1 order-last">
          <h3>기안서 작성-임시저장</h3>
          <p class="text-subtitle">임시저장 문서를 불러와 작성/수정합니다.</p>
        </div>
      </div>
    </div>
  </div>

  <section class="section">
    <form action="/approval/submitDraft" method="post" enctype="multipart/form-data">
      <input type="hidden" name="atrzTempSqn" value="${approval.atrzTempSqn}"/>

      <div class="row">
        <!-- 좌측 본문 -->
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-body">

              <!-- 제목 -->
              <div class="form-group mb-3">
                <label for="title" class="form-label">제목</label>
                <input type="text" class="form-control" id="title" name="atrzDocTtl"
                       value="${approval.atrzDocTtl}">
              </div>

              <!-- 문서 템플릿명/본문 -->
              <div class="form-group mb-3">
                <label class="form-label">내용</label>
                <div class="border p-3 mb-2">
                  <table style="border-collapse: collapse; width: 100%;">
                    <tbody>
                      <tr>
                        <td colspan="2" style="text-align:center; font-size:20px; font-weight:bold; padding:10px;">
                          ${approval.atrzDocTmplNm}
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#ddd; text-align:center; font-weight:bold; width:100px;">기안자</td>
                        <td style="border:1px solid #000;">${approval.drafterName}</td>
                      </tr>
                      <tr>
                        <td style="background:#ddd; text-align:center; font-weight:bold;">문서번호</td>
                        <td style="border:1px solid #000;">${approval.atrzDocId}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 본문 HTML -->
                <textarea class="form-control" name="htmlData" id="htmlData" rows="15">
                  ${approval.htmlData}
                </textarea>
              </div>

              <!-- 첨부파일 -->
              <div class="form-group mb-3">
                <label class="form-label">첨부파일</label>
                <input type="file" name="files" multiple>
                <c:if test="${not empty fileList}">
                  <div class="mt-2">
                    <c:forEach items="${fileList}" var="file">
                      <a href="/file/download/${file.saveFileNm}">${file.orgnFileNm}</a><br/>
                    </c:forEach>
                  </div>
                </c:if>
              </div>

              <button type="submit" class="btn btn-primary">제출</button>

            </div>
          </div>
        </div>

        <!-- 우측 결재선 -->
        <div class="col-12 col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">결재선</h5>
            </div>
            <div class="card-body">
              <table class="table table-bordered approval-line-table">
                <tbody>
                  <c:forEach var="line" items="${approval.approvalLines}">
                    <tr>
                      <th class="text-center">${line.atrzApprUserNm}</th>
                      <td>
                        <span class="badge
                          <c:choose>
                            <c:when test="${line.atrzAct eq 'A401'}">bg-success">승인</c:when>
                            <c:when test="${line.atrzAct eq 'A402'}">bg-danger">반려</c:when>
                            <c:when test="${line.atrzAct eq 'A403'}">bg-info">전결</c:when>
                            <c:otherwise>bg-light-secondary">대기</c:otherwise>
                          </c:choose>
                        </span>
                      </td>
                    </tr>
                  </c:forEach>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </form>
  </section>

</div>
</body>
</html>
