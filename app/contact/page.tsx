import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16 max-w-2xl mx-auto">
      <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-700 transition-colors">← CEO AI Accountability Console</Link>
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Request an Institutional Audit</h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-xl">
        For verified review, submit policy documents, decision flows, UI evidence, appeal procedures,
        responsibility ownership records, and affected-subject evidence.
      </p>
      <a
        href="mailto:contact@platodesign.io"
        className="inline-flex items-center border border-gray-900 text-gray-900 text-[12px] font-mono tracking-wider uppercase px-6 py-3 hover:bg-gray-900 hover:text-white transition-colors"
      >
        Send Enquiry
      </a>
      <p className="text-[10px] text-gray-400 leading-relaxed mt-12 border-t border-gray-100 pt-6 max-w-xl">
        This tool does not provide legal advice, compliance certification, psychological diagnosis, medical
        assessment, or formal AI safety certification. It is a preliminary executive governance tool for
        mapping accountability risks in AI-enabled decision systems.
      </p>
    </div>
  )
}
