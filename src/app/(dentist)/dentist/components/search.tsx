// "use client";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Popover, PopoverTrigger } from "@/components/ui/popover";
// import LaptopIcon from "@/public/icon/web-computer-icon.svg";
// import SearchIconNeutral7 from "@/public/icon/web-search-icon-neutral-7.svg";
// import SearchIcon from "@/public/icon/web-search-icon.svg";
// import Productline1 from "@/public/product-line-thumbnails/Rectangle-1.svg";

// import _ from "lodash";

// import Image from "next/image";
// import React, {
//   ReactElement,
//   Suspense,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   DEFAULT_PRODUCT_PROPERTY_OPTIONS,
//   PRODUCT_FILTER_PAGE_SIZE,
// } from "@/app/constant/product";
// import { IProductLine } from "@/app/models/productLine";
// import { Typography } from "@/components/typography";
// import useLocalStorage from "@/hooks/useLocalStorage";
// import { fetchCategoryWithProductCount } from "@/lib/api/categoryAPI";
// import { fetchProductAutocomplete } from "@/lib/api/productAPI";
// import { fetchProductLineListWithSize } from "@/lib/api/productLineAPI";
// import { cn, formatPriceToVND } from "@/lib/utils";
// import { VariantProps, cva } from "class-variance-authority";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { twMerge } from "tailwind-merge";
// import { Separator } from "@/components/ui/separator";
// import Loading from "@/components/loading";

// interface IProps {
//   variant?: "default" | "header";
//   placeholder?: string;
// }

// const createSearchLink = (keyword: string) => {
//   let queryParams: ProductRequesQueryParams = {
//     search: keyword,
//     range: [0, PRODUCT_FILTER_PAGE_SIZE - 1],
//   };

//   let stringifiedParams: { [key: string]: string } = {};
//   Object.keys(queryParams).map((key) => {
//     stringifiedParams[key] = JSON.stringify(queryParams[key]);
//   });
//   const query = new URLSearchParams(stringifiedParams);
//   return `/search?${query}`;
// };

// function SearchComponent({
//   variant = "default",
//   placeholder = "Tìm kiếm laptop",
// }: IProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   let SearchTermFromURL = "";
//   Array.from(searchParams.entries()).forEach((pair) => {
//     if (pair[0] === "search") SearchTermFromURL = JSON.parse(pair[1]);
//   });
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [selectedBrand, setSelectedBrand] = useState<string>();
//   const [popoverOpen, setPopoverOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(SearchTermFromURL);
//   const [error, setError] = useState();
//   const [data, setData] = useState([]);
//   const [wid, setWid] = useState<number>();
//   const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
//     "searchHistory",
//     []
//   );
//   const [categoryList, setCategoryList] = useState<
//     {
//       _id: string;
//       name: string;
//       slug: string;
//       image: string;
//       count: string;
//     }[]
//   >();
//   const [categoryListError, setCategoryListError] = useState<string | null>();
//   const [productLineList, setProductLineList] =
//     useState<(IProductLine & { _id: string })[]>();
//   const [productLineError, setProductLineError] = useState<string | null>();

//   const onSearchInputFocused = () => {
//     setPopoverOpen(true);
//     if (div1Ref.current) setWid(div1Ref.current?.offsetWidth);
//   };

//   const onSearchChange = (searchTerm: string) => {
//     setSearchTerm(searchTerm);
//   };

//   const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       setPopoverOpen(false);
//       redirectToSearchPage(searchTerm);
//       if (searchTerm.trim().length > 0) {
//         setSearchHistory([searchTerm, ...searchHistory]);
//       }
//     }
//   };

//   const onSearchIconClicked = () => {
//     setPopoverOpen(false);
//     redirectToSearchPage(searchTerm);
//     if (searchTerm.trim().length > 0) {
//       setSearchHistory([searchTerm, ...searchHistory]);
//     }
//   };

//   const handleSuggestionItemClick = (keyword: string) => {
//     setPopoverOpen(false);
//     setSearchTerm(keyword);
//     redirectToSearchPage(keyword);
//   };

//   const handleSelectBrand = (value: string) => {
//     if (value === "Tất cả") {
//       setSelectedBrand("Tất cả");
//       return;
//     }
//     setSelectedBrand(value);
//   };

//   const handleClearSearchHistory = () => {
//     setSearchHistory([]);
//   };

//   const redirectToSearchPage = (keyword: string) => {
//     let queryParams: ProductRequesQueryParams = {
//       search: keyword,
//       range: [0, PRODUCT_FILTER_PAGE_SIZE - 1],
//     };

