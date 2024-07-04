"use client";
import { IProduct } from "@/app/models/product";
import { Button } from "@/components/ui/button";

import {
  fetchProducts,
  removeProduct,
  updateProduct,
  updateProductVisibilityById,
} from "@/lib/api/productAPI";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, EyeOff, EyeOffIcon, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import ProductActionSlide from "./components/actionSlide";
import { DataTable } from "./components/data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPriceToVND } from "@/lib/utils";
import Image from "next/image";
import { Typography } from "@/components/typography";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "@/components/mydialog";

export default function ProductManagementPage() {
  const [action, setAction] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<
    string | undefined
  >();
  const [selectedProductModelNumber, setSelectedProductModelNumber] = useState<
    string | undefined
  >();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSetAction = (
    action: string,
    _id?: string,
    modelNumber?: string
  ) => {
    if (_id) setSelectedProductId(_id);
    if (modelNumber) setSelectedProductModelNumber(modelNumber);
    setAction(action);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (refetchData: boolean = false) => {
    if (refetchData) handleFetchProducts();
    setTimeout(() => {
      setAction(undefined);
      setIsDialogOpen(false);
    }, 300);
  };

  useEffect(() => {
    handleFetchProducts();
  }, [isProcessing]);

  const handleFetchProducts = () => {
    fetchProducts({
      view: "full",
      dashboard: true,
      sort: { createdAt: -1 },
    }).then(({ data, error }) => {
      setData(data.data);
    });
  };

  const handleToggleProductVisibility = (id: string, isVisible: boolean) => {
    updateProductVisibilityById(id, isVisible)
      .then(({ data, error }) => {
        if (error) throw new Error(error);
        handleFetchProducts();
        toast("Cập nhật sản phẩm thành công");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const columns: ColumnDef<IProduct>[] = [
    {
      id: "name",
      accessorKey: "model.name",
      header: "Tên sản phẩm",
      cell: ({ row }) => {
        const product = row.original;
        if (!product) return <></>;

        return (
          <div className="flex items-center gap-2">
            {product?.model?.images[0] && (
              <div className="h-[32px] aspect-video">
                <Image
                  src={product?.model?.images[0]}
                  alt={product?.model?.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover p-0"
                />
              </div>
            )}
            {!product?.model?.images[0] && (
              <div className="h-[32px] aspect-video text-center">
                <Typography headingElement="h6" headingStyle="span">
                  Chưa có ảnh
                </Typography>
              </div>
            )}
            <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
              {product?.model?.name}
            </h3>
          </div>
        );
      },
    },
    {
      id: "category",
      accessorKey: "model.category",
      header: "Nhu cầu sử dụng",
      cell: ({ row }) => {
        const product = row.original;
        if (!product) return <></>;

        const category = product?.model?.category;
        return (
          <div className="flex gap-2">
            {category?.length === 0 && (
              <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
                Không có nhu cầu sử dụng nào
              </h3>
            )}
            <ul className="flex flex-col gap-4 flex-wrap">
              {category?.map((name, index) => {
                return (
                  <li
                    key={index}
                    className="flex items-center rounded-[8px] gap-2 cursor-pointer"
                  >
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      },
      footer: (props) => props.column.id,
      enableSorting: false,
    },
    {
      accessorKey: "model.brand",
      header: "Hãng",
      cell: ({ row }) => {
        const product = row.original;
        if (!product) return <></>;
        const brand = product?.model?.brand;

        return (
          <div className="flex flex-col">
            <span>{brand}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "model.productLine",
      header: "Dòng SP",
      cell: ({ row }) => {
        const product = row.original;
        if (!product) return <></>;

        const productLine = product?.model?.productLine;

        return (
          <div className="flex flex-col">
            <span>{productLine}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "configuration.PriceInVND",
      header: "Giá bán",
      cell: ({ row }) => {
        const product = row.original;
        if (!product) console.log("here");

        const { PriceInVND, SalePercentage, OriginalPrice } =
          product?.configuration;

        return (
          <div className="flex flex-col">
            {/* <span>{OriginalPrice}</span>
            <span>{SalePercentage}</span> */}
            <span>{formatPriceToVND(PriceInVND)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "isVisible",
      header: "Hiện / Ẩn",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <span className="flex flex-row justify-center w-full">
            <button
              title="Ẩn sản phẩm. Khách hàng sẽ không xem, tìm kiếm được sản phẩm."
              onClick={() => {
                handleToggleProductVisibility(
                  product._id ?? "",
                  !product.isVisible
                );
              }}
            >
              {product.isVisible ? (
                <EyeIcon className="stroke-neutral-7 stroke-1 hover:stroke-2"></EyeIcon>
              ) : (
                <EyeOffIcon className="stroke-neutral-7 stroke-1 hover:stroke-2"></EyeOffIcon>
              )}
            </button>
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        const { _id, model } = product;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem
                onClick={() => handleSetAction("ADD_CONFIG", _id)}
              >
                Thêm cấu hình
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => {
                  handleSetAction("UPDATE", _id, model.modelNumber);
                }}
              >
                Cập nhật
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setAction("DELETE");
                  setSelectedProductId(_id);
                }}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="w-full h-[80vh]">
      <div className="bg-shade-1-100% p-4 rounded-[8px] space-y-4 ">
        <div className="flex flex-row justify-between">
          <div className="">
            <h2 className="text-2xl font-bold tracking-tight">
              Quản lí sản phẩm
            </h2>
            <p className="text-muted-foreground">Quản lí laptop theo hãng, theo tên và theo dòng sản phẩm.</p>
          </div>

          <Button
            onClick={() => {
              setIsDialogOpen(true), setAction("CREATE");
            }}
            className="bg-secondary text-shade-1-100% border-[1px] border-secondary hover:bg-primary hover:text-shade-1-100% hover:border-primary"
          >
            Tạo
          </Button>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="h-[90%] lg:h-[80%] overflow-y-scroll min-w-[85%] lg:min-w-[70%] lg:-translate-x-[37%] "
          onPointerDownOutside={(e:any) => {
            e.preventDefault();
          }}
          onInteractOutside={(e:any) => {
            e.preventDefault();
          }}
          closeIconClassName="h-6 w-6"
        >
          <ProductActionSlide
            action={action}
            handleCloseDialog={handleCloseDialog}
            id={selectedProductId}
            modelNumber={selectedProductModelNumber}
          ></ProductActionSlide>
        </DialogContent>
      </Dialog>
      <Dialog
        open={action === "DELETE"}
        onOpenChange={() => setAction(undefined)}
      >
        <DialogContent className=" -translate-x-[37%]">
          <Typography headingElement="h4" headingStyle="h4">
            Xóa sản phẩm
          </Typography>
          <div className="flex flex-col gap-4">
            <Typography headingElement="h6" headingStyle="h5">
              Bạn có muốn xóa sản phẩm này không?
            </Typography>
            <div className="flex flex-row justify-end gap-4">
              <Button
                onClick={() => {
                  setAction(undefined);
                }}
                className="bg-shade-1-100% border-[1px] border-neutral-3 hover:bg-secondary hover:text-shade-1-100% hover:border-secondary"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  if (selectedProductId) {
                    setIsProcessing(true);
                    removeProduct(selectedProductId)
                      .then(({ data, error }) => {
                        if (error) throw new Error(error);
                      })
                      .catch((error) =>
                        console.log("Xóa không thành công", error)
                      )
                      .finally(() => {
                        setAction(undefined);
                        setIsProcessing(false);
                      });
                  } else {
                    console.log("no id");
                  }
                }}
                className="bg-shade-1-100% border-[1px] border-error-2 text-error-2 hover:bg-error-2 hover:text-shade-1-100%"
                disabled={isProcessing ?? false}
              >
                {isProcessing ? "...." : "Xóa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
