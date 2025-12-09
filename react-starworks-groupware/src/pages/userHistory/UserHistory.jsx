import UserHistoryList from './UserHistoryList';

function UserHistory() {
  return (
    <div className="content-wrapper container">
      <div className="page-heading">
        <h3>인사 관리</h3>
        <p className="text-muted">부서 이동, 승진, 직급변경 등 인사기록을 확인할 수 있습니다.</p>
      </div>

      <div className="page-content">
        <UserHistoryList />
      </div>
    </div>
  );
}

export default UserHistory;