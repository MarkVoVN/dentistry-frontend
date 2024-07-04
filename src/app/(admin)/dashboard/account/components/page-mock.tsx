"use client";

import { Button } from "@/components/ui/button";
import { getConfigProduct } from "@/lib/api/productAPI";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import ProductLineDialog from "../components/dialog/product-line-dialog";
import { addProductLine } from "@/lib/api/productLineAPI";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function BrandManagementPage() {
  const [configProduct, setConfigProduct] = useState<{
    BRAND: string[];
    BRAND_PRODUCTLINE: {
      [key: string]: string[];
    };
  } | null>(null);
  const [brands, setBrands] = useState<any>({});
  const [productLines, setProductLines] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = () => {
      getConfigProduct().then((res) => {
        const { data, error } = res;
        if (error) {
          toast.error(error);
          return;
        }
        setConfigProduct(data.data);
        setProductLines(data.data.BRAND_PRODUCTLINE);
        setBrands(data.data.BRAND);
      });
    };
    init();
  }, []);

  function handleAddProductLine(brand: string, productLine: any) {
    addProductLine(productLine).then((res) => {
      const { data, error } = res;
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Thêm dòng sản phẩm thành công!");
      setProductLines((prevBrands: any) => ({
        ...prevBrands,
        [brand]: [...prevBrands[brand], productLine],
      }));
    });
  }

  async function updateProductLine(
    brand: string,
    index: number,
    updatedProductLine: string
  ) {
    setProductLines((prevBrands: any) => {
      const productLines = [...prevBrands[brand]];
      productLines[index] = updatedProductLine;
      return { ...prevBrands, [brand]: productLines };
    });
  }

  const handleAddBrand = (brand: string) => {
    let newBrand = prompt("Nhập tên thương hiệu mới") || "sd";
    setProductLines((prevBrands: any) => {
      return { ...prevBrands, [newBrand]: [] };
    });
    setBrands((prevBrands: any) => [...prevBrands, newBrand]);
  };

  function handleDeleteProductLine(
    brand: string,
    index: number,
    productLine: string
  ) {
    // deleteProductLine(brand, productLine)
    // .then((res) => {
    //   const { data, error } = res;
    //   if (error) {
    //     toast.error(error.error)
    //     return
    //   }
    //   toast.success("Xóa dòng sản phẩm thành công!")
    // })

    setProductLines((prevBrands: any) => {
      const productLines = [...prevBrands[brand]];
      productLines.splice(index, 1);
      return { ...prevBrands, [brand]: productLines };
    });
  }

  return (
    <div className="space-y-8">
      {/* <h2 className="text-3xl font-bold">Thương hiệu</h2>
      <div className="p-4 bg-shade-1-100% rounded-[8px] shadow-sm">
        {configProduct != null ? (
          <>
            {configProduct.BRAND.map((brand: any) => (
              <div key={brand}>{brand}</div>
            ))}
          </>
        ) : (
          <LoadingSkeleton />
        )}
      </div> */}
      <h2 className="text-3xl font-bold">Dòng thương hiệu</h2>
      <div className="shadow-sm grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        {productLines != null ? (
          <>
            {Object.keys(productLines).map((brand) => (
              <div key={brand} className="bg-shade-1-100% rounded-[8px]">
                <div className="h-28 aspect-video w-full">
                  <Image
                    src={"/images/banner-home.jpg"}
                    alt={brand}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover p-0 rounded-t-[8px]"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h2 className="text-[16px] font-semibold">Thương hiệu:</h2>
                  <div className="flex items-center justify-between bg-shade-1-100% rounded-[8px] pl-1">
                    <h3
                      className={twMerge(
                        "text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap flex-1 self-center",
                        brand ? "px-4 pl-1" : "px-4"
                      )}
                    >
                      {brand}
                    </h3>
                    <div>
                      <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => console.log()}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => console.log()}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                  <h2 className="text-[16px] font-semibold">Dòng sản phẩm:</h2>
                  <ul className="flex flex-col gap-4 flex-wrap">
                    {productLines[brand].length === 0 && (
                      <li className="flex items-center justify-between bg-shade-1-100% rounded-[8px] pl-1">
                        <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
                          Không có dòng sản phẩm nào
                        </h3>
                      </li>
                    )}
                    {productLines[brand].map((productLine, index) => {
                      return (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-shade-1-100% rounded-[8px] pl-1"
                        >
                          {productLine && (
                            <div className="h-[48px] aspect-video">
                              <Image
                                src={"/images/dell-xps.png"}
                                alt={productLine}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover p-0"
                              />
                            </div>
                          )}
                          <h3
                            className={twMerge(
                              "text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap flex-1 self-center",
                              productLine ? "px-4 pl-1" : "px-4"
                            )}
                          >
                            {productLine}
                          </h3>
                          <div>
                            <Button
                              variant="outline"
                              className="ml-2"
                              onClick={() =>
                                handleDeleteProductLine(
                                  brand,
                                  index,
                                  productLine
                                )
                              }
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              className="ml-2"
                              onClick={() =>
                                handleDeleteProductLine(
                                  brand,
                                  index,
                                  productLine
                                )
                              }
                            >
                              Xóa
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {/* <ProductLineDialog
                    title="Thêm dòng sản phẩm"
                    buttonTitle="Thêm"
                    brandList={brands || [brand]}
                    defaultBrand={brand}
                    submitFunction={handleAddProductLine}
                  /> */}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddBrand("sd")}
              className="h-full border-dashed border-2 border-secondary text-xl"
            >
              Thêm thương hiệu
            </Button>
          </>
        ) : (
          <LoadingSkeleton />
        )}
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div role="status" className="max-w-sm animate-pulse">
    <div className="h-2.5 bg-shade-1-75% rounded-full dark:bg-shade-1-75% w-48 mb-4"></div>
    <div className="h-2 bg-shade-1-75% rounded-full dark:bg-shade-1-75% max-w-[360px] mb-2.5"></div>
    <div className="h-2 bg-shade-1-75% rounded-full dark:bg-shade-1-75% mb-2.5"></div>
    <div className="h-2 bg-shade-1-75% rounded-full dark:bg-shade-1-75% max-w-[330px] mb-2.5"></div>
    <div className="h-2 bg-shade-1-75% rounded-full dark:bg-shade-1-75% max-w-[300px] mb-2.5"></div>
    <div className="h-2 bg-shade-1-75% rounded-full dark:bg-shade-1-75% max-w-[360px]"></div>
    <span className="sr-only">Loading...</span>
  </div>
);