//     if (selectedBrand) {
//       queryParams.filter = { BRAND: [selectedBrand] };
//     }

//     let stringifiedParams: { [key: string]: string } = {};
//     Object.keys(queryParams).map((key) => {
//       stringifiedParams[key] = JSON.stringify(queryParams[key]);
//     });
//     const query = new URLSearchParams(stringifiedParams);
//     router.push(`/search?${query}`);
//     if (inputRef.current) inputRef.current.blur();
//   };

//   const handleRecentSearchClick = (keyword: string) => {
//     let queryParams: ProductRequesQueryParams = {
//       search: keyword,
//       range: [0, PRODUCT_FILTER_PAGE_SIZE - 1],
//     };

//     if (selectedBrand) {
//       queryParams.filter = { BRAND: [selectedBrand] };
//     }

//     let stringifiedParams: { [key: string]: string } = {};
//     Object.keys(queryParams).map((key) => {
//       stringifiedParams[key] = JSON.stringify(queryParams[key]);
//     });
//     const query = new URLSearchParams(stringifiedParams);
//     router.push(`/search?${query}`);
//     if (inputRef.current) inputRef.current.blur();
//   };

//   const div1Ref = useRef<HTMLDivElement>(null);
//   const div2Ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleSearch = () => {
//       let queryParams: ProductRequesQueryParams = {
//         search: searchTerm,
//         range: [0, 4],
//       };

//       if (selectedBrand && selectedBrand != "") {
//         queryParams.filter = { BRAND: [selectedBrand] };
//       }

//       fetchProductAutocomplete(queryParams)
//         .then((res: any) => {
//           setData(res.data);
//         })
//         .catch((err) => setError(err));
//     };

//     const debouncedSearch = _.debounce(() => {
//       handleSearch();
//     }, 500);

//     if (searchTerm && searchTerm.length > 0) {
//       debouncedSearch();
//     } else {
//       setData([]);
//     }

//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [searchTerm, selectedBrand]);

//   useEffect(() => {
//     fetchCategoryWithProductCount().then(({ error, data }) => {
//       if (data.data && data.data.length > 0) {
//         setCategoryList(data.data);
//         setCategoryListError(null);
//       }
//       if (error) setCategoryListError(error);
//     });

//     fetchProductLineListWithSize(8).then(({ error, data }) => {
//       if (data.data && data.data.length > 0) {
//         setProductLineList(data.data);
//         setProductLineError(null);
//       }
//       if (error) setProductLineError(error);
//     });
//   }, []);

//   const handleClickOutside = (e: MouseEvent) => {
//     if (div1Ref.current === null || div2Ref.current === null) return;
//     if (
//       div2Ref.current.contains(e.target as Node) ||
//       div1Ref.current.contains(e.target as Node)
//     ) {
//       // inside click
//       return;
//     }
//     // outside click
//     setPopoverOpen(false);
//   };

//   useEffect(() => {
//     if (popoverOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [popoverOpen]);

