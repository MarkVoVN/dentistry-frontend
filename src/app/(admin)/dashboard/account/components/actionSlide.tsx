import { IBrand } from "@/app/models/brand";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  getConfigProductOptions,
  getNewProductId,
  getProductDetailByID,
  getProductDetailByIDForAdmin,
  getProductDetailByModelNumber,
  removeProduct,
  removeProductMany,
  updateProduct,
  updateProductMany,
} from "@/lib/api/productAPI";
import React, { useCallback, useEffect, useState } from "react";

import { ICategory } from "@/app/models/category";
import { IProductCreateUpdate } from "@/app/models/product";
import { IProductLine } from "@/app/models/productLine";
import {
  MyInputImage,
  MyInputMultiSelect,
  MyInputNumber,
  MyInputSelect,
  MyInputSwitch,
  MyInputText,
  MyInputTextArray,
  MyInputTextToggleEdit,
  MyInputWrapper,
  PriceInput,
} from "@/components/myinput";
import { ProductCard } from "@/components/product-card";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { addCondition } from "@/lib/api/conditionAPI";
import { uploadMultiImages } from "@/lib/firebase-storage";
import { Dialog } from "@radix-ui/react-dialog";
import slugify from "@sindresorhus/slugify";
import _, { template } from "lodash";
import { ChevronDown, Edit, Plus, Trash2, TrashIcon, X } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import BrandAddDialog from "../../brand/components/brand-create-dialog";
import ProductLineCreateDialog from "../../brand/components/product-line-create-dialog";
import ConfigForm from "../../laptop-config/components/forms/form";
import StageSelector from "./stageSelector";

// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn, formatPriceToVND } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { addKeywordTemplate } from "@/lib/api/keywordTemplateAPI";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Chip } from "../../components/search";
import { DropdownMenu } from "@/components/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { twMerge } from "tailwind-merge";

export default function ProductActionSlide({
  action,
  handleCloseDialog,
  modelNumber,
  id,
}: {
  action: string | undefined;
  handleCloseDialog: (refetchData: boolean) => void;
  modelNumber: string | undefined;
  id: string | undefined;
}) {
  const form: {
    [action: string]: {
      form: React.JSX.Element;
    };
  } = {
    CREATE: {
      form: (
        <CreateProductForm
          handleCloseDialog={handleCloseDialog}
          title={"Thêm sản phẩm mới"}
        />
      ),
    },
    UPDATE: {
      form: (
        <CreateProductForm
          modelNumber={modelNumber}
          id={id}
          title="Cập nhật sản phẩm"
          handleCloseDialog={handleCloseDialog}
        />
      ),
    },
  };

  return (
    <div className=" w-full h-full  flex flex-col ">
      {action && form[action].form}
    </div>
  );
}

const DEFAULT_PRODUCT_CONFIGURATION: IProductCreateFormConfiguration = {
  PromotionInfo: [
    "Tặng balo bảo vệ laptop",
    "Tặng chuột không dây",
    "Vệ sinh, thay keo tản nhiệt, bảo dưỡng miễn phí",
  ],
};

const DEFAULT_PRODUCT_SPEC: IProductCreateFormSpecification = {
  Warranty: "Bảo hành 12 tháng đầu tiên.",
  WarrantyInMonths: 12,
};

