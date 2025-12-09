/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 9. 29.     	윤서현            최초 생성
 *
 * </pre>
 */

//트리 데이터를 보관할 배열
let treeData = [];

//flat 데이터를 tree 데이터 구조로 변환
function buildOrgTree(users) {
	let deptMap = {};
	//최상위 부서 노드들을 담을 배열
	const root = [];

	//부서객체 생성 및 구성원 추가
	/*users.forEach(user => {
		//내가만든 객체는 부서와 사용자가 통합된것이다.

		//첫번째 구간엔 부서를 넣을 수 있다.(기존에 해당 부서가 있을때는 부서생성은 생략, 사용자만 넣는다.)
		//두번빼 구간에 앞에 나온 부서에 사용자를 넣을수 있다.

		//그런데... 새로운 부서가 들어갈때는 기존 부서 객체에서 상위 부서를 찾아 그 부서 하위로 들어가야 한다.

		//부서가 들어가는것만 분리해서 생각해 보자
		//1. 기존에 없는 부서면 넣으면 그만이다.
		//   그냥 넣으면 안되고 상위 부서가 있으면 찾아서 들어가야한다.
		// 머리가 아프다.

		//내가 단순하게 부서를 만들어 넣을 배열이 있으면 되고
		//내가 구조화된 부서에 넣을 객체가 존재하면 쉽겠다. 부서 안에 직원과 하위 바서가 있다.

		//조직도 객체는 id, name, employees, subDepartments가 있는거야

		//조직도 객체가 없을때, 그냥 1개 만들고, employee 1개 만들어서 객체에 넣어주기


		if(deptMap == null){
			treeData = [
				id : user.deptId,
				name : user.deptNm || user.deptId,
				employees : [],
				subDepartments: []
			];

			treeData.employees.push({
				id: user.userId,
					name: user.userNm,
					position: user.jbgdNm || user.jbgdCd,
					phone: user.userTelno,
					email: user.userEmail,
					status: user.codeNm
			});
		}else{

		}


		//존재하지 않는 부서만 생성
		if (deptMap[user.deptId] == undefined) {
			deptMap[user.deptId] = {
				id: user.deptId,
				name: user.deptNm || user.deptId,
				upDeptId: user.upDeptId,
				employees: [],
				subDepartments: []
			};
			console.log("=========================", deptMap[user.deptId] + ':' + user.deptNm);

		}

		//부서에 직원 넣기
		if (user.userNm != null) {
			deptMap[user.deptId].employees.push({
				id: user.userId,
				name: user.userNm,
				position: user.jbgdNm || user.jbgdCd,
				phone: user.userTelno,
				email: user.userEmail,
				status: user.codeNm,
				filePath: user.filePath
			});
		}

	});*/

	// 부서 객체 생성
	users.forEach(user => {
		if (!deptMap[user.deptId]) {
			deptMap[user.deptId] = {
				id: user.deptId,
				name: user.deptNm || user.deptId,
				upDeptId: user.upDeptId,
				employees: [],
				subDepartments: []
			};
		}

		//직원 추가
		if (user.userNm) {
			deptMap[user.deptId].employees.push({
				id: user.userId,
				name: user.userNm,
				department: user.deptNm, // 부서명 추가
				position: user.jbgdNm || user.jbgdCd,
				phone: user.userTelno,
				email: user.userEmail,
				status: user.codeNm,
				filePath: user.filePath
			});
		}
	});

	//상위-하위 부서 연결
	Object.values(deptMap).forEach(dept => {
		//현재부서의 상위부서 찾기
		const upper = deptMap[dept.upDeptId];
		if (upper) {
			//상위부서가 존재하면 그 부서의 하위부서에 추가
			upper.subDepartments.push(dept);
		} else {
			root.push(dept); // 상위 부서가 없으면 루트로
		}
	});

	// 최상위 부서들만 return
	return root;



	//상위부서-하위부서 연결
	// users <- db에서 읽은 조직도 List
	// deptMap <- users를 이용해 dept(id, name...., employees, subDepartments으로 구성)객체의 배열
	//기존 부서 ID
	/*let beforeDeptId = '';
	users.forEach(user => {
		const dept = deptMap[user.deptId];

		//  			console.log('dept.upDeptId: '+dept.upDeptId);

		//기존 부서ID랑 다르면 넣고
		if (beforeDeptId != user.deptId) {
			beforeDeptId = user.deptId;
			if (dept.upDeptId == null) {
				// 	console.log('root 넣기:(재정렬) ');
				root.push(dept); // 최상위 부서
				//기존 부서 ID 랑 같으면 Pass함
			} else {
				let upperDept = deptMap[user.upDeptId];
				// 	console.log('upperDept:(재정렬) '+upperDept + user.deptId + user.deptNm)
				if (upperDept != null) {
					upperDept.subDepartments.push(dept);
				}
			}
		}


		//  			if (user.upperDeptId && deptMap[user.upperDeptId]) {
		//  			    deptMap[user.upperDeptId].subDepartments.push(dept);
		//  			} else if (!user.upperDeptId) {
		//  				if(!root.includes(dept)){
		// 	 			    root.push(dept); // 최상위 부서
		//  				}
		//  			}
	});

	return root;*/

}


