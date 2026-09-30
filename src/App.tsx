                  price: "₹3–15 Lakh per investigation",
                  deskIndex: 6
                },
                {
                  title: "6. Family Wealth Governance",
                  idealFor: "Family-owned groups managing multiple entities, ownership structures or succession planning.",
                  problemSolved: "Ownership, authority and succession decisions can remain fragmented across family and operating entities.",
                  commercialValue: "Creates a structured governance and decision framework for review and formalisation with the appropriate professionals.",
                  price: "₹2–10 Lakh setup",
                  deskIndex: 8
                }
              ].map((p, idx) => (
                <div key={idx} className="navigalex-card p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-md border-t-4 border-blue-600">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                    <div className="space-y-2 text-xs text-slate-700">
                      <div><strong className="text-slate-900">Who picks this:</strong> {p.idealFor}</div>
                      <div><strong className="text-rose-600">The Problem Solved:</strong> {p.problemSolved}</div>
                      <div><strong className="text-emerald-700">Commercial value:</strong> {p.commercialValue}</div>