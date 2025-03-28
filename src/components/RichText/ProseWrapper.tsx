export default function ProseWrapper({
  children,
  extraClassName
}: {
  children: React.ReactNode
  extraClassName?: string
}) {
  return (
    <div
      className={`prose prose-p:text-fk-black prose-headings:font-(family-name:--font-lora) prose-headings:italic prose-headings:underline prose-headings:decoration-fk-yellow prose-headings:decoration-4 prose-a:text-fk-orange prose-a:decoration-dotted prose-a:decoration-2 prose-a:underline-offset-2 prose-a:no-underline hover:prose-a:underline prose-a:transition-colors prose-a:duration-200 prose-a:hover:text-fk-orange-dark prose-a:font-bold prose-blockquote:border-l-4 prose-blockquote:border-fk-orange prose-blockquote:bg-fk-yellow-light prose-blockquote:italic prose-blockquote:text-fk-gray prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:text-xl prose-img:rounded-xl prose-img:shadow-md prose-ul:list-disc prose-ul:marker:text-fk-orange prose-ol:list-decimal prose-ol:marker:text-fk-orange prose-ol:marker:font-bold prose-code:bg-blue-100 prose-code:text-blue-800 prose-code:font-mono prose-code:rounded prose-code:px-2 prose-code:py-1 prose-code:text-sm prose-code:before:hidden prose-code:after:hidden prose-pre:bg-blue-950 prose-pre:text-blue-100 prose-pre:font-mono prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre:border-l-4 prose-pre:border-blue-400 prose-pre:text-base prose-pre:my-6 selection:bg-fk-yellow selection:text-fk-black max-w-none ${extraClassName}`}
    >
      {children}
    </div>
  )
}
