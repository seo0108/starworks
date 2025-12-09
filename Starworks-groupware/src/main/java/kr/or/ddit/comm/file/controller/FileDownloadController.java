package kr.or.ddit.comm.file.controller;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.comm.file.service.FileDetailService;
import kr.or.ddit.document.service.DocumentService;
import kr.or.ddit.document.users.service.DocumentUserFileFolderService;
import kr.or.ddit.vo.UserFileFolderVO;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

/**
 * 파일 다운로드 컨트롤러
 * 
 * @author 임가영
 * @since 2025. 9. 30.
 * @see
 *
 *      <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 30.     	임가영            최초 생성
 *  2025. 10. 19.		임가영			폴더를 zip 으로 다운로드 하는 controller 추가
 *      </pre>
 */
@RestController
@RequiredArgsConstructor
public class FileDownloadController {

	private final S3Client s3Client;

	private final FileDetailService fileDetailService;
	private final DocumentService docService;
	private final DocumentUserFileFolderService userFolderService;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	/**
	 * zip 파일 다운로드 컨트롤러
	 * @param folderSqn
	 * @return
	 */
	@GetMapping("/folder/download/{foldersqn}")
	public ResponseEntity<byte[]> zipDownload(
		@PathVariable(name = "foldersqn") Integer folderSqn
		) {
		
		try {
			// 1. 폴더sqn 을 받고 해당 폴더 안의 파일리스트를 DB 에서 가져오기
			// ** 이부분 다시
			List<Map<String, Object>> fileList = docService.readAllFilesInFolderRecursive(folderSqn);
			
			// 2. 각 파일의 S3 key 를 이용해 S3Client 로 바이트 데이터를 읽는다
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			
			// 3. ZipOutputStream 이용해 ZIP 파일 생성
			try (ZipOutputStream zipOut = new ZipOutputStream(baos)) {
				for(int i = 0; i < fileList.size(); i++) {
					String key = (String) fileList.get(i).get("key");
					String orgnFileNm = (String) fileList.get(i).get("orgnFileNm");
					// ** 이부분 다시
					String folderPath = fileList.get(i).get("folderPath") != null? (String) fileList.get(i).get("folderPath") : "";
					
					// S3에서 각 파일 바이트 데이터 가져오기 (공통)
				    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
											            .bucket(bucket)
											            .key(key)
											            .build();
				    
				    // ResponseEntity<byte[]> 로 브라우저에 전송 (공통)
				    ResponseBytes<?> s3Object = s3Client.getObjectAsBytes(getObjectRequest);
				    
				    byte[] fileBytes = s3Object.asByteArray();
				    
				    // ZIP 항목 추가 (공통 X)
				    String relativePath = folderPath.startsWith("/") ? folderPath.substring(1) : folderPath;
				    String zipEntryName = folderPath.isEmpty() ? orgnFileNm : relativePath + "/" + orgnFileNm;
				    ZipEntry zipEntry = new ZipEntry(zipEntryName);
				    zipOut.putNextEntry(zipEntry);
				    zipOut.write(fileBytes);
				    zipOut.closeEntry();
				}
			}
			byte[] zipBytes = baos.toByteArray();
			
			UserFileFolderVO downFolder = userFolderService.readFileFolder(folderSqn);
			String saveFolderNm = downFolder.getFolderNm();
			String zipFileName = saveFolderNm + ".zip";
			
			// 4. Content-Disposition 헤더 설정 (브라우저에서 다운로드 처리) (공통)
			ContentDisposition contentDisposition = ContentDisposition.attachment()
					.filename(zipFileName, StandardCharsets.UTF_8)
					.build();
			
			HttpHeaders headers = new HttpHeaders();
	        headers.setContentDisposition(contentDisposition);
	        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

	        return ResponseEntity.ok()
	                .headers(headers)
	                .body(zipBytes);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * 파일 단건 다운로드 컨트롤러
	 * @param saveFileNm
	 * @return
	 */
	@GetMapping("/file/download/{saveFileNm}")
	public ResponseEntity<byte[]> download(@PathVariable(name = "saveFileNm") String saveFileNm) {
		Map<String, Object> respMap = fileDetailService.readFileDetailS3(saveFileNm);
		String key = (String) respMap.get("key");
		String orgnFileNm = (String) respMap.get("orgnFileNm");

		// 1. S3에서 파일 가져오기
		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
											.bucket(bucket)
											.key(key)
											.build();

		ResponseBytes<?> s3Object = s3Client.getObjectAsBytes(getObjectRequest);

		byte[] fileBytes = s3Object.asByteArray();

		// 2. Content-Disposition 헤더 설정 (브라우저에서 다운로드 처리)
		ContentDisposition contentDisposition = ContentDisposition.attachment()
				.filename(orgnFileNm, StandardCharsets.UTF_8) // 한글 파일명 안전하게 처리
				.build();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentDisposition(contentDisposition);
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM); // 일반 바이너리 파일

		// 3. 파일 바이트 응답 반환
		return ResponseEntity.ok()
				.headers(headers)
				.body(fileBytes);
	}
}