//   return (
//     <Popover open={popoverOpen}>
//       <PopoverTrigger asChild>
//         <div
//           ref={div1Ref}
//           className={twMerge(
//             "flex flex-row w-full max-w-full p-[5px] border-[1px] border-neutral-6 justify-between items-center relative",
//             variant === "header"
//               ? "h-10 bg-neutral-2"
//               : "h-12 bg-shade-1-100% shadow-search-bar",
//             popoverOpen ? "rounded-t-3xl bg-shade-1-100%" : "rounded-3xl"
//           )}
//         >
//           <div className="flex flex-row w-[90%] ml-[-1px] outline-none">
//             <Select
//               value={selectedBrand}
//               onValueChange={handleSelectBrand}
//               // open={true}
//             >
//               <SelectTrigger
//                 className={twMerge(
//                   "hidden sm:flex w-[148px] min-w-[146px] text-neutral-8 bg-neutral-1 border-2 rounded-full border-primary text-[12px] md:text-sm focus:outline-none outline-none hover:border-secondary",
//                   variant === "header" ? "h-8" : ""
//                 )}
//               >
//                 <Image src={LaptopIcon} alt="Laptop Icon" width={16} />
//                 <SelectValue
//                   placeholder="Thương hiệu"
//                   className="px-[1px] focus:outline-none whitespace-nowrap "
//                 />
//               </SelectTrigger>
//               <SelectContent className="bg-shade-1-75% backdrop-blur-2xl rounded-[12px] mt-[1px] max-h-72 overflow-y-hidden">
//                 <SelectItem
//                   key={`search-brand-select-box-all`}
//                   value={"Tất cả"}
//                   className="cursor-pointer"
//                 >
//                   <Typography
//                     headingElement="p"
//                     headingStyle="span"
//                     className="text-neutral-7 hover:text-secondary w-full text-left text-[14px]"
//                   >
//                     Tất cả
//                   </Typography>
//                 </SelectItem>
//                 {DEFAULT_PRODUCT_PROPERTY_OPTIONS.BRAND.map((brand: string) => (
//                   <SelectItem
//                     key={`search-brand-select-box-${brand}`}
//                     value={brand}
//                     className="cursor-pointer"
//                   >
//                     <Typography
//                       headingElement="p"
//                       headingStyle="span"
//                       className="text-neutral-7 hover:text-secondary w-full text-left text-[14px]"
//                     >
//                       {brand}
//                     </Typography>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <input
//               type="text"
//               value={searchTerm}
//               placeholder={
//                 selectedBrand && selectedBrand !== "Tất cả"
//                   ? `Tìm kiếm laptop ${selectedBrand}`
//                   : placeholder
//               }
//               className={twMerge(
//                 "flex-1 focus:outline-none text-sm ml-2",
//                 variant === "header" ? "bg-neutral-2" : "bg-transparent",
//                 popoverOpen ? "bg-transparent" : ""
//               )}
//               onChange={(e) => onSearchChange(e.target.value)}
//               onFocus={onSearchInputFocused}
//               onKeyDown={onEnter}
//               ref={inputRef}
//             />
//           </div>
//           <Image
//             src={SearchIcon}
//             alt="Search Icon"
//             width={variant === "header" ? 24 : 32}
//             className="mr-1 hover:bg-neutral-2 rounded-2xl"
//             onClick={onSearchIconClicked}
//           />
//           <div
//             ref={div2Ref}
//             className={twMerge(
//               "absolute z-20 top-[101%] left-[50%] transform -translate-x-1/2  bg-shade-1-100% rounded-b-3xl rounded-t-none border-[1px] border-neutral-6 p-4 shadow-md",
//               `${popoverOpen ? "" : "hidden"} `
//             )}
//             style={{ width: wid ? ` ${wid}px ` : "" }}
//           >
//             <div className={"flex flex-col gap-8 py-2"}>
//               {(!searchTerm || searchTerm?.length < 1) && (
//                 <React.Fragment>
//                   {searchHistory && searchHistory.length > 0 && (
//                     <div className="search-content-recent-searches">
//                       <div className="flex flex-row justify-between mb-4">
//                         <Typography
//                           headingElement="p"
//                           headingStyle={"h6"}
//                           className="text-neutral-8 text-[22px]"
//                         >
//                           Nội dung tìm kiếm gần đây
//                         </Typography>