// 부서 총 인원수 계산
function getTotalEmployees(department) {
	// 부서의 직원 수
	let count = department.employees.length;
	//각 하위부서의 인원 재귀적으로 합산
	department.subDepartments.forEach(subDept => {
		count += getTotalEmployees(subDept);
	});
	return count;
}

// 트리 구조를 실제 DOM(ul/li)로 변환
function renderOrgTree(departments, parentElement) {
	// 최상위 ul 요소 생성
	const ul = document.createElement('ul');
	//          	console.log("---->", departments.length);
	// 각 부서(dept)를 순회하면서 li 생성
	departments.forEach(dept => {

		const li = document.createElement('li');

		//이 부서의 인원수 계산
		const totalEmployees = getTotalEmployees(dept);

		//부서명을 클릭할수있는 목록 생성
		const deptLink = document.createElement('a');
		deptLink.href = "#";
		deptLink.classList.add('department-name');
		//                 deptLink.innerHTML = `<i class="bi bi-folder-fill text-primary"></i> ${dept.name} (${totalEmployees}명)`;
		deptLink.innerHTML =
			"<i class='bi bi-folder-fill text-primary'></i> " + dept.name + " (" + totalEmployees + "명)";

		//토글
		deptLink.addEventListener('click', (e)=>{
			e.preventDefault();

			//li 아래의 하위 ul 전부 가져옴
			const subList = li.querySelectorAll(':scope > ul');

			//숨기기/보이기 토글
			subList.forEach(ul => ul.classList.toggle('hidden'));

			 const icon = deptLink.querySelector('i');
			  if (icon.classList.contains('bi-folder-fill')) {
			    icon.classList.replace('bi-folder-fill', 'bi-folder2-open');
			  } else {
			    icon.classList.replace('bi-folder2-open', 'bi-folder-fill');
			  }
		});


		//상세조회(부서ID)
		deptLink.dataset.deptId = dept.id; // Store department ID
		li.appendChild(deptLink);

		// 부서아래 구성원이 있으면 ul/li 생성
		if (dept.employees.length > 0) {
			const empUl = document.createElement('ul');
			empUl.classList.add('list-unstyled', 'ps-4');

			// 각 직원(emp)을 li로 렌더링
			dept.employees.forEach(emp => {
				const empLi = document.createElement('li');
				const empLink = document.createElement('a');
				empLink.href = '#';
				empLink.classList.add('employee-link', 'text-decoration-none');
				empLink.dataset.employeeId = emp.id;

				// 미니 프로필 툴팁 콘텐츠 생성
				const tooltipContent = `
					<div class='text-center p-2'>
						<img src='${emp.filePath || '/images/faces/1.jpg'}' class='rounded-circle mb-2' alt='프로필 사진' width='80' height='80' style='object-fit: cover;'>
						<div class='fw-bold'>${emp.name}</div>
						<div>${emp.department} ${emp.position}</div>
					</div>
				`;

				// Bootstrap 툴팁 속성 설정
				empLink.setAttribute('data-bs-toggle', 'tooltip');
				empLink.setAttribute('data-bs-html', 'true');
				empLink.setAttribute('data-bs-placement', 'right');
				empLink.setAttribute('data-bs-custom-class', 'light-tooltip'); // 커스텀 CSS 클래스 추가
				empLink.setAttribute('title', tooltipContent);


				const workStatusMap = {
				  '근무 중': {
				    label: '근무 중',
				    bg: '#58a35c',   // 녹색 배경
				    color: '#FFFFFF' // 흰색 글자
				  },
				  '자리 비움': {
				    label: '자리 비움',
				    bg: '#6495ED',
				    color: '#FFFFFF'
				  },
				  '퇴근': {
				    label: '퇴근',
				    bg: '#283593',
				    color: '#FFFFFF'
				  },
				  '미출근': {
				    label: '미출근',
				    bg: '#918e8e',
				    color: '#FFFFFF'
				  },
				};

				const status = workStatusMap[emp.status] || { label: emp.status ?? '미등록', bg: '#DAA520', color: '#FFFFFF' };

				empLink.innerHTML = `
					  <div class="d-flex align-items-center gap-2">
					    <img src="${emp.filePath || '/images/faces/1.jpg'}" alt="프로필 사진" class="rounded-circle" width="24" height="24" style="object-fit: cover;">
					    <span class="emp-name">${emp.name}</span>
					    <span class="badge fw-bold rounded-pill" style="background-color:#E6E6FA; color:#222;">${emp.position}</span>
					    <span class="rounded-pill px-2 py-1"
					          style="background-color:${status.bg}; color:${status.color}; font-size:0.7rem;">
					      ${status.label}
					    </span>
					  </div>
					`;


				empLi.appendChild(empLink);
				empUl.appendChild(empLi);
			});
			li.appendChild(empUl);
		}


		if (dept.subDepartments.length > 0) {
			const subUl = document.createElement('ul');
			renderOrgTree(dept.subDepartments, subUl);
			li.appendChild(subUl);
		}
		ul.appendChild(li);
	});
	parentElement.appendChild(ul);
}

