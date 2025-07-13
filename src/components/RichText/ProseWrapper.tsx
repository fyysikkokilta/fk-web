export default function ProseWrapper({
  children,
  extraClassName
}: {
  children: React.ReactNode
  extraClassName?: string
}) {
  return <div className={`prose-fk ${extraClassName || ''}`}>{children}</div>
}
