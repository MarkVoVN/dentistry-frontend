import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends ImageProps {
  alt: string;
  fallbackSrc: string;
}

export const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, alt, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

interface ImageWithFallbackWithIconProps extends ImageProps {
  alt: string;
  fallbackIconComponent: React.ReactNode;
}

export const ImageWithFallbackWithIcon = (
  props: ImageWithFallbackWithIconProps
) => {
  const { src, alt, fallbackIconComponent, ...rest } = props;
  const [isImageValid, setIsImageValid] = useState(true);

  return (
    <React.Fragment>
      {isImageValid ? (
        <Image
          {...rest}
          alt={alt}
          src={src}
          onError={() => {
            setIsImageValid(false);
          }}
        />
      ) : (
        fallbackIconComponent
      )}
    </React.Fragment>
  );
};
