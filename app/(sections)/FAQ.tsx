"use client";

const FAQS = [
  {
    q: "1. What is DDC?",
    a: "DDC (Diamond Data Chain) is a system designed to record data in a way that makes it difficult to secretly change, delete, or manipulate."
  },
  {
    q: "2. Is DDC a cryptocurrency?",
    a: "Partly. DDC has a Coin used for fees, staking, and network operation, and a DDC Token (DDT) used to record and verify data. The goal is not only payments, but trusted digital records."
  },
  {
    q: "3. What problem does DDC solve?",
    a: "Today, records can often be changed, deleted, manipulated, or hidden. DDC creates a permanent and traceable record system where responsibility can be tracked."
  },
  {
    q: "4. Why is DDC different from normal databases?",
    a: "In a normal database, administrators can change records, history can be modified, and responsibility can disappear. In DDC, every action is recorded, changes leave a permanent trace, and records are verified by the network."
  },
  {
    q: "5. What is a DDC Token (DDT)?",
    a: "A DDC Token (DDT) is not money. It is a digital record containing who created the data, when it was created, proof of origin, and validation information."
  },
  {
    q: "6. Can someone enter false information into DDC?",
    a: "Anyone can submit information, but DDC does not automatically treat it as truth. The system evaluates who submitted it, whether the source is verified, whether the data matches other records, and whether multiple confirmations exist. Each record receives a Trust Score."
  },
  {
    q: "7. What is the purpose of validators?",
    a: "Validators are independent network participants who verify transactions, confirm records, and secure the system. They are rewarded for helping maintain network integrity."
  },
  {
    q: "8. Can records be deleted or secretly changed?",
    a: "No. Once confirmed by the network, records become permanent and traceable. Any attempt to manipulate data leaves visible evidence."
  },
  {
    q: "9. Where can DDC be used?",
    a: "DDC can be used in logistics, manufacturing, finance, AI datasets, healthcare, supply chains, inventory systems, and public administration — anywhere accurate and accountable records matter."
  },
  {
    q: "10. What is the main idea behind DDC?",
    a: "DDC is not just about storing data. Its purpose is to create a system where responsibility is visible, records are traceable, manipulation becomes extremely difficult, and trust can be measured instead of assumed."
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="w-full px-6 py-24 bg-slate-950 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          FAQ
        </h2>

        <div className="space-y-6">
          {FAQS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.q}
              </h3>

              <p className="text-slate-300 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
