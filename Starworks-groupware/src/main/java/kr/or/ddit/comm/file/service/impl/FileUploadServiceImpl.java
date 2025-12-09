package kr.or.ddit.comm.file.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.comm.file.FileAttachable;
import kr.or.ddit.comm.file.FileFolderType;
import kr.or.ddit.comm.pdf.PdfServiceImpl;
import kr.or.ddit.mybatis.mapper.AuthorizationDocumentPdfMapper;
import kr.or.ddit.mybatis.mapper.FileDetailMapper;
import kr.or.ddit.mybatis.mapper.FileMasterMapper;
import kr.or.ddit.security.CustomUserDetails;
import kr.or.ddit.vo.AuthorizationDocumentPdfVO;
import kr.or.ddit.vo.AuthorizationDocumentVO;
import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.vo.FileDetailVO;
import kr.or.ddit.vo.FileMasterVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 파일 업로드 서비스
 * @author 임가영
 * @since 2025. 9. 29.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 29.     	임가영           최초 생성
 *
 * </pre>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadServiceImpl {
	
	@Value("${file-info.file.path}")
	private Resource fileFolderRes;
	@Value("${file-info.file.path}")
	private File fileFolder;
	
	private final FileMasterMapper fileMasterMapper;
	private final FileDetailMapper fileDetailMapper;
	private final AuthorizationDocumentPdfMapper authorizationDocumentPdfMapper;
	
	private final FileServiceS3Impl fileService;
	private final PdfServiceImpl pdfService; // html -> pdf 변환용
	
	/**
	 * DB & S3 저장소에 일반 파일을 저장하는 메소드
	 * @param vo Multipart 가 들어있는 VO
	 * @param folder 폴더명. FileFolderType.BOARD.toString() 과 같은 형식으로 사용
	 */
	public void saveFileS3(FileAttachable vo, String folder) {
		// ** 멀티파트 데이터 가져오기
		List<MultipartFile> fileList = vo.getFileList();
		// Authentication 가져오기
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		
		FileMasterVO fileMaster = null;
		
		boolean isFirstFile = true; // 첫 번째 업로드 파일 여부
		
		for(MultipartFile file : fileList) {
			// 만약 있으면 파일 업로드 로직 진행
			if(file != null && !file.isEmpty()) {
				
				if(isFirstFile) {
					isFirstFile = false;
					// FileMaster 테이블에 데이터 저장
					fileMaster = new FileMasterVO();
					// 파일 마스터 테이블에 데이터 삽입
					// selectKey 로 fileMaster 에 fileId 가 저장됨
					fileMaster.setCrtUserId(userDetails.getUsername());
					fileMasterMapper.insertFileMaster(fileMaster);
					
					// ** fileID 세팅하기
					vo.setFileId(fileMaster.getFileId());
				}
				
				String originName = file.getOriginalFilename(); // 원본 파일명
				Long fileSize = file.getSize(); // 파일 크기
				String fileExt = originName.substring(originName.lastIndexOf(".")); // 파일 확장자
				String saveName = UUID.randomUUID().toString() + fileExt; // 저장 파일명
				String fileUrl = fileService.getFileUrl(saveName, folder); // 접근 URL
				String mimeType = file.getContentType(); // 마임타입
				
				try {
					// S3에 업로드
                    fileService.uploadFile(file, saveName, folder);
                    
					// 파일 디테일 테이블에 데이터 삽입
					FileDetailVO fileDetail = new FileDetailVO();
					fileDetail.setFileId(fileMaster.getFileId());
					fileDetail.setOrgnFileNm(originName);
					fileDetail.setSaveFileNm(saveName);
					fileDetail.setFilePath(fileUrl); // S3 URL
					fileDetail.setFileSize(fileSize);
					fileDetail.setExtFile(fileExt);
					fileDetail.setFileMimeType(mimeType);
	
					fileDetailMapper.insertFileDetail(fileDetail);
					
				} catch (IllegalStateException | IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * DB & S3 저장소에 기안서 pdf 파일을 저장하는 메소드
	 * @param authorizationDocument HtmlData 가 들어있는 vo
	 */
	public void savePdfS3(AuthorizationDocumentVO authorizationDocument) {
		try {
			byte[] pdfBytes = pdfService.generatePdfFromHtml(authorizationDocument.getHtmlData());

			Long fileSize = (long) pdfBytes.length; // 파일 크기
			String fileExt = ".pdf"; // 파일 확장자
			String saveName = UUID.randomUUID().toString() + fileExt; // 저장 파일명
			String folder = FileFolderType.APPROVAL_PDF.toString(); // 폴더
			String fileUrl = fileService.getFileUrl(saveName, folder);
			String mimeType = "application/pdf";
			
			// S3에 업로드
			fileService.uploadPdf(pdfBytes, saveName, folder, mimeType);
			
			AuthorizationDocumentPdfVO authorizationDocumentPdf = new AuthorizationDocumentPdfVO();
			authorizationDocumentPdf.setAtrzDocId(authorizationDocument.getAtrzDocId()); // 결재문서일련번호 세팅
			authorizationDocumentPdf.setSaveFileNm(saveName);
			authorizationDocumentPdf.setFilePath(fileUrl);
			authorizationDocumentPdf.setExtFile(fileExt);
			authorizationDocumentPdf.setFileSize(fileSize);
			authorizationDocumentPdf.setFileMimeType(mimeType);
			
			// 기안서 PDF 파일 테이블에 메타데이터 삽입
			authorizationDocumentPdfMapper.insertAuthorizationDocumentPdf(authorizationDocumentPdf);
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 기존 파일을 복사하여 새로운 FileMaster 및 FileDetail 항목을 생성하고 S3에 업로드합니다.
	 * @param originalMailFileId 원본 메일의 mailFileId
	 * @param newVo 새로운 메일 VO (FileAttachable 구현체)
	 * @param folder S3에 저장될 폴더명
	 */
	public void copyFiles(String originalMailFileId, FileAttachable newVo, String folder) {
		if (originalMailFileId == null || originalMailFileId.isEmpty()) {
			return;
		}

		// 1. 원본 파일 상세 정보 조회
		List<FileDetailVO> originalFileDetails = fileDetailMapper.selectFileDetailList(originalMailFileId);
		if (originalFileDetails == null || originalFileDetails.isEmpty()) {
			return;
		}

		// Authentication 가져오기
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

		// 2. 새로운 FileMaster 생성
		FileMasterVO newFileMaster = new FileMasterVO();
		newFileMaster.setCrtUserId(userDetails.getUsername());
		fileMasterMapper.insertFileMaster(newFileMaster);
		newVo.setFileId(newFileMaster.getFileId()); // 새로운 mailFileId 설정

		// 3. 각 원본 파일을 복사하여 S3에 업로드하고 새로운 FileDetail 생성
		for (FileDetailVO originalDetail : originalFileDetails) {
			try {
				// S3에서 원본 파일 다운로드
				String s3Key = folder + "/" + originalDetail.getSaveFileNm(); // S3 키는 폴더/저장파일명
				byte[] fileBytes = fileService.downloadFile(s3Key);

				// 새로운 저장 파일명 생성
				String newSaveName = UUID.randomUUID().toString() + originalDetail.getExtFile();
				String newFileUrl = fileService.getFileUrl(newSaveName, folder);

				// S3에 새로운 파일로 업로드
				fileService.uploadPdf(fileBytes, newSaveName, folder, originalDetail.getFileMimeType()); // uploadPdf 재활용

				// 새로운 FileDetail 생성 및 저장
				FileDetailVO newFileDetail = new FileDetailVO();
				newFileDetail.setFileId(newFileMaster.getFileId());
				newFileDetail.setOrgnFileNm(originalDetail.getOrgnFileNm());
				newFileDetail.setSaveFileNm(newSaveName);
				newFileDetail.setFilePath(newFileUrl);
				newFileDetail.setFileSize(originalDetail.getFileSize());
				newFileDetail.setExtFile(originalDetail.getExtFile());
				newFileDetail.setFileMimeType(originalDetail.getFileMimeType());

				fileDetailMapper.insertFileDetail(newFileDetail);

			} catch (IOException e) {
				log.error("파일 복사 중 오류 발생: {}", e.getMessage());
				// 예외 처리 로직 추가 (예: 트랜잭션 롤백 또는 부분 성공 처리)
			}
		}
	}

	// DB & 로컬에 저장하는 메소드 (지금 안씀)
	public void saveFileLocal(BoardVO board) {
		// 멀티파트 데이터 가져오기
		List<MultipartFile> fileList = board.getFileList();
		// Authentication 가져오기
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		
		FileMasterVO fileMaster = null;
		
		boolean isFirstFile = true; // 첫 번째 업로드 파일 여부
		
		for(MultipartFile file : fileList) {
			// 만약 있으면 파일 업로드 로직 진행
			if(file != null && !file.isEmpty()) {
				
				if(isFirstFile) {
					isFirstFile = false;
					// FileMaster 테이블에 데이터 저장
					fileMaster = new FileMasterVO();
					// 파일 마스터 테이블에 데이터 삽입
					// selectKey 로 fileMaster 에 fileId 가 저장됨
					fileMaster.setCrtUserId(userDetails.getUsername());
					fileMasterMapper.insertFileMaster(fileMaster);
					
					board.setPstFileId(fileMaster.getFileId());
				}
				
				String originName = file.getOriginalFilename(); // 원본 파일명
				Long fileSize = file.getSize(); // 파일 크기
				String fileExt = originName.substring(originName.lastIndexOf(".")); // 파일 확장자
				String saveName = UUID.randomUUID().toString() + fileExt; // 저장 파일명
				String filePath = fileFolder.getAbsolutePath(); // 파일이 저장될 경로
				filePath = filePath.substring(filePath.indexOf("starworks"));
				String mimeType = file.getContentType(); // 마임타입
				
				if (!fileFolder.exists()) {
					boolean isCreated = fileFolder.mkdirs();
					
					if (isCreated) {
						log.info("업로드 폴더 생성 완료");
					} else {
						log.info("업로드 폴더 생성 실패");
					}
				}

				try {
					// 경로에 파일 복사
					File saveFile = new File(fileFolder, saveName);
					file.transferTo(saveFile);
                    
					// 파일 디테일 테이블에 데이터 삽입
					FileDetailVO fileDetail = new FileDetailVO();
					fileDetail.setFileId(fileMaster.getFileId());
					fileDetail.setOrgnFileNm(originName);
					fileDetail.setSaveFileNm(saveName);
					fileDetail.setFilePath(filePath); // local path
					fileDetail.setFileSize(fileSize);
					fileDetail.setExtFile(fileExt);
					fileDetail.setFileMimeType(mimeType);
	
					fileDetailMapper.insertFileDetail(fileDetail);
					
				} catch (IllegalStateException | IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