const KEYWORD_POPUP_MENU_MAX_ITEM = 20;
const CreateProductForm = ({
  id,
  modelNumber,
  title,
  handleCloseDialog,
}: {
  id?: string;
  modelNumber?: string;
  title: string;
  handleCloseDialog: (refetchData: boolean) => void;
}) => {
  const HDD_options = ["Không", "128GB", "256GB", "512GB", "1TB", "2TB"];

  const [productGeneralInfo, setProductGeneralInfo] =
    useState<IProductCreateFormModel>({});

  const [productModel, setProductModel] = useState<{
    [key: string]: IProductCreateFormModel & { _id?: string };
  }>({ 0: {} });
  const [productConfig, setProductConfig] = useState<{
    [key: string]: IProductCreateFormConfiguration;
  }>({ 0: DEFAULT_PRODUCT_CONFIGURATION });
  const [productSpec, setProductSpec] = useState<{
    [key: string]: IProductCreateFormSpecification;
  }>({ 0: DEFAULT_PRODUCT_SPEC });
  // const [productAvailable, setProductAvailable] = useState<boolean>(false);

  const [textInputBuffer, setTextInputBuffer] = useState<{
    [path: string]: {
      [field: string]: string;
    };
  }>({});

  const [modeEdit, setModeEdit] = useState<boolean>(false);

  const [options, setOptions] = useState<IProductConfigOptions>({});

  const [selectedThumbnail, setSelectedThumbnail] = useState<{
    [key: string]: any[];
  }>({ 0: [] });
  const [selectedImages, setSelectedImages] = useState<{
    [key: string]: any[];
  }>({ 0: [] });
  const [preUploadedImages, setPreUploadedImages] = useState<{
    [key: string]: any[];
  }>({ 0: [] });
  const [preUploadedThumbnail, setPreUploadedThumbnail] = useState<{
    [key: string]: any[];
  }>({ 0: [] });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [currentDialog, setCurrentDialog] = useState<string>();
  const [validationState, setValidationState] = useState<{
    [path: string]: string;
  }>();
  const [configOptionList, setConfigOptionList] = useState<string[]>([
    "Cấu hình 1",
  ]);
  const [currentConfigNumber, setCurrentConfigNumber] = useState<number>(0);

  const [configNumberToDelete, setConfigNumberToDelete] = useState<number>(-1);

  const [configIdToBeDelete, setConfigIdToBeDelete] = useState<string[]>([]);

  const [isPriceInputFocused, setIsPriceInputFocus] = useState<boolean>(false);
  const [isOriginalPriceInputFocused, setIsOriginalPriceInputFocus] =
    useState<boolean>(false);

  const [isAvailable, setIsAvailable] = useState<{
    [key: string]: boolean;
  }>({ 0: true });

  const images_preview =
    modeEdit && selectedImages[currentConfigNumber]?.length === 0
      ? preUploadedImages[currentConfigNumber]
      : selectedImages[currentConfigNumber];

  const thumbail_preview =
    modeEdit && selectedThumbnail[currentConfigNumber]?.length === 0
      ? preUploadedThumbnail[currentConfigNumber]
      : selectedThumbnail[currentConfigNumber];

  const updateFormData = ({ path, value }: { path: string; value: any }) => {
    const tokenList = path.split(".");
    const group = tokenList[0];
    const field = tokenList[1];

    if (!field) return;
    switch (group) {
      case "model":
        switch (field) {
          case "brand":
            setProductGeneralInfo((s) => {
              let t = _.cloneDeep(s);
              t[field] = value;
              t.productLine = undefined;
              return t;
            });
            break;
          case "modelNumber":
          case "category":
          case "productLine":
          case "name":
            setProductGeneralInfo((s) => {
              let t = _.cloneDeep(s);
              t[field] = value;
              return t;
            });
            break;
          case "images":
            setProductModel((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              return t;
            });
            break;
          case "fullname":
            setProductModel((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              return t;
            });
            break;
          default:
            setProductModel((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              return t;
            });
            break;
        }
        break;
      case "configuration":
        switch (field) {
          case "slug":
            setProductConfig((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] =
                value?.trim()?.length > 0 ? slugify(value) : value;
              return t;
            });
            break;
          case "PriceInVND":
            if (
              value > 0 &&
              productConfig[currentConfigNumber].OriginalPrice &&
              // @ts-ignore
              productConfig[currentConfigNumber].OriginalPrice >= value
            ) {
              const sale = Math.floor(
                (((productConfig[currentConfigNumber].OriginalPrice ?? 1) -
                  value) /
                  (productConfig[currentConfigNumber].OriginalPrice ?? 1)) *
                  100
              );

              setProductConfig((s) => {
                let t = _.cloneDeep(s);
                t[currentConfigNumber].PriceInVND = value;
                t[currentConfigNumber].SalePercentage =
                  sale > 0 ? sale : undefined;

                return t;
              });
            } else {
              setProductConfig((s) => {
                let t = _.cloneDeep(s);
                t[currentConfigNumber].PriceInVND = value;
                t[currentConfigNumber].SalePercentage = undefined;
                return t;
              });
            }
            break;
          case "OriginalPrice":
            if (
              value > 0 &&
              productConfig[currentConfigNumber]?.PriceInVND &&
              // @ts-ignore
              productConfig[currentConfigNumber]?.PriceInVND <= value
            ) {
              const sale = Math.floor(
                ((value -
                  (productConfig[currentConfigNumber].PriceInVND ?? 1)) /
                  value) *
                  100
              );

              setProductConfig((s) => {
                let t = _.cloneDeep(s);
                t[currentConfigNumber].OriginalPrice = value;
                t[currentConfigNumber].SalePercentage =
                  sale > 0 ? sale : undefined;
                return t;
              });
            } else {
              setProductConfig((s) => {
                let t = _.cloneDeep(s);
                t[currentConfigNumber].OriginalPrice = value;
                t[currentConfigNumber].SalePercentage = undefined;
                return t;
              });
            }
            break;
          case "PromotionInfo":
            setProductConfig((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              return t;
            });
            break;
          default:
            setProductConfig((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              return t;
            });
            break;
        }
        break;
      case "specification":
        switch (field) {
          case "CPUtype":
            setProductSpec((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              t[currentConfigNumber].CPU = value + " ";
              return t;
            });
            break;
          case "VGAtype":
            setProductSpec((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              t[currentConfigNumber].VGA = value + " ";
              return t;
            });
            break;
          case "SSDamount":
            setProductSpec((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              t[currentConfigNumber].SSD = value + " ";
              return t;
            });
            setProductConfig((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber].SSD = value + " ";
              return t;
            });
            break;

          case "HDDamount":
            setProductSpec((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              t[currentConfigNumber].HDD = value + " ";
              return t;
            });
            break;
          case "RAMamount":
            setProductSpec((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              t[currentConfigNumber].RAM = value + " ";
              return t;
            });
            setProductConfig((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber].RAM = value + " ";
              return t;
            });
            break;
          default:
            setProductSpec((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              return t;
            });
            break;
        }
        break;
      default:
        switch (field) {
          case "isAvailable":
          case "isVisible":
          case "isDeleted":
            setProductModel((s) => {
              let t = _.cloneDeep(s);
              t[currentConfigNumber][field] = value;
              return t;
            });
            break;
        }
        break;
    }
  };

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getConfigProductOptions()
      .then(({ error, data }) => {
        if (error) return;
        if (data && data) {
          setOptions(data);
        }
      })
      .catch((e) => {
        console.log("error fetching option list", e);
      });
    if (id) {
      getProductDetailByIDForAdmin(id)
        .then(({ data, error }) => {
          if (error) throw new Error(error);
          let modelState: { [key: string | number]: any } = {};
          let configState: { [key: string | number]: any } = {};
          let specState: { [key: string | number]: any } = {};
          let thumbState: { [key: string | number]: any } = {};
          let imagesState: { [key: string | number]: any } = {};
          let configOptionListState: string[] = [];
          data.data
            .sort(
              (a: any, b: any) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((product: any, index: number) => {
              const { model, configuration, specification, _id } = product;
              modelState[index] = { ...model, _id };
              configState[index] = configuration;
              specState[index] = specification;

              if (model.images && model.images.length > 0) {
                const [tnail, ...rest] = model.images;
                thumbState[index] = [{ name: tnail, preview: tnail }];
                imagesState[index] = rest.map((link: string) => {
                  return { name: link, preview: link };
                });
              }
              configOptionListState.push(`Cấu hình ${index + 1}`);
            });
          const { name, modelNumber, category, brand, productLine } =
            modelState[0];
          setProductGeneralInfo({
            name,
            modelNumber,
            category,
            brand,
            productLine,
          });

          setConfigOptionList(configOptionListState);
          setProductModel(modelState);
          setProductConfig(configState);
          setProductSpec(specState);
          setPreUploadedThumbnail(thumbState);
          setPreUploadedImages(imagesState);
          setModeEdit(true);
        })
        .catch((error) => {
          console.log("Error fetching product detail", error);
        });
    }
  }, [modelNumber]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const data = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      let state = _.cloneDeep(selectedImages);
      state[currentConfigNumber] = data;
      setSelectedImages(state);
    },
    [selectedImages, currentConfigNumber]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onDrop_thumbnail = useCallback(
    (acceptedFiles: any) => {
      let state = _.cloneDeep(selectedThumbnail);
      state[currentConfigNumber] = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      // console.log("setting thumb for config" + currentConfigNumber);
      setSelectedThumbnail(state);
    },
    [selectedThumbnail, currentConfigNumber]
  );

  const {
    getRootProps: getRootProps_thumbnail,
    getInputProps: getInputProps_thumbnail,
    isDragActive: isDragActive_thumbnail,
  } = useDropzone({ onDrop: onDrop_thumbnail, maxFiles: 1 });

  const handleCreateNewKeyword = async () => {
    const kw = textInputBuffer[`${currentConfigNumber}.model.keywords`].value;
    if (!kw || kw.trim().length === 0) {
      return;
    }

    const { data, error } = await addKeywordTemplate(kw);

    if (error != null) {
      // console.log("error catched", error);
      toast.error(error.error);
      setValidationState((s) => {
        return {
          ...s,
          [`${currentConfigNumber}.model.keywords`]: error.error,
        };
      });
      return;
    }

    const newList = [...(productModel[currentConfigNumber].keywords ?? []), kw];

    updateFormData({
      path: "model.keywords",
      value: newList,
    });

    let op = _.cloneDeep(options);
    op.KEYWORD_TEMPLATE
      ? op.KEYWORD_TEMPLATE.push({ value: kw, count: 0 })
      : (op.KEYWORD_TEMPLATE = [{ value: kw, count: 0 }]);
    setOptions(op);
    setOpen(false);
  };

  const handleCreateProduct = async () => {
    setIsProcessing(true);
    const index = Object.keys(productModel);
    const { name, modelNumber, brand, category, productLine } =
      productGeneralInfo;

    let errorList = [];

    if (!name) errorList.push("Thiếu tên sản phẩm. ERROR: model.name");
    if (!brand) errorList.push("Thiếu thương hiệu. ERROR: model.brand");
    if (!category || category.length === 0)
      errorList.push("Thiếu nhu cầu. ERROR: model.category");
    if (!productLine)
      errorList.push("Thiếu dòng thương hiệu. ERROR: model.productLine");
    if (!modelNumber)
      errorList.push("Thiếu mã sản phẩm. ERROR: model.modelNumber");

    index.forEach((i) => {
      const configRequiredFields = [
        "CPU",
        "RAM",
        "VGA",
        "SSD",
        "DisplaySpec",
        "Condition",
        "PriceInVND",
        "OriginalPrice",
      ];

      configRequiredFields.forEach((field) => {
        if (!productConfig[i][field])
          errorList.push(`Thiếu ${field}. ERROR: ${i}.configuration.${field}`);
      });

      const specRequiredFields = [
        "RAM",
        "CPUtype",
        "VGAtype",
        "RAMamount",
        "SSDamount",
        // "DisplaySpec",
        "DisplaySize",
        "DisplayResolution",
        "DisplayPanel",
        "DisplayRefreshRate",
        "Warranty",
        "WarrantyInMonths",
      ];

      specRequiredFields.forEach((field) => {
        if (!productSpec[i][field])
          errorList.push(`Thiếu ${field}. ERROR: ${i}.specification.${field}`);
      });
    });

    if (errorList.length > 0) {
      let errorState: { [key: string]: string } = {};
      let errorCountByConfigNumber: { [key: string]: number } = {};
      errorList.map((error) => {
        let errorMessage: string = error;
        let errorField = errorMessage.split("ERROR: ")[1].split(" ")[0];

        if (errorField) {
          errorState[errorField] = errorMessage.split("ERROR: ")[0];

          let configNumberString = null;

          if (/^\d+$/.test(errorField.split(".")[0])) {
            configNumberString = errorField.split(".")[0];
          }

          if (configNumberString) {
            if (
              errorCountByConfigNumber[configNumberString] &&
              errorCountByConfigNumber[configNumberString] > 0
            ) {
              errorCountByConfigNumber[configNumberString] =
                errorCountByConfigNumber[configNumberString] + 1;
            } else {
              errorCountByConfigNumber[configNumberString] = 1;
            }
          }
        }
      });

      let errorMessage = "";
      Object.keys(errorCountByConfigNumber).map((configNumber) => {
        if (configNumber === "model") {
          errorMessage += `Thông tin chung có ${errorCountByConfigNumber[configNumber]} lỗi. `;
        } else {
          errorMessage += `Cấu hình ${Number.parseInt(configNumber) + 1} có ${
            errorCountByConfigNumber[configNumber]
          } lỗi. `;
        }
      });

      setValidationState(errorState);
      console.log("msg", errorCountByConfigNumber);
      toast.error(errorMessage ?? "Đã có lỗi xảy ra");

      setIsProcessing(false);
      return;
    }
    let newly_created_ids: string[] = [];

    try {
      if (!modeEdit) {
        // CREATE PRODUCT
        // getting the product ids
        const id_list = (await getNewProductId(index.length)).data.ids;

        //uploading product images
        const image_list_promises: any[] = index.map((i) => {
          const id = id_list[i];
          const imageArray = [...selectedThumbnail[i], ...selectedImages[i]];
          return uploadMultiImages(imageArray, "/product/" + id);
        });

        let image_list: { [key: string]: any } = {};
        await Promise.all(image_list_promises)
          .then((images) => {
            images.map((value, index) => {
              image_list[index] = value;
            });
          })
          .catch((error) => {
            toast.error(
              "Đã có lỗi xảy ra trong quá trình tải ảnh, vui lòng thử lại." +
                error?.message ?? ""
            );
            setIsProcessing(false);
            return;
          });

        //synthesize request
        const req = index.map((i) => {
          const id = id_list[i];
          let updatedConfig = _.cloneDeep(productConfig[i]);
          let newModel = _.cloneDeep(productModel[i]);

          newModel.images = image_list[i];
          newModel = { ...newModel, ...productGeneralInfo };
          const { CPU, VGA, RAM, SSD, DisplaySpec } = updatedConfig;

          const templateString =
            newModel.name + " " + [CPU, VGA, RAM, SSD, DisplaySpec].join("/");

          if (!newModel.fullname) newModel.fullname = templateString;

          updatedConfig.slug =
            updatedConfig.slug && updatedConfig.slug.length > 0
              ? updatedConfig.slug
              : slugify(newModel.fullname) + "-" + id;

          if (!updatedConfig.pageTitle)
            updatedConfig.pageTitle = newModel.fullname + "-Laptoptot.vn";

          return {
            _id: id,
            model: newModel,
            configuration: updatedConfig,
            specification: productSpec[i],
            isDeleted: false,
            isAvailable: isAvailable?.[i] ?? true,
          };
        });

        // console.log(req);
        //send req
        const res = await updateProductMany({
          update: req as IProductCreateUpdate[],
        });

        const { data, error } = res;
        if (error != null) {
          let errorMessage: string = error?.error;
          let isValidationError =
            errorMessage.indexOf("validationError:") !== -1;

          await removeProductMany(id_list);
          setIsProcessing(false);

          if (!isValidationError) {
            //system error
            toast.error(errorMessage || "Đã có lỗi xảy ra");
            return;
          } else {
            // validation error
            let errorMessage: string = error?.error;

            let error_list = errorMessage
              .split("validationError:")[1]
              .split("/END/");

            console.log(error_list);
            let errorState: { [key: string]: string } = {};
            let errorCountByConfigNumber: { [key: string]: number } = {};
            let noFieldError: string[] = [];

            error_list.map((error) => {
              let errorField = error.split("ERROR: ")[1].split(" ")[0];
              if (errorField) {
                // let configNumber = errorField.split(".")[0];
                if (/^\d+$/.test(errorField.split(".")[0])) {
                  let configNumber = errorField.split(".")[0];
                  if (errorCountByConfigNumber[configNumber] > 0) {
                    errorCountByConfigNumber[configNumber] =
                      errorCountByConfigNumber[configNumber] + 1;
                  } else {
                    errorCountByConfigNumber[configNumber] = 1;
                  }
                }
                errorState[errorField] = error.split("ERROR: ")[0];
              } else {
                noFieldError.push(error);
              }
            });

            let error_message_to_user = "";
            Object.keys(errorCountByConfigNumber).map((configNumber) => {
              let configNumber_int = -1;
              try {
                configNumber_int = Number.parseInt(configNumber);
                error_message_to_user += `Cấu hình ${configNumber_int + 1} có ${
                  errorCountByConfigNumber[configNumber]
                } lỗi. `;
              } catch (err) {}
            });
            error_message_to_user += noFieldError.join(". ");
            setValidationState(errorState);

            toast.error(error_message_to_user ?? "Đã có lỗi xảy ra");
          }
        } else {
          toast(
            "Thêm sản phẩm " +
              productGeneralInfo.name +
              `với ${index.length} cấu hình` +
              " thành công!"
          );
          handleCloseDialog(true);
          setIsProcessing(false);
          return;
        }
        return;
      }
      // UPDATE PRODUCT
      // getting the product ids

      const id_list_promises: any = Object.keys(productModel).map((key) => {
        const id = productModel[key]._id;
        if (id) return id;
        return getNewProductId().then((res) => {
          // console.log("get new id res", res.data.ids[0]);
          newly_created_ids.push(res.data.ids[0]);
          return res.data.ids[0];
        });
      });

      let id_list: any = [];

      await Promise.all(id_list_promises)
        .then((data) => {
          id_list = data;
          // console.log("complete id list", data);
          // console.log("new create id", newly_created_ids);
        })
        .catch((error) => {
          throw new Error(
            "Đã có lỗi xảy ra trong quá trình khởi tạo id, vui lòng thử lại." +
              error?.message ?? ""
          );
        });

      // console.log("pre", preUploadedThumbnail);

      //uploading product images
      const thumb_list_promises: any[] = index.map(async (i) => {
        const id = id_list[i];

        let thumbURL = preUploadedThumbnail[i]?.[0]?.name ?? "";

        if (selectedThumbnail[i] && selectedThumbnail[i].length > 0) {
          thumbURL = (
            await uploadMultiImages(selectedThumbnail[i], "/product/" + id)
          )[0];
        }
        return thumbURL;
      });

      const image_list_promises: any[] = index.map(async (i) => {
        const id = id_list[i];
        let imgURL =
          preUploadedImages[i]?.length > 0
            ? preUploadedImages[i].map((image) => image?.name ?? "")
            : [];
        if (selectedImages[i] && selectedImages[i].length > 0) {
          imgURL = await uploadMultiImages(selectedImages[i], "/product/" + id);
        }
        return imgURL;
      });

      let thumb_list: { [key: string]: any } = {};

      await Promise.all(thumb_list_promises)
        .then((images) => {
          images.map((value, index) => {
            thumb_list[index] = value;
          });
        })
        .catch((error) => {
          throw new Error(
            "Đã có lỗi xảy ra trong quá trình tải ảnh, vui lòng thử lại." +
              error?.message ?? ""
          );
        });

      let image_list: { [key: string]: any } = {};

      await Promise.all(image_list_promises)
        .then((images) => {
          images.map((value, index) => {
            image_list[index] = value;
          });
        })
        .catch((error) => {
          throw new Error(
            "Đã có lỗi xảy ra trong quá trình tải ảnh, vui lòng thử lại." +
              error?.message ?? ""
          );
        });

      // console.log("thumblist", thumb_list);
      // console.log("image_list", image_list);

      const req = index.map((i) => {
        const id = id_list[i];
        let updatedConfig = _.cloneDeep(productConfig[i]);
        let newModel = _.cloneDeep(productModel[i]);

        newModel.images = [thumb_list[i], ...image_list[i]];
        newModel = { ...newModel, ...productGeneralInfo };
        const { CPU, VGA, RAM, SSD, DisplaySpec } = updatedConfig;

        const templateString =
          newModel.name + " " + [CPU, VGA, RAM, SSD, DisplaySpec].join("/");

        if (!newModel.fullname) newModel.fullname = templateString;

        updatedConfig.slug =
          updatedConfig.slug && updatedConfig.slug.length > 0
            ? updatedConfig.slug.endsWith(id as string)
              ? updatedConfig.slug
              : updatedConfig.slug + "-" + id
            : slugify(newModel.fullname) + "-" + id;

        if (!updatedConfig.pageTitle)
          updatedConfig.pageTitle = newModel.fullname + "-Laptoptot.vn";

        return {
          _id: id,
          model: newModel,
          configuration: updatedConfig,
          specification: productSpec[i],
          isDeleted: false,
          isAvailable: isAvailable?.[i] ?? true,
        };
      });

      // console.log(req);

      const res = await updateProductMany({
        update: req as IProductCreateUpdate[],
        deleteIdList: configIdToBeDelete,
      });

      const { data, error } = res;
      if (error != null) {
        let errorMessage: string = error?.error;
        let isValidationError = errorMessage.indexOf("validationError:") !== -1;

        if (!isValidationError) {
          //system error
          throw new Error(errorMessage || "Đã có lỗi xảy ra");
        } else {
          // validation error
          let errorMessage: string = error?.error;

          let error_list = errorMessage
            .split("validationError:")[1]
            .split("/END/");

          console.log(error_list);
          let errorState: { [key: string]: string } = {};
          let errorCountByConfigNumber: { [key: string]: number } = {};
          let noFieldError: string[] = [];

          error_list.map((error) => {
            let errorField = error.split("ERROR: ")[1].split(" ")[0];
            if (errorField) {
              let configNumber = errorField.split(".")[0];
              if (errorCountByConfigNumber[configNumber] > 0) {
                errorCountByConfigNumber[configNumber] =
                  errorCountByConfigNumber[configNumber] + 1;
              } else {
                errorCountByConfigNumber[configNumber] = 1;
              }
              errorState[errorField] = error.split("ERROR: ")[0];
            } else {
              noFieldError.push(error);
            }
          });

          let error_message_to_user = "";
          Object.keys(errorCountByConfigNumber).map((configNumber) => {
            let configNumber_int = -1;
            try {
              configNumber_int = Number.parseInt(configNumber);
              error_message_to_user += `Cấu hình ${configNumber_int + 1} có ${
                errorCountByConfigNumber[configNumber]
              } lỗi. `;
            } catch (err) {}
          });
          error_message_to_user += noFieldError.join(". ");
          setValidationState(errorState);

          throw new Error(error_message_to_user ?? "Đã có lỗi xảy ra");
        }
      } else {
        toast.success(
          "Cập nhật sản phẩm " +
            productGeneralInfo.name +
            `với ${index.length} cấu hình` +
            " thành công!"
        );
        handleCloseDialog(true);

        return;
      }
    } catch (e: any) {
      console.log("error catched");
      toast.error(e?.message ?? "Đã có lỗi xảy ra. Vui lòng thử lại.");

      await removeProductMany(newly_created_ids);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="">
      <div className="w-full flex flex-row justify-between items-center my-2 py-4 bg-shade-1-100% rounded">
        <Typography headingElement="h3" headingStyle={"h4"} className="w-full">
          {title}
        </Typography>
        <Button
          onClick={handleCreateProduct}
          className="text-shade-1-100% text-lg mr-4"
          disabled={isProcessing}
        >
          {isProcessing ? "..." : modeEdit ? "Lưu" : "Tạo"}
        </Button>
      </div>
      <section className="model-section flex flex-col gap-4 pb-3">
        {/* MODEL */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-row justify-between gap-4">
            <MyInputText
              props={{
                path: "model.name",
                type: "text",
                label: "Tên sản phẩm",
                value: productGeneralInfo?.name ?? "",
                cellClassName: "w-full",
                onBlur: () => {
                  // propagate name change to full name
                  if (
                    (!productModel[currentConfigNumber].fullname ||
                      productModel[currentConfigNumber].fullname?.length ===
                        0) &&
                    productGeneralInfo.name
                  ) {
                    let newModel = _.cloneDeep(productModel);
                    newModel[currentConfigNumber].fullname =
                      productGeneralInfo.name;
                    setProductModel(newModel);
                  }
                  // propagate name change to slug
                  if (
                    (!productConfig[currentConfigNumber].slug ||
                      productConfig[currentConfigNumber].slug?.trim()
                        ?.length === 0) &&
                    productGeneralInfo.name
                  ) {
                    setProductConfig((s) => {
                      let newState = _.cloneDeep(s);
                      newState[currentConfigNumber].slug = slugify(
                        productGeneralInfo.name ?? "",
                        {
                          lowercase: true,
                        }
                      );
                      return newState;
                    });
                  }
                  // propagate name change to page title
                  if (
                    (!productConfig[currentConfigNumber].pageTitle ||
                      productConfig[currentConfigNumber].pageTitle?.trim()
                        ?.length === 0) &&
                    productGeneralInfo.name
                  ) {
                    setProductConfig((s) => {
                      let newState = _.cloneDeep(s);
                      newState[currentConfigNumber].pageTitle =
                        productGeneralInfo.name;
                      return newState;
                    });
                  }
                },
                errorMessage: validationState
                  ? validationState[`model.name`]
                  : undefined,
              }}
              updateFormData={updateFormData}
            />
            <MyInputText
              props={{
                path: "model.modelNumber",
                type: "text",
                label: "Mã sản phẩm",
                value: productGeneralInfo?.modelNumber ?? "",
                cellClassName: "w-full",
                // description:
                //   "Những cấu hình khác nhau của 1 laptop đều có chung 1 mã sản phẩm",
                errorMessage: validationState
                  ? validationState[`model.modelNumber`]
                  : undefined,
              }}
              updateFormData={updateFormData}
            />
          </div>
          <div className="flex flex-row justify-between gap-4">
            <MyInputSelect
              props={{
                path: "model.brand",
                type: "select",
                label: "Thương hiệu",
                value: productGeneralInfo.brand,
                items:
                  options.BRAND?.map((brand: IBrand) => {
                    return { value: brand.name };
                  }) ?? [],
                handleCreateNew: () => {
                  setCurrentDialog("brand");
                },
                cellClassName: "w-full",
                placeholderText: " ",
                errorMessage: validationState
                  ? validationState[`model.brand`]
                  : undefined,
              }}
              updateFormData={updateFormData}
            />
            <BrandAddDialog
              open={currentDialog === "brand"}
              onOpenChange={(value) => {
                if (value) {
                  //setCurrentDialog("brand");
                } else {
                  setCurrentDialog(undefined);
                }
              }}
              hideTrigger={true}
              onSuccess={(data: any) => {
                if (data.data.name) {
                  setCurrentDialog(undefined);
                  updateFormData({
                    path: "model.brand",
                    value: data.data.name,
                  });
                  let oplist = options;
                  if (oplist.BRAND) {
                    oplist.BRAND.push({
                      _id: data.data._id,
                      name: data.data.name,
                      slug: data.data.slug,
                    });
                  } else {
                    oplist.BRAND = [
                      {
                        _id: data.data._id,
                        name: data.data.name,
                        slug: data.data.slug,
                      },
                    ];
                  }
                  setOptions(oplist);
                }
                console.log("brand creation success", data.data.name);
              }}
              onFail={() => {
                console.log("brand creation failed");
              }}
              brandList={[]}
              submitFunction={() => {}}
              defaultBrand=""
            ></BrandAddDialog>
            <MyInputSelect
              props={{
                path: "model.productLine",
                type: "select",
                label: "Dòng thương hiệu",
                value: productGeneralInfo.productLine,
                items:
                  options.PRODUCT_LINE?.filter((pl: any) => {
                    //TODO: currently does not check if product line is matched with category.
                    if (
                      !productGeneralInfo.brand ||
                      productGeneralInfo.brand?.length === 0
                    )
                      return true;
                    if (pl.brand === productGeneralInfo.brand) {
                      return true;
                    }
                    return false;
                  }).map((productLine: any) => {
                    return {
                      value: productLine.name,
                    };
                  }) ?? [],
                handleCreateNew: () => {
                  setCurrentDialog("productLine");
                },
                placeholderText: " ",
                cellClassName: "w-full",
                errorMessage: validationState
                  ? validationState[`model.productLine`]
                  : undefined,
              }}
              updateFormData={updateFormData}
            />
            <ProductLineCreateDialog
              brandList={options.BRAND ?? []}
              open={currentDialog === "productLine"}
              onOpenChange={(value) => {
                if (value) {
                  //setCurrentDialog("productLine");
                } else {
                  setCurrentDialog(undefined);
                }
              }}
              hideTrigger={true}
              onSuccess={(data: any) => {
                if (data.data.name) {
                  setCurrentDialog(undefined);
                  updateFormData({
                    path: "model.productLine",
                    value: data.data.name,
                  });
                  let oplist = options;
                  const { _id, name, brand, category, image, isPromoted } =
                    data.data;
                  const newPl = {
                    _id,
                    name,
                    brand,
                    category,
                    image,
                    isPromoted,
                  };
                  // console.log("newpl", newPl);
                  if (oplist.PRODUCT_LINE) {
                    oplist.PRODUCT_LINE.push(newPl);
                  } else {
                    oplist.PRODUCT_LINE = [newPl];
                  }
                  setOptions(oplist);
                }
                // console.log("product line creation success", data.data.name);
              }}
              defaultBrand={productModel[currentConfigNumber].brand}
              onFail={(error: any) => {
                // console.log("product line creation failed" + error);
              }}
              submitFunction={() => {}}
            ></ProductLineCreateDialog>
            <MyInputMultiSelect
              props={{
                path: "model.category",
                type: "multiSelect",
                label: "Nhu cầu sử dụng",
                value: productGeneralInfo.category?.join(", "),
                // description: "Chọn nhu cầu sử dụng phù hợp với sản phẩm",
                cellClassName: "w-full",
                errorMessage: validationState
                  ? validationState[`model.category`]
                  : undefined,
                items:
                  options.CATEGORY?.map((category: ICategory) => {
                    return {
                      value: category.name,
                      checked: productGeneralInfo.category?.includes(
                        category.name
                      ),
                    };
                  }) ?? [],
                onChange: ({
                  value,
                  field,
                }: {
                  value: boolean;
                  field: string;
                }) => {
                  // let newTagList = productConfig[currentConfigNumber].tag ?? [];
                  console.log(value);
                  console.log(field);
                  console.log("prev list: ", productGeneralInfo.category);
                  let prev = productGeneralInfo.category ?? [];
                  const index = prev.indexOf(field);

                  if (value === true) {
                    if (index > -1) return;
                    prev.push(field);
                    // if (options.CATEGORY) {
                    //   const { slug } = options.CATEGORY.filter(
                    //     (c) => c.name === field
                    //   )[0];
                    // newTagList.push({
                    //   displayText: field,
                    //   link: `/collections/${slug}`,
                    // });
                    // }
                  }
                  if (value === false) {
                    if (index > -1) {
                      prev.splice(index, 1);
                    }
                    // newTagList = newTagList.filter(({ displayText, link }) => {
                    //   return displayText !== field;
                    // });
                  }
                  // const newConfig = {
                  //   ...productConfig[currentConfigNumber],
                  // tag: newTagList,
                  // };
                  // setProductConfig(newConfig);
                  console.log("updated list", prev);
                  updateFormData({ path: "model.category", value: prev });
                },
              }}
              updateFormData={updateFormData}
            />
          </div>
        </div>
        {/*<div
          className={"flex flex-row justify-between items-center gap-2 w-full "}
        >
          //<div className="flex flex-row w-full justify-between">
          <div className="w-1/3 flex flex-col gap-2">
            <Label className={"mt-1"}>Cấu hình</Label>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={twMerge(
                  "h-10 border-[1px] border-neutral-3 rounded-md p-2 px-3 text-left flex flex-row justify-between items-center"
                )}
              >
                {configOptionList[currentConfigNumber] ?? ""}
                <ChevronDown width={16} height={16}></ChevronDown>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[15vw] 2xl:min-w-[16vw] max-h-[50vh] overflow-y-auto"
                align="start"
              >
                <DropdownMenuItem
                  onClick={() => {
                    const index = configOptionList.length;

                    const newConfigOptionList = [
                      ...configOptionList,
                      `Cấu hình ${index + 1}`,
                    ];
                    setConfigOptionList(newConfigOptionList);

                    const model = _.cloneDeep(productModel);
                    model[index] = {};
                    setProductModel(model);

                    const config = _.cloneDeep(productConfig);
                    config[index] = DEFAULT_PRODUCT_CONFIGURATION;
                    setProductConfig(config);

                    const spec = _.cloneDeep(productSpec);
                    spec[index] = DEFAULT_PRODUCT_SPEC;
                    setProductSpec(spec);

                    let isAvai = _.cloneDeep(isAvailable);
                    isAvai[index] = true;
                    setIsAvailable(isAvai);

                    setSelectedThumbnail((s) => {
                      const t = _.cloneDeep(s);
                      t[index] = [];
                      return t;
                    });
                    setSelectedImages((s) => {
                      const t = _.cloneDeep(s);
                      t[index] = [];
                      return t;
                    });
                    setPreUploadedImages((s) => {
                      const t = _.cloneDeep(s);
                      t[index] = [];
                      return t;
                    });
                    setPreUploadedThumbnail((s) => {
                      const t = _.cloneDeep(s);
                      t[index] = [];
                      return t;
                    });

                    setCurrentConfigNumber(index);
                  }}
                  className="flex flex-row gap-2"
                >
                  <Plus width={16} height={16}></Plus> {"Tạo mới"}
                </DropdownMenuItem>

                {configOptionList
                  .map((v: string, index: number) => {
                    return { value: index, text: v };
                  })
                  .map(({ value: itemValue, text }) => {
                    return (
                      <DropdownMenuItem
                        key={`select-config-${itemValue}`}
                        className="flex flex-row justify-between p-0 m-0"
                        onClick={() => {
                          setCurrentConfigNumber(itemValue);
                        }}
                      >
                        <span className="flex flex-row gap-2 p-2">
                          <span className="w-4 h-4">
                            {currentConfigNumber === itemValue && (
                              <Check width={16} height={16}></Check>
                            )}
                          </span>
                          <span>{text ?? itemValue}</span>
                        </span>

                        <span
                          className={twMerge(
                            "p-2 rounded border-[1px] border-neutral-3 text-neutral-3 cursor-pointer",
                            configOptionList.length > 1
                              ? "hover:border-error-2 hover:text-error-2 "
                              : "opacity-30 "
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (configOptionList.length > 1) {
                              setConfigNumberToDelete(itemValue);
                            }
                          }}
                        >
                          <TrashIcon className="w-4 h-4"></TrashIcon>
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={configNumberToDelete >= 0}
              onOpenChange={() => setConfigNumberToDelete(-1)}
            >
              <DialogContent className=" -translate-x-[37%]">
                <Typography headingElement="h4" headingStyle="h4">
                  Xóa cấu hình
                </Typography>
                <div className="flex flex-col gap-4">
                  <Typography headingElement="h6" headingStyle="h5">
                    Bạn có chắc chắn muốn xóa cấu hình này không?
                    {modeEdit && productModel?.[configNumberToDelete]?._id
                      ? " Cấu hình này đã được lưu trên cơ sở dữ liệu. Cấu hình này sẽ chỉ được xóa sau khi bạn nhấn lưu."
                      : ""}
                  </Typography>
                  <div className="flex flex-row justify-end gap-4">
                    <Button
                      onClick={() => {
                        setConfigNumberToDelete(-1);
                      }}
                      className="bg-shade-1-100% border-[1px] border-neutral-3 hover:bg-secondary hover:text-shade-1-100% hover:border-secondary"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          modeEdit &&
                          productModel?.[configNumberToDelete]?._id
                        ) {
                          setConfigIdToBeDelete((s) => {
                            return [
                              ...s,
                              productModel[configNumberToDelete]._id as string,
                            ];
                          });
                        }

                        if (
                          configNumberToDelete ===
                          configOptionList.length - 1
                        ) {
                          let newConfigOptionList = [...configOptionList];
                          newConfigOptionList.pop();
                          setConfigOptionList(newConfigOptionList);

                          let model = _.cloneDeep(productModel);
                          delete model[configNumberToDelete];
                          setProductModel(model);

                          const config = _.cloneDeep(productConfig);
                          delete config[configNumberToDelete];
                          setProductConfig(config);

                          const spec = _.cloneDeep(productSpec);
                          delete spec[configNumberToDelete];
                          setProductSpec(spec);

                          setSelectedThumbnail((s) => {
                            const t = _.cloneDeep(s);
                            delete t[configNumberToDelete];
                            return t;
                          });
                          setSelectedImages((s) => {
                            const t = _.cloneDeep(s);
                            delete t[configNumberToDelete];
                            return t;
                          });
                          setPreUploadedImages((s) => {
                            const t = _.cloneDeep(s);
                            delete t[configNumberToDelete];
                            return t;
                          });
                          setPreUploadedThumbnail((s) => {
                            const t = _.cloneDeep(s);
                            delete t[configNumberToDelete];
                            return t;
                          });

                          if (currentConfigNumber === configNumberToDelete) {
                            setCurrentConfigNumber(configNumberToDelete - 1);
                          }
                          setConfigNumberToDelete(-1);
                          return;
                        }

                        let newConfigOptionList = [...configOptionList];
                        newConfigOptionList.pop();
                        setConfigOptionList(newConfigOptionList);

                        let model: any = {};
                        let config: any = {};
                        let spec: any = {};
                        let newSelTNail: any = {};
                        let newSelImg: any = {};
                        let newPreTNail: any = {};
                        let newPreImg: any = {};

                        Object.keys(productModel).map((key, index) => {
                          if (index < configNumberToDelete) {
                            model[key] = _.cloneDeep(productModel[key]);
                            config[key] = _.cloneDeep(productConfig[key]);
                            spec[key] = _.cloneDeep(productSpec[key]);
                            newSelTNail[key] = _.cloneDeep(
                              selectedThumbnail[key]
                            );
                            newSelImg[key] = _.cloneDeep(selectedImages[key]);
                            newPreTNail[key] = _.cloneDeep(
                              preUploadedThumbnail[key]
                            );
                            newPreImg[key] = _.cloneDeep(
                              preUploadedImages[key]
                            );
                          }

                          if (
                            index >= configNumberToDelete &&
                            productModel[index + 1] !== undefined
                          ) {
                            model[key] = _.cloneDeep(productModel[index + 1]);
                            config[key] = _.cloneDeep(productConfig[index + 1]);
                            spec[key] = _.cloneDeep(productSpec[index + 1]);
                            newSelTNail[key] = _.cloneDeep(
                              selectedThumbnail[index + 1]
                            );
                            newSelImg[key] = _.cloneDeep(
                              selectedImages[index + 1]
                            );
                            newPreTNail[key] = _.cloneDeep(
                              preUploadedThumbnail[index + 1]
                            );
                            newPreImg[key] = _.cloneDeep(
                              preUploadedImages[index + 1]
                            );
                          }
                        });
                        setProductModel(model);
                        setProductConfig(config);
                        setProductSpec(spec);
                        setSelectedThumbnail(newSelTNail);
                        setSelectedImages(newSelImg);
                        setPreUploadedThumbnail(newPreTNail);
                        setPreUploadedImages(newPreImg);

                        if (currentConfigNumber > configNumberToDelete) {
                          setCurrentConfigNumber(currentConfigNumber - 1);
                        }
                        setConfigNumberToDelete(-1);
                      }}
                      className="bg-shade-1-100% border-[1px] border-error-2 text-error-2 hover:bg-error-2 hover:text-shade-1-100%"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>*/}

        <span className="h-[1px] w-full bg-neutral-3 mt-4"></span>
        <Tabs defaultValue="config" className="w-full my-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Cấu hình</TabsTrigger>
            <TabsTrigger value="spec">Chi tiết</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          <TabsContent value="config">
            <div className="flex gap-8 my-8">
              <div className="flex flex-col h-full w-[40%]">
                {/* Preview Product Card*/}
                <div className="flex justify-center my-2">
                  <div className="w-[226px]">
                    <ProductCard
                      name={productGeneralInfo.name ?? "Chưa nhập"}
                      specifications={{
                        cpu:
                          productConfig[currentConfigNumber].CPU ?? "Chưa chọn",
                        gpu:
                          productConfig[currentConfigNumber].VGA ?? "Chưa chọn",
                        lcd:
                          productConfig[currentConfigNumber].DisplaySpec ??
                          "Chưa chọn",
                        ram:
                          productConfig[currentConfigNumber].RAM ?? "Chưa chọn",
                        storage:
                          productConfig[currentConfigNumber].SSD ?? "Chưa chọn",
                      }}
                      orginalPrice={
                        productConfig[currentConfigNumber].OriginalPrice ?? 0
                      }
                      price={productConfig[currentConfigNumber].PriceInVND ?? 0}
                      discount={
                        productConfig[currentConfigNumber].SalePercentage ?? 0
                      }
                      tag={productConfig[currentConfigNumber]?.flag}
                      condition={
                        productConfig[currentConfigNumber].Condition ??
                        "Chưa chọn"
                      }
                      imageUrl={
                        (modeEdit &&
                        selectedThumbnail[currentConfigNumber]?.length === 0
                          ? preUploadedThumbnail[currentConfigNumber]
                          : selectedThumbnail[currentConfigNumber]
                        )?.map((file) => file.preview)[0]
                      }
                      unclickable={true}
                    ></ProductCard>
                  </div>
                </div>
                <MyInputImage
                  props={{
                    path: "model.images[0]",
                    type: "image",
                    label: "Hình thẻ sản phẩm",
                    description: "Một ảnh dùng cho thẻ sản phẩm",
                    dropBoxText: "Thêm hình ảnh cho thẻ sản phẩm",
                    imageInputProps: getInputProps_thumbnail,
                    imageRootProps: getRootProps_thumbnail,
                    value: thumbail_preview,
                    cellClassName: "row-span-3",
                    isDragActive: isDragActive_thumbnail,
                  }}
                  updateFormData={updateFormData}
                />
                <MyInputImage
                  props={{
                    path: "model.images",
                    type: "image",
                    label: "Hình sản phẩm",
                    description:
                      "Sản phẩm sẽ hiển thị trong mục sản phẩm mới trên trang chủ",
                    dropBoxText: "Thêm hình ảnh cho sản phẩm",
                    value: images_preview,
                    imageInputProps: getInputProps,
                    imageRootProps: getRootProps,
                    isDragActive: isDragActive,
                    cellClassName: "row-span-3",
                    handleImageRemove: (index: number) => {
                      if (index < 0) return;
                      if (
                        modeEdit &&
                        selectedImages[currentConfigNumber].length === 0
                      )
                        return;
                      let state = _.cloneDeep(selectedImages);
                      state[currentConfigNumber].splice(index, 1);
                      setSelectedImages(state);
                    },
                  }}
                  updateFormData={updateFormData}
                />
              </div>
              <div className="flex flex-col h-full w-[60%] gap-2">
                <div className="CPU">
                  <div className="flex gap-4">
                    <MyInputSelect
                      props={{
                        path: "specification.CPUtype",
                        type: "select",
                        label: "Loại CPU",
                        // placeholderText: "Chọn CPU",
                        value: productSpec[currentConfigNumber].CPUtype,
                        items:
                          options.CPU?.map((cpu: string) => ({ value: cpu })) ??
                          [],
                        cellClassName: "w-1/3",
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.CPUtype`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                    <MyInputText
                      props={{
                        path: "configuration.CPU",
                        type: "text",
                        label: "Tên ngắn gọn CPU ",
                        description: "Mẫu: i5 1235U / R5 7530",
                        cellClassName: "flex-1",
                        value: productConfig[currentConfigNumber].CPU ?? "",
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.configuration.CPU`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                  </div>
                  <MyInputText
                    props={{
                      path: "specification.CPU",
                      type: "text",
                      label: "Tên đầy đủ CPU ",
                      description:
                        "Mẫu: Intel Core i5-1235U, 10 lõi / 12 luồng, 4.40 GHz, 12MB",
                      value: productSpec[currentConfigNumber].CPU ?? "",
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.specification.CPU`
                          ]
                        : undefined,
                    }}
                    updateFormData={updateFormData}
                  />
                </div>
                <div className="VGA/GPU ">
                  <div className="flex gap-4">
                    <MyInputSelect
                      props={{
                        path: "specification.VGAtype",
                        type: "select",
                        label: "Loại card đồ họa",
                        // placeholderText: "Chọn loại Card đồ họa",
                        value: productSpec[currentConfigNumber].VGAtype,
                        items:
                          options.VGA?.map((name: string) => ({
                            value: name,
                          })) ?? [],
                        cellClassName: "w-1/3",
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.VGAtype`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />

                    <MyInputText
                      props={{
                        path: "configuration.VGA",
                        type: "text",
                        label: "Tên ngắn gọn VGA ",
                        description: "Mẫu: Iris Xe | RTX 3050",
                        value: productConfig[currentConfigNumber].VGA ?? "",
                        cellClassName: "flex-1",
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.configuration.VGA`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                  </div>
                  <MyInputText
                    props={{
                      path: "specification.VGA",
                      type: "text",
                      label: "Tên đầy đủ VGA ",
                      description:
                        "Mẫu: Intel Iris Xe Graphics | NVIDIA® GeForce RTX™ 3050 6GB GDDR6",
                      value: productSpec[currentConfigNumber].VGA ?? "",
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.specification.VGA`
                          ]
                        : undefined,
                    }}
                    updateFormData={updateFormData}
                  />
                </div>
                <div className="SSD">
                  <div className="flex gap-4">
                    <MyInputSelect
                      props={{
                        path: "specification.SSDamount",
                        type: "select",
                        label: "Dung lượng SSD",
                        // placeholderText: "Chọn dung lượng ổ SSD",
                        items:
                          options.SSD?.map((name: string) => ({
                            value: name,
                          })) ?? [],
                        cellClassName: "w-1/3",
                        value: productSpec[currentConfigNumber].SSDamount,
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.SSDamount`
                            ]
                            ? validationState[
                                `${currentConfigNumber}.specification.SSD`
                              ]
                            : validationState[
                                `${currentConfigNumber}.configuration.SSD`
                              ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                    <MyInputText
                      props={{
                        path: "specification.SSD",
                        type: "text",
                        label: "Thông số chi tiết SSD ",
                        description: "Mẫu: 512 GB PCIe NVMe M.2 SSD",
                        cellClassName: "flex-1",
                        value: productSpec[currentConfigNumber].SSD ?? "",
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.SSD`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                  </div>
                </div>
                <div className="RAM">
                  <div className="flex gap-4">
                    <MyInputSelect
                      props={{
                        path: "specification.RAMamount",
                        type: "select",
                        label: "Dung lượng RAM",
                        // placeholderText: "Chọn dung lượng RAM",
                        items:
                          options.RAM?.map((name: string) => ({
                            value: name,
                          })) ?? [],
                        cellClassName: "w-1/3",
                        value: productSpec[currentConfigNumber].RAMamount,
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.RAMamount`
                            ]
                            ? validationState[
                                `${currentConfigNumber}.specification.RAMamount`
                              ]
                            : validationState[
                                `${currentConfigNumber}.configuration.RAM`
                              ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                    <MyInputText
                      props={{
                        path: "specification.RAM",
                        type: "text",
                        label: "Thông số chi tiết RAM ",
                        description: "Mẫu: 16GB, DDR5 3200MHz, 2 x 8GB",
                        cellClassName: "flex-1",
                        value: productSpec[currentConfigNumber].RAM ?? "",
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.RAM`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                  </div>
                </div>

                <MyInputSelect
                  props={{
                    path: "configuration.Condition",
                    label: "Tình trạng",
                    items:
                      options.CONDITION?.map((name: string) => ({
                        value: name,
                      })) ?? [],
                    value: productConfig[currentConfigNumber].Condition,
                    handleCreateNew: () => {
                      setCurrentDialog("condition");
                    },
                    errorMessage: validationState
                      ? validationState[
                          `${currentConfigNumber}.configuration.Condition`
                        ]
                      : undefined,
                  }}
                  updateFormData={updateFormData}
                />
                <Dialog
                  open={currentDialog === "condition"}
                  onOpenChange={(value) => {
                    if (value) {
                      // setCurrentDialog("brand");
                    } else {
                      setCurrentDialog(undefined);
                    }
                  }}
                >
                  <DialogContent>
                    <DialogTitle>Thêm tình trạng</DialogTitle>
                    <ConfigForm
                      label={"Tình trạng"}
                      placeholder={"Mới 100%"}
                      submitFunction={(value: string) =>
                        addCondition(value).then((res) => {
                          const { data, error } = res;
                          console.log(res);
                          if (error) {
                            toast.error(error?.error);
                            return;
                          }
                          toast.success("Thêm tình trạng thành công!");
                          updateFormData({
                            path: "configuration.Condition",
                            value: value,
                          });
                          setOptions((op) => {
                            return {
                              ...op,
                              CONDITION: data.data.CONDITION,
                            };
                          });
                          setCurrentDialog(undefined);
                        })
                      }
                    />
                  </DialogContent>
                </Dialog>

                <div className="price flex flex-row justify-between gap-1">
                  <MyInputWrapper
                    props={{
                      path: "configuration.PriceInVND",
                      label: "Giá bán",
                      cellClassName: "w-1/3",
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.configuration.PriceInVND`
                          ]
                        : undefined,
                    }}
                  >
                    <PriceInput
                      value={productConfig[currentConfigNumber].PriceInVND ?? 0}
                      min={0}
                      defaultValue={0}
                      setValue={(value: any) =>
                        updateFormData({
                          path: "configuration.PriceInVND",
                          value: value,
                        })
                      }
                      inputClassName=""
                    ></PriceInput>
                  </MyInputWrapper>
                  <MyInputWrapper
                    props={{
                      path: "configuration.OriginalPrice",
                      label: "Giá gốc",
                      cellClassName: "w-1/3",
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.configuration.OriginalPrice`
                          ]
                        : undefined,
                    }}
                  >
                    <PriceInput
                      value={
                        productConfig[currentConfigNumber].OriginalPrice ?? 0
                      }
                      min={0}
                      defaultValue={0}
                      setValue={(value: any) =>
                        updateFormData({
                          path: "configuration.OriginalPrice",
                          value: value,
                        })
                      }
                    ></PriceInput>
                  </MyInputWrapper>
                  {/* <MyInputNumber
                    props={{
                      path: "configuration.PriceInVND",
                      label: "Giá bán",
                      cellClassName: "w-1/3",
                      description: "đơn vị: Đồng",
                      value: productConfig[currentConfigNumber].PriceInVND,
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.configuration.PriceInVND`
                          ]
                        : undefined,
                      onBlur: () => {
                        setIsPriceInputFocus(false);
                      },
                      onTextInputFocused: () => {
                        setIsPriceInputFocus(true);
                      },
                    }}
                    updateFormData={updateFormData}
                  /> */}
                  {/* <MyInputNumber
                    props={{
                      type: isOriginalPriceInputFocused ? "text" : "number",
                      path: "configuration.OriginalPrice",
                      label: "Giá gốc",
                      cellClassName: "w-1/3",
                      value: isOriginalPriceInputFocused
                        ? formatPriceToVND(
                            productConfig[currentConfigNumber].OriginalPrice ??
                              0
                          )
                        : productConfig[currentConfigNumber].OriginalPrice,
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.configuration.OriginalPrice`
                          ]
                        : undefined,
                      onBlur: () => {
                        setIsOriginalPriceInputFocus(false);
                      },
                      onTextInputFocused: () => {
                        setIsOriginalPriceInputFocus(true);
                      },
                    }}
                    updateFormData={updateFormData}
                  /> */}
                  <MyInputText
                    props={{
                      path: "configuration.SalePercentage",
                      label: "Giảm giá (%) ",
                      readonly: true,
                      value: productConfig[currentConfigNumber].SalePercentage,
                      cellClassName: "w-1/3",
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.configuration.SalePercentage`
                          ]
                        : undefined,
                    }}
                    updateFormData={updateFormData}
                  />
                </div>
                <MyInputText
                  props={{
                    path: "configuration.flag",
                    label: "Tag của thẻ sản phẩm",
                    value: productConfig[currentConfigNumber].flag ?? "",
                    description:
                      "Giá trị mẫu: Mới | Hot | Liên hệ. Nếu để trống sẽ hiển thị tỉ lệ giảm giá của sản phẩm.",
                  }}
                  updateFormData={updateFormData}
                />
                {/* Display */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    <MyInputSelect
                      props={{
                        path: "specification.DisplaySize",
                        type: "select",
                        label: "Kích thước màn hình",
                        items:
                          options.DISPLAY_SIZE?.map((name: string) => ({
                            value: name,
                            text: name + " inch",
                          })) ?? [],
                        cellClassName: "w-1/2",
                        value: productSpec[currentConfigNumber].DisplaySize,
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.DisplaySize`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                    <MyInputSelect
                      props={{
                        path: "specification.DisplayResolution",
                        type: "select",
                        label: "Độ phân giải màn hình",
                        items:
                          options.DISPLAY_RESOLUTION?.map((name: string) => ({
                            value: name,
                          })) ?? [],
                        cellClassName: "w-1/2",
                        value:
                          productSpec[currentConfigNumber].DisplayResolution,
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.DisplayResolution`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                  </div>
                  <div className="flex gap-4">
                    <MyInputSelect
                      props={{
                        path: "specification.DisplayPanel",
                        type: "select",
                        label: "Tấm nền màn hình",
                        // placeholderText: "Chọn tấm nền màn hình",
                        items:
                          options.DISPLAY_PANEL?.map((name: string) => ({
                            value: name,
                          })) ?? [],
                        cellClassName: "w-1/2",
                        value: productSpec[currentConfigNumber].DisplayPanel,
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.DisplayPanel`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                    <MyInputSelect
                      props={{
                        path: "specification.DisplayRefreshRate",
                        type: "select",
                        label: "Tần số quét",
                        // placeholderText: "Chọn tần số quét",
                        items:
                          options.DISPLAY_REFRESHRATE?.map((name: string) => ({
                            value: name,
                          })) ?? [],
                        cellClassName: "w-1/2",
                        value:
                          productSpec[currentConfigNumber].DisplayRefreshRate,
                        errorMessage: validationState
                          ? validationState[
                              `${currentConfigNumber}.specification.DisplayRefreshRate`
                            ]
                          : undefined,
                      }}
                      updateFormData={updateFormData}
                    />
                  </div>
                  <MyInputText
                    props={{
                      path: "configuration.DisplaySpec",
                      type: "text",
                      label: "Tóm tắt thông số màn hình",
                      description: "Mẫu: 15.6 IPS 4K 60Hz",
                      value:
                        productConfig[currentConfigNumber].DisplaySpec ?? "",
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.configuration.DisplaySpec`
                          ]
                        : undefined,
                    }}
                    updateFormData={updateFormData}
                  />
                  <MyInputText
                    props={{
                      path: "specification.DisplaySpec",
                      type: "text",
                      label: "Thông số chi tiết màn hình ",
                      value: productSpec[currentConfigNumber].DisplaySpec ?? "",
                      errorMessage: validationState
                        ? validationState[
                            `${currentConfigNumber}.specification.DisplaySpec`
                          ]
                        : undefined,
                      description:
                        "Mẫu: 15.6 inch, 4K, IPS, micro-edge, anti-glare, 250 nits, 45% NTSC",
                    }}
                    updateFormData={updateFormData}
                  />
                </div>

                <MyInputTextArray
                  props={{
                    path: "configuration.PromotionInfo",
                    label: "Khuyến mãi tặng kèm",
                    submitText: "Thêm",
                    valueDisplay: () => {
                      return (
                        <>
                          {!productConfig[currentConfigNumber]
                            .PromotionInfo && (
                            // || productConfig[currentConfigNumber].PromotionInfo.length === 0
                            <span className="text-neutral-7 text-sm not-italic font-normal leading-[130%] tracking-[0.07px]">
                              Chưa có khuyến mãi
                            </span>
                          )}
                          {productConfig[currentConfigNumber].PromotionInfo && (
                            // productConfig[currentConfigNumber].PromotionInfo.length > 0 &&
                            <ul className="list-inside list-disc flex flex-col items-stretch py-4 gap-[10px] pl-2">
                              {productConfig[
                                currentConfigNumber
                              ].PromotionInfo?.map((promotion, index) => (
                                <li
                                  className="text-neutral-7 text-sm not-italic font-normal leading-[130%] tracking-[0.07px] flex flex-row justify-between"
                                  key={promotion}
                                >
                                  {promotion}
                                  <span className="flex flex-row gap-4">
                                    <span
                                      className="hover:text-primary hover:bold cursor-pointer"
                                      onClick={() => {
                                        let newList = _.cloneDeep(
                                          productConfig[currentConfigNumber]
                                            .PromotionInfo ?? []
                                        );
                                        const bufferData = newList.splice(
                                          index,
                                          1
                                        );
                                        updateFormData({
                                          path: "configuration.PromotionInfo",
                                          value: newList,
                                        });
                                        setTextInputBuffer((prev) => {
                                          return {
                                            ...prev,
                                            [`${currentConfigNumber}.configuration.PromotionInfo`]:
                                              {
                                                value: bufferData[0],
                                              },
                                          };
                                        });
                                      }}
                                    >
                                      <Edit width={16} height={16}></Edit>
                                    </span>
                                    <span
                                      className="hover:text-primary hover:bold cursor-pointer"
                                      onClick={() => {
                                        const newList =
                                          productConfig[currentConfigNumber]
                                            .PromotionInfo ?? [];
                                        newList.splice(index, 1);
                                        updateFormData({
                                          path: "configuration.PromotionInfo",
                                          value: newList,
                                        });
                                      }}
                                    >
                                      <TrashIcon
                                        width={16}
                                        height={16}
                                      ></TrashIcon>
                                    </span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      );
                    },
                    value:
                      textInputBuffer[
                        `${currentConfigNumber}.configuration.PromotionInfo`
                      ]?.value ?? "",
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setTextInputBuffer((prev) => {
                        return {
                          ...prev,
                          [`${currentConfigNumber}.configuration.PromotionInfo`]:
                            {
                              value: e.target.value,
                            },
                        };
                      });
                    },
                    onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => {
                      if (
                        textInputBuffer[
                          `${currentConfigNumber}.configuration.PromotionInfo`
                        ].value
                      ) {
                        updateFormData({
                          path: "configuration.PromotionInfo",
                          value: [
                            ...(productConfig[currentConfigNumber]
                              .PromotionInfo ?? []),
                            textInputBuffer[
                              `${currentConfigNumber}.configuration.PromotionInfo`
                            ].value,
                          ],
                        });
                        setTextInputBuffer((prev) => {
                          return {
                            ...prev,
                            [`${currentConfigNumber}.configuration.PromotionInfo`]:
                              { value: "" },
                          };
                        });
                      }
                    },
                  }}
                  updateFormData={updateFormData}
                />
                <div className={"flex flex-col gap-2 col-span-1"}>
                  <Label className={"mt-1 "}>Từ khóa</Label>
                  <div className="flex flex-row gap-2 flex-wrap">
                    {productModel[currentConfigNumber]?.keywords?.length !==
                      0 &&
                      productModel[currentConfigNumber]?.keywords?.map(
                        (keyword, index) => {
                          return (
                            <Chip
                              label={keyword}
                              key={`keyword-display-chip-${index}`}
                              endIcon={
                                <span
                                  className="hover:bg-neutral-3 rounded-lg"
                                  onClick={() => {
                                    let prev = _.cloneDeep(
                                      productModel[currentConfigNumber]
                                        .keywords ?? []
                                    );
                                    const index = prev.indexOf(keyword);

                                    if (index > -1) {
                                      prev.splice(index, 1);
                                    }

                                    updateFormData({
                                      path: "model.keywords",
                                      value: prev,
                                    });
                                  }}
                                >
                                  <X className="h-4 w-4"></X>
                                </span>
                              }
                              className="hover:text-primary hover:border-primary"
                            ></Chip>
                          );
                        }
                      )}
                    {(!productModel[currentConfigNumber]?.keywords ||
                      productModel[currentConfigNumber]?.keywords?.length ===
                        0) && (
                      <Typography
                        headingElement="p"
                        headingStyle={"body"}
                        className="pl-2 italic text-neutral-7 py-1"
                      >
                        Chưa có từ khóa
                      </Typography>
                    )}
                  </div>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        Chọn từ khóa
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command
                        loop
                        //</PopoverContent>className="max-h-[200px] overflow-y-auto"
                      >
                        <CommandInput
                          placeholder="Tìm kiếm từ khóa ..."
                          value={
                            textInputBuffer[
                              `${currentConfigNumber}.model.keywords`
                            ]?.value ?? undefined
                          }
                          onValueChange={(search: string) => {
                            setTextInputBuffer((prev) => {
                              return {
                                ...prev,
                                [`${currentConfigNumber}.model.keywords`]: {
                                  value: search,
                                },
                              };
                            });
                          }}
                        />
                        <CommandEmpty className="py-2">
                          <span className="w-full flex flex-col gap-3 items-center">
                            <Typography
                              headingElement="p"
                              headingStyle="body"
                              className="text-sm py-1"
                            >
                              Không tìm thấy từ khóa.
                            </Typography>
                            {textInputBuffer[
                              `${currentConfigNumber}.model.keywords`
                            ]?.value?.trim()?.length > 0 &&
                              !(
                                options.KEYWORD_TEMPLATE?.map((o) => o.value) ??
                                []
                              ).includes(
                                textInputBuffer[
                                  `${currentConfigNumber}.model.keywords`
                                ]?.value
                              ) && (
                                <span
                                  key={`keywords.createNew`}
                                  onClick={handleCreateNewKeyword}
                                  className="w-full flex flex-row items-center hover:bg-[#F1F5F9] p-2 px-4 hover:cursor-pointer text-sm"
                                >
                                  {`Tạo từ khóa "${
                                    textInputBuffer[
                                      `${currentConfigNumber}.model.keywords`
                                    ]?.value
                                  }"`}
                                </span>
                              )}
                          </span>
                        </CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-scroll">
                          {textInputBuffer[
                            `${currentConfigNumber}.model.keywords`
                          ]?.value?.trim()?.length > 0 &&
                            !(
                              options.KEYWORD_TEMPLATE?.map((o) => o.value) ??
                              []
                            ).includes(
                              textInputBuffer[
                                `${currentConfigNumber}.model.keywords`
                              ]?.value
                            ) && (
                              <CommandItem
                                key={`keywords.createNew`}
                                onSelect={handleCreateNewKeyword}
                              >
                                <Plus className={cn("mr-2 h-4 w-4")} />
                                {`Tạo từ khóa ${
                                  textInputBuffer[
                                    `${currentConfigNumber}.model.keywords`
                                  ]?.value
                                }`}
                              </CommandItem>
                            )}
                          {options.KEYWORD_TEMPLATE?.slice(
                            0,
                            KEYWORD_POPUP_MENU_MAX_ITEM
                          )
                            .sort((a, b) => b.count - a.count)
                            .map(({ value, count }) => (
                              <CommandItem
                                key={value}
                                onSelect={() => {
                                  let prev =
                                    productModel[currentConfigNumber]
                                      .keywords ?? [];
                                  const index = prev.indexOf(value);

                                  if (index > -1) {
                                    prev.splice(index, 1);
                                  } else {
                                    prev.push(value);
                                  }

                                  updateFormData({
                                    path: "model.keywords",
                                    value: prev,
                                  });
                                }}
                                className="flex flex-row justify-between"
                              >
                                <span className="flex flex-row w-3/4">
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      (
                                        productModel[currentConfigNumber]
                                          .keywords ?? []
                                      ).includes(value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <span>{value}</span>
                                </span>

                                <span>{`${count} máy`}</span>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="spec">
            <MyInputSwitch
              props={{
                path: "isAvailable",
                label: `Trạng thái hàng: ${
                  isAvailable[currentConfigNumber] ? "Sẵn hàng" : "Hàng liên hệ"
                }`,
                value: isAvailable[currentConfigNumber],
                onChange: (value: boolean) => {
                  let t = _.cloneDeep(isAvailable);
                  t[currentConfigNumber] = value;
                  setIsAvailable(t);
                },
                cellClassName: "w-1/3 py-4",
              }}
              updateFormData={updateFormData}
            />
            <MyInputNumber
              props={{
                path: "specification.WeightInKillograms",
                label: "Trọng lượng",
                description: "Đơn vị: Kg",
                value:
                  productSpec[currentConfigNumber].WeightInKillograms ?? "",
              }}
              updateFormData={updateFormData}
            />

            {/* <MyInputText
              props={{
                path: "specification.Dimension",
                label: "Kích thước",
                value: productSpec[currentConfigNumber].Dimension ?? "",

                description:
                  "cạnh dài x cạnh ngắn x độ dày, đơn vị: cm. Mẫu: 32.5cm x 21.66cm x 1.7cm",
              }}
              updateFormData={updateFormData}
            /> */}

            <MyInputText
              props={{
                path: "specification.Port",
                label: "Cổng kết nối",
                value: productSpec[currentConfigNumber].Port ?? "",

                description:
                  "Mẫu: 1x USB Type-C (Sạc, DisplayPort 1.4) 2x USB Type-A 1x HDMI 2.1 1x cổng Tai/microphone combo 3.5mm",
              }}
              updateFormData={updateFormData}
            />

            {/* <MyInputText
              props={{
                path: "specification.Keyboard",
                label: "Bàn phím",
                value: productSpec[currentConfigNumber].Keyboard ?? "",

                description:
                  "Mẫu: Đơn sắc, màu trắng | Đa sắc RGB từng phím | layout bàn phím Tiếng Nhật | layout bàn phím Châu Âu",
              }}
              updateFormData={updateFormData}
            /> */}

            <MyInputText
              props={{
                path: "specification.OperatingSystem",
                value: productSpec[currentConfigNumber].OperatingSystem ?? "",

                label: "Hệ điều hành",
              }}
              updateFormData={updateFormData}
            />

            {/* <MyInputText
              props={{
                path: "specification.AuthenticationFeature",
                label: "Chức năng bảo mật",
                value:
                  productSpec[currentConfigNumber].AuthenticationFeature ?? "",

                description:
                  "Các tính năng bảo mật của sản phẩm. Mẫu: Nhận diện khuông mặt Window Hello | Bảo mật vân tay",
              }}
              updateFormData={updateFormData}
            /> */}

            {/* <MyInputText
              props={{
                path: "specification.LAN",
                label: "Cổng LAN",
                value: productSpec[currentConfigNumber].LAN ?? "",

                description:
                  "Thông số chuẩn kết nối cổng LAN. Có thể bỏ trống.",
              }}
              updateFormData={updateFormData}
            />

            <MyInputText
              props={{
                path: "specification.Wifi",
                label: "Card Wifi",
                value: productSpec[currentConfigNumber].Wifi ?? "",

                description:
                  "Thông số card wifi. Mẫu: MediaTek Wi-Fi 6 MT7921 (2x2)",
              }}
              updateFormData={updateFormData}
            />

            <MyInputText
              props={{
                path: "specification.Bluetooth",
                label: "Bluetooth",
                value: productSpec[currentConfigNumber].Bluetooth ?? "",

                description:
                  "Thông số chuẩn kết nối Bluetooth. Mẫu: Bluetooth 5.2",
              }}
              updateFormData={updateFormData}
            /> */}

            <MyInputText
              props={{
                path: "specification.Battery",
                label: "Pin",
                value: productSpec[currentConfigNumber].Battery ?? "",

                description:
                  "Thông số kỹ thuật pin, thời lượng sử dụng pin. Mẫu: 43 Wh Li-ion, 3 cell, cho 6 tiếng sử dụng (lướt web)",
              }}
              updateFormData={updateFormData}
            />

            {/* <MyInputText
              props={{
                path: "specification.Webcam",
                label: "Webcam",
                value: productSpec[currentConfigNumber].Webcam ?? "",

                description:
                  'Thông số kỹ thuật webcam. Nếu không có thì ghi "Không". Mẫu: Wide Vision 720p HD camera',
              }}
              updateFormData={updateFormData}
            />

            <MyInputText
              props={{
                path: "specification.Audio",
                label: "Loa",
                value: productSpec[currentConfigNumber].Audio ?? "",
                description:
                  "Thông số kỹ thuật loa, số lượng. Mẫu: 2 loa, công suất 2Wh",
              }}
              updateFormData={updateFormData}
            />

            <MyInputText
              props={{
                path: "specification.CardReader",
                label: "Đầu đọc thẻ SD/ Micro SD",
                value: productSpec[currentConfigNumber].CardReader ?? "",

                description:
                  "Có thể bỏ trống. Mẫu: Có hỗ trợ đọc thẻ SD/ Micro SD",
              }}
              updateFormData={updateFormData}
            /> */}

            <MyInputText
              props={{
                path: "specification.Color",
                label: "Màu",
                value: productSpec[currentConfigNumber].Color ?? "",
              }}
              updateFormData={updateFormData}
            />

            <MyInputText
              props={{
                path: "specification.Warranty",
                label: "Bảo hành",
                value: productSpec[currentConfigNumber].Warranty ?? "",
                description:
                  "Chính sách bảo hành của sản phẩm, thời gian. Mẫu: 1 Đổi 1 trong 7 ngày đầu nếu phát sinh lỗi phần cứng. Bảo hành 12 tháng đầu tiên.",
              }}
              updateFormData={updateFormData}
            />

            <MyInputNumber
              props={{
                path: "specification.WarrantyInMonths",
                label: "Thời hạn bảo hành (đơn vị: tháng)",
                value: productSpec[currentConfigNumber].WarrantyInMonths ?? "",
                description: "Thời hạn bảo hành theo số tháng.",
              }}
              updateFormData={updateFormData}
            />

            {/* <div className="HDD flex gap-4">
              <MyInputSelect
                props={{
                  path: "specification.HDDamount",
                  type: "select",
                  label: "Dung lượng HDD",
                  // placeholderText: "Chọn dung lượng ổ HDD",
                  items:
                    HDD_options.map((name: string) => ({ value: name })) ?? [],
                  cellClassName: "w-1/3",
                  value: productSpec[currentConfigNumber].HDDamount,
                  errorMessage: validationState
                    ? validationState[
                        `${currentConfigNumber}.specification.HDDamount`
                      ]
                    : undefined,
                }}
                updateFormData={updateFormData}
              />
              <MyInputText
                props={{
                  path: "specification.HDD",
                  type: "text",
                  label: "Thông số chi tiết HDD ",
                  description: "Mẫu: 512 GB | Không có",
                  cellClassName: "flex-1",
                  value: productSpec[currentConfigNumber].HDD ?? "",
                  errorMessage: validationState
                    ? validationState[
                        `${currentConfigNumber}.specification.HDD`
                      ]
                    : undefined,
                }}
                updateFormData={updateFormData}
              />
            </div> */}
          </TabsContent>

          <TabsContent value="seo" className="flex flex-col gap-4 my-8">
            <MyInputText
              props={{
                path: "model.fullname",
                type: "text",
                label: "Tên đầy đủ",
                value: productModel[currentConfigNumber].fullname ?? "",
                description:
                  "Nên bao gồm tên, mã sản phẩm, năm ra mắt, cấu hình",
                onBlur: () => {
                  if (
                    // (!productConfig[currentConfigNumber].slug ||
                    //   productConfig[currentConfigNumber].slug.trim()
                    //     .length === 0) &&
                    productModel[currentConfigNumber].fullname
                  ) {
                    setProductConfig((s) => {
                      let t = _.cloneDeep(s);
                      t[currentConfigNumber].slug = slugify(
                        productModel[currentConfigNumber].fullname ?? "",
                        {
                          lowercase: true,
                        }
                      );
                      return t;
                    });
                  }
                  // if (
                  //   (!productConfig[currentConfigNumber].pageTitle ||
                  //     productConfig[currentConfigNumber].pageTitle.trim()
                  //       .length === 0) &&
                  //   productModel[currentConfigNumber].fullname
                  // ) {
                  //   setProductConfig((s) => {
                  //     return {
                  //       ...s,
                  //       pageTitle: productModel[currentConfigNumber].fullname,
                  //     };
                  //   });
                  // }
                },
              }}
              updateFormData={updateFormData}
            />
            {/* <MyInputText
              props={{
                path: "configuration.pageTitle",
                label: "Tiêu đề trang sản phẩm",
                value: productConfig[currentConfigNumber].pageTitle ?? "",
                description:
                  "Nên sẽ để tên đầy đủ sản phẩm và từ khóa ngắn gọn xúc tính. Mẫu: Asus Zenbook 14 OLED UX3405MA Ultra 5 125H/16GB/512GB/Win11 (PP151W) ",
              }}
              updateFormData={updateFormData}
            /> */}
            <MyInputText
              props={{
                path: "configuration.description",
                label: "Mô tả trang sản phẩm",
                value: productConfig[currentConfigNumber].description ?? "",

                description: "Mô tả trang sản phẩm ngắn gọn xúc tích.",
              }}
              updateFormData={updateFormData}
            />
            <MyInputTextArray
              props={{
                path: "configuration.seoKeyword",
                label: "Từ khóa tìm kiếm sản phẩm (SEO)",
                submitText: "Thêm",
                valueDisplay: () => {
                  return (
                    <>
                      {(!productConfig[currentConfigNumber].seoKeyword ||
                        productConfig[currentConfigNumber].seoKeyword
                          ?.length === 0) && (
                        <span className="text-neutral-7 text-sm not-italic font-normal leading-[130%] tracking-[0.07px]">
                          Chưa có từ khóa
                        </span>
                      )}
                      {productConfig[currentConfigNumber].seoKeyword &&
                        productConfig[currentConfigNumber].seoKeyword
                          ?.length !== 0 && (
                          <ul className="list-inside list-disc flex flex-col items-stretch py-4 gap-[10px] pl-2">
                            {productConfig[currentConfigNumber].seoKeyword?.map(
                              (text, index) => (
                                <li
                                  className="flex flex-row justify-between text-neutral-7 text-sm not-italic font-normal leading-[130%] tracking-[0.07px]"
                                  key={text}
                                >
                                  {text}
                                  <span
                                    className="hover:text-primary hover:bold cursor-pointer"
                                    onClick={() => {
                                      const newList =
                                        productConfig[currentConfigNumber]
                                          .seoKeyword ?? [];
                                      newList.splice(index, 1);
                                      updateFormData({
                                        path: "configuration.seoKeyword",
                                        value: newList,
                                      });
                                    }}
                                  >
                                    <TrashIcon
                                      width={16}
                                      height={16}
                                    ></TrashIcon>
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </>
                  );
                },
                value: textInputBuffer["configuration.seoKeyword"]?.value ?? "",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setTextInputBuffer((prev) => {
                    return {
                      ...prev,
                      "configuration.seoKeyword": { value: e.target.value },
                    };
                  });
                },
                onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => {
                  if (textInputBuffer["configuration.seoKeyword"].value) {
                    updateFormData({
                      path: "configuration.seoKeyword",
                      value: [
                        ...(productConfig[currentConfigNumber].seoKeyword ??
                          []),
                        textInputBuffer["configuration.seoKeyword"].value,
                      ],
                    });
                    setTextInputBuffer((prev) => {
                      return {
                        ...prev,
                        "configuration.seoKeyword": { value: "" },
                      };
                    });
                  }
                },
              }}
              updateFormData={updateFormData}
            />
            <MyInputTextToggleEdit
              props={{
                path: "configuration.slug",
                label: "Địa chỉ trang sản phẩm",
                description: `Đường dẫn URL đến trang chi tiết sản phẩm. 
                 Mặc định là tên đầy đủ của sản phẩm không dấu gạch liền. 
                 Ví dụ: hp-pavilion-14-dv-2073-tu.
                 Hệ thống sẽ tự động đính kèm thêm id của sản phẩm trong cơ sở dữ liệu để tránh trùng lặp`,
                value: productConfig[currentConfigNumber].slug,
              }}
              updateFormData={updateFormData}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};
