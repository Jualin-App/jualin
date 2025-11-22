export default function JualinLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/Logo.png" 
        alt="Jualin Logo" 
        className="h-8 w-auto"
      />
    </div>
  )
}