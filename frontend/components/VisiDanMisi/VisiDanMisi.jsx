import Polygon from "../../assets/icon/Polygon.svg"
import naik from "../../assets/icon/naik.svg"
import { useSection } from "../../lib/content"
import { HeroTitle } from "../../lib/text"

const VisiDanMisi = () => {
  const visiMisi = useSection("visiMisi")

  return (
    <section className="mx-auto max-w-363 px-6 py-14 md:px-12 md:py-18.5 lg:px-14.5">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-x-18">
        <div className="flex justify-between gap-6 lg:block lg:space-y-31.75">
          <div className="flex items-center gap-4">
            <img src={Polygon} alt="" className="h-4 w-4" />
            <span className="font-inter text-xl font-bold tracking-[-0.04em] text-[#1f1f1f] md:text-[30px]">
              {visiMisi.visionLabel}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img src={Polygon} alt="" className="h-4 w-4" />
            <span className="font-inter text-xl font-bold tracking-[-0.04em] text-[#1f1f1f] md:text-[30px]">
              {visiMisi.missionLabel}
            </span>
          </div>
        </div>

        <div>
          <p className="max-w-205 text-lg leading-[1.55] tracking-[-0.04em] text-[#1f1f1f] md:text-[28px]">
            {visiMisi.vision}
          </p>

          <div className="mt-9 grid grid-cols-1 gap-x-10 gap-y-7.5 md:grid-cols-2">
            {visiMisi.missions.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0efff] shadow-[inset_0_0_0_1px_rgba(43,40,128,0.2)]">
                  <img src={naik} alt="" className="h-4 w-4" />
                </div>
                <p className="max-w-81.25 text-base leading-[1.45] tracking-[-0.03em] text-[#1f1f1f] md:text-[20px]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-18 text-center">
        <h2 className="font-header text-5xl font-semibold leading-none tracking-tighter text-[#1f1f1f] md:text-[66px]">
          <HeroTitle
            before={visiMisi.coreValueTitleBefore}
            highlight={visiMisi.coreValueTitleHighlight}
            highlightClassName="text-[#2c2a8d]"
          />
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 items-center gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
        {visiMisi.coreValues.map((item) => (
          <div
            key={item.id}
            className={
              item.active
                ? "flex min-h-52.5 flex-col items-center justify-center rounded-[20px] bg-linear-to-br from-[#6d63d6] to-[#2c2a8d] px-8 py-10 text-center text-white shadow-[0_18px_30px_rgba(53,49,133,0.28)]"
                : "flex min-h-52.5 flex-col items-center justify-center rounded-[20px] border border-[#d7d7d7] bg-white px-8 py-10 text-center"
            }
          >
            <h3
              className={
                "font-inter text-[24px] font-bold tracking-[-0.03em] " +
                (item.active ? "text-white" : "text-[#2c2a8d]")
              }
            >
              {item.title}
            </h3>
            <p
              className={
                "mt-3 max-w-56 text-[16px] leading-normal tracking-[-0.02em] " +
                (item.active ? "text-white/90" : "text-[#3b3b3b]")
              }
            >
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default VisiDanMisi
