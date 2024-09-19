import { useLocation } from 'react-router-dom';
import styles from './Detail.module.css'
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // solid 아이콘
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // regular 아이콘
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api, url } from '../../../../config/config';
import { useEffect, useState } from 'react';
import { Notice } from './Notice/Notice';
import { ProductData } from './ProductData/ProductData';
import { Casting } from './Casting/Casting';
import { Write } from './Write/Write';
import { Calender } from '../../../../components/Calender/Calender';
import { BookModal } from '../../../../components/BookModal/BookModal';
// import { format } from 'date-fns';
import { format, parseISO, isSameDay } from 'date-fns';


export const Detail = ()=>{

    const location = useLocation();
    const { seq } = location.state || {};  // 전달된 state가 있으면 가져옴
    const [tap, setTap] = useState(0);


    // =================== 상품 상세 정보 ===================
    const [mainData, setMainData] = useState(null);
    const [seatPrices, setSeatPrices] = useState([]);
    const [description, setDescription] = useState({}); 
    const [casting, setCasting] = useState([]);
    // const [schedules, setSchedules] = useState([]);
    const [times, setTimes] = useState([]);
    const [days, setDays] = useState([]); 
    const [part, setPart] = useState([]); // 날짜 선택 시 회차 넣을 변수
    const [castingAndDate, setCastingAndDate] = useState([]);
    const [company, setCompany] = useState({});
    const [member,setMember] = useState({});

    
    
    useEffect(()=>{
        alert(seq+"번 상품 상세정보입니다.");
        api.get(`/detail/${seq}`)
        .then((resp)=>{
            console.log("상품 상세정보 확인",resp.data);
            setMainData(resp.data.mainData); //메인 상품 정보
            setDescription(resp.data.description); // 공지사항, 상세정보 사항
            setSeatPrices(resp.data.seats); // 좌석별 가격
            setCasting(resp.data.casting); // 캐스팅 인물, 역할 정보
            setCompany(resp.data.companyData); // 사업체정보
            setMember(resp.data.memberData); // 기본 멤버 정보(이메일, 대표 이름)
            setDays(resp.data.days);
            setTimes(resp.data.times);
            const processedData = processCastingData(resp.data.castingAndDate);
            setCastingAndDate(processedData);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[seq])

    // useEffect(()=>{
    //     console.log("데이터 변환 모습",castingAndDate);
    // },[castingAndDate]);



    // =================== 캘린더 관련 멤버 변수 =================== 
    const [selectedDate, setSelectedDate] = useState(new Date());
    // 달력 표시 범위 (지금의 경우 9월달만 있기 때문에 화살표가 비활성화 됨)
    //format(new Date(image.end_date), 'yyyy-MM-dd')
    const minDate = mainData?.start_date ? new Date(mainData.start_date) : new Date();
    const maxDate = mainData?.end_date ? new Date(mainData.end_date) : new Date();
    // 활성화 시킬 날짜 설정
    const periods = [];
    const scheduleDays = Object.keys(castingAndDate).map(dateStr => new Date(dateStr)).sort((a, b) => a - b);

    for (let i = 0; i < scheduleDays.length; i++) {
        const start = scheduleDays[i];
        let end = start;
        // 연속된 날짜 범위를 찾아서 `end` 값을 업데이트
        while (i + 1 < scheduleDays.length && scheduleDays[i + 1] - scheduleDays[i] <= 24 * 60 * 60 * 1000) {
            end = scheduleDays[++i];
        }
        // 연속된 날짜가 아닐 경우도 처리
        periods.push({ start, end });
    }

    // useEffect(() => {
    //     // selectedDate를 ISO 형식으로 변환
    //     const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

    //     // castingAndDate에서 selectedDateStr과 일치하는 날짜를 찾고 times를 추출
    //     const dateStr = Object.keys(castingAndDate).find(dateStr => {
    //         // 키에서 시간 부분을 제거하고 비교
    //         const formattedDateStr = new Date(dateStr).toISOString().split('T')[0];
    //         return formattedDateStr === selectedDateStr;
    //     });

    //     if (dateStr) {
    //         const timesSet = new Set(Object.keys(castingAndDate[dateStr]));
    //         setPart(Array.from(timesSet));
    //         console.log("Available times: ", timesSet);  // 확인을 위한 콘솔 출력
    //     } else {
    //         setPart([]);
    //         console.log("No matching data for selected date.", dateStr);  // 확인을 위한 콘솔 출력
    //     }
    // }, [selectedDate, castingAndDate]);

    useEffect(() => {
        // selectedDate를 문자열로 변환
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
        // castingAndDate에서 selectedDateStr과 일치하는 날짜를 찾고 times를 추출
        const dateStr = Object.keys(castingAndDate).find(dateStr => {
            // castingAndDate의 날짜를 문자열로 변환
            const formattedDateStr = format(parseISO(dateStr), 'yyyy-MM-dd');
            return formattedDateStr === selectedDateStr;
        });
    
        if (dateStr) {
            const timesSet = new Set(Object.keys(castingAndDate[dateStr]));
            setPart(Array.from(timesSet));
            console.log("Available times: ", timesSet);  // 확인을 위한 콘솔 출력
        } else {
            setPart([]);
            console.log("No matching data for selected date.");  // 확인을 위한 콘솔 출력
        }
    }, [selectedDate, castingAndDate]);


    // =================== 회차 선택 멤버 변수 ===================
    const [selectedTime, setSelectedTime] = useState('');

    const handleTime = (time) => {
        setSelectedTime(time);
    }

    useEffect(()=>{
        console.log("선택한 날짜 : ",selectedDate);
    },[selectedDate])

    // =================== 에매 모달창 멤버 변수 ===================
    const [bookModal, setBookModal] = useState(false);

    // 모달창이 열리면 스크롤을 비활성화하고, 닫히면 다시 활성화
    useEffect(() => {
        if (bookModal) {
            document.body.style.overflow = 'hidden'; // 스크롤 비활성화
        } else {
            document.body.style.overflow = 'auto'; // 스크롤 활성화
        }
        // 컴포넌트가 언마운트될 때 스크롤 복구
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [bookModal]);

    const isBookModalOpen = ()=>{
        setBookModal(true);
    }

    const closeBookModal=()=>{
        setBookModal(false);
    }

    // =================== 캐스팅 객체 생성 변수 ===================
    const processCastingData = (data) => {
        const result = {};
        data.forEach(item => {
            const date = item.schedule_day;
            const role = item.casting_role;
            const name = item.casting_name;
            const time = item.times;
            const day = item.days;

            if (!result[date]) {
                result[date] = {};
            }

            if (!result[date][time]) {
                result[date][time]= {};
            }

            if (!result[date][time][day]) {
                result[date][time][day]= {};
            }

            result[date][time][day][role] = name;
            });
        return result;
    };


    return(
        <div className={styles.container}>
            <div className={styles.left}>
            {mainData ? (
                    <>
                        <h2>{mainData.name}</h2>
                        <div className={styles.header_data}>
                            <div className={styles.header_data_left}>
                                <img src={mainData.files_sysname} alt="상품 이미지" />
                                <div className={styles.likes}>
                                    {'like' === 'like'
                                        ? <FontAwesomeIcon icon={regularHeart} />
                                        : <FontAwesomeIcon icon={solidHeart} />
                                    }
                                    &nbsp; 관심등록
                                </div>
                            </div>
                            <div className={styles.header_data_right}>
                                <div className={styles.datas}>
                                    <div className={styles.data_title}>장소</div>
                                    <div className={styles.data_content}>{mainData.place_name}</div>
                                </div>
                                <div className={styles.datas}>
                                    <div className={styles.data_title}>공연기간</div>
                                    <div className={styles.data_content}>
                                        {format(new Date(mainData.start_date), 'yyyy.MM.dd')} ~ &nbsp;
                                        {format(new Date(mainData.end_date), 'yyyy.MM.dd')}
                                    </div>
                                </div>
                                <div className={styles.datas}>
                                    <div className={styles.data_title}>공연시간</div>
                                    <div className={styles.data_content}>{mainData.running_time}분 (인터미션 {mainData.running_intertime}분 포함)</div>
                                </div>
                                <div className={styles.datas}>
                                    <div className={styles.data_title}>관람연령</div>
                                    <div className={styles.data_content}>{mainData.age_limit} {mainData.age_limit.startsWith("전") ? "" : " 이상"}</div>
                                </div>
                                <div className={styles.datas}>
                                    <div className={styles.data_title}>가격</div>
                                    <div className={styles.data_content}>
                                        {
                                            seatPrices.map((price)=>{
                                                return(
                                                    <div className={styles.data_sub_content} key={price.price_seq}>
                                                        <span style={{ color: "gray" }}>{price.place_seat_level}</span><span> &nbsp;{price.price_seat}원</span>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.btns}>
                            <button onClick={() => { setTap(0) }}>공지사항</button>
                            <button onClick={() => { setTap(1) }}>캐스팅정보</button>
                            <button onClick={() => { setTap(2) }}>판매정보</button>
                            <button onClick={() => { setTap(3) }}>관람후기 (0)</button>
                            <button onClick={() => { setTap(4) }}>기대평 (0)</button>
                        </div>

                        <div className={styles.detail_page}>
                            {
                                tap === 1 ? <Casting castings={casting} seq={seq} days={days} time={times} castingAndDate={castingAndDate}/> :
                                tap === 2 ? <ProductData member={member} company={company} mainData={mainData} casting={casting}/> :
                                tap === 3 ? <Write category="review" /> :
                                tap === 4 ? <Write category="excite" /> :
                                <Notice description = {description} casting = {casting}/>
                            }
                        </div>
                    </>
                ) : (
                    <div className={styles.loading}>로딩 중입니다...</div>
                )}

            </div>


            {/* 예매 섹션 */}
            <div className={styles.right}>
                <div className={styles.bubble}>
                    <div className={styles.text}><span style={{color:"purple", fontWeight:600, fontSize:"20px"}}>Step 1.</span><span style={{fontWeight:600, fontSize:"19px"}}> 날짜 선택</span></div>
                    <div className={styles.calendar}>
                        <Calender minDate={minDate} maxDate={maxDate} periods = {periods} setSelectedDate = {setSelectedDate} selectedDate={selectedDate}/>
                    </div>
                    <div className={styles.text}><span style={{color:"purple", fontWeight:600, fontSize:"20px"}}>Step 2.</span><span style={{fontWeight:600, fontSize:"19px"}}> 회차 선택</span></div>
                    <div className={styles.time}>
                        {
                            part.map((part, index)=>{
                                return(
                                    <div className={`${styles.time_bubble} ${selectedTime === part ? styles.selected : ''}`} onClick={() => handleTime(part)}>
                                        {index+1}회 {part}
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={styles.seats}> 
                        <p>
                            <span>총 좌석수 : 100 좌석&nbsp;&nbsp;|</span>
                            <span>&nbsp;&nbsp;잔여 좌석수 : 70 좌석</span>
                        </p>
                    </div>     
                    <div className={styles.book}>
                        <button onClick={isBookModalOpen}>예매하기</button>
                    </div>            
                </div>
            </div>

            <BookModal isOpen={bookModal} onClose={closeBookModal}/>


        </div>
    );

}