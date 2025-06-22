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
      // Split by comma to get solar and lunar dates
      const parts = line.split(',');
      if (parts.length === 2) {
        parsedData.push({
          solar: parts[0].trim(),
          lunar: parts[1].trim()
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

function findLunarToSolarMapping(lunarMonth: number, lunarDay: number, targetYear: number): Date | null {
  // Find entries that match the lunar month and day for any year in the data
  const matchingEntries = baseDateData.filter(entry => {
    const lunarDate = parseDateString(entry.lunar);
    if (!lunarDate) return false;
    
    const lunarMonthFromData = lunarDate.getMonth() + 1;
    const lunarDayFromData = lunarDate.getDate();
    
    return lunarMonthFromData === lunarMonth && lunarDayFromData === lunarDay;
  });

  if (matchingEntries.length === 0) return null;

  // Sort entries by year to find the best reference point
  const sortedEntries = matchingEntries.map(entry => ({
    ...entry,
    solarDate: parseDateString(entry.solar),
    lunarDate: parseDateString(entry.lunar)
  })).filter(entry => entry.solarDate && entry.lunarDate)
    .sort((a, b) => a.solarDate!.getFullYear() - b.solarDate!.getFullYear());

  if (sortedEntries.length === 0) return null;

  // Find the closest reference year
  let bestEntry = sortedEntries[0];
  let minYearDiff = Math.abs(targetYear - bestEntry.solarDate!.getFullYear());

  for (const entry of sortedEntries) {
    const yearDiff = Math.abs(targetYear - entry.solarDate!.getFullYear());
    if (yearDiff < minYearDiff) {
      minYearDiff = yearDiff;
      bestEntry = entry;
    }
  }

  // Calculate the target solar date
  const refSolarDate = bestEntry.solarDate!;
  const yearDiff = targetYear - refSolarDate.getFullYear();
  
  // Create target date by adding years
  const targetSolarDate = new Date(refSolarDate);
  targetSolarDate.setFullYear(targetYear);
  
  // Lunar calendar adjustment: lunar year is approximately 354 days vs 365 days solar
  // This creates about 11 days drift per year
  const lunarDrift = Math.floor(yearDiff * 11);
  
  // Apply the drift adjustment
  if (yearDiff > 0) {
    // For future years, lunar dates come earlier
    targetSolarDate.setDate(targetSolarDate.getDate() - lunarDrift);
  } else {
    // For past years, lunar dates come later
    targetSolarDate.setDate(targetSolarDate.getDate() + Math.abs(lunarDrift));
  }
  
  return targetSolarDate;
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let year = startYear; year <= endYear; year++) {
    const solarDate = findLunarToSolarMapping(lunarMonth, lunarDay, year);
    
    if (solarDate) {
      // Only include dates that are today or in the future
      if (solarDate >= today) {
        results.push({
          year: year,
          solarDate: formatSolarDate(solarDate),
          dayOfWeek: getDayOfWeek(solarDate),
          dday: calculateDday(solarDate)
        });
      }
    }
  }

  return {
    eventTitle,
    lunarMonth,
    lunarDay,
    results
  };
}

function formatDateForCsv(solarDateStr: string): string {
  // Convert Korean date format "2025년 1월 15일" to "2025-01-15"
  const match = solarDateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (match) {
    const year = match[1];
    const month = match[2].padStart(2, '0');
    const day = match[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return solarDateStr;
}

export function generateCsvContent(convertedResults: ConvertedResults): string {
  const headers = ['Subject', 'Start Date', 'All Day Event'];
  const rows = [headers.join(',')];
  
  convertedResults.results.forEach(result => {
    const formattedDate = formatDateForCsv(result.solarDate);
    const row = [
      convertedResults.eventTitle,
      formattedDate,
      'TRUE'
    ];
    rows.push(row.join(','));
  });
  
  return '\uFEFF' + rows.join('\n'); // Add BOM for proper UTF-8 encoding
}

export function downloadCsv(convertedResults: ConvertedResults): void {
  const csvContent = generateCsvContent(convertedResults);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const filename = `${convertedResults.eventTitle}_음력달력.csv`;
  
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
