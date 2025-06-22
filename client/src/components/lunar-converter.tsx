import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Search, RotateCcw, Download, Copy, Check, AlertCircle } from "lucide-react";
import { convertLunarToSolar, downloadCsv, generateCsvContent, type ConvertedResults } from "@/lib/lunar-converter";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  eventTitle: z.string().min(1, "기념일 제목을 입력해주세요"),
  lunarMonth: z.string().min(1, "음력 월을 선택해주세요"),
  lunarDay: z.string().min(1, "음력 일을 선택해주세요"),
});

type FormData = z.infer<typeof formSchema>;

export default function LunarConverter() {
  const [results, setResults] = useState<ConvertedResults | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventTitle: "",
      lunarMonth: "",
      lunarDay: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsConverting(true);
      const lunarMonth = parseInt(data.lunarMonth);
      const lunarDay = parseInt(data.lunarDay);
      
      const convertedResults = convertLunarToSolar(data.eventTitle, lunarMonth, lunarDay);
      
      if (convertedResults.results.length === 0) {
        toast({
          title: "변환 실패",
          description: "해당 음력 날짜에 대한 양력 변환 데이터를 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }
      
      setResults(convertedResults);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "음력 변환 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const onReset = () => {
    form.reset();
    setResults(null);
  };

  const handleDownloadCsv = () => {
    if (!results) return;
    
    try {
      downloadCsv(results);
      toast({
        title: "다운로드 완료",
        description: "CSV 파일이 다운로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "CSV 파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleCopyResults = async () => {
    if (!results) return;
    
    try {
      const csvContent = generateCsvContent(results);
      await navigator.clipboard.writeText(csvContent);
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      toast({
        title: "복사 완료",
        description: "결과가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getDdayBadgeColor = (dday: string) => {
    if (dday.startsWith('D-')) {
      return 'bg-emerald-100 text-emerald-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <Card className="shadow-lg border border-slate-200">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <CalendarDays className="text-primary mr-3" size={24} />
            기념일 정보 입력
          </h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Event Title */}
              <FormField
                control={form.control}
                name="eventTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      기념일 제목
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="예: 할머니 생신, 아버지 생신 등"
                        {...field}
                        className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lunar Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lunarMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        음력 월
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                            <SelectValue placeholder="월 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month}월
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lunarDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        음력 일
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                            <SelectValue placeholder="일 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                            <SelectItem key={day} value={day.toString()}>
                              {day}일
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isConverting}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <Search className="mr-2" size={16} />
                  {isConverting ? "변환 중..." : "변환하기"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onReset}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="mr-2" size={16} />
                  초기화
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <Card id="results" className="shadow-lg border border-slate-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <CalendarDays className="text-blue-600 mr-3" size={24} />
                변환 결과
              </h2>
              <div className="flex gap-3">
                <Button 
                  onClick={handleDownloadCsv}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  <Download className="mr-2" size={16} />
                  CSV 다운로드
                </Button>
                <Button 
                  onClick={handleCopyResults}
                  variant="outline"
                  className="bg-slate-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                >
                  {copySuccess ? <Check className="mr-2" size={16} /> : <Copy className="mr-2" size={16} />}
                  {copySuccess ? "복사됨!" : "복사"}
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-slate-800 mb-2">기념일 정보</h3>
              <p className="text-slate-600">
                <span className="font-medium">{results.eventTitle}</span> 
                {" "}(음력 {results.lunarMonth}월 {results.lunarDay}일)
              </p>
            </div>

            {/* Results Table */}
            {results.results.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="border border-slate-300 rounded-lg overflow-hidden">
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead className="border border-slate-300 px-4 py-3 text-left font-medium text-slate-700">연도</TableHead>
                      <TableHead className="border border-slate-300 px-4 py-3 text-left font-medium text-slate-700">양력 날짜</TableHead>
                      <TableHead className="border border-slate-300 px-4 py-3 text-left font-medium text-slate-700">요일</TableHead>
                      <TableHead className="border border-slate-300 px-4 py-3 text-left font-medium text-slate-700">D-Day</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.results.map((result, index) => (
                      <TableRow key={index} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="border border-slate-300 px-4 py-3 font-medium text-slate-800">
                          {result.year}
                        </TableCell>
                        <TableCell className="border border-slate-300 px-4 py-3 text-slate-700">
                          {result.solarDate}
                        </TableCell>
                        <TableCell className="border border-slate-300 px-4 py-3 text-slate-600">
                          {result.dayOfWeek}
                        </TableCell>
                        <TableCell className="border border-slate-300 px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDdayBadgeColor(result.dday)}`}>
                            {result.dday}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  해당 음력 날짜에 대한 양력 변환 데이터를 찾을 수 없습니다.
                </AlertDescription>
              </Alert>
            )}

            {/* Summary Info */}
            {results.results.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="text-blue-500 mr-2" size={16} />
                  <span className="text-blue-700 text-sm">
                    총 <span className="font-medium">{results.results.length}</span>개의 향후 양력 날짜를 표시했습니다. 
                    (오늘 이후 날짜만 포함)
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