// 부서ID로 부서찾는 함수
function findDepartmentById(id, departments) {
	for (const dept of departments) {
		if (dept.id === id) { // ID 일치 시 바로 반환
			return dept;
		}
		const found = findDepartmentById(id, dept.subDepartments);
		if (found) {
			return found;
		}
	}
	return null;
}

// 직원ID로 직원을 찾는 함수
function findEmployeeById(id, departments) {
	for (const dept of departments) {
		for (const emp of dept.employees) {
			if (emp.id == id) {
				return emp;
			}
		}
		const found = findEmployeeById(id, dept.subDepartments);
		if (found) {
			console.log("found:", found);
			return found;
		}
	}
	return null;
}

// 부서 상세조회
function displayDepartmentDetails(deptId) {
	// 트리데이터에서 부서 찾음
	const dept = findDepartmentById(deptId, treeData);
	const deptDetailContainer = document.getElementById('deptDetailContainer');
	deptDetailContainer.innerHTML = ''; //이전 내용 초기화

	if (dept) {
		const totalEmployees = getTotalEmployees(dept);

		// 부서 제목/총인원/직원 리스트 머리
		//                 let html = `
		//                     <h4>${dept.name}</h4>
		//                     <p>총 인원: ${totalEmployees}명</p>
		//                     <h5>부서원 목록</h5>
		//                     <ul class="list-group employee-list">
		//                 `;
		let html =
			"<h4>" + dept.name + "</h4>" +
			"<p>총 인원: " + totalEmployees + "명</p>" +
			"<h5>부서원 목록</h5>" +
			"<ul class='list-group employee-list'>";


		// 재귀로 이 부서 + 하위 부서의 모든 직원을 추가
		function addEmployeesToList(department) {
			department.employees.forEach(emp => {
				//                     	console.log("부서 상세보기 - 직원 데이터:", emp);
				//                     	console.log("랄랄랄", html)
				//                         html += `
				//                             <li class="list-group-item d-flex justify-content-between align-items-center" data-employee-id="${emp.id}">
				//                                 ${emp.name} <span class="badge bg-secondary rounded-pill">${emp.position}</span>
				//                             </li>
				//                         `;
				html += "<li class='list-group-item d-flex justify-content-between align-items-center' data-employee-id='"
					+ emp.id + "'>"
					+ emp.name
					+ "<span class='badge bg-secondary rounded-pill'>"
					+ emp.position
					+ "</span></li>";
				//                     console.log("직원 추가:", emp.id, emp.name, emp.position);

			});
			department.subDepartments.forEach(addEmployeesToList);
			console.log("최종 html:", html);
		}

		addEmployeesToList(dept);

		html += "</ul>";
		deptDetailContainer.innerHTML = html;

		console.log("최종 deptDetailContainer.innerHTML:", deptDetailContainer.innerHTML);

		// 리스트에서 직원 항목을 클릭하면 모달 오픈
		deptDetailContainer.querySelectorAll('.employee-list .list-group-item').forEach(item => {
			item.addEventListener('click', (event) => {
				const empId = event.currentTarget.dataset.employeeId;
				displayMemberModal(empId);
			});
		});
	} else {
		deptDetailContainer.innerHTML = '<p class="text-muted">부서를 클릭하여 상세 정보를 확인하세요.</p>';
	}
}


