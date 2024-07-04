"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { IProduct } from "@/app/models/product";
import { formatPriceToVND } from "@/lib/utils";
import { useState } from "react";

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "model.name",
    header: "Tên sản phẩm",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-2">
          <div className="h-[32px] aspect-video">
            <Image
              src={product.model.images[0]}
              alt={product.model.name}
              width={400}
              height={400}
              className="w-full h-full object-cover p-0"
            />
          </div>
          <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
            {product.model.name}
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
      const category = product.model.category;
      return (
        <div className="flex gap-2">
          {category.length === 0 && (
            <h3 className="text-neutral-8 text-[14px] not-italic leading-[normal] whitespace-nowrap">
              Không có nhu cầu sử dụng nào
            </h3>
          )}
          <ul className="flex flex-col gap-4 flex-wrap">
            {category.map((name, index) => {
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
      const { brand } = product.model;

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
      const { productLine } = product.model;

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
      const { PriceInVND, SalePercentage, OriginalPrice } =
        product.configuration;

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
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText("123")}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
