import LunarConverter from "@/components/lunar-converter";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">음력 생일 양력 변환기</h1>
            <p className="text-slate-600">음력 생일을 입력하면 2025년부터 2050년까지의 양력 날짜를 확인할 수 있습니다</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <LunarConverter />

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <i className="fas fa-question-circle text-slate-500 mr-3"></i>
            사용 방법
          </h2>
          <div className="space-y-4 text-slate-600">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white text-sm font-medium rounded-full mr-3 mt-0.5">1</span>
              <p>기념일 제목을 입력하세요. (예: 할머니 생신, 아버지 생일)</p>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white text-sm font-medium rounded-full mr-3 mt-0.5">2</span>
              <p>음력 월과 일을 선택하세요.</p>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white text-sm font-medium rounded-full mr-3 mt-0.5">3</span>
              <p>변환하기 버튼을 클릭하면 2025년부터 2050년까지의 양력 날짜를 확인할 수 있습니다.</p>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white text-sm font-medium rounded-full mr-3 mt-0.5">4</span>
              <p>결과를 CSV 파일로 다운로드하거나 클립보드에 복사할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; 2024 음력 생일 양력 변환기. CloudFlare Pages로 배포됨.</p>
            <p className="mt-2">정확한 음력-양력 변환을 위해 한국천문연구원 데이터를 기반으로 합니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