//직원 상세 모달 표시
function displayMemberModal(empId) {

	const employee = findEmployeeById(empId, treeData);

	console.log("선택된 직원:", employee);

	// 사진 (없으면 기본 이미지)
	if (employee) {
		document.getElementById('memberPhoto').src = employee.filePath ? employee.filePath : '/images/faces/1.jpg';
		//console.log("=====>employee.filePath", employee.filePath);
		document.getElementById('memberName').textContent = employee.name;
		document.getElementById('memberPosition').textContent = "직급:" + employee.position;
		document.getElementById('memberPhone').textContent = employee.phone;
		const memberEmailLink = document.getElementById('memberEmailLink');
		memberEmailLink.textContent = employee.email;
		console.log("Debug Employee Object:", employee);
		memberEmailLink.href = `/mail/send?recipientId=${employee.id}&recipientName=${encodeURIComponent(employee.name)}&recipientDept=${encodeURIComponent(employee.department)}&recipientEmail=${encodeURIComponent(employee.email)}`;

		// 근무상태 뱃지 색상 세팅
		const memberStatusSpan = document.getElementById('memberStatus');
		memberStatusSpan.textContent = employee.status;
		memberStatusSpan.className = 'badge'; // Reset classes
		if (employee.status === '근무 중') {
			memberStatusSpan.classList.add('bg-success');
		} else {
			memberStatusSpan.classList.add('bg-secondary');
		}

		// 💬 채팅 아이콘 클릭 시 이동
		const chatIcon = document.querySelector('.chat-icon');
		chatIcon.onclick = () => {
			window.location.href = `/mail/send`;
		};

		const memberModal = new bootstrap.Modal(document.getElementById('memberDetailModal'));
		memberModal.show();
	}
}

// 툴팁 초기화 함수
function initializeTooltips() {
    // 기존 툴팁 제거
    const existingTooltips = document.querySelectorAll('.tooltip');
    existingTooltips.forEach(tooltip => tooltip.remove());

    // 새로운 툴팁 초기화
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            boundary: document.body // 툴팁이 잘리지 않도록 body를 경계로 설정
        });
    });
}

// 조직도 검색(부서명/사원명)
function searchOrganization() {
	const searchTerm = document.getElementById('orgSearchInput').value.toLowerCase();
	const orgTreeContainer = document.getElementById('orgTreeContainer');
	orgTreeContainer.innerHTML = ''; // 초기화

	function filterData(departments, term) {
		const results = [];
		for (const dept of departments) {
			const matchingEmployees = dept.employees.filter(emp => emp.name.toLowerCase().includes(term));
			const matchingSubDepts = filterData(dept.subDepartments, term);

			if (dept.name.toLowerCase().includes(term) || matchingEmployees.length > 0 || matchingSubDepts.length > 0) {
				results.push({
					...dept,
					employees: dept.name.toLowerCase().includes(term)
						? dept.employees
						: matchingEmployees,
					subDepartments: matchingSubDepts
				});
			}
		}
		return results;
	}

	// 전체 트리에서 검색
	const filteredData = filterData(treeData, searchTerm);
	if (filteredData.length > 0) {
		renderOrgTree(filteredData, orgTreeContainer);
		initializeTooltips(); // 검색 후 툴팁 재초기화
	} else {
		orgTreeContainer.innerHTML = '<p class="text-muted">검색 결과가 없습니다.</p>';
	}
}


// 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
	const orgTreeContainer = document.getElementById("orgTreeContainer");

	// 백엔드에서 사용자 목록을 받아와 트리 데이터로 변환
	fetch("/rest/comm-user")
		.then(res => res.json())
		.then(users => {
			treeData = []; //기존 데이터 초기화
			treeData = buildOrgTree(users); //flat -> tree로 변환
			//          			console.log("====>", users.length);
			//          			console.log("treeData:", treeData);
			console.log(users.filter(u => u.upDeptId).slice(0, 10));
			console.log("모든 부서 ID:", [...new Set(users.map(u => u.deptId))]);
			console.log("모든 상위부서 ID:", [...new Set(users.map(u => u.upDeptId))]);
			console.log("트리 구성 결과:", treeData.map(d => d.name));
			console.log("첫번째 user:", users[0]);

			// 실제 DOM에 렌더링
			const orgTreeContainer = document.getElementById("orgTreeContainer");
			renderOrgTree(treeData, orgTreeContainer);
			initializeTooltips(); // 최초 렌더링 후 툴팁 초기화
		})


	// 부서나 구성원을 클릭했을 때 동작하는 이벤트 핸들러(모달창)
	orgTreeContainer.addEventListener('click', (event) => {
		const deptLink = event.target.closest('.department-name');
		const empLink = event.target.closest('.employee-link');

		if (deptLink) {
			event.preventDefault();
			const deptId = deptLink.dataset.deptId;
			displayDepartmentDetails(deptId);
		} else if (empLink) {
			event.preventDefault();
			const empId = empLink.dataset.employeeId;
			//모달창 표시
			displayMemberModal(empId);
		}
	});

	// 검색 버튼/엔터로 검색 수행
	document.getElementById('orgSearchButton').addEventListener('click', searchOrganization);
	document.getElementById('orgSearchInput').addEventListener('keypress', (event) => {
		if (event.key === 'Enter') {
			searchOrganization();
		}
	});
});