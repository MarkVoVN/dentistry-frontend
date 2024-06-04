import Image from "next/image";
import Link from "next/link";

const footerData: { title: string; items: { text: string; url?: string }[] }[] =
  [
    {
      title: "contacts",
      items: [
        {
          text: "Address: 236/29/18 Điện Biên Phủ - Phường 17 - Quận Bình Thạnh - TPHCM.",
        },
        {
          text: "Website: dentistry.iframe.vn",
        },

        {
          text: "Email: dentistry@iframe.vn",
        },
        {
          text: "Phone:  091 987 6543",
        },
      ],
    },
    {
      title: "services",
      items: [
        {
          text: "Make Appointment at Clinic",
        },
        {
          text: "Make Appointment with Dentist",
        },
        {
          text: "Make Appointment for Service",
        },
      ],
    },
    {
      title: "about us",
      items: [
        {
          text: "Introduction",
        },
        {
          text: "Terms & Condition",
        },
        {
          text: "Privacy Policy",
        },
      ],
    },
    {
      title: "Guide",
      items: [
        {
          text: "How to make appointment",
        },
        {
          text: "FAP",
        },
      ],
    },
  ];

export default async function Footer() {
  return (
    <footer className="main-footer w-full flex justify-center items-center bg-neutral-7">
      {/* laptop */}
      <div className="container hidden md:flex flex-col justify-between">
        <div className="main-footer--top">
          <div className="grid grid-cols-4 px-5 py-10 gap-2 justify-items-center">
            {footerData.map((section, index) => (
              <div key={index} className="flex flex-col">
                <div className="footer-title mb-2">
                  <h4 className="font-medium text-base text-primary-100">
                    {section.title.toUpperCase()}
                  </h4>
                </div>
                <div className="footer-content">
                  <ul className="list-none space-y-1">
                    {section.items?.map(({ text, url }, index) => (
                      <li key={index}>
                        {url ? (
                          <Link
                            href={url}
                            title={text}
                            className="text-shade-1-100%  hover:text-secondary"
                          >
                            <h4 className="text-[14px] font-light leading-6">
                              {text}
                            </h4>
                          </Link>
                        ) : (
                          <div>
                            <h4 className="text-shade-1-100% text-[14px] font-light leading-6">
                              {text}
                            </h4>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* {category.image && (
                  <div className="footer-image mt-4 flex-1 flex justify-end">
                    <Link
                      href="http://online.gov.vn/Home/WebDetails/99314/"
                      target="_blank"
                    >
                      <Image
                        src={"/logos/bo-cong-thuong.png"}
                        alt={"Bộ Công Thương"}
                        width={123}
                        height={46}
                        className="object-contain cursor-pointer"
                      />
                    </Link>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>
        <div className="main-footer--copyright">
          <div className="line border-t-[1px] border-t-shade-1-75%">
            <div className="pb-12 pt-4 px-5 grid grid-cols-8 gap-4">
              <div
                className="main-header--logo col-span-2"
                itemScope
                itemType="http://schema.org/Organization"
              >
                <Link href="/" itemProp="url">
                  <Image
                    src="/dentistry.svg"
                    alt="laptoptot.vn"
                    width={200}
                    height={50}
                  />
                </Link>
              </div>
              <div className="justify-self-center col-span-4 flex flex-col justify-center items-center font-light text-[14px] text-shade-1-100%">
                <span>&copy; 2024 DENTISTRY LLC</span>
                {/* <span>GPĐKKD số 0317298466</span> */}
              </div>
              <div className="justify-self-end col-span-2 text-[14px] text-shade-1-100%">
                <span>Design by </span>
                <Link
                  href="https://iframe.vn/"
                  className="underline underline-offset-2"
                >
                  iframe.vn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile */}
      {/* <div className="container px-0 flex md:hidden flex-col justify-between">
        <div className="main-footer--top">
          <div className="grid grid-cols-1 px-5 py-10 space-y-4">
            {categoryLinks.map((category, index) => (
              <div key={index} className="flex flex-col">
                <div className="footer-title mb-2">
                  <h4 className="font-medium text-[13px] text-primary-100">
                    {category.name.toUpperCase()}
                  </h4>
                </div>
                <div className="footer-content">
                  <ul className="list-none grid grid-cols-2">
                    {category.children?.map((item, index) => (
                      <li key={index}>
                        {item.url ? (
                          <Link href={item.url} title={item.name}>
                            <h4 className="text-shade-1-100% text-[12px] font-light leading-6">
                              {item.name}
                            </h4>
                          </Link>
                        ) : (
                          <div>
                            <h4 className="text-shade-1-100% text-[12px] font-light leading-6">
                              {item.name}
                            </h4>
                            {item.children?.map((child, index) => (
                              <h5
                                key={index}
                                className="text-shade-1-100% text-[12px] font-light leading-6"
                              >
                                {child.name}
                              </h5>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="main-footer--copyright">
          <div className="line border-t-[1px] border-t-shade-1-75%">
            <div className="pb-28 xl:pb-12 pt-4 px-5 flex justify-center gap-4">
              <div className="footer-image mt-2 flex justify-end items-center">
                <Link href="http://online.gov.vn/Home/WebDetails/99314/">
                  <Image
                    src={"/logos/bo-cong-thuong.png"}
                    alt={"Bộ Công Thương"}
                    width={85}
                    height={48}
                    className="object-contain cursor-pointer"
                  />
                </Link>
              </div>

              <div className="justify-self-center flex flex-1 flex-col justify-center font-light text-[7px] text-shade-1-100%">
                <span>
                  &copy; 2024 CÔNG TY TNHH THƯƠNG MẠI - DỊCH VỤ VY TRẦN LAPTOP
                </span>
                <span>GPĐKKD số 0317298466</span>
                <div className="justify-self-end col-span-2 text-[7px] text-shade-1-100%">
                  <span>Design by </span>
                  <Link
                    href="https://iframe.vn/"
                    className="underline underline-offset-2"
                  >
                    iframe.vn
                  </Link>
                  - Website Service
                </div>
              </div>

            </div>
          </div>
        </div>
      </div> */}
    </footer>
  );
}
