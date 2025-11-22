import JualinLogo from "@/components/common/JualinLogo"

export default function Header() {
  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 px-4">
        <p className="text-xs sm:text-sm">
          Wow! News | instant delivery is now available in all over INDONESIA, free shipping for standard delivery.
        </p>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Left side - Logo */}
            <div className="flex items-center mr-8">
              <JualinLogo />
            </div>
            
            {/* Center - Navigation */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center space-x-8">
                <button className="flex items-center text-[#1F1F1F] hover:text-[#E53935] font-medium">
                  Category
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <a href="#" className="text-[#1F1F1F] hover:text-[#E53935] font-medium">Women</a>
                <a href="#" className="text-[#1F1F1F] hover:text-[#E53935] font-medium">Men</a>
                <a href="#" className="text-[#1F1F1F] hover:text-[#E53935] font-medium">Kids</a>
                <a href="#" className="text-[#1F1F1F] hover:text-[#E53935] font-medium">Sport</a>
                <a href="#" className="text-[#1F1F1F] hover:text-[#E53935] font-medium">Sale</a>
              </nav>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center ml-8">
              <button className="p-2 rounded-full bg-[#E53935] text-white hover:bg-[#D32F2F] transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}