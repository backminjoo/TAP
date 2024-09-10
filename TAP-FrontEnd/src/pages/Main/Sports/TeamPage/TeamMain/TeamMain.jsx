import React, { useState, useEffect } from 'react';
import styles from './TeamMain.module.css'; // CSS 모듈 임포트

export const TeamMain = ({ matches, selectedTeam }) => {
  // 현재 표시되는 항목 수를 관리하는 상태
  const [maxList, setMaxList] = useState(5);

  // useEffect로 matches가 제대로 들어오는지 확인 (필요한 경우 콘솔 로그 추가)
  useEffect(() => {
    console.log(matches); // matches 데이터 확인
  }, [matches]);

  return (
    <div className={styles.teamMain}>
      <h2>경기 일정</h2>
      <div className={styles.scheduleTable}>
        {matches.slice(0, maxList).map((match, index) => (
          <div key={index} className={styles.timeSchedule}>
            {/* 날짜 및 시간 표시 */}
            <div className={styles.scheduleDateTime}>
              <div className={styles.date}>
                {new Date(match.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                ({new Date(match.date).toLocaleDateString('ko-KR', { weekday: 'short' })})
              </div>
              <div className={styles.time}>
                {match.time || '18:30'}
              </div>
            </div>

            {/* 팀 매치 표시 */}
            <div className={styles.teamMatch}>
              <div className={styles.team1}>
                <a href="#" style={{ cursor: 'default' }}>
                  <img
                    src={match.homeTeamLogo || 'http://ticketimage.interpark.com/TicketImage/sports/web/small/PB004.png'}
                    onError={(e) => e.target.src = '//ticketimage.interpark.com/Play/image/small/NoImage.gif'}
                    alt={selectedTeam || match.homeTeam || '홈 팀'}
                  />
                </a>
                <a href="#" className={styles.teamName} style={{ cursor: 'default' }}>
                  {selectedTeam || match.homeTeam || '홈 팀'}
                </a>
              </div>

              {/* "vs" 텍스트 */}
              <div className={styles.vsText}>vs</div>

              <div className={styles.team2}>
                <a href="#" style={{ cursor: 'default' }}>
                  <img
                    src={match.opponentLogo || 'http://ticketimage.interpark.com/TicketImage/sports/web/small/PB009.png'}
                    onError={(e) => e.target.src = '//ticketimage.interpark.com/Play/image/small/NoImage.gif'}
                    alt={match.opponent || '상대 팀'}
                  />
                </a>
                <a href="#" className={styles.teamName} style={{ cursor: 'default' }}>
                  {match.opponent || '상대 팀'}
                </a>
              </div>
            </div>

            {/* 홈구장 정보 */}
            <div className={styles.ground}>
              <span>{match.homeGround || '경기장'}</span>
            </div>

            {/* 예매 버튼 */}
            <div className={styles.btns}>
              <a
                href="#"
                className={`${styles.BtnColor_Y} ${styles.btn1}`}
                onClick={() => alert('예매하기 기능 미구현')}
              >
                예매하기
              </a>
            </div>
          </div>
        ))}

        {/* 더보기 버튼 */}
        {matches.length > maxList && (
          <div
            className={styles.more}
            onClick={() => setMaxList(prev => prev + 5)}
          >
            더보기
          </div>
        )}
      </div>
    </div>
  );
};
