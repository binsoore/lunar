import baseDateText from "@assets/base_date_1750583288301.txt?raw";

export interface DateMapping {
  solar: string;
  lunar: string;
}

export interface ConversionResult {
  year: number;
  solarDate: string;
  dayOfWeek: string;
  dday: string;
}

export interface ConvertedResults {
  eventTitle: string;
  lunarMonth: number;
  lunarDay: number;
  results: ConversionResult[];
}

let baseDateData: DateMapping[] = [];

// Parse base date data on module load
function parseBaseDateData(): DateMapping[] {
  const lines = baseDateText.split('\n');
  const parsedData: DateMapping[] = [];
  
  lines.forEach(line => {
    if (line.trim()) {
      const match = line.match(/\d+:\s*([^,]+),\s*(.+)/);
      if (match) {
        parsedData.push({
          solar: match[1].trim(),
          lunar: match[2].trim()
        });
      }
    }
  });
  
  return parsedData;
}

// Initialize base date data
baseDateData = parseBaseDateData();

function parseDateString(dateStr: string): Date | null {
  // Handle various date formats from the base data
  try {
    // Try parsing YYYY-MM-DD format
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
      return new Date(year, month - 1, day);
    }
    return null;
  } catch {
    return null;
  }
}

function formatLunarDate(month: number, day: number): string {
  // Format lunar date to match the format in base data
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return `${monthStr}-${dayStr}`;
}

function findLunarToSolarMapping(lunarMonth: number, lunarDay: number, targetYear: number): Date | null {
  const targetLunarDate = formatLunarDate(lunarMonth, lunarDay);
  
  // Find entries that match the lunar month and day
  const matchingEntries = baseDateData.filter(entry => {
    const lunarDate = parseDateString(entry.lunar);
    if (!lunarDate) return false;
    
    const lunarMonthFromData = lunarDate.getMonth() + 1;
    const lunarDayFromData = lunarDate.getDate();
    
    return lunarMonthFromData === lunarMonth && lunarDayFromData === lunarDay;
  });

  if (matchingEntries.length === 0) return null;

  // Find the closest year match or interpolate
  for (const entry of matchingEntries) {
    const solarDate = parseDateString(entry.solar);
    const lunarDate = parseDateString(entry.lunar);
    
    if (!solarDate || !lunarDate) continue;
    
    const yearDiff = targetYear - solarDate.getFullYear();
    
    // If we have an exact match or close match, calculate the solar date for target year
    if (Math.abs(yearDiff) <= 50) {
      // Simple approximation: add the year difference
      const targetSolarDate = new Date(solarDate);
      targetSolarDate.setFullYear(targetYear);
      
      // Adjust for lunar calendar drift (very rough approximation)
      // Lunar year is about 11 days shorter than solar year
      const lunarDrift = Math.floor(yearDiff * 11);
      targetSolarDate.setDate(targetSolarDate.getDate() - lunarDrift);
      
      return targetSolarDate;
    }
  }

  // Fallback: approximate based on lunar calendar principles
  const baseEntry = matchingEntries[0];
  const baseSolarDate = parseDateString(baseEntry.solar);
  const baseLunarDate = parseDateString(baseEntry.lunar);
  
  if (baseSolarDate && baseLunarDate) {
    const yearDiff = targetYear - baseSolarDate.getFullYear();
    const targetSolarDate = new Date(baseSolarDate);
    targetSolarDate.setFullYear(targetYear);
    
    // Apply lunar drift correction
    const lunarDrift = Math.floor(yearDiff * 11);
    targetSolarDate.setDate(targetSolarDate.getDate() - lunarDrift);
    
    return targetSolarDate;
  }

  return null;
}

function calculateDday(targetDate: Date): string {
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

function formatSolarDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

function getDayOfWeek(date: Date): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
}

export function convertLunarToSolar(eventTitle: string, lunarMonth: number, lunarDay: number): ConvertedResults {
  const results: ConversionResult[] = [];
  const startYear = 2025;
  const endYear = 2050;

  for (let year = startYear; year <= endYear; year++) {
    const solarDate = findLunarToSolarMapping(lunarMonth, lunarDay, year);
    
    if (solarDate) {
      results.push({
        year: year,
        solarDate: formatSolarDate(solarDate),
        dayOfWeek: getDayOfWeek(solarDate),
        dday: calculateDday(solarDate)
      });
    }
  }

  return {
    eventTitle,
    lunarMonth,
    lunarDay,
    results
  };
}

export function generateCsvContent(convertedResults: ConvertedResults): string {
  const headers = ['연도', '양력 날짜', '요일', 'D-Day'];
  const rows = [headers.join(',')];
  
  // Add event info as comment
  rows.push(`# ${convertedResults.eventTitle} (음력 ${convertedResults.lunarMonth}월 ${convertedResults.lunarDay}일)`);
  
  convertedResults.results.forEach(result => {
    const row = [
      result.year,
      `"${result.solarDate}"`,
      result.dayOfWeek,
      result.dday
    ];
    rows.push(row.join(','));
  });
  
  return '\uFEFF' + rows.join('\n'); // Add BOM for proper UTF-8 encoding
}

export function downloadCsv(convertedResults: ConvertedResults): void {
  const csvContent = generateCsvContent(convertedResults);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const filename = `${convertedResults.eventTitle}_음력${convertedResults.lunarMonth}월${convertedResults.lunarDay}일_양력변환.csv`;
  
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
