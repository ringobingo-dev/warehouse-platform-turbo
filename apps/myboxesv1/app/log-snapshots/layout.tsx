import type React from "react"
import "../globals.css"
import "./styles.css"

export default function LogSnapshotsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="w-full"
      style={{
        maxWidth: "100%",
        width: "100%",
        margin: 0,
        padding: 0,
      }}
      data-page="/log-snapshots"
    >
      {children}
    </div>
  )
}

