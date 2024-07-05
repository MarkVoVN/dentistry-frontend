import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import firebaseServiceInstance from "./firebase-service";

export const uploadMultiImages = async (selectedImages, fileRoute = "/") => {
  const arrayOfLinkImages = await Promise.all(
    selectedImages.map(async (image, index) => {
      const imageRef = ref(firebaseServiceInstance.storage, "/images" + fileRoute + "/" +image.name);
      return uploadBytes(imageRef, image).then(async () => {
        // const downloadURL = await getDownloadURL(imageRef)
        //! update images in firestore
        // await updateDoc(firebaseServiceInstance.db, "images", {
        //   images: arrayUnion(downloadURL)
        // })

        //! update images in mongodb
        // fake promise
        return getDownloadURL(imageRef)
      });
    }
  ))

  return arrayOfLinkImages
}