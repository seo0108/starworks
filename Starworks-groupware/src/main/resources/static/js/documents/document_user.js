/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      		    수정자            수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 16.     	임가영            최초 생성
 *
 * </pre>
 */

const drag_items = document.querySelectorAll(".drag_item");
// 드래그 되어 도착하는 곳
const drag_leave_folder = document.querySelectorAll(".drag_leave_folder");


// counter가 필요한 이유..
// td 안에 자식 요소가 여러 개 있거나 사용자가 폴더 아이콘, 텍스트 링크 등 여러 부분을 거쳐 드래그할 때 실제로는 아직 같은 <td> 안에 있는데, 이벤트는 여러 번 뜸

drag_items.forEach((drag_item) => {
	const fileTr2 = drag_item.closest("tr");
//	console.log("fileTr2", fileTr2)

	// 드래그 시작할 때
	drag_item.addEventListener("dragstart", (e) => {
		const fileTr = drag_item.closest("tr");
		console.log("fileTr", fileTr)
		// 담아서 보낼 수 있다
		e.dataTransfer.setData("fileId", fileTr.dataset.fileid);
		e.dataTransfer.setData("fileSqn", fileTr.dataset.filesqn);

		//폴더 이동시..
		e.dataTransfer.setData("folderSqn", fileTr.dataset.foldersqn);
	})
})


drag_leave_folder.forEach((drag_leave) => {
	 let counter = 0;

	// 드래그 포인트 될 때
	drag_leave.addEventListener("dragenter", () => {
		counter++;
		drag_leave.closest("tr").classList.add("table-warning");
	});

	// 드래그가 떠날 때
	drag_leave.addEventListener("dragleave", () => {
		counter--;
		if (counter === 0) {
			drag_leave.closest("tr").classList.remove("table-warning");
		}
	});

	// 이게 없으면 아무리 drop 이벤트를 등록해도 절대 실행되지 않음
	// dragover는 "여기 드롭해도 돼요"" 라고 브라우저에 알려주는 신호.
	// e.preventDefault()를 반드시 호출해야 drop 이벤트가 동작함.
	drag_leave.addEventListener("dragover", (e) => {
	    e.preventDefault(); // drop 이벤트 허용
	 });

	// 드롭됐을 때
	drag_leave.addEventListener("drop", async(e) => {
		e.preventDefault();
		counter = 0;

		const folderTr = drag_leave.closest("tr");
		folderTr.classList.remove("table-warning");


		// 이동대상이 파일일 때
		let targetFileId = e.dataTransfer.getData("fileId");
		let targetFileSqn = e.dataTransfer.getData("fileSqn");

		// 이동대상이 폴더일 때
		let targetFolderSqn = e.dataTransfer.getData("folderSqn");

		let moveUpfolderSqn = folderTr.dataset.foldersqn; // 이동 대상 폴더 sqn

		console.log("targetFileId", targetFileId);
		console.log("targetFileSqn", targetFileSqn);
		console.log("targetFolderSqn", targetFolderSqn);

		let success = false;
		if( targetFileId != null && targetFileId !== 'undefined' &&
  			targetFileSqn != null && targetFileSqn !== 'undefined') {
			success = await moveFile(targetFileId, targetFileSqn, moveUpfolderSqn);
		} else if(targetFolderSqn != null && targetFolderSqn != undefined){
			if(targetFolderSqn == moveUpfolderSqn) return;
			success = await moveFolder(targetFolderSqn, moveUpfolderSqn);
		}

		if(success) {
//			showToast("info", "파일이 이동되었습니다");
			location.reload(true);
		} else {
			showToast("error", "파일 이동에 실패하였습니다");
		}


	});
});

const moveFile = async (userFileId, userFileSqn, folderSqn) => {
	// userFileId, userFileSqn, folderSqn
	const resp = await fetch("/rest/document-user-file/move", {
					method: "PUT",
					headers : {
						"Content-Type" : "application/json"
					},
					body : JSON.stringify({
						"userFileId" : userFileId, // 해당 파일 Id (master 테이블)
						"userFileSqn" : userFileSqn, // 해당 파일 Sqn (detail 테이블)
						"folderSqn" : folderSqn // 이동할 폴더 Sqn
					})
				});
	const data = await resp.json();

	return data.success;
}

const moveFolder = async (targetFolderSqn, moveUpfolderSqn) => {
	const resp = await fetch("/rest/document/user/folder/move", {
				method : "PUT",
				headers : {
					"Content-Type" : "application/json"
				},
				body : JSON.stringify({
					"folderSqn" : targetFolderSqn,
					"upFolderSqn" : moveUpfolderSqn
				})
			});

	const data = await resp.json();

	return data.success;
}

