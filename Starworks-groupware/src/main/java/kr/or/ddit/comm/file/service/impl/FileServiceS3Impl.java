package kr.or.ddit.comm.file.service.impl;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * S3에 업로드 하는 로직
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
public class FileServiceS3Impl {

    private final S3Client s3Client;
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.region.static}")
    private String region;

    // 파일 업로드
    public String uploadFile(MultipartFile file, String saveName, String folder) throws IOException {
    	String key = folder + "/" + saveName;
    	
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest,
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

        return saveName; // 저장된 파일명 반환
    }
    
    /**
     * 결재 최종승인 완료 후, pdf 를 s3 에 저장하는 로직
     * @param fileBytes
     * @param saveName
     * @param folder
     * @param contentType
     * @return
     * @throws IOException
     */
    public String uploadPdf(byte[] fileBytes, String saveName, String folder, String contentType) throws IOException {
    	String key = folder + "/" + saveName;
    	
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();
        
        s3Client.putObject(putObjectRequest,
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(fileBytes));
        
        return saveName; // 저장된 파일명 반환
    }
    

    // presigned URL 발급 (다운로드 링크)
    public String getFileUrl(String saveName, String folder) {
    	// URL 인코딩 (필요 없을듯)
    	// String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8);
    	return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + folder + "/" + saveName;
    }

    // 파일 삭제
    public void deleteFile(String saveName) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(saveName)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }

    /**
     * S3에서 파일을 byte 배열로 다운로드합니다.
     * @param key S3 객체 키 (폴더/파일명)
     * @return 파일의 byte 배열
     * @throws IOException 파일 다운로드 중 오류 발생 시
     */
    public byte[] downloadFile(String key) throws IOException {
        return s3Client.getObject(software.amazon.awssdk.services.s3.model.GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build(), software.amazon.awssdk.core.sync.ResponseTransformer.toBytes()).asByteArray();
    }
}