//                         <span
//                           className="text-neutral-6 hover:text-primary hover:cursor-pointer"
//                           onClick={handleClearSearchHistory}
//                         >
//                           Xóa
//                         </span>
//                       </div>
//                       <div className="flex flex-row flex-wrap gap-3">
//                         {searchHistory.map((item, index) => (
//                           <Chip
//                             key={`recent-searches-${index}`}
//                             label={item}
//                             endIcon={
//                               <Image
//                                 src={SearchIconNeutral7}
//                                 width={24}
//                                 alt="recent-searches-icon"
//                                 className=""
//                               ></Image>
//                             }
//                             startIcon={<div></div>}
//                             className="hover:text-primary hover:border-primary hover:cursor-pointer hover:fill-primary fill-neutral-7 text-neutral-7 border-neutral-5"
//                             onClick={() => handleRecentSearchClick(item)}
//                           ></Chip>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {!categoryListError &&
//                     categoryList &&
//                     categoryList.length > 0 && (
//                       <div className="find-by-category">
//                         <div className="flex flex-row justify-between mb-4">
//                           <Typography
//                             headingElement="p"
//                             headingStyle={"h6"}
//                             className="text-neutral-8 text-[22px]"
//                           >
//                             Tìm laptop theo nhu cầu
//                           </Typography>
//                         </div>
//                         <div className="grid grid-cols-2 gap-y-4">
//                           {categoryList.map(
//                             ({
//                               _id,
//                               name,
//                               slug,
//                               image,
//                               count,
//                             }: {
//                               _id: string;
//                               name: string;
//                               slug: string;
//                               image: string;
//                               count: string;
//                             }) => (
//                               <CategoryTitle
//                                 key={`search-content-category-title-${_id}`}
//                                 title={name}
//                                 numberOfModels={count}
//                                 imageSrc={image}
//                                 slug={slug}
//                               ></CategoryTitle>
//                             )
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   {!productLineError &&
//                     productLineList &&
//                     productLineList.length > 0 && (
//                       <div>
//                         <div className="flex flex-row justify-between mb-4">
//                           <Typography
//                             headingElement="p"
//                             headingStyle={"h6"}
//                             className="text-neutral-8 text-[22px]"
//                           >
//                             Dòng laptop phổ biến
//                           </Typography>
//                         </div>
//                         <div className="flex flex-row flex-wrap gap-3">
//                           {productLineList.map(({ _id, name, image }) => (
//                             <Link
//                               href={createSearchLink(name)}
//                               key={`search-productline-${_id}`}
//                               className="border-[1px] border-neutral-5 hover:border-primary hover:text-primary text-neutral-8  rounded-[50px] flex items-center gap-[10px] py-1 pl-1 pr-3 cursor-pointer bg-shade-1-100%"
//                             >
//                               <div className="aspect-square w-[36px]">
//                                 <Image
//                                   src={image ?? Productline1}
//                                   width={36}
//                                   height={36}
//                                   alt="recent-searches-icon"
//                                   className="z-[-10] object-cover w-full h-full rounded-full"
//                                 ></Image>
//                               </div>
//                               <span className="text-[14px] ">{name}</span>
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                 </React.Fragment>
//               )}
//               {searchTerm &&
//                 searchTerm.length > 0 &&
//                 data &&
//                 data.length > 0 && (
//                   <React.Fragment>
//                     <div className={"flex flex-col gap-2 mt-1"}>
//                       {data.map((record: any) => {
//                         const index = record.name
//                           .toLowerCase()
//                           .indexOf(searchTerm.toLowerCase());

//                         const beforeSearchTerm = record.name.slice(0, index);
//                         const duringSearchTerm = record.name.slice(
//                           index,
//                           index + searchTerm.length
//                         );
//                         const afterSearchTerm = record.name.slice(
//                           index + searchTerm.length
//                         );

//                         return (
//                           <div
//                             key={record._id}
//                             className="text-neutral-5 hover:bg-neutral-1 hover:cursor-pointer text-[16px]"
//                             onClick={() =>
//                               handleSuggestionItemClick(record.name)
//                             }
//                           >
//                             {index === -1 ? (
//                               record.name
//                             ) : (
//                               <React.Fragment>
//                                 {beforeSearchTerm}
//                                 <span className="text-neutral-8">
//                                   {duringSearchTerm}
//                                 </span>
//                                 {afterSearchTerm}
//                               </React.Fragment>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                     <div className="search-suggested-products">
//                       <div className="flex flex-row justify-between mb-2">
//                         <Typography
//                           headingElement="p"
//                           headingStyle={"h6"}
//                           className="text-neutral-8 text-[22px]"
//                         >
//                           Sản phẩm gợi ý
//                         </Typography>
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         {data.slice(0, 2).map((product: any) => (
//                           <Link
//                             href={`/products/${product.slug}.html`}
//                             key={`suggested-product-showcase-${product._id}`}
//                           >
//                             <div className="flex flex-row justify-between items-center hover:text-primary cursor-pointer">
//                               <div className="flex flex-row items-center">
//                                 <Image
//                                   src={product.image[0] ?? LaptopIcon}
//                                   height={72}
//                                   width={72}
//                                   alt="suggested-product-showcase-image"
//                                 ></Image>
//                                 <span className="ml-2">{product.name}</span>
//                               </div>
//                               <Typography
//                                 headingElement="p"
//                                 headingStyle="h6"
//                                 className="text-neutral-7"
//                               >
//                                 {formatPriceToVND(product.price ?? 0)}
//                               </Typography>
//                             </div>
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   </React.Fragment>
//                 )}
//             </div>
//           </div>
//         </div>
//       </PopoverTrigger>
//     </Popover>
//   );
// }

// export function Search({
//   variant = "default",
//   placeholder = "Tìm kiếm laptop",
// }: IProps) {
//   return (
//     <Suspense fallback={<Loading />}>
//       <SearchComponent variant={variant} placeholder={placeholder} />
//     </Suspense>
//   );
// }

// export function SearchMobileComponent({
//   variant = "default",
//   placeholder = "Tìm kiếm laptop",
// }: IProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   let SearchTermFromURL = "";
//   Array.from(searchParams.entries()).forEach((pair) => {
//     if (pair[0] === "search") SearchTermFromURL = JSON.parse(pair[1]);
//   });
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [selectedBrand, setSelectedBrand] = useState<string>();
//   const [popoverOpen, setPopoverOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(SearchTermFromURL);
//   const [error, setError] = useState();
//   const [data, setData] = useState([]);
//   const [wid, setWid] = useState<number>();
//   const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
//     "searchHistory",
//     []
//   );
//   const [categoryList, setCategoryList] = useState<
//     {
//       _id: string;
//       name: string;
//       slug: string;
//       image: string;
//       count: string;
//     }[]
//   >();
//   const [categoryListError, setCategoryListError] = useState<string | null>();
//   const [productLineList, setProductLineList] =
//     useState<(IProductLine & { _id: string })[]>();
//   const [productLineError, setProductLineError] = useState<string | null>();

//   const onSearchInputFocused = () => {
//     setPopoverOpen(true);
//     if (div1Ref.current) setWid(div1Ref.current?.offsetWidth);
//   };

//   const onSearchChange = (searchTerm: string) => {
//     setSearchTerm(searchTerm);
//   };

//   const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       setPopoverOpen(false);
//       redirectToSearchPage(searchTerm);
//       if (searchTerm.trim().length > 0) {
//         setSearchHistory([searchTerm, ...searchHistory]);
//       }
//     }
//   };

//   const handleSuggestionItemClick = (keyword: string) => {
//     setPopoverOpen(false);
//     setSearchTerm(keyword);
//     redirectToSearchPage(keyword);
//   };

//   const handleSelectBrand = (value: string) => {
//     if (value === "Tất cả") {
//       setSelectedBrand(undefined);
//       return;
//     }
//     setSelectedBrand(value);
//   };

//   const handleClearSearchHistory = () => {
//     setSearchHistory([]);
//   };

//   const redirectToSearchPage = (keyword: string) => {
//     let queryParams: ProductRequesQueryParams = {
//       search: keyword,
//       range: [0, PRODUCT_FILTER_PAGE_SIZE - 1],
//     };

//     if (selectedBrand) {
//       queryParams.filter = { BRAND: [selectedBrand] };
//     }

//     let stringifiedParams: { [key: string]: string } = {};
//     Object.keys(queryParams).map((key) => {
//       stringifiedParams[key] = JSON.stringify(queryParams[key]);
//     });
//     const query = new URLSearchParams(stringifiedParams);
//     router.push(`/search?${query}`);
//     if (inputRef.current) inputRef.current.blur();
//   };

//   const handleRecentSearchClick = (keyword: string) => {
//     let queryParams: ProductRequesQueryParams = {
//       search: keyword,
//       range: [0, PRODUCT_FILTER_PAGE_SIZE - 1],
//     };

//     if (selectedBrand) {
//       queryParams.filter = { BRAND: [selectedBrand] };
//     }

//     let stringifiedParams: { [key: string]: string } = {};
//     Object.keys(queryParams).map((key) => {
//       stringifiedParams[key] = JSON.stringify(queryParams[key]);
//     });
//     const query = new URLSearchParams(stringifiedParams);
//     router.push(`/search?${query}`);
//     if (inputRef.current) inputRef.current.blur();
//   };

//   const div1Ref = useRef<HTMLDivElement>(null);
//   const div2Ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleSearch = () => {
//       let queryParams: ProductRequesQueryParams = {
//         search: searchTerm,
//         range: [0, 4],
//       };

//       if (selectedBrand && selectedBrand != "") {
//         queryParams.filter = { BRAND: [selectedBrand] };
//       }

//       fetchProductAutocomplete(queryParams)
//         .then((res: any) => {
//           setData(res.data);
//         })
//         .catch((err) => setError(err));
//     };

//     const debouncedSearch = _.debounce(() => {
//       handleSearch();
//     }, 500);

//     if (searchTerm && searchTerm.length > 0) {
//       debouncedSearch();
//     } else {
//       setData([]);
//     }

//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [searchTerm, selectedBrand]);

//   useEffect(() => {
//     fetchCategoryWithProductCount().then(({ error, data }) => {
//       if (data.data && data.data.length > 0) {
//         setCategoryList(data.data);
//         setCategoryListError(null);
//       }
//       if (error) setCategoryListError(error);
//     });

//     fetchProductLineListWithSize(8).then(({ error, data }) => {
//       if (data.data && data.data.length > 0) {
//         setProductLineList(data.data);
//         setProductLineError(null);
//       }
//       if (error) setProductLineError(error);
//     });
//   }, []);

//   const handleClickOutside = (e: MouseEvent) => {
//     if (div1Ref.current === null || div2Ref.current === null) return;
//     if (
//       div2Ref.current.contains(e.target as Node) ||
//       div1Ref.current.contains(e.target as Node)
//     ) {
//       // inside click
//       return;
//     }
//     // outside click
//     setPopoverOpen(false);
//   };

//   useEffect(() => {
//     if (popoverOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [popoverOpen]);

//   return (
//     <Popover open={popoverOpen}>
//       <PopoverTrigger asChild>
//         <div
//           ref={div1Ref}
//           className={twMerge(
//             "flex flex-row w-full max-w-full p-[5px] border-[1px] border-neutral-6 justify-between items-center relative rounded-3xl bg-shade-1-100%",
//             variant === "header"
//               ? "h-10 bg-neutral-2"
//               : "h-12 bg-shade-1-100% shadow-search-bar"
//             // popoverOpen ? "rounded-t-3xl bg-shade-1-100%" : "rounded-3xl"
//           )}
//         >
//           <div className="flex flex-row w-[90%] ml-[-1px] outline-none">
//             <Select
//               value={selectedBrand}
//               onValueChange={handleSelectBrand}
//               // open={true}
//             >
//               <SelectTrigger
//                 className={twMerge(
//                   "hidden sm:flex w-[148px] min-w-[146px] text-neutral-8 bg-neutral-1 border-2 rounded-full border-primary text-[12px] md:text-sm focus:outline-none outline-none hover:border-secondary",
//                   variant === "header" ? "h-8" : ""
//                 )}
//               >
//                 <Image src={LaptopIcon} alt="Laptop Icon" width={16} />
//                 <SelectValue
//                   placeholder="Thương hiệu"
//                   className="px-[1px] focus:outline-none whitespace-nowrap "
//                 />
//               </SelectTrigger>
//               <SelectContent className="bg-shade-1-75% backdrop-blur-2xl rounded-[12px] mt-[1px] max-h-72 overflow-y-hidden">
//                 <SelectItem
//                   key={`search-brand-select-box-all`}
//                   value={"Tất cả"}
//                   className="cursor-pointer"
//                 >
//                   <Typography
//                     headingElement="p"
//                     headingStyle="span"
//                     className="text-neutral-7 hover:text-secondary w-full text-left text-[14px]"
//                   >
//                     Tất cả
//                   </Typography>
//                 </SelectItem>
//                 {DEFAULT_PRODUCT_PROPERTY_OPTIONS.BRAND.map((brand: string) => (
//                   <SelectItem
//                     key={`search-brand-select-box-${brand}`}
//                     value={brand}
//                     className="cursor-pointer"
//                   >
//                     <Typography
//                       headingElement="p"
//                       headingStyle="span"
//                       className="text-neutral-7 hover:text-secondary w-full text-left text-[14px]"
//                     >
//                       {brand}
//                     </Typography>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <input
//               type="text"
//               value={searchTerm}
//               placeholder={
//                 selectedBrand && selectedBrand !== "Tất cả"
//                   ? `Tìm kiếm laptop ${selectedBrand}`
//                   : placeholder
//               }
//               className={twMerge(
//                 "flex-1 focus:outline-none text-sm ml-2",
//                 variant === "header" ? "bg-neutral-2" : "bg-transparent"
//                 // popoverOpen ? "bg-transparent" : ""
//               )}
//               onChange={(e) => onSearchChange(e.target.value)}
//               onFocus={onSearchInputFocused}
//               onKeyDown={onEnter}
//               ref={inputRef}
//             />
//           </div>
//           <Image
//             src={SearchIcon}
//             alt="Search Icon"
//             width={variant === "header" ? 24 : 32}
//             className="pr-1"
//           />
//           {popoverOpen && (
//             <div
//               ref={div2Ref}
//               className={twMerge(
//                 "fixed w-screen h-screen z-20 top-0 left-0 bg-shade-1-100% border-[1px] border-neutral-6 p-4 pt-14 shadow-md"
//               )}
//             >
//               <div className="w-full flex flex-row justify-evenly gap-8 items-center">
//                 <div className="w-full bg-neutral-2 py-2 px-3 rounded-3xl flex flex-row">
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     placeholder={placeholder + " " + (selectedBrand ?? "")}
//                     className={twMerge(
//                       "flex-1 focus:outline-none text-sm ml-2 bg-neutral-2"
//                     )}
//                     onChange={(e) => onSearchChange(e.target.value)}
//                     onKeyDown={onEnter}
//                     autoFocus
//                     // ref={inputRef}
//                   />
//                   <Image
//                     src={SearchIcon}
//                     alt="Search Icon"
//                     width={24}
//                     className="mr-1"
//                   />
//                 </div>
//                 <Typography
//                   headingElement="p"
//                   headingStyle={"h4"}
//                   className="text-primary "
//                   onClick={() => setPopoverOpen(false)}
//                 >
//                   Hủy
//                 </Typography>
//               </div>
//               <Separator className="my-2"></Separator>
//               <div className={"flex flex-col gap-8"}>
//                 {(!searchTerm || searchTerm?.length < 1) && (
//                   <div>
//                     {searchHistory && searchHistory.length > 0 && (
//                       <div className="search-content-recent-searches">
//                         <div className="flex flex-row justify-between mb-4">
//                           <Typography
//                             headingElement="p"
//                             headingStyle={"h6"}
//                             className="text-neutral-7"
//                           >
//                             Nội dung tìm kiếm gần đây
//                           </Typography>
//                           <span
//                             className="text-neutral-6 pt-[2px] hover:text-primary hover:cursor-pointer"
//                             onClick={handleClearSearchHistory}
//                           >
//                             Xóa
//                           </span>
//                         </div>
//                         <div className="flex flex-row flex-wrap gap-3 mb-4">
//                           {searchHistory.map((item, index) => (
//                             <Chip
//                               key={`recent-searches-${index}`}
//                               label={item}
//                               endIcon={
//                                 <Image
//                                   src={SearchIconNeutral7}
//                                   width={24}
//                                   alt="recent-searches-icon"
//                                   className="hover:fill-primary"
//                                 ></Image>
//                               }
//                               startIcon={<div></div>}
//                               className="hover:text-primary border-primary"
//                               onClick={() => handleRecentSearchClick(item)}
//                             ></Chip>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {!categoryListError &&
//                       categoryList &&
//                       categoryList.length > 0 && (
//                         <div className="find-by-category">
//                           <div className="flex flex-row justify-between mb-4">
//                             <Typography
//                               headingElement="p"
//                               headingStyle={"h6"}
//                               className="text-neutral-7"
//                             >
//                               Tìm laptop theo nhu cầu
//                             </Typography>
//                           </div>
//                           <div className="grid grid-cols-2 gap-y-4 mb-4">
//                             {categoryList.map(
//                               ({
//                                 _id,
//                                 name,
//                                 slug,
//                                 image,
//                                 count,
//                               }: {
//                                 _id: string;
//                                 name: string;
//                                 slug: string;
//                                 image: string;
//                                 count: string;
//                               }) => (
//                                 <CategoryTitle
//                                   key={`search-content-category-title-${_id}`}
//                                   title={name}
//                                   numberOfModels={count}
//                                   imageSrc={image}
//                                   slug={slug}
//                                   height={53}
//                                   width={53}
//                                 ></CategoryTitle>
//                               )
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     {!productLineError &&
//                       productLineList &&
//                       productLineList.length > 0 && (
//                         <div>
//                           <div className="flex flex-row justify-between mb-4">
//                             <Typography
//                               headingElement="p"
//                               headingStyle={"h6"}
//                               className="text-neutral-7"
//                             >
//                               Dòng laptop phổ biến
//                             </Typography>
//                           </div>
//                           <div className="flex flex-row flex-wrap gap-3">
//                             {productLineList.map(({ _id, name, image }) => (
//                               <Link
//                                 href={createSearchLink(name)}
//                                 key={`search-productline-${_id}`}
//                                 className="border-[1px] border-neutral-5 hover:border-secondary rounded-[50px] flex items-center gap-[10px] py-1 pl-1 pr-3 cursor-pointer bg-shade-1-100%"
//                               >
//                                 <div className="w-[28px] h-[28px]">
//                                   <Image
//                                     src={image ?? Productline1}
//                                     width={28}
//                                     height={28}
//                                     alt="recent-searches-icon"
//                                     className="z-[-10] object-cover w-full h-full rounded-full"
//                                   ></Image>
//                                 </div>
//                                 <span className="text-neutral-8 text-[12px]">
//                                   {name}
//                                 </span>
//                               </Link>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                   </div>
//                 )}
//                 {searchTerm &&
//                   searchTerm.length > 0 &&
//                   data &&
//                   data.length > 0 && (
//                     <div>
//                       <div className={"flex flex-col gap-2 mt-2"}>
//                         {data.map((record: any) => {
//                           const index = record.name
//                             .toLowerCase()
//                             .indexOf(searchTerm.toLowerCase());

//                           const beforeSearchTerm = record.name.slice(0, index);
//                           const duringSearchTerm = record.name.slice(
//                             index,
//                             index + searchTerm.length
//                           );
//                           const afterSearchTerm = record.name.slice(
//                             index + searchTerm.length
//                           );
//                           return (
//                             <div
//                               key={record._id}
//                               className="text-neutral-5 hover:bg-neutral-1 hover:cursor-pointer text-[16px]"
//                               onClick={() =>
//                                 handleSuggestionItemClick(record.name)
//                               }
//                             >
//                               {index === -1 ? (
//                                 record.name
//                               ) : (
//                                 <React.Fragment>
//                                   {beforeSearchTerm}
//                                   <span className="text-neutral-8">
//                                     {duringSearchTerm}
//                                   </span>
//                                   {afterSearchTerm}
//                                 </React.Fragment>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                       <div className="search-suggested-products">
//                         <div className="flex flex-row justify-between mb-2 mt-3">
//                           <Typography
//                             headingElement="p"
//                             headingStyle="h6"
//                             className="text-neutral-7"
//                           >
//                             Sản phẩm gợi ý
//                           </Typography>
//                         </div>
//                         <div className="flex flex-col gap-1">
//                           {data.slice(0, 2).map((product: any) => {
//                             return (
//                               <Link
//                                 href={`/products/${product.slug}.html`}
//                                 key={`suggested-product-showcase-${product._id}`}
//                               >
//                                 <div className="flex flex-row justify-between items-center p-1 rounded-lg bg-neutral-2 hover:text-primary cursor-pointer">
//                                   <div className="flex flex-row items-center">
//                                     <Image
//                                       src={product.image[0] ?? LaptopIcon}
//                                       height={72}
//                                       width={72}
//                                       alt="suggested-product-showcase-image"
//                                       className="rounded-lg object-scale-down aspect-square"
//                                     ></Image>
//                                     <span className="ml-4 text-sm text-neutral-7 text-wrap">
//                                       {product.name}
//                                     </span>
//                                   </div>
//                                   <Typography
//                                     headingElement="p"
//                                     headingStyle="h6"
//                                     className="text-secondary pr-2"
//                                   >
//                                     {formatPriceToVND(product.price ?? 0)}
//                                   </Typography>
//                                 </div>
//                               </Link>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//               </div>
//             </div>
//           )}
//         </div>
//       </PopoverTrigger>
//     </Popover>
//   );
// }

// export function SearchMobile({
//   variant = "default",
//   placeholder = "Tìm kiếm laptop",
// }: IProps) {
//   return (
//     <Suspense fallback={<Loading />}>
//       <SearchMobileComponent variant={variant} placeholder={placeholder} />
//     </Suspense>
//   );
// }

// const ChipVariants = cva(
//   "flex flex-row py-[6px] px-2 w-fit items-center rounded-full text-sm justify-between",
//   {
//     variants: {
//       variant: {
//         default: " border-[1px] border-neutral-5 text-neutral-7",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   }
// );
// export interface ChipProps
//   extends React.HTMLAttributes<HTMLDivElement>,
//     VariantProps<typeof ChipVariants> {
//   label?: string;
//   startIcon?: ReactElement;
//   endIcon?: ReactElement;
// }

// export function Chip({
//   label,
//   variant,
//   startIcon,
//   endIcon,
//   onClick,
//   className,
//   ...props
// }: ChipProps) {
//   return (
//     <span
//       onClick={onClick}
//       className={
//         cn(ChipVariants({ variant }), className, "p-1 cursor-pointer") +
//         (onClick ? "hover:cursor-pointer" : "")
//       }
//       {...props}
//     >
//       {startIcon}
//       <span className="px-2 overflow-hidden whitespace-nowrap">{label}</span>
//       {endIcon}
//     </span>
//   );
// }

// function CategoryTitle({
//   title,
//   slug,
//   imageSrc,
//   numberOfModels = "",
//   height = 80,
//   width = 80,
// }: {
//   title: string;
//   slug: string;
//   imageSrc: string;
//   numberOfModels: string;
//   height?: number;
//   width?: number;
// }) {
//   return (
//     <Link key={title} href={`/collections/${slug}`} className="group">
//       <div className="flex flex-row space-x-3 w-fit border-[1px] rounded-xl border-shade-1-100% ">
//         <Image
//           src={imageSrc}
//           height={height}
//           width={width}
//           alt={`${title}-category-image`}
//           className="group-hover:brightness-75 tránition-all duration-300"
//         ></Image>
//         <div className="flex flex-col justify-center ">
//           <span className="text-neutral-8">{title}</span>
//           <span className="text-sm text-neutral-6">{`${numberOfModels} máy`}</span>
//         </div>
//       </div>
//     </Link>
//   );
// }
