import { Typography } from "@/components/typography";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { twMerge } from "tailwind-merge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPriceToVND } from "@/lib/utils";
import { Check, ChevronDown, Minus, Plus } from "lucide-react";
import Image from "next/image";

export const MyInputText = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    type,
    label,
    description,
    autoComplete = "off",
    readonly = false,
    onBlur,

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,
    errorMessage = "",

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      {label.length > 0 && (
        <Label
          htmlFor={path}
          className={twMerge(
            "mt-1",
            labelClassName && labelClassName.length > 0 ? labelClassName : ""
          )}
        >
          {label}
        </Label>
      )}
      <Input
        id={path}
        type="text"
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        onChange={
          (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void) ??
          ((e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData({
              path: path,
              value: e.target.value,
            }))
        }
        className={twMerge(
          "placeholder-opacity-25",
          errorMessage && errorMessage.length > 0
            ? "border-error-2 border-[1px]"
            : "",
          inputClassName && inputClassName.length > 0 ? inputClassName : ""
        )}
        placeholder={placeholderText}
        value={value}
        readOnly={readonly}
        onBlur={onBlur}
      />
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputNumber = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    type,
    label,
    description,
    autoComplete = "off",

    readonly = false,
    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,
    errorMessage = "",

    controlledInputType,
    onBlur,
    onTextInputFocused,

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>
      <Input
        id={path}
        type={controlledInputType ?? "number"}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        onChange={
          (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void) ??
          ((e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData({
              path: path,
              value: e.target.value,
            }))
        }
        className={twMerge(
          "placeholder-opacity-25",
          inputClassName && inputClassName.length > 0 ? inputClassName : ""
        )}
        placeholder={placeholderText}
        value={value}
        readOnly={readonly}
        onBlur={onBlur}
        onFocus={onTextInputFocused}
      />
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputSelect = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    errorMessage = "",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,

    value,
    defaultValue,
    placeholderText,
    items,
    createNewText,
    onOpenChange,
    handleCreateNew,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,

    readonly,
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>

      <DropdownMenu open={readonly ? false : undefined}>
        <DropdownMenuTrigger
          className={twMerge(
            "h-10 border-[1px] border-neutral-3 rounded-md p-2 px-3 text-left flex flex-row justify-between items-center",
            inputClassName ?? "",
            errorMessage ? "border-error-2" : "",
            readonly ? "cursor-default" : ""
          )}
        >
          <span>
            {value && value.length > 0
              ? value
              : valueDisplay ?? placeholderText}
          </span>
          {readonly ? null : <ChevronDown width={16} height={16}></ChevronDown>}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-[15vw] 2xl:min-w-[16vw] max-h-[50vh] overflow-y-auto"
          align="start"
        >
          {handleCreateNew !== undefined && (
            <DropdownMenuItem
              onClick={handleCreateNew}
              className="flex flex-row gap-2"
            >
              <Plus width={16} height={16}></Plus> {createNewText ?? "Tạo mới"}
            </DropdownMenuItem>
          )}

          {items &&
            items.length > 0 &&
            items.map(({ value: itemValue, text }) => {
              return (
                <DropdownMenuItem
                  key={`select-${path}-${itemValue}`}
                  className="flex flex-row gap-2"
                  onClick={(
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => {
                    updateFormData({
                      path: path,
                      value: itemValue,
                    });
                  }}
                >
                  <span className="w-4 h-4">
                    {value === itemValue && (
                      <Check width={16} height={16}></Check>
                    )}
                  </span>
                  <span>{text ?? itemValue}</span>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputSwitch = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,
    errorMessage = "",

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <div className="flex flex-row justify-between">
        <Label
          htmlFor={path}
          className={twMerge(
            "mt-1",
            labelClassName && labelClassName.length > 0 ? labelClassName : ""
          )}
        >
          {label}
        </Label>
        <Switch
          checked={value ?? undefined}
          onCheckedChange={
            (onChange as (value: boolean) => void) ??
            ((value: boolean) =>
              updateFormData({
                path: path,
                value: value,
              }))
          }
        ></Switch>
      </div>
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputMultiSelect = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,
    errorMessage = "",

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={twMerge(
            "h-10 border-[1px] border-neutral-3 rounded-md p-2 px-3 text-left flex flex-row justify-between items-center",
            inputClassName ?? ""
          )}
        >
          <span>{value && value.length > 0 ? value : placeholderText}</span>
          <ChevronDown width={16} height={16}></ChevronDown>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="start">
          {items &&
            items.length > 0 &&
            items.map(({ value, text, checked }) => {
              return (
                <DropdownMenuItem
                  key={`multiselect-${path}-${value}`}
                  className="flex flex-row gap-2"
                  onClick={(
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => {
                    (
                      onChange as ({
                        value,
                        field,
                      }: {
                        value: boolean;
                        field: string;
                      }) => void
                    )({
                      value: checked === undefined ? true : !checked,
                      field: value,
                    });
                  }}
                >
                  <span className="w-4 h-4">
                    {checked && <Check width={16} height={16}></Check>}
                  </span>
                  <span>{text ?? value}</span>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputAutocomplete = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,
    errorMessage = "",
    onTextInputChange,
    onTextInputFocused,
    onTextInputBlur,

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,
    handleCreateNew,
    createNewText,
    menuOpen,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>

      <DropdownMenu open={menuOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger
          className={twMerge(
            "h-10 border-[1px] border-neutral-3 rounded-md p-2 px-3 text-left flex flex-row justify-between items-center",
            inputClassName ?? ""
          )}
          asChild
        >
          {/* <span>{value && value.length > 0 ? value : placeholderText}</span> */}
          {/* <ChevronDown width={16} height={16}></ChevronDown> */}

          <Input
            id={path}
            type="text"
            autoComplete={autoComplete}
            defaultValue={defaultValue}
            onChange={
              onTextInputChange as (
                e: React.ChangeEvent<HTMLInputElement>
              ) => void
              // ??
              // ((e: React.ChangeEvent<HTMLInputElement>) =>
              //   updateFormData({
              //     path: path,
              //     value: e.target.value,
              //   }))
            }
            className={twMerge(
              "placeholder-opacity-25 w-full"
              // inputClassName && inputClassName.length > 0 ? inputClassName : ""
            )}
            onFocus={onTextInputFocused}
            placeholder={placeholderText}
            onBlur={onTextInputBlur}
            value={value}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="" align="start">
          {handleCreateNew !== undefined && (
            <DropdownMenuItem
              onClick={handleCreateNew}
              className="flex flex-row gap-2"
            >
              <Plus width={16} height={16}></Plus> {createNewText ?? "Tạo mới"}
            </DropdownMenuItem>
          )}
          {items &&
            items.length > 0 &&
            items.map(({ value, text, checked }) => {
              return (
                <DropdownMenuItem
                  key={`autocomplete-${path}-${value}`}
                  className="flex flex-row gap-2"
                  onClick={(
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => {
                    (
                      onChange as ({
                        value,
                        field,
                      }: {
                        value: boolean;
                        field: string;
                      }) => void
                    )({
                      value: checked === undefined ? true : !checked,
                      field: value,
                    });
                  }}
                >
                  <span className="w-4 h-4">
                    {checked && <Check width={16} height={16}></Check>}
                  </span>
                  <span>{text ?? value}</span>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputTextArray = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,
    errorMessage = "",

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>
      <div className="w-full"> {valueDisplay()}</div>
      <div className="w-full flex flex-row gap-2">
        <Input
          id={path}
          type="text"
          // defaultValue={defaultValue}
          autoComplete={autoComplete}
          onChange={
            (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void) ??
            ((e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({
                path: path,
                value: e.target.value,
              }))
          }
          className={twMerge(
            "",
            inputClassName && inputClassName.length > 0 ? inputClassName : ""
          )}
          value={value}
        />
        <Button
          onClick={onSubmit}
          className={twMerge("text-shade-1-100%", submitBtnClassName)}
        >
          {submitText ?? "Tạo"}
        </Button>
      </div>
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputTextToggleEdit = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText = "Lưu",
    submitBtnClassName,
    onSubmit,

    startInEditMode = false,
    editBtnText = "Đổi",
    editBtnClassName,
    submitHandler,
  } = props;

  const [isEditMode, setIsEditMode] = useState(startInEditMode);
  const [internalInputBuffer, setInternalInputBuffer] = useState("");

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>
      <div className="w-full flex flex-row gap-2">
        <Input
          id={path}
          type="text"
          autoComplete={autoComplete}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInternalInputBuffer(e.target.value)
          }
          className={twMerge(
            "",
            isEditMode ? "" : "bg-neutral-2 cursor-default",
            inputClassName && inputClassName.length > 0 ? inputClassName : ""
          )}
          value={isEditMode ? internalInputBuffer : value}
          readOnly={!isEditMode}
        />
        {!isEditMode && (
          <Button
            onClick={() => {
              setIsEditMode(true);
              setInternalInputBuffer(value);
            }}
            className={twMerge("text-shade-1-100%", editBtnClassName)}
          >
            {editBtnText}
          </Button>
        )}

        {isEditMode && (
          <Button
            onClick={(e) => {
              setIsEditMode(false);
              setInternalInputBuffer("");
              if (submitHandler) {
                submitHandler(internalInputBuffer);
              } else {
                updateFormData({
                  path: path,
                  value: internalInputBuffer,
                });
              }
            }}
            className={twMerge("text-shade-1-100%", submitBtnClassName)}
          >
            {submitText}
          </Button>
        )}
      </div>
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
    </div>
  );
};

export const MyInputImage = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,
    handleImageRemove,

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
    isDragActive,
  } = props;

  const [modeExpanded, setModeExpanded] = useState(false);

  const DEFAULT_PREVIEW_ITEM_COUNT = 4;
  const EXPANDED_PREVIEW_ITEM_COUNT = -1; // -1 === view all

  const previewItemCount = modeExpanded
    ? EXPANDED_PREVIEW_ITEM_COUNT === -1
      ? value.length
      : EXPANDED_PREVIEW_ITEM_COUNT
    : DEFAULT_PREVIEW_ITEM_COUNT;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 ",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>
      <div
        className="w-full aspect-video cursor-pointer mt-2"
        {...imageRootProps()}
      >
        <input id={path} {...imageInputProps()} />
        {isDragActive ? (
          <div className="w-full aspect-video border-4 border-dashed border-secondary rounded-[8px] flex justify-center items-center gap-2 flex-col">
            <span className="text-xs font-semibold text-secondary-900">
              Kéo ảnh để vào đây...
            </span>
          </div>
        ) : (
          <div className="w-full aspect-video border-4 border-dashed border-secondary rounded-[8px] flex justify-center items-center gap-2 flex-col">
            {value && value.length != 0 ? (
              <div
                className={twMerge(
                  "w-full gap-1 bg-neutral-3",
                  value.length > 2 ? "grid grid-cols-2" : ""
                )}
              >
                {value
                  .slice(0, previewItemCount)
                  .map((file: any, index: number) => {
                    const lastIndex = previewItemCount - 1;
                    const leftOverCount = value.length - previewItemCount;
                    const oddNumberOfPreviewItems =
                      value.length > 1 && value.length % 2 === 1; // 3 5 7

                    if (index === lastIndex && index !== 0) {
                      return (
                        <div
                          key={file.name}
                          className="col-span-1 relative"
                          onClick={(e) => {
                            setModeExpanded(true);
                            e.stopPropagation();
                          }}
                        >
                          <Image
                            src={file.preview}
                            width={500}
                            height={500}
                            alt="??"
                            className={twMerge(
                              "object-cover w-full aspect-video ",
                              leftOverCount > 0 ? "opacity-60" : ""
                            )}
                          />
                          {leftOverCount > 0 ? (
                            <Typography
                              headingElement="p"
                              headingStyle={"h6"}
                              className="absolute top-[40%] left-[40%] text-shade-1-100% text-3xl font-bold"
                            >
                              {`+ ${leftOverCount}`}
                            </Typography>
                          ) : (
                            <span
                              className="bg-neutral-3 hover:bg-neutral-7 rounded-2xl absolute top-1 right-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (handleImageRemove) handleImageRemove(index);
                              }}
                            >
                              <Minus className="h-5 w-5"></Minus>
                            </span>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={file.name}
                        className={twMerge(
                          " relative",
                          oddNumberOfPreviewItems && index === 0
                            ? "col-span-2"
                            : "col-span-1"
                        )}
                      >
                        <Image
                          src={file.preview}
                          width={500}
                          height={500}
                          alt="??"
                          className="object-cover w-full aspect-video "
                        />
                        {value.length !== 1 &&
                          handleImageRemove !== undefined && (
                            <span
                              className="bg-neutral-3 opacity-50 hover:opacity-100 rounded-2xl absolute top-1 right-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageRemove(index);
                              }}
                            >
                              <Minus className="h-5 w-5"></Minus>
                            </span>
                          )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <>
                <div className="text-secondary font-bold">{dropBoxText}</div>
                <span className="text-xs font-semibold text-secondary-900">
                  Kéo thả hoặc nhấn vào để thêm ảnh
                </span>
              </>
            )}
          </div>
        )}
      </div>
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
    </div>
  );
};

export function MyPriceInput({
  value,
  min,
  max,
  inputClassName = "",
  defaultValue,
  setValue,
  autoFocus = false,
}: {
  value: number;
  min?: number;
  max?: number;
  inputClassName?: string;
  defaultValue: number;
  setValue: (v: number) => void;
  autoFocus?: boolean;
}) {
  const [displayFormatedPrice, setDisplayFormatedPrice] =
    useState<boolean>(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let curValue = event.target.value;
    curValue = curValue.replace(/\D/g, "");
    const parsedValue = parseInt(curValue, 10);
    if (Number.isNaN(parsedValue)) {
      setValue(defaultValue);
      return;
    }
    if (max && parsedValue > max) {
      setValue(max);
      return;
    }
    if (min && parsedValue < min) {
      setValue(min);
      return;
    }
    setValue(parsedValue);
  };

  const removeFormatOnFocus = () => {
    setDisplayFormatedPrice(false);
  };

  const addFormatOnBlur = () => {
    setDisplayFormatedPrice(true);
  };

  let displayText = displayFormatedPrice ? formatPriceToVND(value) : value;
  displayText = displayText === 0 ? "" : displayText;

  return (
    <Input
      autoFocus={autoFocus}
      type={displayFormatedPrice ? "text" : "number"}
      value={displayText}
      min={!displayFormatedPrice && min ? min : undefined}
      max={!displayFormatedPrice && max ? max : undefined}
      onFocus={removeFormatOnFocus}
      onBlur={addFormatOnBlur}
      step={displayFormatedPrice ? undefined : 10000}
      onChange={handleChange}
      className={twMerge(
        "placeholder-opacity-25",
        inputClassName && inputClassName.length > 0 ? inputClassName : ""
      )}
    ></Input>
  );
}

export const MyInputWrapper = ({
  props,
  children,
}: {
  props: IInputConfig;
  children: any;
}) => {
  const {
    path,
    label,
    description,

    labelClassName,
    descriptionClassName,
    cellClassName,
    errorMessage = "",
  } = props;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 col-span-1",
        cellClassName && cellClassName.length > 0 ? cellClassName : ""
      )}
      key={path}
    >
      <Label
        htmlFor={path}
        className={twMerge(
          "mt-1",
          labelClassName && labelClassName.length > 0 ? labelClassName : ""
        )}
      >
        {label}
      </Label>
      {children}
      {description && description.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge(
            "ml-2 italic",
            descriptionClassName && descriptionClassName.length > 0
              ? descriptionClassName
              : ""
          )}
        >
          {`*${description}`}
        </Typography>
      )}
      {errorMessage && errorMessage.length > 0 && (
        <Typography
          headingElement="p"
          headingStyle={"span"}
          className={twMerge("ml-2 bold text-error-2")}
        >
          {`${errorMessage}`}
        </Typography>
      )}
    </div>
  );
};

const MyInputMOCK = ({
  props,
  updateFormData,
}: {
  props: IInputConfig;
  updateFormData: any;
}) => {
  const {
    path,
    label,
    description,
    autoComplete = "off",

    labelClassName,
    inputClassName,
    descriptionClassName,
    cellClassName,
    onChange,

    value,
    defaultValue,
    placeholderText,
    items,
    onOpenChange,

    valueDisplay,
    submitText,
    submitBtnClassName,
    onSubmit,

    dropBoxText,
    imageRootProps,
    imageInputProps,
  } = props;

  return (
    <>
      <div
        className={twMerge(
          "flex flex-col gap-2 col-span-1",
          cellClassName && cellClassName.length > 0 ? cellClassName : ""
        )}
        key={path}
      >
        <Label
          htmlFor={path}
          className={twMerge(
            "mt-1",
            labelClassName && labelClassName.length > 0 ? labelClassName : ""
          )}
        >
          {label}
        </Label>
        <div className="w-full flex flex-row"></div>
        {description && description.length > 0 && (
          <Typography
            headingElement="p"
            headingStyle={"span"}
            className={twMerge(
              "ml-2 italic",
              descriptionClassName && descriptionClassName.length > 0
                ? descriptionClassName
                : ""
            )}
          >
            {`*${description}`}
          </Typography>
        )}
      </div>
    </>
  );
};

export interface IInputConfig {
  path: string;
  label: string;
  type?: string;
  description?: string;
  onBlur?: any;

  readonly?: boolean;
  placeholderText?: string;
  value?: any;
  defaultValue?: any;
  autoComplete?: string;

  errorMessage?: string;

  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  cellClassName?: string;
  renderRight?: boolean;

  onChange?:
    | ((e: React.ChangeEvent<HTMLInputElement>) => void)
    | ((value: string) => void)
    | ((value: boolean) => void)
    | (({ value, field }: { value: boolean; field: string }) => void);
  onTextInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextInputFocused?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  onTextInputBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  handleImageRemove?: (index: number) => void;
  controlledInputType?: string;

  items?: { value: any; text?: string; checked?: boolean }[];
  createNewText?: string;
  defaultOpen?: boolean;
  menuOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleCreateNew?: (value: any) => void;

  valueDisplay?: any;
  submitText?: string;
  submitBtnClassName?: string;
  onSubmit?: React.MouseEventHandler<HTMLButtonElement>;

  editBtnText?: string;
  editBtnClassName?: string;
  startInEditMode?: boolean;
  submitHandler?: (value: string) => void;

  dropBoxText?: string;
  imageRootProps?: any;
  imageInputProps?: any;
  isDragActive?: any;
}
