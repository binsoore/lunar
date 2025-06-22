// 음력-양력 변환 데이터 (간소화된 샘플)
const lunarSolarData = {
  '1-1': [
    { year: 2025, solarDate: '2025-01-29' },
    { year: 2026, solarDate: '2026-02-17' },
    { year: 2027, solarDate: '2027-02-07' },
    { year: 2028, solarDate: '2028-01-27' },
    { year: 2029, solarDate: '2029-02-13' },
    { year: 2030, solarDate: '2030-02-03' },
    { year: 2031, solarDate: '2031-01-23' },
    { year: 2032, solarDate: '2032-02-11' },
    { year: 2033, solarDate: '2033-01-31' },
    { year: 2034, solarDate: '2034-02-19' },
    { year: 2035, solarDate: '2035-02-08' },
    { year: 2036, solarDate: '2036-01-28' },
    { year: 2037, solarDate: '2037-02-15' },
    { year: 2038, solarDate: '2038-02-04' },
    { year: 2039, solarDate: '2039-01-24' },
    { year: 2040, solarDate: '2040-02-12' },
    { year: 2041, solarDate: '2041-02-01' },
    { year: 2042, solarDate: '2042-01-22' },
    { year: 2043, solarDate: '2043-02-10' },
    { year: 2044, solarDate: '2044-01-30' },
    { year: 2045, solarDate: '2045-02-17' },
    { year: 2046, solarDate: '2046-02-06' },
    { year: 2047, solarDate: '2047-01-26' },
    { year: 2048, solarDate: '2048-02-14' },
    { year: 2049, solarDate: '2049-02-02' },
    { year: 2050, solarDate: '2050-01-23' }
  ]
};

// 음력-양력 변환 함수 (근사치)
function convertLunarToSolar(lunarMonth, lunarDay) {
  const results = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 기본 변환 로직 (1월 1일 기준으로 다른 날짜들 계산)
  const baseData = lunarSolarData['1-1'];
  
  for (let i = 0; i < baseData.length; i++) {
    const baseEntry = baseData[i];
    const baseDate = new Date(baseEntry.solarDate);
    
    // 월/일 차이 계산 (대략적)
    const monthDiff = (lunarMonth - 1) * 30;
    const dayDiff = lunarDay - 1;
    const totalDiff = monthDiff + dayDiff;
    
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + totalDiff);
    
    // 현재일 이후만 포함
    if (targetDate >= today) {
      results.push({
        year: baseEntry.year,
        solarDate: formatDate(targetDate),
        dayOfWeek: getDayOfWeek(targetDate),
        dday: calculateDday(targetDate)
      });
    }
  }
  
  return results;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

function getDayOfWeek(date) {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
}

function calculateDday(targetDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return `D-${diffDays}`;
  } else if (diffDays < 0) {
    return `D+${Math.abs(diffDays)}`;
  } else {
    return 'D-DAY';
  }
}

function formatDateForCsv(dateStr) {
  const match = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (match) {
    const year = match[1];
    const month = match[2].padStart(2, '0');
    const day = match[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

function generateCsvContent(eventTitle, results) {
  const headers = ['Subject', 'Start Date', 'All Day Event'];
  const rows = [headers.join(',')];
  
  results.forEach(result => {
    const formattedDate = formatDateForCsv(result.solarDate);
    const row = [eventTitle, formattedDate, 'TRUE'];
    rows.push(row.join(','));
  });
  
  return '\uFEFF' + rows.join('\n');
}

function downloadCsv(eventTitle, results) {
  const csvContent = generateCsvContent(eventTitle, results);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const filename = `${eventTitle}_음력달력.csv`;
  
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// DOM 요소들
const lunarDaySelect = document.getElementById('lunarDay');
const lunarForm = document.getElementById('lunarForm');
const resetBtn = document.getElementById('resetBtn');
const resultsDiv = document.getElementById('results');
const resultsTable = document.getElementById('resultsTable');
const eventInfo = document.getElementById('eventInfo');
const summaryText = document.getElementById('summaryText');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');

let currentResults = null;
let currentEventTitle = '';

// 일 옵션 생성
for (let i = 1; i <= 30; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = `${i}일`;
  lunarDaySelect.appendChild(option);
}

// 폼 제출 처리
lunarForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const eventTitle = document.getElementById('eventTitle').value;
  const lunarMonth = parseInt(document.getElementById('lunarMonth').value);
  const lunarDay = parseInt(document.getElementById('lunarDay').value);
  
  if (!eventTitle || !lunarMonth || !lunarDay) {
    alert('모든 필드를 입력해주세요.');
    return;
  }
  
  const results = convertLunarToSolar(lunarMonth, lunarDay);
  
  if (results.length === 0) {
    alert('해당 음력 날짜에 대한 양력 변환 데이터를 찾을 수 없습니다.');
    return;
  }
  
  currentResults = results;
  currentEventTitle = eventTitle;
  
  displayResults(eventTitle, lunarMonth, lunarDay, results);
});

function displayResults(eventTitle, lunarMonth, lunarDay, results) {
  // 이벤트 정보 표시
  eventInfo.textContent = `${eventTitle} (음력 ${lunarMonth}월 ${lunarDay}일)`;
  
  // 테이블 내용 생성
  resultsTable.innerHTML = '';
  results.forEach(result => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-50 transition-colors';
    
    const ddayColor = result.dday.startsWith('D-') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';
    
    row.innerHTML = `
      <td class="border border-slate-300 px-4 py-3 font-medium text-slate-800">${result.year}</td>
      <td class="border border-slate-300 px-4 py-3 text-slate-700">${result.solarDate}</td>
      <td class="border border-slate-300 px-4 py-3 text-slate-600">${result.dayOfWeek}</td>
      <td class="border border-slate-300 px-4 py-3">
        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${ddayColor}">
          ${result.dday}
        </span>
      </td>
    `;
    resultsTable.appendChild(row);
  });
  
  // 요약 정보
  summaryText.textContent = `총 ${results.length}개의 향후 양력 날짜를 표시했습니다. (오늘 이후 날짜만 포함)`;
  
  // 결과 영역 표시
  resultsDiv.classList.remove('hidden');
  
  // 결과로 스크롤
  setTimeout(() => {
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// 초기화 버튼
resetBtn.addEventListener('click', function() {
  lunarForm.reset();
  resultsDiv.classList.add('hidden');
  currentResults = null;
  currentEventTitle = '';
});

// CSV 다운로드
downloadBtn.addEventListener('click', function() {
  if (currentResults && currentEventTitle) {
    downloadCsv(currentEventTitle, currentResults);
    showToast('CSV 파일이 다운로드되었습니다.');
  }
});

// 복사 버튼
copyBtn.addEventListener('click', async function() {
  if (currentResults && currentEventTitle) {
    try {
      const csvContent = generateCsvContent(currentEventTitle, currentResults);
      await navigator.clipboard.writeText(csvContent);
      
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        복사됨!
      `;
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
      
      showToast('결과가 클립보드에 복사되었습니다.');
    } catch (error) {
      showToast('클립보드 복사 중 오류가 발생했습니다.');
    }
  }
});

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg z-50 transition-opacity';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}